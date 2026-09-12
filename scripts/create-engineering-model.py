"""Reproducible Courtyard House concept, built for the six-stage web story.

Run: blender --background --python scripts/create-engineering-model.py -- --no-render
All components are batched by system and supporting floor. The .blend is editable;
the GLB is the actual animated building, not a baked picture of the concept.
"""
import bpy
import math
import random
import sys
import json
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/models'
OUT.mkdir(parents=True, exist_ok=True)
bpy.context.preferences.filepaths.save_version = 0
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
RNG = random.Random(41)
MODEL = json.loads((ROOT/'content/engineering-model.json').read_text(encoding='utf-8'))
H = MODEL['floorHeight']
GROUND = -1.0
SLAB = .20
# x minimum/maximum, y minimum/maximum, occupied floors. Front is negative Y.
WINGS = MODEL['wings']
BUCKETS = {}
MATERIALS = []
SUPPORTS = []
PLATES = []
FACADE_ENDS = {}
CORNER_PROBES = []
PARAPET_PROBES = []
GUARD_POSTS = set()


def material(name, color, metal=0, rough=.6, alpha=1, emission=0):
    m=bpy.data.materials.new(name)
    m.diffuse_color=(*color,alpha)
    m.use_nodes=True
    m.use_backface_culling=True
    bsdf=m.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value=(*color,1)
    bsdf.inputs['Metallic'].default_value=metal
    bsdf.inputs['Roughness'].default_value=rough
    bsdf.inputs['Alpha'].default_value=alpha
    if emission:
        bsdf.inputs['Emission Color'].default_value=(*color,1)
        bsdf.inputs['Emission Strength'].default_value=emission
    if alpha<1: m.surface_render_method='DITHERED'
    MATERIALS.append(m)
    return len(MATERIALS)-1


stone=material('Pearl honed limestone',(.55,.525,.465),rough=.72)
concrete=material('Warm grey structural concrete',(.40,.39,.355),rough=.82)
bronze=material('Warm charcoal anodised metal',(.055,.064,.055),metal=.55,rough=.34)
# Muted copper echoes the site's burnt-orange/copper accents. Keep it on
# selected architectural details, with charcoal as the primary metal finish.
copper=material('Brushed copper accent',(.51,.216,.098),metal=.55,rough=.40)
glass=material('Smoked architectural glazing',(.085,.105,.095),metal=.25,rough=.14,alpha=.78)
guard_glass=material('Clear terrace glazing',(.20,.28,.27),metal=.05,rough=.12,alpha=.24)
inside=material('Neutral interior plaster',(.24,.25,.225),rough=.85)
joint=material('Recessed joints and gaskets',(.085,.078,.062),rough=.92)
soil=material('Planting soil',(.058,.052,.037),rough=1)
wood=material('Weathered olive bark',(.17,.135,.087),rough=.95)
leaf=[material('Olive foliage '+str(i),c,rough=.88) for i,c in enumerate([(.17,.205,.095),(.255,.285,.145),(.34,.355,.205)])]
for index in leaf: MATERIALS[index].use_backface_culling=False
fabric=material('Linen seat cushions',(.46,.43,.35),rough=1)
rebar=material('Reinforcement copper',(.65,.24,.075),metal=.5,rough=.35)
duct=material('Mechanical sage',(.24,.43,.37),metal=.45,rough=.4)
light=material('Recessed warm light',(.86,.62,.32),rough=.7,emission=.6)

# A small packed limestone texture survives glTF export. UVs use world units,
# so the same fine grain has consistent scale on piers, paving and parapets.
import numpy as np
noise_rng=np.random.default_rng(18)
n=256
field=np.zeros((n,n))
for size,weight in [(5,.025),(23,.016),(83,.009),(256,.008)]:
    grid=noise_rng.random((size,size))-.5
    source=np.linspace(0,1,size); target=np.linspace(0,1,n)
    field+=np.array([np.interp(target,source,row) for row in np.array([np.interp(target,source,row) for row in grid]).T]).T*weight
base=np.array([.55,.525,.465])
pixels=np.ones((n,n,4),dtype=np.float32)
linear=np.clip(base[None,None,:]+field[:,:,None],0,1)
pixels[:,:,:3]=np.where(linear<=.0031308,linear*12.92,1.055*linear**(1/2.4)-.055)
texture=bpy.data.images.new('Honed limestone grain',width=n,height=n)
texture.colorspace_settings.name='sRGB'
texture.pixels.foreach_set(pixels.ravel())
texture.pack()
nodes=MATERIALS[stone].node_tree.nodes
tex=nodes.new('ShaderNodeTexImage'); tex.image=texture
MATERIALS[stone].node_tree.links.new(tex.outputs['Color'],nodes.get('Principled BSDF').inputs['Base Color'])


def polygon(points, mat, kind, level, bevel=False):
    key=(kind,level)
    bucket=BUCKETS.setdefault(key,{'verts':[],'faces':[],'mats':[],'bevel':set()})
    start=len(bucket['verts'])
    bucket['verts'].extend(tuple(p) for p in points)
    bucket['faces'].append(tuple(range(start,start+len(points))))
    bucket['mats'].append(mat)
    if bevel: bucket['bevel'].update(range(start,start+len(points)))


def box(name,loc,dims,mat,kind,level=-1,bevel=False):
    x,y,z=loc; w,d,h=(v/2 for v in dims)
    assert min(dims)>0, (name,dims)
    assert z-h>=GROUND-.001, (name,z-h)
    # Shared vertices retain connected edges for bevel and editable solids.
    key=(kind,level)
    b=BUCKETS.setdefault(key,{'verts':[],'faces':[],'mats':[],'bevel':set()})
    i=len(b['verts'])
    b['verts'].extend([(x-w,y-d,z-h),(x+w,y-d,z-h),(x+w,y+d,z-h),(x-w,y+d,z-h),
                       (x-w,y-d,z+h),(x+w,y-d,z+h),(x+w,y+d,z+h),(x-w,y+d,z+h)])
    b['faces'].extend(tuple(i+j for j in face) for face in [(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)])
    b['mats'].extend([mat]*6)
    if bevel: b['bevel'].update(range(i,i+8))


def rod(a,b,r,mat,kind,level,vertices=6):
    a,b=Vector(a),Vector(b)
    axis=(b-a).normalized()
    u=axis.cross(Vector((0,0,1)))
    if u.length<.01: u=axis.cross(Vector((0,1,0)))
    u.normalize(); v=axis.cross(u)
    ring=[u*math.cos(i*math.tau/vertices)*r+v*math.sin(i*math.tau/vertices)*r for i in range(vertices)]
    polygon([a+p for p in reversed(ring)],mat,kind,level)
    polygon([b+p for p in ring],mat,kind,level)
    for i in range(vertices):
        j=(i+1)%vertices
        polygon([a+ring[i],a+ring[j],b+ring[j],b+ring[i]],mat,kind,level)


def closed_corner(outline,level):
    """Extrude a shared, closed return across both adjoining elevations."""
    area=sum(a.x*b.y-b.x*a.y for a,b in zip(outline,outline[1:]+outline[:1]))
    assert abs(area)>.001, ('Degenerate corner',outline)
    if area<0: outline=list(reversed(outline))
    count=len(outline)
    faces=[tuple(reversed(range(count))),tuple(range(count,2*count))]
    faces += [(i,(i+1)%count,(i+1)%count+count,i+count) for i in range(count)]
    # A corner must be one closed solid, not two intersecting facade strips.
    edges={}
    for face in faces:
        for a,b in zip(face,face[1:]+face[:1]):
            edge=tuple(sorted((a,b))); edges[edge]=edges.get(edge,0)+1
    assert all(uses==2 for uses in edges.values()), 'Open corner mesh'
    bucket=BUCKETS.setdefault(('frame',level),{'verts':[],'faces':[],'mats':[],'bevel':set()})
    start=len(bucket['verts'])
    bucket['verts'].extend((p.x,p.y,z) for z in [level*H,(level+1)*H] for p in outline)
    bucket['faces'].extend(tuple(start+i for i in face) for face in faces)
    bucket['mats'].extend([stone]*len(faces))
    bucket['bevel'].update(range(start,start+2*count))


def plate(rect,level):
    x0,x1,y0,y1=rect; z=level*H
    box('Connected floor plate',((x0+x1)/2,(y0+y1)/2,z),(x1-x0,y1-y0,SLAB),concrete,'structure',level,True)
    PLATES.append((rect,level))


def column(x,y,level,span=1,width=.25):
    bottom=level*H+SLAB/2
    top=(level+span)*H-SLAB/2
    box('Supported column',(x,y,(bottom+top)/2),(width,width,top-bottom),concrete,'structure',level,True)
    SUPPORTS.append((x,y,level,level+span))


for x0,x1,y0,y1,floors in WINGS:
    rect=(x0,x1,y0,y1)
    for level in range(floors+1): plate(rect,level)
    for level in range(floors):
        for x in [x0+.26,x1-.26]:
            for y in [y0+.26,(y0+y1)/2,y1-.26]: column(x,y,level)
        # Slender perimeter beams are attached to the slab they support.
        for y in [y0+.20,y1-.20]:
            box('Perimeter beam',((x0+x1)/2,y,(level+1)*H-.20),(x1-x0,.25,.25),concrete,'structure',level+1)
# The low entrance hall has a genuinely double-height colonnade, covered by
# the inhabited courtyard deck. No phantom floor cuts through the entrance.
CENTRE=tuple(MODEL['entrance'])
for level in [0,2]: plate(CENTRE,level)
for x in [-1.48,-.28,.92,1.88]:
    for y in [-3.35,1.15]: column(x,y,0,span=2,width=.30)
for y in [-3.35,1.15]:
    box('Entrance transfer beam',(.2,y,2*H-.24),(3.8,.34,.3),concrete,'structure',2)
# Enclosed stair/lift core stays vertically aligned through the tall wing.
for level in range(6):
    box('Enclosed core',(-3.40,2.22,level*H+H/2),(1.25,1.60,H-.19),concrete,'structure',level)


def facade(a,b,floors,bays,kind='facade',start=0):
    """Continuous floor edges, full-height glass and slim metal bay divisions."""
    a,b=Vector(a),Vector(b)
    along=(b-a).normalized(); normal=Vector((along.y,-along.x))
    length=(b-a).length
    def block(t,offset,z,width,depth,height,mat,level,bevel=False,role=None):
        p=a+along*t+normal*offset
        dims=(width,depth,height) if abs(along.x)>.5 else (depth,width,height)
        box('Facade component',(p.x,p.y,z),dims,mat,role or kind,level,bevel)
    bay=length/bays
    for level in range(start,floors):
        z=level*H
        # Join stone returns after collecting every elevation at this floor.
        # Independent endpoint boxes leave the outer corner quadrant open.
        for point,direction in [(a,along),(b,-along)]:
            key=(round(point.x,4),round(point.y,4),level)
            FACADE_ENDS.setdefault(key,[]).append((direction.copy(),normal.copy()))
        for i in range(1,bays):
            block(i*bay,-.12,z+H/2,.065,.12,H-.22,bronze,level)
        # Continuous bands span the slim intermediate mullions, meeting only
        # the stone corner returns. No gaps or coplanar overlapping faces.
        for dz in [.055,H-.055]:
            block(length/2,0,z+dz,length-.60,.32,.11,stone,level,True,role='frame')
        for i in range(bays):
            left=.30 if i==0 else i*bay+.0325
            right=length-.30 if i==bays-1 else (i+1)*bay-.0325
            t=(left+right)/2; w=right-left
            # The two half-bands meet at the actual slab centre. Recessed
            # gaskets separate the glazing from the continuous limestone edge.
            for dz in [.13,H-.13]: block(t,-.11,z+dz,w,.045,.04,bronze,level)
            block(t,-.145,z+H/2,w,.025,H-.30,glass,level)
            block(t,-.72,z+H/2,w,.055,H-.35,inside,level)
            for offset in [-w/2,w/2]:
                block(t+offset,-.12,z+H/2,.024,.055,H-.29,bronze,level)
            block(t,-.32,z+.13,w,.34,.025,bronze,level)
            # A low credenza and ceiling strip lend depth without a heavy interior.
            block(t+w*.15,-.57,z+.31,w*.50,.22,.24,wood,level)
            block(t,-.54,z+H-.22,w*.60,.025,.018,light,level)


# Polygon boundary orientation puts the exterior on the right of each segment.
# Each exposed face is intentional, including the courtyard-facing elevations.
facade((-4.6,-3.6),(-1.7,-3.6),6,2)
facade((-4.6,3.4),(-4.6,-3.6),6,4)
facade((-1.7,3.4),(-4.6,3.4),6,2)
facade((-1.7,-3.6),(-1.7,1.4),6,3,start=2)
facade((-1.7,1.4),(-1.7,3.4),6,1,start=5)
facade((4.6,3.4),(-1.7,3.4),5,4)
facade((-1.7,1.4),(2.1,1.4),5,3,start=2)
facade((2.1,1.4),(4.6,1.4),5,2,start=4)
facade((4.6,-3.6),(4.6,1.4),4,3)
facade((4.6,1.4),(4.6,3.4),5,1)
facade((2.1,-3.6),(4.6,-3.6),4,2)
facade((2.1,1.4),(2.1,-3.6),4,3,start=2)

# One return solid per junction and floor. The outer and inner intersections
# close both convex building corners and concave courtyard corners. Collinear
# elevations share one straight pier; isolated jambs retain a closed end cap.
joined_corners=0
for (x,y,level),ends in FACADE_ENDS.items():
    p=Vector((x,y)); u,n=ends[0]
    assert len(ends)<=2, ('Ambiguous facade junction',x,y,level)
    if len(ends)==2 and abs(u.dot(ends[1][0]))<.01:
        v,m=ends[1]
        outline=[p+u*.30+n*.16,p+(n+m)*.16,p+v*.30+m*.16,
                 p+v*.30-m*.16,p-(n+m)*.16,p+u*.30-n*.16]
        # Probe the former missing quadrant at the joint, in world space.
        probe=p+(n+m)*.12
        inside=False
        for a,b in zip(outline,outline[1:]+outline[:1]):
            if (a.y>probe.y)!=(b.y>probe.y):
                if probe.x<(b.x-a.x)*(probe.y-a.y)/(b.y-a.y)+a.x: inside=not inside
        assert inside, ('Unclosed facade corner',x,y,level)
        CORNER_PROBES.append((p.copy(),(n+m).copy(),level))
        joined_corners+=1
    else:
        lo=-.30 if len(ends)==2 else 0
        if len(ends)==2: assert n.dot(ends[1][1])>.99, 'Opposed facade normals'
        outline=[p+u*lo+n*.16,p+u*.30+n*.16,p+u*.30-n*.16,p+u*lo-n*.16]
    closed_corner(outline,level)
print('CORNER_CONTACT_CHECKS',joined_corners,'joined corners;',len(FACADE_ENDS),'closed returns',flush=True)
# Dark metal jackets closely wrap the actual double-height entrance columns.
for x in [-1.48,-.28,.92,1.88]:
    box('Entrance metal pier',(x,-3.35,H-.04),(.32,.36,2*H-.28),copper if x in [-.28,.92] else bronze,'frame',0,True)
box('Entrance architrave',(.2,-3.35,2*H-.03),(3.8,.56,.30),stone,'frame',2,True)
box('Recessed lobby glazing',(.2,-2.75,H),(3.3,.03,2*H-.32),glass,'facade',0)
box('Lobby back wall',(.2,.95,H),(3.3,.12,2*H-.30),inside,'facade',0)
for x in [-1.42,-.32,.78,1.82]:
    box('Lobby bronze frame',(x,-2.78,H),(.05,.07,2*H-.32),bronze,'facade',0)
box('Entrance threshold',(.2,-3.40,.115),(3.6,.60,.03),stone,'structure',0)


def paving(rect,level):
    x0,x1,y0,y1=rect; z=level*H+.112
    nx=max(1,round((x1-x0)/.65)); ny=max(1,round((y1-y0)/.65))
    dx=(x1-x0)/nx; dy=(y1-y0)/ny
    box('Paving bed',((x0+x1)/2,(y0+y1)/2,z-.005),(x1-x0,y1-y0,.020),joint,'facade',level)
    for ix in range(nx):
        for iy in range(ny):
            box('Paving tile',(x0+(ix+.5)*dx,y0+(iy+.5)*dy,z+.011),(dx-.008,dy-.008,.022),stone,'facade',level)


def parapet_path(points,level,closed=False):
    """One watertight, mitred curb, with no doubled faces at its turns."""
    points=[Vector(p) for p in points]
    count=len(points); verts=[]; faces=[]
    for i,p in enumerate(points):
        before=(p-points[(i-1)%count]).normalized() if i or closed else None
        after=(points[(i+1)%count]-p).normalized() if i<count-1 or closed else None
        normals=[Vector((-v.y,v.x)) for v in [before,after] if v is not None]
        bisector=sum(normals,Vector((0,0))).normalized()
        offset=bisector*(.08/bisector.dot(normals[0]))
        if before is not None and after is not None:
            for sign in [-1,1]: PARAPET_PROBES.append((p.copy(),bisector*sign,level))
        for z in [level*H+.10,level*H+.20]:
            for side in [1,-1]:
                q=p+offset*side; verts.append((q.x,q.y,z))
    for i in range(count if closed else count-1):
        a=4*i; b=4*((i+1)%count)
        faces.extend([(a,a+2,b+2,b),(a+1,b+1,b+3,a+3),
                      (a+2,a+3,b+3,b+2),(a,b,b+1,a+1)])
    if not closed:
        end=4*(count-1)
        faces.extend([(0,1,3,2),(end,end+2,end+3,end+1)])
    edges={}
    for face in faces:
        for a,b in zip(face,face[1:]+face[:1]):
            edge=tuple(sorted((a,b))); edges[edge]=edges.get(edge,0)+1
    assert all(uses==2 for uses in edges.values()), 'Open parapet mesh'
    bucket=BUCKETS.setdefault(('facade',level),{'verts':[],'faces':[],'mats':[],'bevel':set()})
    start=len(bucket['verts']); bucket['verts'].extend(verts)
    bucket['faces'].extend(tuple(start+i for i in face) for face in faces)
    bucket['mats'].extend([stone]*len(faces))
    bucket['bevel'].update(range(start,start+len(verts)))


def guard(a,b,level,solid_height=.10):
    a,b=Vector(a),Vector(b); along=(b-a).normalized(); length=(b-a).length
    p=(a+b)/2; z=level*H+.10
    top=z+.54
    rod((a.x,a.y,top),(b.x,b.y,top),.012,copper,'facade',level)
    count=max(1,math.ceil(length/1.15))
    for i in range(count+1):
        p=a+(b-a)*i/count
        key=(round(p.x,4),round(p.y,4),level)
        if key not in GUARD_POSTS:
            rod((p.x,p.y,z+solid_height),(p.x,p.y,top),.012,bronze,'facade',level,4)
            GUARD_POSTS.add(key)
    for i in range(count):
        p=a+(b-a)*(i+.5)/count
        width=length/count-.032
        height=top-z-solid_height-.025
        dims=(width,.018,height) if abs(along.x)>.5 else (.018,width,height)
        box('Terrace glass panel',(p.x,p.y,z+solid_height+.012+height/2),dims,guard_glass,'facade',level)


def planter(rect,level,base_z=None):
    x0,x1,y0,y1=rect; z=level*H+.135 if base_z is None else base_z
    for y in [y0,y1]: box('Planter wall',((x0+x1)/2,y,z+.16),(x1-x0+.12,.12,.32),stone,'facade',level)
    for x in [x0,x1]: box('Planter wall',(x,(y0+y1)/2,z+.16),(.12,y1-y0,.32),stone,'facade',level)
    box('Contained soil',((x0+x1)/2,(y0+y1)/2,z+.26),(x1-x0-.08,y1-y0-.08,.08),soil,'facade',level)
    return z+.30


def foliage(center,radius,level,leaves=75):
    cx,cy,cz=center
    for i in range(leaves):
        theta=RNG.random()*math.tau; c=RNG.uniform(-1,1); s=math.sqrt(1-c*c)
        radius_i=radius*RNG.random()**.33
        p=Vector((cx+radius_i*s*math.cos(theta),cy+radius_i*s*math.sin(theta),cz+radius_i*c*.7))
        long=Vector((RNG.uniform(-1,1),RNG.uniform(-1,1),RNG.uniform(-.45,.7))).normalized()*RNG.uniform(.06,.115)
        short=long.cross(Vector((0,0,1))).normalized()*RNG.uniform(.018,.035)
        polygon([p-long,p+short,p+long,p-short],RNG.choice(leaf),'facade',level)


def tree(x,y,z,level,size=1):
    root=Vector((x,y,z)); fork=root+Vector((.06,-.035,.83*size))
    rod(root,fork,.055*size,wood,'facade',level,8)
    for i in range(8):
        angle=i*math.tau/8+RNG.uniform(-.2,.2)
        end=fork+Vector((math.cos(angle)*.48*size,math.sin(angle)*.48*size,RNG.uniform(.25,.62)*size))
        rod(fork,end,.020*size,wood,'facade',level,5)
        foliage(end,.37*size,level,48)
    foliage(fork+Vector((0,0,.54*size)),.40*size,level,75)


def herbs(rect,z,level):
    x0,x1,y0,y1=rect
    count=max(2,round((x1-x0)*(y1-y0)*11))
    for i in range(count):
        x=RNG.uniform(x0+.03,x1-.03); y=RNG.uniform(y0+.03,y1-.03)
        foliage((x,y,z+.13),.16,level,13)
        for j in range(4):
            a=RNG.random()*math.tau; height=RNG.uniform(.12,.30)
            polygon([(x-.009,y,z),(x+.009,y,z),(x+math.cos(a)*.075,y+math.sin(a)*.075,z+height)],leaf[1],'facade',level)


# Four inhabited roofs: high wing, rear wing, right wing and entrance garden.
ROOFS=[((-4.6,-1.7,-3.6,3.4),6),((-1.7,4.6,1.4,3.4),5),((2.1,4.6,-3.6,1.4),4),(CENTRE,2)]
for (x0,x1,y0,y1),level in ROOFS:
    paving((x0+.20,x1-.20,y0+.20,y1-.20),level)
# Guards only along exposed edges, never through adjacent occupied wings.
for points,level,closed in [
    ([(-4.51,-3.51),(-1.79,-3.51),(-1.79,3.31),(-4.51,3.31)],6,True),
    ([(-1.6,3.31),(4.51,3.31),(4.51,1.49),(-1.6,1.49)],5,False),
    ([(2.19,1.3),(2.19,-3.51),(4.51,-3.51),(4.51,1.3)],4,False),
    ([(-1.58,-3.51),(1.98,-3.51)],2,False),
]:
    parapet_path(points,level,closed)
    for a,b in zip(points,points[1:]+(points[:1] if closed else [])): guard(a,b,level)
planting=[((-4.20,-2.05,-3.12,-2.60),6),((-4.22,-3.73,-2.25,.45),6),
          ((-.95,3.9,2.55,3.04),5),((3.81,4.24,-2.85,.8),4),((2.48,3.28,-2.88,-1.95),4),
          ((-1.29,-.55,-2.66,-1.78),2),((1.36,1.75,-2.70,.62),2),((-.75,.85,.57,.98),2)]
for rect,level in planting:
    top=planter(rect,level); herbs(rect,top,level)
for x,y,level,size in [(-.94,-2.20,2,1.0),(2.9,-2.4,4,1.05),(-3.95,-1.1,6,.65),(2.85,2.8,5,.7)]:
    tree(x,y,level*H+.435,level,size)
# Benches with linen seats and a low table in the courtyard and upper terrace.
for x,y,level in [(.25,-1.75,2),(3.10,-.3,4)]:
    z=level*H+.14
    box('Bench base',(x,y,z+.13),(.95,.36,.26),stone,'facade',level,True)
    box('Linen cushion',(x,y,z+.285),(.90,.33,.05),fabric,'facade',level,True)
    box('Bench back',(x,y+.155,z+.39),(.95,.06,.24),wood,'facade',level)
    box('Terrace table',(x,y-.65,z+.16),(.46,.36,.32),stone,'facade',level,True)
# Roof core is an extension of the actual core, clad with bronze service fins.
box('Roof stair enclosure',(-3.40,2.22,6*H+.51),(1.25,1.60,.82),concrete,'structure',6)
box('Roof core cap',(-3.40,2.22,6*H+.95),(1.37,1.72,.09),stone,'facade',6,True)
box('Roof access door',(-3.40,3.031,6*H+.43),(.52,.026,.65),bronze,'facade',6)
for i in range(19):
    x=-3.99+i*1.18/18
    box('Core copper louvre',(x,1.39,6*H+.53),(.028,.075,.82),copper,'facade',6)
for i in range(22):
    y=1.44+i*1.54/21
    box('Core side louvre',(-2.74,y,6*H+.53),(.07,.028,.82),copper,'facade',6)

# Raised stone site meets the studio ground exactly. Approach steps are solid.
box('Foundation',(0,-.10,-.60),(10.7,8.4,.80),concrete,'base',-1,True)
box('Site paving',(0,-.10,-.15),(10.85,8.55,.10),stone,'base',-1,True)
for i in range(5):
    top=-.1-(i+1)*.15; y=-4.49-i*.26
    box('Grounded entrance step',(.15,y,(GROUND+top)/2),(3.82,.53,top-GROUND),stone,'base',-1,True)
# A side ramp has a real sloped mesh and connected landing, no floating strip.
x0,x1=5.43,6.01; y0,y1=-4.30,3.7
ramp=[(x0,y0,GROUND),(x1,y0,GROUND),(x1,y1,GROUND),(x0,y1,GROUND),
      (x0,y0,-.1),(x1,y0,-.1),(x1,y1,GROUND+.012),(x0,y1,GROUND+.012)]
for face in [(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]: polygon([ramp[i] for i in face],stone,'base',-1)
box('Ramp landing',(5.70,-4.34,-.15),(.64,.34,.10),stone,'base',-1)
for y in [-4.15,-2.6,-1,.6,2.2,3.6]:
    z=-.1-(y-y0)/(y1-y0)*.888
    rod((5.99,y,z),(5.99,y,z+.43),.014,bronze,'base',-1)
rod((5.99,y0,.33),(5.99,y1,GROUND+.442),.018,bronze,'base',-1)
# Ground planters are on the foundation top, with shrubs rooted in contained soil.
for x in [-3.25,3.32]:
    rect=(x-.9,x+.9,-4.12,-3.83)
    top=planter(rect,0,base_z=-.10); herbs(rect,top,0)
# Illustrative reinforcement follows the new left-wing columns and slab bands.
for level in [1,2,3,4]:
    x,y=-1.96,-3.34; z=level*H
    for dx in [-.08,.08]:
        for dy in [-.08,.08]: rod((x+dx,y+dy,z+.10),(x+dx,y+dy,z+H-.10),.018,rebar,'rebar',level)
    for j in range(10):
        zz=z+.12+j*(H-.24)/9
        pts=[(x-.105,y-.105,zz),(x+.105,y-.105,zz),(x+.105,y+.105,zz),(x-.105,y+.105,zz)]
        for k in range(4): rod(pts[k],pts[(k+1)%4],.012,rebar,'rebar',level,5)
    for i in range(12):
        yy=-3.32+i*.13
        rod((-4.3,yy,z+.02),(-1.9,yy,z+.02),.014,rebar,'rebar',level,5)
    for i in range(17):
        xx=-4.3+i*.15
        rod((xx,-3.32,z+.065),(xx,-1.85,z+.065),.014,rebar,'rebar',level,5)
# Services stay within the occupied U-shaped wings, never across the open garden.
for level in [1,3,4]:
    z=level*H+H-.35
    box('Left wing duct',(-3.1,0,z),(.22,6.2,.18),duct,'services',level)
    box('Rear wing duct',(.5,2.35,z),(7.1,.22,.18),duct,'services',level)
    if level<4: box('Right wing duct',(3.35,-.35,z),(.22,4.65,.18),duct,'services',level)
    for y in [-2.5,-.6,1.1]: box('Left branch',(-3.1,y,z),(2.1,.15,.13),duct,'services',level)
    rod((-3.65,-3.1,z+.15),(-3.65,2.6,z+.15),.032,bronze,'services',level)

# Verify columns have a supporting plate at both ends; no supported system is
# allowed to accidentally terminate in the courtyard void or above a low wing.
def supported(x,y,level):
    return any(l==level and r[0]-.001<=x<=r[1]+.001 and r[2]-.001<=y<=r[3]+.001 for r,l in PLATES)
assert all(supported(x,y,lo) and supported(x,y,hi) for x,y,lo,hi in SUPPORTS)
assert not any(level>2 and r==CENTRE for r,level in PLATES)
print('COURTYARD_CONTACT_CHECKS',len(SUPPORTS),'columns',len(PLATES),'plates',flush=True)

assets=[]
for (kind,level),b in BUCKETS.items():
    mesh=bpy.data.meshes.new(f'{kind}_{level}')
    mesh.from_pydata(b['verts'],[],b['faces']); mesh.update()
    ob=bpy.data.objects.new(mesh.name,mesh); bpy.context.collection.objects.link(ob)
    used=sorted(set(b['mats']))
    for index in used: mesh.materials.append(MATERIALS[index])
    indices={mat:i for i,mat in enumerate(used)}
    for poly,mat in zip(mesh.polygons,b['mats']): poly.material_index=indices[mat]
    uv=mesh.uv_layers.new(name='World grain')
    for poly in mesh.polygons:
        axis=max(range(3),key=lambda i:abs(poly.normal[i]))
        dims=[i for i in range(3) if i!=axis]
        for loop_index in poly.loop_indices:
            co=mesh.vertices[mesh.loops[loop_index].vertex_index].co
            uv.data[loop_index].uv=(co[dims[0]]*.75,co[dims[1]]*.75)
    ob['system']='facade' if kind=='frame' else kind; ob['level']=level
    if kind=='frame': ob['animationRole']='frame'
    if b['bevel']:
        group=ob.vertex_groups.new(name='Finished stone edges'); group.add(list(b['bevel']),1,'REPLACE')
        bpy.context.view_layer.objects.active=ob
        mod=ob.modifiers.new('Restrained edge bevel','BEVEL'); mod.width=.008; mod.segments=1
        mod.limit_method='VGROUP'; mod.vertex_group=group.name
        bpy.ops.object.modifier_apply(modifier=mod.name)
    assets.append(ob)

# Check the finished, bevelled mesh rather than only the construction outline.
# A short ray at each outer/inner corner must hit its closing face. The old
# independent strips leave this diagonal ray travelling through the open notch.
bpy.context.view_layer.update()
depsgraph=bpy.context.evaluated_depsgraph_get()
facade_trees={ob['level']:BVHTree.FromObject(ob,depsgraph) for ob in assets if ob['system']=='facade' and not ob.get('animationRole')}
frame_trees={ob['level']:BVHTree.FromObject(ob,depsgraph) for ob in assets if ob.get('animationRole')=='frame'}
for point,outward,level in CORNER_PROBES:
    origin=Vector((point.x+outward.x*.30,point.y+outward.y*.30,(level+.5)*H))
    direction=Vector((-outward.x,-outward.y,0)).normalized()
    hit,normal,index,distance=frame_trees[level].ray_cast(origin,direction,.5)
    assert hit is not None and .14<distance<.24, ('Open finished corner',point,level,distance)
print('FINISHED_CORNER_RAYS',len(CORNER_PROBES),'passed',flush=True)
for point,outward,level in PARAPET_PROBES:
    origin=Vector((point.x+outward.x*.30,point.y+outward.y*.30,level*H+.15))
    direction=Vector((-outward.x,-outward.y,0))
    hit,normal,index,distance=facade_trees[level].ray_cast(origin,direction,.4)
    assert hit is not None and .17<distance<.21, ('Open parapet corner',point,level,distance)
print('FINISHED_PARAPET_RAYS',len(PARAPET_PROBES),'passed',flush=True)

bpy.ops.object.select_all(action='DESELECT')
for ob in assets: ob.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'formwork-courtyard.glb'),export_format='GLB',use_selection=True,export_extras=True,export_animations=False,export_meshopt_compression_enable=True)
scene=bpy.context.scene
scene.render.engine='CYCLES'; scene.cycles.samples=48; scene.cycles.use_denoising=True
try:
    prefs=bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type='OPTIX'; prefs.get_devices()
    for device in prefs.devices: device.use=device.type=='OPTIX'
    if any(device.use for device in prefs.devices): scene.cycles.device='GPU'
except Exception: pass
scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.09,.08,.065,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.45
studio=material('Studio charcoal',(.024,.025,.022),rough=.85)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,GROUND))
bpy.context.object.data.materials.append(MATERIALS[studio])
for name,loc,power,size,color in [('Key',(-9,-12,20),2400,8,(1,.89,.74)),('Fill',(12,-2,14),1100,10,(.86,.92,1)),('Rim',(-4,10,18),1800,8,(1,.9,.75))]:
    bpy.ops.object.light_add(type='AREA',location=loc)
    ob=bpy.context.object; ob.name=name; ob.data.energy=power; ob.data.shape='DISK'; ob.data.size=size; ob.data.color=color
    ob.rotation_euler=(Vector((0,0,4.5))-ob.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(17,-24,16))
scene.camera=bpy.context.object
scene.camera.rotation_euler=(Vector((0,0,4.6))-scene.camera.location).to_track_quat('-Z','Y').to_euler()
scene.camera.data.type='ORTHO'; scene.camera.data.ortho_scale=18
scene.render.resolution_x=1400; scene.render.resolution_y=1400; scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
render_dir=ROOT/'artifacts/courtyard-review'; render_dir.mkdir(parents=True,exist_ok=True)
scene.render.filepath=str(render_dir/'blender-opening.png')
for ob in assets:
    if ob.get('system') in ['rebar','services']: ob.hide_render=True
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/formwork-courtyard.blend'))
if '--no-render' not in sys.argv: bpy.ops.render.render(write_still=True)
print('COURTYARD_MODEL_COMPLETE', (OUT/'formwork-courtyard.glb').stat().st_size,flush=True)

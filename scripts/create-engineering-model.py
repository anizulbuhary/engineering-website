"""Reproducible FORMWORK concept model. Run with Blender --background --python.

Creates a compact GLB with independently animated systems, the editable .blend,
and a studio-lit poster. Geometry is illustrative, not construction documentation.
"""
import bpy
import sys
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
bpy.context.preferences.filepaths.save_version = 0
OUT = ROOT / 'public' / 'models'
OUT.mkdir(parents=True, exist_ok=True)
(ROOT / 'assets' / 'blender').mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def material(name, color, metal=0, rough=.5):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Metallic'].default_value = metal
    bsdf.inputs['Roughness'].default_value = rough
    return m

concrete = material('Honed limestone', (.49, .465, .40), 0, .78)
edge = material('Cut limestone edges', (.68, .655, .59), 0, .62)
copper = material('Brushed architectural bronze', (.32, .205, .115), .72, .38)
glass = material('Recessed smoked glazing', (.055, .082, .075), .18, .2)
steel = material('Reinforcement', (.65, .24, .075), .5, .35)
duct = material('Mechanical sage', (.24, .43, .37), .45, .4)
dark = material('Basalt plinth', (.10, .12, .105), .15, .6)
paving = material('Terrace stone', (.40, .39, .345), 0, .86)
joint = material('Recessed stone joints', (.19, .185, .16), 0, .9)

buckets = {}
def box(name, loc, dims, mat, kind, level=-1):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    ob = bpy.context.object
    ob.name = name
    ob.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    ob.data.materials.append(mat)
    # Reserve additional geometry for edges that remain visible at site scale.
    # Thin joints, pavers and fins do not need hundreds of bevel vertices each.
    if (kind in ['structure','base'] and min(dims) >= .08) or name=='Corner frame':
        group=ob.vertex_groups.new(name='Architectural edges')
        group.add(list(range(len(ob.data.vertices))),1,'REPLACE')
    buckets.setdefault((kind, level), []).append(ob)
    return ob

def rod(a, b, radius, mat, kind, level):
    delta = Vector(b) - Vector(a)
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=radius, depth=delta.length,
                                      location=(Vector(a) + Vector(b)) / 2)
    ob = bpy.context.object
    ob.rotation_euler = delta.to_track_quat('Z', 'Y').to_euler()
    ob.data.materials.append(mat)
    buckets.setdefault((kind, level), []).append(ob)

# Seven occupied storeys plus a finished roof. Setback slabs cover the storey
# beneath them, so the wider lower facade never protrudes beyond its roof.
def envelope(level):
    return (8.6 if level < 5 else 7.1, 6.4 if level < 6 else 5.3, 0 if level < 5 else -.55)

def terrace_finish(cx, width, depth, z, level):
    """A continuous bedding layer and fitted pavers within the parapet line."""
    w, d = width-.48, depth-.48
    box('Stone bedding', (cx,0,z+.119), (w,d,.018), joint, 'structure', level)
    nx, ny = max(1,round(w/.82)), max(1,round(d/.82))
    for ix in range(nx):
        for iy in range(ny):
            x=cx-w/2+(ix+.5)*w/nx
            y=-d/2+(iy+.5)*d/ny
            box('Fitted terrace paver',(x,y,z+.14),(w/nx-.014,d/ny-.014,.025),paving,'structure',level)

for level in range(8):
    z = level * 1.55
    width, depth, cx = envelope(level)
    slab_width, slab_depth, slab_cx = envelope(max(0, level-1))
    box('Floor plate', (slab_cx, 0, z), (slab_width, slab_depth, .22), edge, 'structure', level)
    box('Soffit', (slab_cx, 0, z-.15), (slab_width-.2, slab_depth-.2, .13), concrete, 'structure', level)
    # A slim recessed fascia line gives the slab a manufactured edge rather
    # than the appearance of a stack of featureless white blocks.
    for side in [-1,1]:
        box('Fascia joint',(slab_cx,side*(slab_depth/2+.001),z-.067),(slab_width-.08,.008,.012),joint,'structure',level)
        box('Fascia joint',(slab_cx+side*(slab_width/2+.001),0,z-.067),(.008,slab_depth-.08,.012),joint,'structure',level)
    if level < 7:
        for x in [-3.1, 0, 2.5]:
            for y in [-2.25, 2.15]:
                box('Column', (x, y, z+.72), (.29, .29, 1.24), concrete, 'structure', level)
        box('Core', (-1.15, 1.15, z+.72), (1.3, 1.7, 1.24), concrete, 'structure', level)
    # Solid parapets and copings are attached to their slab, including terraces.
    if level in [5, 6, 7]:
        for side in [-1, 1]:
            x=slab_cx+side*(slab_width/2-.09)
            y=side*(slab_depth/2-.09)
            box('Parapet',(x,0,z+.33),(.18,slab_depth,.46),concrete,'structure',level)
            box('Parapet',(slab_cx,y,z+.33),(slab_width-.36,.18,.46),concrete,'structure',level)
            box('Coping',(x,0,z+.575),(.22,slab_depth,.05),edge,'structure',level)
            box('Coping',(slab_cx,y,z+.575),(slab_width-.44,.22,.05),edge,'structure',level)
        terrace_finish(slab_cx,slab_width,slab_depth,z,level)
    if level < 7:
        for y in [-depth/2+.38, depth/2-.38]:
            box('Ribbon window', (cx, y, z+.72), (width-.72, .10, 1.22), glass, 'facade', level)
            for h in [.13,1.31]:
                box('Window rail',(cx,y,z+h),(width-.62,.17,.065),copper,'facade',level)
            count=round((width-.82)/.55)
            for i in range(count+1):
                x = cx-width/2+.41+i*(width-.82)/count
                if level==0 and y<0 and abs(x)<1.25: continue
                box('Bronze fin', (x, y, z+.72), (.055, .32, 1.22), copper, 'facade', level)
                box('Window mullion',(x,y,z+.72),(.035,.12,1.22),dark,'facade',level)
        for x in [cx-width/2+.38, cx+width/2-.38]:
            box('Side window', (x, 0, z+.72), (.10, depth-.66, 1.22), glass, 'facade', level)
            for h in [.13,1.31]:
                box('Side rail',(x,0,z+h),(.17,depth-.62,.065),copper,'facade',level)
            count=round((depth-.82)/.55)
            for i in range(count+1):
                y=-depth/2+.41+i*(depth-.82)/count
                box('Side fin', (x,y,z+.72), (.32, .055, 1.22), copper, 'facade', level)
        # Continuous corner frames close the four glass joints at every storey.
        for x in [cx-width/2+.38,cx+width/2-.38]:
            for y in [-depth/2+.38,depth/2-.38]:
                box('Corner frame',(x,y,z+.72),(.12,.12,1.22),copper,'facade',level)
    # Selected reinforcement zones, with longitudinal bars and closed stirrups.
    if level in [2, 3, 4]:
        for x in [2.4, 2.6]:
            for y in [-2.35, -2.15]:
                rod((x,y,z-.1), (x,y,z+1.65), .025, steel, 'rebar', level)
        for j in range(9):
            h=z+j*.18
            pts=[(2.39,-2.36,h),(2.61,-2.36,h),(2.61,-2.14,h),(2.39,-2.14,h)]
            for k in range(4): rod(pts[k],pts[(k+1)%4],.018,steel,'rebar',level)
        for i in range(12):
            y=-2.4+i*.14
            rod((-3.2,y,z+.02),(3.3,y,z+.02),.018,steel,'rebar',level)
        for i in range(27):
            x=-3.2+i*.25
            rod((x,-2.4,z+.06),(x,-.8,z+.06),.018,steel,'rebar',level)
    if level in [1, 3, 5]:
        box('Main air duct', (0, .1, z+1.15), (6.6,.28,.2), duct,'services',level)
        for x in [-2.4,0,2.4]:
            box('Branch duct',(x,-.85,z+1.15),(.19,2.1,.16),duct,'services',level)
        rod((-3,-1.6,z+1.25),(3,-1.6,z+1.25),.055,copper,'services',level)

GROUND = -1
for x in [-.62,.62]:
    box('Entrance door',(x,-2.89,.72),(1.2,.06,1.20),glass,'facade',0)
for x in [-1.24,0,1.24]:
    box('Entrance jamb',(x,-2.94,.72),(.05,.08,1.24),copper,'facade',0)
for x in [-.13,.13]:
    rod((x,-3.01,.48),(x,-3.01,.85),.025,copper,'facade',0)
box('Entrance canopy',(0,-3.18,1.42),(3.15,1.18,.18),edge,'structure',1)
box('Canopy bronze soffit',(0,-3.27,1.323),(2.96,.94,.018),copper,'structure',1)
box('Entrance threshold',(0,-3.04,.122),(2.58,.44,.024),dark,'structure',0)
box('Podium', (0,0,-.64),(10.6,8.3,.72),dark,'base')
box('Podium cap',(0,0,-.235),(10.8,8.5,.1),concrete,'base')
for x in [-4.35,-3.3,-2.25,-1.2,1.2,2.25,3.3,4.35]:
    box('Podium stone joint',(x,-4.257,-.235),(.012,.016,.08),joint,'base')
for i in range(4):
    top=-.185-(i+1)*.163
    box('Solid approach step',(0,-4.4-i*.32,(top+GROUND)/2),(5.8,.64,top-GROUND),concrete,'base')
roof_z=7*1.55
box('Enclosed roof core',(-1.15,1.15,roof_z+.55),(1.3,1.7,.9),concrete,'structure',7)
box('Core roof cap',(-1.15,1.15,roof_z+1.03),(1.42,1.82,.09),edge,'structure',7)
box('Roof access door',(-1.15,.291,roof_z+.48),(.52,.035,.72),dark,'structure',7)
box('Roof door threshold',(-1.15,.23,roof_z+.16),(.62,.2,.05),edge,'structure',7)

# Contact checks run before merging, while semantic parts are still available.
bpy.context.view_layer.update()
assert all(ob.location.z-ob.dimensions.z/2 >= GROUND-.001 for group in buckets.values() for ob in group)
assert abs(buckets[('base',-1)][0].location.z-buckets[('base',-1)][0].dimensions.z/2-GROUND)<.001
assert not any(ob.name.startswith('Column') for ob in buckets[('structure',7)])
assert all(abs(ob.location.z-ob.dimensions.z/2-GROUND)<.001 for ob in buckets[('base',-1)] if ob.name.startswith('Solid approach'))

assets=[]
for (kind,level), objects in buckets.items():
    bpy.ops.object.select_all(action='DESELECT')
    for ob in objects: ob.select_set(True)
    bpy.context.view_layer.objects.active=objects[0]
    bpy.ops.object.join()
    ob=bpy.context.object
    ob.name=f'{kind}_{level}'
    bpy.context.scene.cursor.location=(0,0,0)
    bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
    ob['system']=kind
    ob['level']=level
    if kind in ['structure','base','facade']:
        bevel=ob.modifiers.new('Small manufactured edges','BEVEL')
        bevel.width=.006 if kind=='facade' else .014
        bevel.segments=2
        bevel.limit_method='VGROUP'
        bevel.vertex_group='Architectural edges'
        bpy.ops.object.modifier_apply(modifier=bevel.name)
    assets.append(ob)

bpy.ops.object.select_all(action='DESELECT')
for ob in assets: ob.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'formwork-pavilion.glb'), export_format='GLB',
                         use_selection=True, export_extras=True, export_animations=False)

# A matching high-quality static view loads before the interactive scene.
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=32
scene.cycles.use_denoising=True
try:
    prefs=bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type='OPTIX'
    prefs.get_devices()
    for device in prefs.devices: device.use=device.type=='OPTIX'
    if any(device.use for device in prefs.devices): scene.cycles.device='GPU'
except Exception:
    pass
scene.world.color=(.15,.15,.15)
scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.075,.095,.09,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.45
groundmat=material('Studio charcoal',(.025,.035,.032),0,.8)
bpy.ops.mesh.primitive_plane_add(size=200, location=(0,0,GROUND))
bpy.context.object.data.materials.append(groundmat)
for name,loc,power,size,color in [
    ('Softbox',(2,-12,22),3200,12,(1,.88,.7)),
    ('Rim',(-10,6,16),3800,9,(.77,.86,1)),
    ('Fill',(12,8,10),2200,8,(1,.64,.35))]:
    bpy.ops.object.light_add(type='AREA',location=loc)
    light=bpy.context.object
    light.name=name
    light.data.energy=power
    light.data.shape='DISK'
    light.data.size=size
    light.data.color=color
    light.rotation_euler=(Vector((0,0,5))-light.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(21,-29,18))
camera=bpy.context.object
camera.rotation_euler=(Vector((0,0,5.1))-camera.location).to_track_quat('-Z','Y').to_euler()
camera.data.type='ORTHO'
camera.data.ortho_scale=20
scene.camera=camera
scene.render.resolution_x=1500
scene.render.resolution_y=1300
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
render_dir = ROOT / 'artifacts' / 'blender'
render_dir.mkdir(parents=True, exist_ok=True)
scene.render.filepath=str(render_dir/'pavilion-poster.png')
for ob in assets:
    if ob.get('system') in ['rebar','services']: ob.hide_render=True
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets'/'blender'/'formwork-pavilion.blend'))
if '--no-render' not in sys.argv:
    bpy.ops.render.render(write_still=True)
# The website's transparent poster is captured from the runtime scene with
# scripts/capture-engineering-poster.mjs after rebuilding the frontend.
print('FORMWORK_MODEL_COMPLETE')

"""Reproducible FORMWORK concept model. Run with Blender --background --python.

Creates a compact GLB with independently animated systems, the editable .blend,
and a studio-lit poster. Geometry is illustrative, not construction documentation.
"""
import bpy
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

concrete = material('Warm limestone', (.60, .55, .44), .05, .66)
edge = material('Pale cut edges', (.82, .77, .65), .08, .4)
copper = material('Anodised bronze', (.47, .22, .09), .65, .32)
glass = material('Smoked glazing', (.055, .105, .10), .5, .22)
steel = material('Reinforcement', (.65, .24, .075), .5, .35)
duct = material('Mechanical sage', (.24, .43, .37), .45, .4)
dark = material('Basalt plinth', (.10, .12, .105), .15, .6)

buckets = {}
def box(name, loc, dims, mat, kind, level=-1):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    ob = bpy.context.object
    ob.name = name
    ob.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    ob.data.materials.append(mat)
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

for level in range(8):
    z = level * 1.55
    width, depth, cx = envelope(level)
    slab_width, slab_depth, slab_cx = envelope(max(0, level-1))
    box('Floor plate', (slab_cx, 0, z), (slab_width, slab_depth, .22), edge, 'structure', level)
    box('Soffit', (slab_cx, 0, z-.15), (slab_width-.2, slab_depth-.2, .13), concrete, 'structure', level)
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
            box('Parapet',(x,0,z+.27),(.18,slab_depth,.34),concrete,'structure',level)
            box('Parapet',(slab_cx,y,z+.27),(slab_width-.36,.18,.34),concrete,'structure',level)
            box('Coping',(x,0,z+.455),(.21,slab_depth,.04),edge,'structure',level)
            box('Coping',(slab_cx,y,z+.455),(slab_width-.42,.21,.04),edge,'structure',level)
    if level < 7:
        for y in [-depth/2+.38, depth/2-.38]:
            box('Ribbon window', (cx, y, z+.72), (width-.72, .10, 1.22), glass, 'facade', level)
            for h in [.13,1.31]:
                box('Window rail',(cx,y,z+h),(width-.62,.17,.065),copper,'facade',level)
            for i in range(int(width/.42)):
                x = cx-width/2+.4+i*.42
                if level==0 and y<0 and abs(x)<1.25: continue
                box('Bronze fin', (x, y, z+.72), (.065, .36, 1.22), copper, 'facade', level)
        for x in [cx-width/2+.38, cx+width/2-.38]:
            box('Side window', (x, 0, z+.72), (.10, depth-.66, 1.22), glass, 'facade', level)
            for h in [.13,1.31]:
                box('Side rail',(x,0,z+h),(.17,depth-.62,.065),copper,'facade',level)
            for i in range(int(depth/.42)):
                box('Side fin', (x, -depth/2+.4+i*.42, z+.72), (.36, .065, 1.22), copper, 'facade', level)
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
box('Podium', (0,0,-.64),(10.6,8.3,.72),dark,'base')
box('Podium cap',(0,0,-.235),(10.8,8.5,.1),concrete,'base')
for i in range(4):
    top=-.185-(i+1)*.163
    box('Solid approach step',(0,-4.4-i*.32,(top+GROUND)/2),(5.8,.64,top-GROUND),concrete,'base')
roof_z=7*1.55
box('Enclosed roof core',(-1.15,1.15,roof_z+.55),(1.3,1.7,.9),concrete,'structure',7)
box('Core roof cap',(-1.15,1.15,roof_z+1.03),(1.42,1.82,.09),edge,'structure',7)
box('Roof access door',(-1.15,.291,roof_z+.48),(.52,.035,.72),dark,'structure',7)

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
    if kind in ['structure','base']:
        bevel=ob.modifiers.new('Small manufactured edges','BEVEL')
        bevel.width=.012
        bevel.segments=2
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
bpy.ops.render.render(write_still=True)
# The website's transparent poster is captured from the runtime scene with
# scripts/capture-engineering-poster.mjs after rebuilding the frontend.
print('FORMWORK_MODEL_COMPLETE')

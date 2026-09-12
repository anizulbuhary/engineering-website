"""Read the saved building and render inspection views without modifying it."""
import bpy
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'assets/blender/formwork-courtyard.blend'))
scene=bpy.context.scene
scene.cycles.samples=16
try:
    prefs=bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type='OPTIX';prefs.get_devices()
    for device in prefs.devices: device.use=device.type=='OPTIX'
    if any(device.use for device in prefs.devices):
        scene.cycles.device='GPU';scene.cycles.denoiser='OPTIX'
except Exception: pass
scene.render.resolution_x=1000
scene.render.resolution_y=1000
out=ROOT/'artifacts/courtyard-review';out.mkdir(parents=True,exist_ok=True)
camera=scene.camera
views=[('front',(0,-30,15),(0,0,5),19),('rear',(0,30,15),(0,0,5),19),('left',(-30,0,14),(0,0,5),19),('right',(30,0,14),(0,0,5),19),('roof',(12,-14,24),(0,0,8),15),('courtyard',(8,-14,12),(.2,-.7,4.1),7),('entrance',(6,-18,5),(.3,-3.4,1.3),7),('facade-joints',(-12,-18,9),(-3.3,-3.6,5),5),('ground',(15,-20,1),(0,-1,-.3),14),('underside',(15,-20,-8),(0,0,3),20)]
views.insert(-1,('terrace-corner',(12,-14,11),(4.25,-3.15,6.35),3))
for name,position,target,scale in views:
    camera.location=position
    camera.rotation_euler=(Vector(target)-camera.location).to_track_quat('-Z','Y').to_euler()
    camera.data.ortho_scale=scale
    if name=='underside':
        for ob in scene.objects:
            if ob.type=='MESH' and not ob.get('system'): ob.hide_render=True
    scene.render.filepath=str(out/f'{name}.png')
    bpy.ops.render.render(write_still=True)
    print('REVIEW_VIEW',name,flush=True)

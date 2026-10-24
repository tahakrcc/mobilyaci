"""Generate the optimized Wooden Universe hero journey model and a preview render."""

import bpy
import math
import os
import random
from mathutils import Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODEL_PATH = os.path.join(ROOT, "public", "models", "wood-journey.glb")
PREVIEW_PATH = os.path.join(ROOT, "outputs", "wood-journey-preview.png")
random.seed(41)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for data in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
        pass


def texture(name):
    return bpy.data.images.load(os.path.join(ROOT, "assets", "wood-journey", name + ".jpg"))


def material(name, color, roughness=0.5, metallic=0.0, alpha=1.0, image=None):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, alpha)
    mat.use_nodes = True
    bsdf = next((node for node in mat.node_tree.nodes if node.type == "BSDF_PRINCIPLED"), None)
    if bsdf is None:
        bsdf = mat.node_tree.nodes.new("ShaderNodeBsdfPrincipled")
        output = next((node for node in mat.node_tree.nodes if node.type == "OUTPUT_MATERIAL"), None)
        if output is None:
            output = mat.node_tree.nodes.new("ShaderNodeOutputMaterial")
        mat.node_tree.links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    if image is not None:
        tex = mat.node_tree.nodes.new("ShaderNodeTexImage")
        tex.image = image
        mat.node_tree.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if "Coat Weight" in bsdf.inputs:
        bsdf.inputs["Coat Weight"].default_value = 0.28 if metallic < 0.5 else 0.72
    if alpha < 1:
        bsdf.inputs["Alpha"].default_value = alpha
        mat.surface_render_method = "DITHERED"
    return mat


def empty(name):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    return obj


def irregular_radius(theta, x=0.0, seed=0.0, base=1.0):
    return base * (
        1.0
        + 0.055 * math.sin(theta * 3 + seed)
        + 0.028 * math.sin(theta * 7 - seed * 1.4)
        + 0.018 * math.sin(theta * 13 + x * 1.8)
    )


def make_log(name, length, radius, rings, segments, parent, bark_mat, wood_mat):
    verts, faces = [], []
    for i in range(rings):
        x = -length / 2 + length * i / (rings - 1)
        taper = 1.0 - 0.055 * (x / (length / 2))
        for j in range(segments):
            theta = 2 * math.pi * j / segments
            r = irregular_radius(theta, x, seed=0.4, base=radius * taper)
            verts.append((x, r * math.cos(theta), r * math.sin(theta)))
    for i in range(rings - 1):
        for j in range(segments):
            n = (j + 1) % segments
            a = i * segments + j
            b = i * segments + n
            c = (i + 1) * segments + n
            d = (i + 1) * segments + j
            faces.append((a, b, c, d))
    left_center = len(verts)
    verts.append((-length / 2, 0, 0))
    right_center = len(verts)
    verts.append((length / 2, 0, 0))
    for j in range(segments):
        n = (j + 1) % segments
        faces.append((left_center, n, j))
        a = (rings - 1) * segments + j
        b = (rings - 1) * segments + n
        faces.append((right_center, a, b))
    mesh = bpy.data.meshes.new(name + "Mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.parent = parent
    obj.data.materials.append(bark_mat)
    obj.data.materials.append(wood_mat)
    side_faces = (rings - 1) * segments
    for poly in obj.data.polygons:
        poly.material_index = 0 if poly.index < side_faces else 1
        poly.use_smooth = poly.index < side_faces
    uv = obj.data.uv_layers.new(name="UVMap")
    for poly in obj.data.polygons:
        seam = poly.index < side_faces and any(v % segments == 0 for v in poly.vertices) and any(v % segments == segments - 1 for v in poly.vertices)
        for loop_index in poly.loop_indices:
            vertex_index = obj.data.loops[loop_index].vertex_index
            vx, vy, vz = obj.data.vertices[vertex_index].co
            if poly.index < side_faces:
                angle_u = (vertex_index % segments) / segments
                uv.data[loop_index].uv = (1.0 if seam and angle_u == 0 else angle_u, (vx / length + .5) * 1.7)
            else:
                uv.data[loop_index].uv = (vy / (radius * 2.3) + .5, vz / (radius * 2.3) + .5)
    bevel = obj.modifiers.new("HandSoftenedEdges", "BEVEL")
    bevel.width = 0.025
    bevel.segments = 2
    return obj


def poly_curve(name, points, bevel, mat, parent):
    curve = bpy.data.curves.new(name + "Curve", "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 1
    curve.bevel_depth = bevel
    curve.bevel_resolution = 2
    spline = curve.splines.new("POLY")
    spline.points.add(len(points) - 1)
    for point, co in zip(spline.points, points):
        point.co = (*co, 1.0)
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    obj.parent = parent
    return obj


def make_cut_rings(parent, x, radius, ring_mat, bark_mat, prefix, segments=88):
    for idx, angle in enumerate((-1.8, -0.72, 0.28, 1.38)):
        points = []
        for step in range(7):
            t = step / 6
            bend = math.sin(t * math.pi * 2 + idx) * 0.045
            points.append((x - 0.003, (radius * 0.08 + radius * 0.68 * t) * math.cos(angle + bend), (radius * 0.08 + radius * 0.68 * t) * math.sin(angle + bend)))
        poly_curve(f"{prefix}_Crack_{idx}", points, 0.009, bark_mat, parent)


def make_bark_grooves(parent, length, radius, mat):
    for idx in range(18):
        theta = 2 * math.pi * idx / 18 + (idx % 3) * 0.04
        points = []
        for step in range(20):
            x = -length / 2 + 0.12 + (length - 0.24) * step / 19
            drift = 0.055 * math.sin(step * 0.62 + idx)
            r = irregular_radius(theta + drift, x, seed=0.4, base=radius) + 0.012
            points.append((x, r * math.cos(theta + drift), r * math.sin(theta + drift)))
        poly_curve(f"BarkGroove_{idx:02d}", points, 0.011 + (idx % 4) * 0.002, mat, parent)


def make_slab_half(name, side, parent, wood_mat, edge_mat):
    segments = 14
    length = 4.2
    outer_y = 1.28 * side
    inner_base = 0.24 * side
    top_z, bottom_z = 0.12, -0.12
    verts = []
    for i in range(segments + 1):
        x = -length / 2 + length * i / segments
        outer = outer_y + side * (0.08 * math.sin(i * 1.1) + 0.035 * math.sin(i * 2.7))
        inner = inner_base + side * (0.12 * math.sin(i * 0.86 + 0.7) + 0.05 * math.sin(i * 2.2))
        verts.extend([(x, outer, top_z), (x, inner, top_z), (x, outer, bottom_z), (x, inner, bottom_z)])
    faces = []
    face_mats = []
    for i in range(segments):
        a = i * 4
        b = (i + 1) * 4
        faces.extend([(a, b, b + 1, a + 1), (a + 2, a + 3, b + 3, b + 2), (a, a + 2, b + 2, b), (a + 1, b + 1, b + 3, a + 3)])
        face_mats.extend([0, 0, 1, 1])
    faces.extend([(0, 1, 3, 2), (segments * 4, segments * 4 + 2, segments * 4 + 3, segments * 4 + 1)])
    face_mats.extend([1, 1])
    mesh = bpy.data.meshes.new(name + "Mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.parent = parent
    obj.data.materials.append(wood_mat)
    obj.data.materials.append(edge_mat)
    for poly, mat_index in zip(obj.data.polygons, face_mats):
        poly.material_index = mat_index
    uv = obj.data.uv_layers.new(name="UVMap")
    for poly in obj.data.polygons:
        for loop_index in poly.loop_indices:
            vertex = obj.data.vertices[obj.data.loops[loop_index].vertex_index].co
            uv.data[loop_index].uv = (vertex.x / 4.2 + .5, vertex.y / 2.8 + .5)
    bevel = obj.modifiers.new("SlabEdgeSoftening", "BEVEL")
    bevel.width = 0.035
    bevel.segments = 3
    return obj


def add_box(name, location, scale, mat, parent, bevel=0.04):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    obj.parent = parent
    mod = obj.modifiers.new(name + "Bevel", "BEVEL")
    mod.width = bevel
    mod.segments = 3
    return obj


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


clear_scene()
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
os.makedirs(os.path.dirname(PREVIEW_PATH), exist_ok=True)

bark = material("Bark_Rough", (0.105, 0.045, 0.018), roughness=0.94, image=texture("bark"))
bark_high = material("Bark_Ridge", (0.19, 0.075, 0.024), roughness=0.88)
wood = material("Olive_Heartwood", (0.47, 0.255, 0.095), roughness=0.58, image=texture("olive-grain"))
ring = material("Growth_Rings", (0.135, 0.052, 0.016), roughness=0.75)
endgrain = material("Endgrain_Cut", (0.68, 0.43, 0.17), roughness=0.72, image=texture("end-grain"))
resin = material("Smoked_Resin", (0.012, 0.055, 0.052), roughness=0.13, metallic=0.18, alpha=0.88)
metal = material("Blackened_Steel", (0.018, 0.017, 0.014), roughness=0.25, metallic=0.92)

trunk_root = empty("TrunkRoot")
trunk = make_log("SculptedOliveTrunk", 4.15, 1.05, 12, 96, trunk_root, bark, endgrain)
make_cut_rings(trunk_root, -2.09, 1.05, ring, bark_high, "Trunk")

slice_root = empty("CrossSection")
slice_root.location.x = -2.85
slice = make_log("CrossSectionDisc", 0.16, 1.05, 2, 96, slice_root, bark, endgrain)
make_cut_rings(slice_root, -0.085, 1.05, ring, bark_high, "SliceFront")

slab_root = empty("SlabAssembly")
slab_root.rotation_euler = (0.05, 0.0, -0.03)
make_slab_half("LiveEdge_Left", -1, slab_root, wood, bark)
make_slab_half("LiveEdge_Right", 1, slab_root, wood, bark)
add_box("ResinRiver", (0, 0, 0.005), (2.08, 0.28, 0.105), resin, slab_root, bevel=0.08)
for x in (-1.48, 1.48):
    add_box(f"SteelLeg_{x}_A", (x, -0.83, -0.72), (0.07, 0.07, 0.62), metal, slab_root, bevel=0.035)
    add_box(f"SteelLeg_{x}_B", (x, 0.83, -0.72), (0.07, 0.07, 0.62), metal, slab_root, bevel=0.035)
    add_box(f"SteelLeg_{x}_Rail", (x, 0, -1.3), (0.07, 0.9, 0.07), metal, slab_root, bevel=0.035)

# Keep the alternate stages in the file; the website controls their visibility.
preview_hidden = [obj for obj in bpy.context.scene.objects if obj == slice_root or obj == slab_root or obj.parent == slice_root or obj.parent == slab_root]
for obj in preview_hidden:
    obj.hide_render = True

# Convert curves and apply modifiers for predictable glTF output.
for obj in list(bpy.context.scene.objects):
    if obj.type == "CURVE":
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.convert(target="MESH")
        obj.select_set(False)
for obj in list(bpy.context.scene.objects):
    if obj.type == "MESH":
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        for modifier in list(obj.modifiers):
            try:
                bpy.ops.object.modifier_apply(modifier=modifier.name)
            except RuntimeError:
                pass
        obj.select_set(False)

# Preview studio.
bpy.ops.mesh.primitive_plane_add(size=18, location=(0, 0, -1.35))
floor = bpy.context.object
floor.name = "PreviewFloor"
floor.data.materials.append(material("PreviewFloorMat", (0.009, 0.008, 0.006), roughness=0.72))
floor.hide_viewport = False

bpy.ops.object.light_add(type="AREA", location=(-1.8, -3.5, 4.8))
key = bpy.context.object
key.data.energy = 1150
key.data.shape = "DISK"
key.data.size = 4.0
key.data.color = (1.0, 0.63, 0.27)
look_at(key, (0, 0, 0))
bpy.ops.object.light_add(type="AREA", location=(3.4, 2.8, 1.6))
fill = bpy.context.object
fill.data.energy = 850
fill.data.size = 3.0
fill.data.color = (1.0, 0.88, 0.62)
look_at(fill, (0, 0, 0))
bpy.ops.object.light_add(type="AREA", location=(-3.0, 3.4, 0.4))
rim = bpy.context.object
rim.data.energy = 620
rim.data.size = 2.0
rim.data.color = (0.42, 0.24, 0.08)
look_at(rim, (0, 0, 0))

bpy.ops.object.camera_add(location=(5.8, -7.0, 3.35))
camera = bpy.context.object
look_at(camera, (0, 0, -0.05))
bpy.context.scene.camera = camera

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1000
scene.render.resolution_y = 700
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = PREVIEW_PATH
scene.render.film_transparent = False
scene.world.color = (0.002, 0.002, 0.001)
scene.render.image_settings.color_mode = "RGBA"
scene.view_settings.look = "AgX - Medium High Contrast"
bpy.ops.render.render(write_still=True)

# Do not ship preview-only studio objects.
bpy.data.objects.remove(floor, do_unlink=True)
bpy.data.objects.remove(camera, do_unlink=True)
bpy.data.objects.remove(key, do_unlink=True)
bpy.data.objects.remove(fill, do_unlink=True)
bpy.data.objects.remove(rim, do_unlink=True)
for obj in preview_hidden:
    obj.hide_render = False

bpy.ops.file.pack_all()
bpy.context.preferences.filepaths.save_version = 0
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, "assets", "wood-journey", "wood-journey.blend"))

bpy.ops.export_scene.gltf(
    filepath=MODEL_PATH,
    export_format="GLB",
    export_apply=True,
    export_yup=True,
    export_cameras=False,
    export_lights=False,
)

print(f"MODEL={MODEL_PATH}")
print(f"PREVIEW={PREVIEW_PATH}")

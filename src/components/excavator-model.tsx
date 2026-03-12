import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export function ExcavatorModel({ movement, boxO, ...props }) {
  const { nodes, materials } = useGLTF("/Excavator Simple.glb");
  useFrame(() => {
    if (nodes.Stick) {
      nodes.Stick.rotation.x = movement.stick;
    }
    if (nodes.Boom0) {
      nodes.Boom0.rotation.x = movement.boom;
    }
    if (nodes.Bucket) {
      nodes.Bucket.rotation.x = movement.bucket;
    }
    if (nodes.Bone) {
      nodes.Bone.rotation.z = movement.base;
    }
  });

  return (
    <group {...props} dispose={null}>
      <group position={boxO}>
        <primitive object={nodes.Bone} />
      </group>
    </group>
  );
}

useGLTF.preload("/Excavator Simple.glb");

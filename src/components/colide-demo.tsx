import { useEffect, useRef, useState } from "react";
import MovementInput from "./movement-input";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";

const TreeDemo = () => {
  const [movement, setMovement] = useState({ y: 1 });
  const body = useRef(null);

  useEffect(() => {
    if (!body.current) return;
    const next = new Vector3(0, movement.y, 0);
    body.current.setNextKinematicTranslation(next);
  }, [movement.y]);

  return (
    <div className="bg-gray-900 h-screen text-gray-300 font-bold">
      <div className="p-4 absolute z-10">
        <MovementInput
          title="y"
          movement={movement}
          setMovement={setMovement}
        />
      </div>
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <OrbitControls />
        <axesHelper />
        <Physics debug colliders="cuboid">
          {/*  ___________static cube___________  */}
          <RigidBody
            type="fixed"
            name="earth"
            gravityScale={0}
            onCollisionEnter={(e) => console.log(e)}
          >
            <mesh position={[1, -4, 1]}>
              <boxGeometry args={[3, 3, 3]} />
              <meshStandardMaterial
                color="lightgreen"
                transparent
                opacity={0.3}
              />
            </mesh>
          </RigidBody>

          {/*  ___________moving cube___________  */}
          <RigidBody
            ref={body}
            name="body"
            gravityScale={0}
            type="kinematicPosition"
            activeCollisionTypes={60943}
          >
            <mesh position={[1, -1, 1]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="lightblue" />
            </mesh>
          </RigidBody>
        </Physics>
      </Canvas>
    </div>
  );
};

export default TreeDemo;

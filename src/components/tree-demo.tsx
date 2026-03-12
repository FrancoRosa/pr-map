import { Canvas } from "@react-three/fiber";
import { CameraControls, OrbitControls } from "@react-three/drei"; // 1. Import the controls
import { useEffect, useRef, useState } from "react";
// import { ExcavatorModel } from "./excavator-model";
// import GeoJsonLayer from "./geojson-line";
import fieldData from "../assets/inverterJson.json";
import { Button } from "./ui/button";
import * as THREE from "three";
import { Vector3 } from "three";
import { Physics, RigidBody } from "@react-three/rapier";

function Box({ origin = [0, 0, 0], movement }) {
  const body = useRef(null);

  useEffect(() => {
    if (!body.current) return;
    const next = new Vector3(origin[0], origin[1] + movement.boom, origin[2]);
    body.current.setNextKinematicTranslation(next); // for kinematic
    // body.current.setTranslation(next, true); // for dynamic
  }, [origin, movement]);

  return (
    <RigidBody ref={body} type="kinematicPosition" colliders="cuboid">
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="lightgreen" />
      </mesh>
    </RigidBody>
  );
}

function FieldBox({ width, height, depth, setBoxO }) {
  return (
    <mesh
      onClick={(e) => {
        const {
          point: { x, y, z },
        } = e;
        setBoxO([x, y, z]);
      }}
    >
      <boxGeometry args={[width + 20, height, depth + 20]} />
      <meshStandardMaterial
        color="royalblue"
        // transparent
        opacity={0.3}
      />
    </mesh>
  );
}

function Plane({ setBoxO }) {
  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[0, 0, 0]}
      onClick={(e) => {
        const {
          point: { x, y, z },
        } = e;
        e.stopPropagation();
        setBoxO([x, y, z]);
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial transparent opacity={0.1} />
    </mesh>
  );
}

function SurfPlane({ setBoxO, fieldAverages }) {
  const { x: xi, y: yi, z: zi } = fieldAverages;
  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[xi, yi + 0.02, zi]}
      onClick={(e) => {
        const {
          point: { x, y, z },
        } = e;
        e.stopPropagation();
        console.log({ x, y, z });
        setBoxO([x + xi, yi, z + zi]);
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial
        // transparent
        opacity={0.0}
        color="royalblue"
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function MovementInput({ title, movement, setMovement }) {
  return (
    <>
      <p className=" capitalize">{title}</p>
      <input
        type="range"
        min={-Math.PI}
        max={Math.PI}
        step={0.01}
        onChange={(e) =>
          setMovement((m) => ({ ...m, [title]: parseFloat(e.target.value) }))
        }
        // onChange={(e) => setBoom(parseFloat(e.target.value))}
        name={title}
        value={movement[title]}
      />
    </>
  );
}

const TreeDemo = () => {
  // const [base, setBase] = useState(0);
  // const [boom, setBoom] = useState(0);
  // const [stick, setStick] = useState(0);
  // const [bucket, setBucket] = useState(0);

  const [movement, setMovement] = useState({
    base: 0,
    boom: 1.5,
    stick: 0,
    bucket: 0,
  });
  const [message, setMessage] = useState("");
  const [index, setIndex] = useState(0);
  const controllerRef = useRef();
  const [boxO, setBoxO] = useState([0, 0, 0]);
  const [sceneOffset, setSceneOffset] = useState([0, 0, 0]);
  const [gridPosition, setGridPosition] = useState([1, 1, 1]);
  // const usefulData = fieldData.features.filter(
  //   (d) => d.geometry.coordinates[0][2] !== 0,
  // );

  const getAverage = (arr) => {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b) / arr.length;
  };

  // const fieldAverages = {
  //   x:
  //     getAverage(usefulData.map((d) => d.geometry.coordinates[1][0])) - 2410000,
  //   y: Math.max(...usefulData.map((d) => d.geometry.coordinates[1][2])),
  //   z: getAverage(usefulData.map((d) => d.geometry.coordinates[1][1])) - 300000,
  // };

  // const fieldEdges = {
  //   min: {
  //     x:
  //       Math.min(...usefulData.map((d) => d.geometry.coordinates[0][0])) -
  //       2410000,
  //     y: Math.min(...usefulData.map((d) => d.geometry.coordinates[0][2])),
  //     z:
  //       Math.min(...usefulData.map((d) => d.geometry.coordinates[0][1])) -
  //       300000,
  //   },
  //   max: {
  //     x:
  //       Math.max(...usefulData.map((d) => d.geometry.coordinates[0][0])) -
  //       2410000,
  //     y: Math.max(...usefulData.map((d) => d.geometry.coordinates[0][2])),
  //     z:
  //       Math.max(...usefulData.map((d) => d.geometry.coordinates[0][1])) -
  //       300000,
  //   },
  // };

  const fieldEdges = {
    min: {
      x: -10,
      y: -5,
      z: -10,
    },
    max: {
      x: 10,
      y: -1,
      z: 10,
    },
  };

  const fieldCenter = [
    (fieldEdges.min.x + fieldEdges.max.x) / 2,
    (fieldEdges.min.y + fieldEdges.max.y) / 2,
    (fieldEdges.min.z + fieldEdges.max.z) / 2,
  ];

  const fieldSize = {
    width: fieldEdges.max.x - fieldEdges.min.x,
    height: fieldEdges.max.y - fieldEdges.min.y,
    depth: fieldEdges.max.z - fieldEdges.min.z,
  };

  useEffect(() => {
    setBoxO([fieldCenter[0], 1, fieldCenter[2]]);
  }, [fieldCenter[0], fieldCenter[1], fieldCenter[2]]);

  const handleCollision = (event) => {
    console.log("onCollisionEnter", event);
    setMessage("Collision event fired");
  };

  const handleIntersection = (event) => {
    console.log("onIntersectionEnter", event);
    setMessage("Intersection event fired");
  };

  // const updatePos = () => {
  //   setGridPosition([fieldAverages.x, fieldAverages.y, fieldAverages.z]);
  //   const data = usefulData[index];
  //   const [xi, yi, zi] = data?.geometry?.coordinates[0];
  //   const [xo, yo, zo] = data?.geometry?.coordinates[1];
  //   setSceneOffset([-xi + 2410000, -zi, -yi + 300000]);
  //   setMessage(
  //     JSON.stringify({ index, coordss: [xi, yi, zi, xo, yo, zo] }, null, 2),
  //   );
  //   // controllerRef.current?.setLookAt(xi, yi, zi, xo, yo + 10, zo + 10, true);
  //   controllerRef.current?.setLookAt(0, 5, 10, 0, 0, 0, true);
  // };

  // const handleButton = () => {
  //   setIndex((i) => (i < usefulData.length - 1 ? i + 1 : 0));
  //   updatePos();
  // };
  // const handle10xButton = () => {
  //   setIndex((i) => (i < usefulData.length - 10 ? i + 10 : 0));
  //   updatePos();
  // };

  return (
    <div className="bg-gray-900 h-screen text-gray-300 font-bold">
      <div className="p-4 absolute z-10">
        <MovementInput
          title="boom"
          movement={movement}
          setMovement={setMovement}
        />
        <MovementInput
          title="stick"
          movement={movement}
          setMovement={setMovement}
        />
        <MovementInput
          title="bucket"
          movement={movement}
          setMovement={setMovement}
        />
        <MovementInput
          title="base"
          movement={movement}
          setMovement={setMovement}
        />

        <br />
        {/* <Button onClick={handleButton}>Data</Button>
        <Button onClick={handle10xButton}>+10</Button>
        <pre className="text-xs">{message}</pre> */}
      </div>
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <CameraControls ref={controllerRef} />
        <pointLight
          position={[+100, +100, +100]}
          decay={0}
          intensity={Math.PI}
        />
        {/* <Box x={x} origin={boxO} /> */}
        {/* <ModelColors /> */}
        <OrbitControls makeDefault />
        <group position={sceneOffset}>
          <axesHelper />
          {/* <gridHelper args={[50]} position={gridPosition} /> */}

          <Physics colliders="cuboid" debug>
            <Box origin={boxO} movement={movement} />
            <RigidBody
              position={fieldCenter}
              gravityScale={0}
              type="fixed"
              sensor
              colliders="cuboid"
              onIntersectionEnter={handleIntersection}
              onCollisionEnter={handleCollision}
            >
              <FieldBox
                width={fieldSize.width}
                height={fieldSize.height}
                depth={fieldSize.depth}
                setBoxO={setBoxO}
              />
            </RigidBody>
          </Physics>
          {/* <Plane {...{ setBoxO }} /> */}
          {/* <SurfPlane setBoxO={setBoxO} fieldAverages={fieldAverages} /> */}
        </group>
      </Canvas>
    </div>
  );
};

export default TreeDemo;

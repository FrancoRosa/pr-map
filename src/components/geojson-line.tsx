import React, { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";

interface GeoJsonProps {
  data: any; // Your GeoJSON object
  color?: string;
  lineWidth?: number;
}

const GeoJsonLayer: React.FC<GeoJsonProps> = ({
  data,
  color = "lime",
  lineWidth = 1,
}) => {
  const lines = useMemo(() => {
    const extractedLines: THREE.Vector3[][] = [];

    data.features.forEach((feature: any) => {
      const { type, coordinates } = feature.geometry;

      if (type === "LineString") {
        // Single line: [[lng, lat], [lng, lat], ...]
        extractedLines.push(
          coordinates.map((coord: number[]) => {
            return new THREE.Vector3(
              coord[0] - 2410000,
              coord[2],
              coord[1] - 300000,
            );
          }),
        );
      } else if (type === "MultiLineString") {
        // Multiple lines: [[[lng, lat], ...], [[lng, lat], ...]]
        coordinates.forEach((lineCoords: number[][]) => {
          extractedLines.push(
            lineCoords.map(
              (coord: number[]) =>
                new THREE.Vector3(
                  coord[0] - 2410000,
                  coord[2],
                  coord[1] - 300000,
                ),
            ),
          );
        });
      }
    });

    return extractedLines;
  }, [data]);

  return (
    <group>
      {lines.map((points, index) => (
        <Line
          key={index}
          points={points} // Array of THREE.Vector3
          color={color} // Default color
          lineWidth={lineWidth} // Thickness
        />
      ))}
    </group>
  );
};

export default GeoJsonLayer;

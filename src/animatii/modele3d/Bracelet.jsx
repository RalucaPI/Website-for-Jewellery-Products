import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { MeshStandardMaterial } from 'three';

export function Bracelet(props) {
  const { nodes } = useGLTF('/models/bracelet/scene.gltf');

  const silverMaterial = new MeshStandardMaterial({
    color: 0xc0c0c0,  // Argintiu
    metalness: 0.8,
    roughness: 0.2,
  });

  return (
    <group {...props} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.012}>
        <group rotation={[-Math.PI, 0, 0]} scale={0.01}>
          <group position={[12.406, 29973.605, 2662.629]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Necklace_M_Gold_0.geometry}
              material={silverMaterial}  
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Necklace_M_Gold_0_1.geometry}
              material={silverMaterial}  
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/models/bracelet/scene.gltf');

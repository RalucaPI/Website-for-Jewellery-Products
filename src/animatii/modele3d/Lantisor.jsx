import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export function Lantisor(props) {
  const { nodes, materials } = useGLTF('/models/necklace/scene.gltf');
 

  return (
    <group {...props}  dispose={null}>
      <group position={[0, 0, 0]} rotation={[Math.PI / 1, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.MASH1_ReproMesh_lambert1_0.geometry}
          material={materials.lambert1}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.MASH1_ReproMesh_lambert1_0_1.geometry}
          material={materials.lambert1}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.MASH1_ReproMesh_lambert1_0_2.geometry}
          material={materials.lambert1}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.MASH1_ReproMesh_lambert1_0_3.geometry}
          material={materials.lambert1}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.MASH1_ReproMesh_lambert1_0_4.geometry}
          material={materials.lambert1}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.MASH1_ReproMesh_Diamodo_0.geometry}
          material={materials.Diamodo}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.pCube1_lambert1_0.geometry}
          material={materials.lambert1}
          position={[272.26, -1.707, 16.504]}
          rotation={[0, -0.423, 0]}
          scale={[10.717, 3.818, 4.325]}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/models/necklace/scene.gltf');

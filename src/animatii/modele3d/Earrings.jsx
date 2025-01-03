/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: automicgoldapril (https://sketchfab.com/automicgoldapril)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/au-40303-earring-3dc232daa567465a8da5a9326463f966
Title: AU-40303 Earring
*/

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export function Earrings(props) {
  const { nodes, materials } = useGLTF('/models/cercei/scene.gltf');
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01; // Ajustează viteza de rotație după necesități
    }
  });
  return (
    <group {...props} ref={groupRef} dispose={null} >
      <group position={[0, 0.002, 0.002]} rotation={[3.137, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_2_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_3_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_4_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_5_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_6_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_7_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_8_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_9_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_10_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_11_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_12_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_13_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_14_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_15_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_16_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_17_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_18_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_19_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_20_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_21_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_22_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_23_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Diamond_Round_24_Material_1_0.geometry}
            material={materials.Material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_2_WhiteMetal_0.geometry}
            material={materials.WhiteMetal}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_3_WhiteMetal_0.geometry}
            material={materials.WhiteMetal}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/cercei/scene.gltf')

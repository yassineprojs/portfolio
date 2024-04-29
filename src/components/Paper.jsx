// import { shaderMaterial } from "@react-three/drei";
// import { extend, useFrame } from "@react-three/fiber";
// import * as THREE from "three";
// import React, { useRef, Suspense } from "react";
// import glsl from "babel-plugin-glsl/macro";

// const WaveShaderMaterial = shaderMaterial(
//   {
//     uTime: 0,
//     uColor: new THREE.Color(0.0, 0.0, 0.0),
//     uTexture: new THREE.Texture(),
//   },
//   glsl`
//   #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
//   precision mediump float;

//   varying vec2 vUv;
//   varying float vWave;

//   uniform float uTime;

//   void main(){
//       vUv = uv;

//       vec3 pos = position;
//       float noiseFreq = 0.5;
//       float noiseAmp = 0.08;
//       vec3 noisePos = vec3(pos.x * noiseFreq + uTime * 0.15 , pos.y,pos.z);
//       pos.z += snoise3(noisePos) * noiseAmp;
//       vWave = pos.z;

//       gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
//   }
//   `,
//   glsl`
//   precision mediump float;

//   uniform sampler2D uTexture;

//   uniform vec3 uColor;
//   uniform float uTime;

//   varying vec2 vUv;
//   varying float vWave;

//     void main(){
//       float wave = vWave * 0.1;
//       vec3 texture = texture2D(uTexture, vUv + wave).rgb;
//       gl_FragColor = vec4(texture,1.0);
//     }
//     `
// );

// export default WaveShaderMaterial;

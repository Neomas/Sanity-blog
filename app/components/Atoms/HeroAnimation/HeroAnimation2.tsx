import {
  Float,
  OrbitControls,
  PerspectiveCamera,
  Points,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import { mix } from "@motionone/utils";
import { animate } from "motion";
import { memo, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three-stdlib";
import { useMediaQuery } from "@react-hook/media-query";

//@ts-ignore
import Vertext from "./vertext.vert";
//@ts-ignore
import Fragment from "./fragment.frag";

import { Canvas } from "@react-three/fiber";
import useHardwareAcceleration from "@hooks/useHardwareAcceleration";

const Particles = ({ activeItem, initialized = false }) => {
  const [particleGroup, setParticleGroup] = useState({});
  const [rotateSpeed, setrotateSpeed] = useState(0.3);
  const isDesktopInit = useMediaQuery("(min-width: 798px)");
  const pointsRef = useRef<any>(null);

  const particleCount = 1000;
  const itemGeometries = [
    new THREE.SphereGeometry(2.5, 32, 32),
    new THREE.SphereGeometry(2.5, 32, 32),
    new THREE.SphereGeometry(2.5, 32, 32),
  ];

  useEffect(() => {
    var particles = new THREE.BufferGeometry();
    var startparticles = new THREE.BufferGeometry();
    particles.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3)
    );
    const scales = new Float32Array(particleCount); // replace particleCount with the number of vertices in your geometry

    startparticles.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3)
    );
    startparticles.setAttribute(
      "aScale",
      new THREE.BufferAttribute(new Float32Array(particleCount * 1))
    );

    for (let i = 0; i < particleCount; i++) {
      //set in random position
      const size = 16;
      const x = Math.random() * size - size / 2;
      const y = Math.random() * size - size / 2;
      const z = Math.random() * size - size / 2;
      particles?.attributes?.position.setXYZ(i, x, y, z);
    }

    for (let i = 0; i < particleCount; i++) {
      scales[i] = Math.random(); // replace this with the actual scale for each vertex
    }
    particles.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    setParticleGroup((prev) => ({
      ...prev,
      ["particles"]: particles,
      ["startparticles"]: startparticles,
    }));

    for (let p = 0; p < 3; p++) {
      let itemParticles = new THREE.BufferGeometry();
      itemParticles.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3)
      );
      // itemParticles.setAttribute("aScale", new THREE.BufferAttribute(new Float32Array(particleCount * 1), 1));
      itemParticles.setAttribute(
        "aScale",
        new THREE.BufferAttribute(scales, 1)
      );

      const geometry = itemGeometries[p];
      const mesh = new THREE.Mesh(geometry);
      const sampler = new MeshSurfaceSampler(mesh).build();

      // sample random positions
      const tempPosition = new THREE.Vector3();
      for (let i = 0; i < particleCount; i++) {
        sampler.sample(tempPosition);

        itemParticles?.attributes?.position.setXYZ(
          i,
          tempPosition.x,
          tempPosition.y,
          tempPosition.z
        );

        // itemParticles?.attributes?.aScale.set(i, Math.random()); // Set a random value for aScale
      }

      setParticleGroup((prev) => ({ ...prev, [`item-${p}`]: itemParticles }));
    }
  }, []);

  const uniforms = {
    uSize: {
      value: 10 * (typeof window !== "undefined" ? window.devicePixelRatio : 1),
    },
    uColor: { value: Math.random() },
  };

  // useEffect(() => {
  //   console.log(particleGroup?.["particles"]?.attributes?.aScale.array);
  // }, [particleGroup]);

  const itemRef = useRef<any>(null);
  const parentRef = useRef<any>(null);

  const isHwaEnabled = useHardwareAcceleration();

  // console.log(particleGroup?.["particles"]);

  return isHwaEnabled ? (
    <Canvas ref={parentRef}>
      <OrbitControls />
      <Points
        ref={pointsRef}
        positions={particleGroup?.["particles"]?.attributes?.position?.array}
      >
        <shaderMaterial
          vertexShader={Vertext}
          fragmentShader={Fragment}
          uniforms={uniforms}
        />
        <bufferGeometry attach="geometry" {...particleGroup?.["particles"]}>
          <bufferAttribute
            attachObject={["attributes", "aScale"]}
            count={particleCount}
            array={particleGroup?.["particles"]?.attributes?.aScale?.array}
            itemSize={1}
          />
        </bufferGeometry>
      </Points>
    </Canvas>
  ) : (
    <></>
  );
};

export default memo(Particles);

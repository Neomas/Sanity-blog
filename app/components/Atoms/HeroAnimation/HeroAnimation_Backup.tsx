import { Float, OrbitControls, PerspectiveCamera, Points } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import { mix } from "@motionone/utils";
import { animate } from "motion";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three-stdlib";
import { useMediaQuery } from "@react-hook/media-query";
// import { Suspense } from "react";
// import { EffectComposer, Vignette, Bloom } from "@react-three/postprocessing";

const Particles = ({ activeItem, initialized = false }) => {
  const [particleGroup, setParticleGroup] = useState({});

  const [rotateSpeed, setrotateSpeed] = useState(0.3);
  const isDesktopInit = useMediaQuery("(min-width: 798px)");
  const pointsRef = useRef<any>(null);

  const particleCount = 2500;

  const itemGeometries = [new THREE.SphereGeometry(4, 24, 24)];

  useFrame(({ camera, mouse }) => {
    if (!particleGroup?.["particles"]) return;
    // Rotate Z & Y axis
    if (pointsRef.current && isDesktopInit) {
      const factor = 0.1;
      pointsRef.current.position.z = mouse.x * -factor;
      pointsRef.current.position.y = mouse.y * -factor;
    }
  });

  const morphTo = (index, isIntro = false) => {
    const activeGeometry = particleGroup[`item-0`];

    const setParticles = ({
      end,
      duration = 1.2,
      easing = "ease-in-out",
    }: {
      end: any;
      duration?: number;
      easing?:
        | "linear"
        | "ease"
        | "ease-in"
        | "ease-out"
        | "ease-in-out"
        | "steps-start"
        | "steps-end"
        | `steps(${number}, ${"start" | "end"})`
        | any;
    }) => {
      particleGroup["startparticles"].attributes.position.array = [
        ...particleGroup["particles"].attributes.position.array,
      ];

      animate(
        (progress) => {
          for (let i = 0; i < particleCount * 3; i++) {
            particleGroup["particles"].attributes.position.array[i] = mix(
              particleGroup["startparticles"].attributes.position.array[i],
              end.attributes?.position.array[i],
              progress
            );
          }
          particleGroup["particles"].attributes.position.needsUpdate = true;
        },
        {
          easing: easing,
          duration: duration,
        }
      );
    };

    if (index === 0) {
      setParticles({ end: particleGroup["baseparticles"], duration: 0.2, easing: "ease-out" });
    }
    if (index === 1) {
      setParticles({ end: activeGeometry });
    }
    if (index === 2) {
      console.log({ particleGroup });

      const bezierCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.2, 0.2, 0),
        new THREE.Vector3(0.8, 0.2, 0),
        new THREE.Vector3(1, 1, 0)
      );
      const backOutEasing = (t) => bezierCurve.getPointAt(t).y;

      setParticles({ end: particleGroup["zeroparticles"], duration: 0.3, easing: backOutEasing });
    }

    animate(
      (progress) => {
        setrotateSpeed(mix(16, 2.3, progress));
      },
      {
        easing: "ease-in-out",
        duration: 1.2,
      }
    );
  };

  useEffect(() => {
    var particles = new THREE.BufferGeometry();
    var startparticles = new THREE.BufferGeometry();
    var baseparticles = new THREE.BufferGeometry();
    var zeroparticles = new THREE.BufferGeometry();
    particles.setAttribute("position", new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3));
    startparticles.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3)
    );
    zeroparticles.setAttribute("position", new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3));
    baseparticles.setAttribute("position", new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3));
    particles.setAttribute("size", new THREE.BufferAttribute(new Float32Array(particleCount * 1), 1));
    startparticles.setAttribute("size", new THREE.BufferAttribute(new Float32Array(particleCount * 1), 1));
    for (let i = 0; i < particleCount; i++) {
      //set in random position
      const size = 16;
      const x = Math.random() * size - size / 2;
      const y = Math.random() * size - size / 2;
      const z = Math.random() * size - size / 2;
      particles?.attributes?.position.setXYZ(i, x, y, z);
      startparticles?.attributes?.position.setXYZ(i, x, y, z);
      baseparticles?.attributes?.position.setXYZ(i, x, y, z);
      particles?.attributes?.size.set(i, 0.06);
      startparticles?.attributes?.size.set(i, 0.06);
    }

    setParticleGroup((prev) => ({
      ...prev,
      ["particles"]: particles,
      ["startparticles"]: startparticles,
      ["baseparticles"]: baseparticles,
      ["zeroparticles"]: zeroparticles,
    }));

    for (let p = 0; p < itemGeometries.length; p++) {
      let itemParticles = new THREE.BufferGeometry();
      itemParticles.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3)
      );
      itemParticles.setAttribute("size", new THREE.BufferAttribute(new Float32Array(particleCount * 1), 1));

      const geometry = itemGeometries[p];
      const mesh = new THREE.Mesh(geometry);
      const sampler = new MeshSurfaceSampler(mesh).build();

      // sample random positions
      const tempPosition = new THREE.Vector3();
      for (let i = 0; i < particleCount; i++) {
        sampler.sample(tempPosition);

        itemParticles?.attributes?.position.setXYZ(i, tempPosition.x, tempPosition.y, tempPosition.z);
        itemParticles?.attributes?.size.set(i, 0.06);
      }

      setParticleGroup((prev) => ({ ...prev, [`item-${p}`]: itemParticles }));
    }
  }, []);

  useEffect(() => {
    // console.log({ activeItem });
    if (!particleGroup?.["particles"] || !particleGroup?.["startparticles"]) return;
    morphTo(activeItem);
  }, [activeItem]);

  const itemRef = useRef<any>(null);

  return (
    <>
      <PerspectiveCamera makeDefault position={[isDesktopInit ? -2 : -1, -1, 10]} />

      <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={rotateSpeed} />

      <Float
        scale={0.8}
        // position={[1, 0.5, 1.5]}
        position={[0, 0, 0]}
        rotationIntensity={1}
        floatIntensity={0.4}
        floatingRange={[-1, 1]}
        ref={itemRef}>
        {/* @ts-ignore */}
        <Points
          rotation={[0, 0, 0]}
          positions={particleGroup?.["particles"]?.attributes?.position?.array}
          sizes={particleGroup?.["particles"]?.attributes?.size?.array}
          ref={pointsRef}>
          <pointsMaterial
            alphaTest={0.5}
            size={0.06}
            color={"#1b1b1b"}
            transparent
            map={new THREE.TextureLoader().load("/three/particle.png")}
          />
        </Points>
      </Float>
    </>
  );
};

export default memo(Particles, (prev, next) => {
  return prev.activeItem === next.activeItem;
});

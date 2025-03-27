import {
  Float,
  OrbitControls,
  PerspectiveCamera,
  Points,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import { mix } from "@motionone/utils";
import { animate } from "motion";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
// import { MeshSurfaceSampler } from "three-stdlib";
import { useMediaQuery } from "@react-hook/media-query";
// import { Suspense } from "react";
// import { EffectComposer, Vignette, Bloom } from "@react-three/postprocessing";
// import Console from "./Console";
// import { useGLTF, Html } from "@react-three/drei";
// import { lerp } from "three";

//@ts-ignore
import vertexShader from "./vertexShader.glsl";
//@ts-ignore
import fragmentShader from "./fragmentShader.glsl";

const Particles = ({ activeItem, setActiveItem, initialized = false }: any) => {
  const [particleGroup, setParticleGroup] = useState({});

  const [rotateSpeed, setrotateSpeed] = useState(0.1);
  // const [position, setPosition] = useState([0, 0, 0]);
  const isDesktopInit = useMediaQuery("(min-width: 798px)");
  const pointsRef = useRef<any>(null);

  const particleCount: any = 1200;
  const itemGeometries = [new THREE.SphereGeometry(3, 32, 32)];

  const morphTo = (index: any, isIntro = false) => {
    const setParticles = ({
      end,
      duration = 2,
      easing = "ease-out",
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
      // console.log({ particleGroup });
      //@ts-ignore
      particleGroup["startparticles"].attributes.position.array = [
        //@ts-ignore
        ...particleGroup["particles"].attributes.position.array,
      ];

      animate(
        (progress: any) => {
          for (let i = 0; i < particleCount * 3; i++) {
            //@ts-ignore
            particleGroup["particles"].attributes.position.array[i] = mix(
              //@ts-ignore
              particleGroup["startparticles"].attributes.position.array[i],
              end.attributes?.position.array[i],
              progress
            );
          }
          //@ts-ignore
          particleGroup["particles"].attributes.position.needsUpdate = true;
        },
        {
          easing: easing,
          duration: duration,
        }
      );
    };

    if (index === 0) {
      //@ts-ignore
      setParticles({ end: particleGroup["baseparticles"] });
      // itemRef.current.position.set(0, 0, 0);

      animate(
        (progress: any) => {
          itemRef.current.position.x = mix(3, 0, progress);
          itemRef.current.position.z = mix(4, 10, progress);
        },
        {
          easing: "ease-in-out",
          duration: 1.2,
        }
      );
    }
    if (index === 1) {
      setParticles({ end: itemGeometries[0] });
      // itemRef.current.position.set(3, 0, 4);

      animate(
        (progress: any) => {
          itemRef.current.position.x = mix(0, 3, progress);
          itemRef.current.position.z = mix(10, 4, progress);
        },
        {
          easing: "ease-in-out",
          duration: 1.2,
        }
      );
    }
    if (index === 2) {
      // console.log({ particleGroup });

      const bezierCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.2, 0.2, 0),
        new THREE.Vector3(0.8, 0.2, 0),
        new THREE.Vector3(1, 1, 0)
      );
      const backOutEasing = (t: any) => bezierCurve.getPointAt(t).y;

      //@ts-ignore
      setParticles({
        //@ts-ignore
        end: particleGroup["zeroparticles"],
        duration: 0.3,
        easing: backOutEasing,
      });
    }
  };

  useEffect(() => {
    animate(
      (progress: any) => {
        itemRef.current.position.x = mix(3, 0, progress);
        itemRef.current.position.z = mix(4, 10, progress);
      },
      {
        easing: "ease-in-out",
        duration: 1.2,
      }
    );
  }, []);

  const resetParticles = () => {
    setParticleGroup({});
  };

  const calcParticles = () => {
    var particles = new THREE.BufferGeometry();
    var startparticles = new THREE.BufferGeometry();
    var baseparticles = new THREE.BufferGeometry();

    particles.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3)
    );
    startparticles.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3)
    );

    baseparticles.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3)
    );
    particles.setAttribute(
      "size",
      new THREE.BufferAttribute(new Float32Array(particleCount * 1), 1)
    );
    startparticles.setAttribute(
      "size",
      new THREE.BufferAttribute(new Float32Array(particleCount * 1), 1)
    );
    for (let i = 0; i < particleCount; i++) {
      //set in random position
      const size = 16;
      const x = Math.random() * size - size / 2;
      const y = Math.random() * size - size / 2;
      const z = Math.random() * size - size / 2;
      particles?.attributes?.position.setXYZ(i, x, y, z);
      startparticles?.attributes?.position.setXYZ(i, x, y, z);
      baseparticles?.attributes?.position.setXYZ(i, x, y, z);
      //@ts-ignore
      particles?.attributes?.size.set(i, 0.06);
      //@ts-ignore
      startparticles?.attributes?.size.set(i, 0.06);
    }

    setParticleGroup((prev) => ({
      ...prev,
      ["particles"]: particles,
      ["startparticles"]: startparticles,
      ["baseparticles"]: baseparticles,
    }));

    for (let p = 0; p < itemGeometries.length; p++) {
      let itemParticles = new THREE.BufferGeometry();
      itemParticles.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3)
      );
      itemParticles.setAttribute(
        "size",
        new THREE.BufferAttribute(new Float32Array(particleCount * 1), 1)
      );

      const geometry = itemGeometries[p];
      const mesh = new THREE.Mesh(geometry);
      // const sampler = new MeshSurfaceSampler(mesh).build();

      // sample random positions
      const tempPosition = new THREE.Vector3();
      for (let i = 0; i < particleCount; i++) {
        // sampler.sample(tempPosition);
        // console.log(geometry, tempPosition, "tempPosition");

        tempPosition.fromArray(geometry.attributes.position.array, i * 3);

        itemParticles?.attributes?.position.setXYZ(
          i,
          tempPosition.x,
          tempPosition.y,
          tempPosition.z
        );
        //@ts-ignore
        itemParticles?.attributes?.size.set(i, 1);
      }

      setParticleGroup((prev) => ({ ...prev, [`item-${p}`]: itemParticles }));
    }
  };

  useEffect(() => {
    calcParticles();

    // console.log(bdTitle.nodes, "bdTitle");

    // let titleParticles = new THREE.BufferGeometry();
    // let test = new THREE.BufferGeometry();
    // const bdTitleItem = bdTitle.nodes.Scene.children[0];

    // const bdTitleGeometry = bdTitle.nodes.Curve.geometry;
    // const bdTitleGeometry2 = bdTitle.nodes.BDMESH_1.geometry;
    // console.log({ nodes: bdTitle.nodes });
    // let bdTitleGeometryPosition = bdTitleGeometry.attributes.position.array;
    // let bdTitleGeometry = new THREE.BufferGeometry();
    // bdTitle.nodes.Scene.children.forEach((item) => {
    //   if (item.type === "Mesh") {
    //     bdTitleGeometry.merge(item.geometry);
    //   }
    // });
    // if (item.type === "Mesh") {
    // bdTitleGeometryPosition.push(item.geometry.attributes.position.array);
    // bdTitleGeometry.mergeGeometries(item.geometry);
    // }
    // });

    // const bdTitleMesh = new THREE.Mesh(bdTitleItem);

    //merge all the geometries into one

    // const sampler = new MeshSurfaceSampler(bdTitleMesh).build();
    // sampler.sample(tempPosition);
    // for (let i = 0; i < particleCount; i++) {
    //   tempPosition.fromArray(bdTitleGeometryPosition);

    //   titleParticles?.attributes?.position.setXYZ(i, tempPosition.x, tempPosition.y, tempPosition.z);
    //   titleParticles?.attributes?.size.set(i, 0.06);
    // }
    // for (let p = 0; p < bdTitleGeometryPosition.length; p++) {
    //   tempPosition.fromArray(bdTitleGeometryPosition);

    //   titleParticles?.attributes?.position.setXYZ(p, tempPosition.x, tempPosition.y, tempPosition.z);
    //   titleParticles?.attributes?.size.set(p, 0.06);
    // }

    // setParticleGroup((prev) => ({ ...prev, [`titleParticles`]: titleParticles }));
    // console.log({ titleParticles });
  }, []);

  useEffect(() => {
    //   // console.log({ activeItem });
    //@ts-ignore
    if (!particleGroup?.["particles"] || !particleGroup?.["startparticles"])
      return;
    morphTo(activeItem);
  }, [activeItem, isDesktopInit]);

  const itemRef = useRef<any>(null);

  const radius = 18;

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0.0,
      },
      uRadius: {
        value: radius,
      },
      uSize: {
        value: 2.0,
      },
      uHide: {
        value: activeItem === 3 ? 0 : 1,
      },
    }),
    []
  );

  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const { viewport, setSize, size, ...props } = useThree();

  useEffect(() => {
    const handleResize = () => {
      // Recalculate viewport size here
      window.innerWidth > 768
        ? setSize(window.innerWidth, window.innerHeight)
        : setSize(window.innerWidth, window.innerHeight * 0.75);
    };

    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useFrame(({ mouse }) => {
    const x = (mouse.x * viewport.width) / 2 / 10;
    const y = (mouse.y * viewport.height) / 2 / 10;

    // Create current and target Vector3 for rotation
    const currentRotation = new THREE.Vector3(
      pointsRef.current.rotation.x,
      pointsRef.current.rotation.y,
      pointsRef.current.rotation.z
    );
    const targetRotation = new THREE.Vector3(-y, x, 0);

    // Add easing effect
    currentRotation.lerp(targetRotation, 0.1);
    pointsRef.current.rotation.set(
      currentRotation.x,
      currentRotation.y,
      currentRotation.z
    );
  });

  return (
    <>
      <PerspectiveCamera
        makeDefault
        ref={cameraRef}
        position={[
          isDesktopInit ? -2 : 5,
          isDesktopInit ? -1 : 2,
          isDesktopInit ? 12 : 11,
        ]}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        // autoRotate={activeItem != 3}
        enabled={false}
        autoRotateSpeed={rotateSpeed}
      />
      <Float
        scale={0.8}
        // position={[1, 0.5, 1.5]}
        position={[0, 0, 0]}
        rotationIntensity={3}
        floatIntensity={0.4}
        floatingRange={[-1, 1]}
        ref={itemRef}
      >
        {/* @ts-ignore */}
        <Points
          rotation={[0, 0, 0]}
          //@ts-ignore
          positions={particleGroup?.["particles"]?.attributes?.position?.array}
          ref={pointsRef}
          onClick={() => {
            // console.log("click");
            // console.log(activeItem);
            setActiveItem && setActiveItem(activeItem === 1 ? 0 : 1);
          }}
        >
          <shaderMaterial
            depthWrite={false}
            fragmentShader={fragmentShader}
            vertexShader={vertexShader}
            uniforms={uniforms}
            blending={THREE.AdditiveBlending}
          />
        </Points>
      </Float>
    </>
  );
};

export default memo(Particles, (prev, next) => {
  return prev.activeItem === next.activeItem;
});

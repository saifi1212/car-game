
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { pingpong } from "three/src/math/MathUtils";

const ThreeScene = () => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  let carModel = "";
  let chaseCam, chaseCamPivot; 
  let view = new THREE.Vector3();
  function initChaseCam() {
  chaseCam = new THREE.Object3D(); 
  chaseCam.position.set(0, 0, 0);
  chaseCam.rotation.set(0,Math.PI/2,0)
  chaseCamPivot = new THREE.Object3D();
  chaseCamPivot.position.set(0, 8, 20);
  
  chaseCam.add(chaseCamPivot);
  scene.add(chaseCam); 
}

useEffect(() => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  const root = document.getElementById("root");
  root.appendChild(renderer.domElement);

    renderer.setClearColor(0xa3a3a3);

   initChaseCam();
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    // const cannonDebugger = new CannonDebugger(scene, world, {});

    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    const wall1 = new CANNON.Body({
      mass:10000,
      shape:new CANNON.Box(new CANNON.Vec3(11.65 ,1 , 0.4)),
    })
    wall1.position.set(0,1,2)
    world.addBody(wall1)
       const wall2 = new CANNON.Body({
      mass:10000,
      shape:new CANNON.Box(new CANNON.Vec3(11.65 ,1 , 0.4)),
    })
    wall2.position.set(0,1,-2)
    world.addBody(wall2)
         const wall3 = new CANNON.Body({
      mass:10000,
      shape:new CANNON.Box(new CANNON.Vec3(0.5 ,1 , 2)),
    })
    wall3.position.set(12.2,1,0)
    world.addBody(wall3)
      const wall4 = new CANNON.Body({
      mass:10000,
      shape:new CANNON.Box(new CANNON.Vec3(0.5 ,1 , 2)),
    })
    wall4.position.set(-12.2,1,0)
    world.addBody(wall4)
    const ambientLight = new THREE.AmbientLight(0xededed, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    scene.add(directionalLight);
    directionalLight.position.set(10, 11, 7);

    const gltfLoader = new GLTFLoader();
    const rgbeLoader = new RGBELoader();
    gltfLoader.load("/models/normal.glb", function (gltf) {
      const model = gltf.scene;
      gltf.scene.scale.set(.1*gltf.scene.scale.x, .2*gltf.scene.scale.y, .1
        * gltf.scene.scale.z)
       gltf.scene.position.set(0,0.1,0)
       gltf.scene.rotation.set(0,-Math.PI/2,0)
      scene.add(model);
    });
    
    
  
    const carBody = new CANNON.Body({
      mass: 1000,
      position: new CANNON.Vec3(11, 1, 0),
      shape: new CANNON.Box(new CANNON.Vec3(0.4, 0.01, 0.22)),
    });
    const vehicle = new CANNON.RigidVehicle({
      chassisBody: carBody,
    });
    

    const mass = 200;
    const axisWidth = 0.26;
    const wheelShape = new CANNON.Sphere(0.08);
    const wheelMaterial = new CANNON.Material('wheel');
    const down = new CANNON.Vec3(0, -1, 0);

    const wheelBody1 = new CANNON.Body({ mass, material: wheelMaterial });
    wheelBody1.addShape(wheelShape);
    wheelBody1.angularDamping = 0.4;
    vehicle.addWheel({
      body: wheelBody1,
      position: new CANNON.Vec3(-0.32, 0, axisWidth / 2),
      axis: new CANNON.Vec3(0, 0, 1),
      direction: down,
    });

    const wheelBody2 = new CANNON.Body({ mass, material: wheelMaterial });
    wheelBody2.addShape(wheelShape);
    wheelBody2.angularDamping = 0.4;
    vehicle.addWheel({
      body: wheelBody2,
      position: new CANNON.Vec3(-0.32, 0, -axisWidth / 2),
      axis: new CANNON.Vec3(0, 0, 1),
      direction: down,
    });

    const wheelBody3 = new CANNON.Body({ mass, material: wheelMaterial });
    wheelBody3.addShape(wheelShape);
    wheelBody3.angularDamping = 0.4;
    vehicle.addWheel({
      body: wheelBody3,
      position: new CANNON.Vec3(0.32, 0, axisWidth / 2),
      axis: new CANNON.Vec3(0, 0, 1),
      direction: down,
    });

    const wheelBody4 = new CANNON.Body({ mass, material: wheelMaterial });
    wheelBody4.addShape(wheelShape);
    wheelBody4.angularDamping = 0.4;
    vehicle.addWheel({
      body: wheelBody4,
      position: new CANNON.Vec3(0.32, 0, -axisWidth / 2),
      axis: new CANNON.Vec3(0, 0, 1),
      direction: down,
    });
    vehicle.addToWorld(world);



    gltfLoader.load("/models/car3.glb", function (gltf) {
      carModel = gltf.scene;
      carModel.scale.set(0.1 * carModel.scale.x, 0.1 * carModel.scale.y, 0.1 * carModel.scale.z);
      gltf.scene.position.copy(carBody.position)
       gltf.scene.quaternion.copy(carBody.quaternion.x,carBody.quaternion.y,carBody.quaternion.z)
      carModel.add(chaseCam)
      scene.add(carModel);
    });
    document.addEventListener('keydown', (event) => {
      const maxSteerVal = Math.PI / 8;
      const maxForce = 170;
      
      switch (event.key) {
        case 'w':
        case 'ArrowUp':
          vehicle.setWheelForce(maxForce, 0);
          vehicle.setWheelForce(maxForce, 1);
          break;

          case 's':
        case 'ArrowDown':
          vehicle.setWheelForce(-maxForce / 2, 0);
          vehicle.setWheelForce(-maxForce / 2, 1);
          break;

        case 'a':
        case 'ArrowLeft':
          vehicle.setSteeringValue(maxSteerVal, 0);
          vehicle.setSteeringValue(maxSteerVal, 1);
          break;
          
          case 'd':
            case 'ArrowRight':
          vehicle.setSteeringValue(-maxSteerVal, 0);
          vehicle.setSteeringValue(-maxSteerVal, 1);
          break;
        }
      });
      
      document.addEventListener('keyup', (event) => {
        
        switch (event.key) {
          case 'w':
            case 'ArrowUp':
          vehicle.setWheelForce(0, 0);
          vehicle.setWheelForce(0, 1);
          break;
          
          case 's':
            case 'ArrowDown':
              vehicle.setWheelForce(0, 0);
              vehicle.setWheelForce(0, 1);
              break;
              
              case 'a':
                case 'ArrowLeft':
                  vehicle.setSteeringValue(0, 0);
                  vehicle.setSteeringValue(0, 1);
                  break;
                  
                  case 'd':
                    case 'ArrowRight':
                      vehicle.setSteeringValue(0, 0);
                      vehicle.setSteeringValue(0, 1);
                      break;
                    }
                  });
                  

    function animate() {
     

      world.step(1 / 60);
      // cannonDebugger.update();

      if (carModel) {
        carModel.position.copy(carBody.position);
        carModel.quaternion.copy(carBody.quaternion);

        camera.lookAt(carModel.position)
      }
      updateChaseCam()

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);


    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  function updateChaseCam() {
    chaseCamPivot.getWorldPosition(view); 
    if (view.y < 1) view.y = 1; 
    camera.position.lerpVectors(camera.position, view, 1);
    }
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  return null;
};

export default ThreeScene;

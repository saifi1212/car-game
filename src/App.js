
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { pingpong } from "three/src/math/MathUtils";

const ThreeScene = () => {
  let start = false;
  const[countToggle ,setcountToggle ] =useState(false)
  const [count,setcount]=useState(1)
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  let carModel ;
  let carModel2 ;
  let carModel3 ;
  let carModel4;
  let carModel5 ;
  let chaseCam, chaseCamPivot ; 
  let model;
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
const carBody = new CANNON.Body({
  mass: 500,
  position: new CANNON.Vec3(22.5, 0.05, 0),
  shape: new CANNON.Box(new CANNON.Vec3(0.25, 0.07, 0.15)),
});
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
});
const vehicle = new CANNON.RigidVehicle({
  chassisBody: carBody,
});
const mass = 100;
const axisWidth = 0.3;
const wheelShape = new CANNON.Sphere(0.08);
const wheelMaterial = new CANNON.Material('wheel');
const down = new CANNON.Vec3(0, -1, 0);
const wheels = (vehicle,position)=>{
 const wheelBody1 = new CANNON.Body({ mass, material: wheelMaterial });
 wheelBody1.addShape(wheelShape);
 wheelBody1.angularDamping = 0.4;
 vehicle?.addWheel({
   body: wheelBody1,
   position: new CANNON.Vec3(position?.x, position?.y,position?.z),
   axis: new CANNON.Vec3(0, 0, 1),
   
   direction: down,
 });
}
wheels(vehicle ,{x:-0.3, y:0, z:axisWidth / 2})
wheels(vehicle ,{x:-0.3, y:0, z:-axisWidth / 2})
wheels(vehicle ,{x:0.3, y:0, z:axisWidth / 2})
wheels(vehicle ,{x:0.3, y:0, z:-axisWidth / 2})

const carBody2 = new CANNON.Body({
  mass: 1000,
  position: new CANNON.Vec3(22.5, 0.05, 0.8),
  shape: new CANNON.Box(new CANNON.Vec3(0.4, 0.2, 0.22)),
});
const carBody3 = new CANNON.Body({
  mass: 1000,
  position: new CANNON.Vec3(22.5, 0.05, -0.8),
  shape: new CANNON.Box(new CANNON.Vec3(0.4, 0.2, 0.22)),
});
const carBody4 = new CANNON.Body({
  mass: 1000,
  position: new CANNON.Vec3(22.5, 0.05, 1.6),
  shape: new CANNON.Box(new CANNON.Vec3(0.4, 0.2, 0.22)),
});

const carBody5 = new CANNON.Body({
mass: 1000,
position: new CANNON.Vec3(22.5, 0.05, -1.6),
shape: new CANNON.Box(new CANNON.Vec3(0.4, 0.2, 0.22)),
});
const wall1 = new CANNON.Body({
  mass:90000,
  shape:new CANNON.Box(new CANNON.Vec3(23.2 ,1 , 0.4)),
})
const wall2 = new CANNON.Body({
mass:90000,
shape:new CANNON.Box(new CANNON.Vec3(23.2 ,1 , 0.4)),
})
const wall3 = new CANNON.Body({
mass:90000,
shape:new CANNON.Box(new CANNON.Vec3(0.5 ,1 , 3.4)),
})
const wall4 = new CANNON.Body({
mass:90000,
shape:new CANNON.Box(new CANNON.Vec3(0.5 ,1 , 3.4)),
})
useEffect(() => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  const root = document.getElementById("root");
  root.appendChild(renderer.domElement);

    renderer.setClearColor(0xa3a3a3);

   initChaseCam();
   vehicle.addToWorld(world);
   world.addBody(carBody2)
   world.addBody(carBody3)
   world.addBody(carBody4)
   world.addBody(carBody5);


    // const cannonDebugger = new CannonDebugger(scene, world, {});

    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

  
    wall1.position.set(0,1,3.8)
    world.addBody(wall1)
    wall2.position.set(0,1,-3.8)
    world.addBody(wall2)
    wall3.position.set(23.7,1,0)
    world.addBody(wall3)
    wall4.position.set(-23.7,1,0)
    world.addBody(wall4)
    const ambientLight = new THREE.AmbientLight(0xededed, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    scene.add(directionalLight);
    directionalLight.position.set(10, 11, 7);

    const gltfLoader = new GLTFLoader();
    const rgbeLoader = new RGBELoader();
    gltfLoader.load("/models/normal.glb", function (gltf) {
       model = gltf.scene;
      gltf.scene.scale.set(.2*gltf.scene.scale.x, .2*gltf.scene.scale.y, .2
        * gltf.scene.scale.z
        )
       gltf.scene.position.set(0,0.01,0)
       gltf.scene.rotation.set(0,-Math.PI/2,0)
      scene.add(model);
    });
    
    
  
   
    

   
  
// const frame = new CANNON.Body({
//   mass: 0,
//   position: new CANNON.Vec3(carBody.position.x, 0.2,carBody.position.z +0.23),
//   shape: new CANNON.Box(new CANNON.Vec3(0.4, 0.17, 0.01)),
// });
// world.addBody(frame)
// const frame2 = new CANNON.Body({
//   mass: 0,
//   position: new CANNON.Vec3(carBody.position.x, 0.2,carBody.position.z -0.25),
//   shape: new CANNON.Box(new CANNON.Vec3(0.4, 0.17, 0.01)),
// });
// world.addBody(frame2)
    gltfLoader.load("/models/race1.glb", function (gltf) {
      carModel = gltf.scene;
      carModel.scale.set(0.08 * carModel.scale.x, 0.08 * carModel.scale.y, 0.08 * carModel.scale.z);
      gltf.scene.position.copy(carBody.position.x,0.01,carBody.position.z)
       gltf.scene.quaternion.copy(carBody.quaternion.x,carBody.quaternion.y,carBody.quaternion.z)
      carModel.add(chaseCam)
      scene.add(carModel);
    });
    gltfLoader.load("/models/race1.glb", function (gltf) {
      carModel2 = gltf.scene;
      carModel2.scale.set(0.08 * carModel2.scale.x, 0.08 * carModel2.scale.y, 0.08 * carModel2.scale.z);
      gltf.scene.position.set(carBody2.position.x,0.01,carBody2.position.z)
      gltf.scene.quaternion.copy(carBody2.quaternion.x,carBody2.quaternion.y,carBody2.quaternion.z)
      scene.add(carModel2);
    });
    gltfLoader.load("/models/race1.glb", function (gltf) {
      carModel3 = gltf.scene;
      carModel3.scale.set(0.08 * carModel3.scale.x, 0.08 * carModel3.scale.y, 0.08 * carModel3.scale.z);
      gltf.scene.position.copy(carBody3.position)
      gltf.scene.quaternion.copy(carBody3.quaternion.x,carBody3.quaternion.y,carBody3.quaternion.z)
      scene.add(carModel3);
    });
    gltfLoader.load("/models/race1.glb", function (gltf) {
      carModel4 = gltf.scene;
      carModel4.scale.set(0.08 * carModel4.scale.x, 0.08 * carModel4.scale.y, 0.08 * carModel4.scale.z);
      gltf.scene.position.copy(carBody4.position)
      gltf.scene.quaternion.copy(carBody4.quaternion.x,carBody4.quaternion.y,carBody4.quaternion.z)
      scene.add(carModel4);
    });
    gltfLoader.load("/models/race1.glb", function (gltf) {
      carModel5 = gltf.scene;
      carModel5.scale.set(0.08 * carModel5.scale.x, 0.08 * carModel5.scale.y, 0.08 * carModel5.scale.z);
      gltf.scene.position.copy(carBody5.position)
      gltf.scene.quaternion.copy(carBody5.quaternion.x,carBody5.quaternion.y,carBody5.quaternion.z)
      scene.add(carModel5);
    });
 
                  
console.log(start)
    function animate(time) {
     

      world.step(1 / 60);
      // cannonDebugger.update();
      if (carModel ) {
        carModel.position.copy(carBody.position);
        carModel.quaternion.copy(carBody.quaternion);
        camera.lookAt(carModel.position)
      }
      
      if (carModel2) {
          carModel2.position.set(carBody2.position.x,0.01,carBody2.position.z)
           carModel2.quaternion.copy(carBody2.quaternion);
           
           if (carBody2.position.x >=-22.5 && start) {
            carBody2.position.x -= 0.07

           }else{
            carBody2.position.x = 22.5
           }
      }
      if (carModel3) {
        carModel3.position.set(carBody3.position.x,0.01,carBody3.position.z)
        carModel3.quaternion.copy(carBody3.quaternion);
        if (carBody3.position.x >=-22.5  && start) {
          carBody3.position.x -= 0.15
         }else{
          carBody3.position.x = 22.5
         }
      }
      if (carModel4) {
        carModel4.position.set(carBody4.position.x,0.01,carBody4.position.z)
        carModel4.quaternion.copy(carBody4.quaternion);
        if (carBody4.position.x >=-22.5  && start) {
          carBody4.position.x -= 0.11
         }else{
          carBody4.position.x = 22.5
         }
      }
      if (carModel5) {
        carModel5.position.set(carBody5.position.x,0.02,carBody5.position.z)
        carModel5.quaternion.copy(carBody5.quaternion);
        if (carBody5.position.x >=-22.5  && start) {
          carBody5.position.x -= 0.07
         }else{
          carBody5.position.x = 22.5
         }
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
  document.addEventListener('keydown', (event) => {
    const maxSteerVal = Math.PI / 10;
    const maxForce = 50;
    if (start) {
      
      switch (event.key) {
        case 'ArrowUp':
          vehicle.setWheelForce(maxForce, 0);
          vehicle.setWheelForce(maxForce, 1);
  
          break;
        case 'ArrowDown':
          vehicle.setWheelForce(-maxForce / 2, 0);
          vehicle.setWheelForce(-maxForce / 2, 1);
          break;
  
        case 'ArrowLeft':
          vehicle.setSteeringValue(maxSteerVal, 0);
          vehicle.setSteeringValue(maxSteerVal, 1);
          break;
          
            case 'ArrowRight':
          vehicle.setSteeringValue(-maxSteerVal, 0);
          vehicle.setSteeringValue(-maxSteerVal, 1);
          break;
        }
    }
    });
    
    document.addEventListener('keyup', (event) => {
      if (start) {
        
        switch (event.key) {
            case 'ArrowUp':
          vehicle.setWheelForce(0, 0);
          vehicle.setWheelForce(0, 1);
          break;
          
            case 'ArrowDown':
              vehicle.setWheelForce(0, 0);
              vehicle.setWheelForce(0, 1);
              break;
              
                case 'ArrowLeft':
                  vehicle.setSteeringValue(0, 0);
                  vehicle.setSteeringValue(0, 1);
                  break;
                  
                    case 'ArrowRight':
                      vehicle.setSteeringValue(0, 0);
                      vehicle.setSteeringValue(0, 1);
                      break;
                    }
      }
                });
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
  const handleCount=()=>{
    setcountToggle(true)
    setTimeout(() => {
      setcount(2)
    }, 1000);
    setTimeout(() => {
      setcount(3)
    }, 2000);
    setTimeout(() => {
      setcount("Go")
    }, 3000);
    setTimeout(() => {
      start= true
      const modal = document.getElementById("modal")
      modal.style.display = "none"
    }, 4000);
    }
  return(<>
    <div id="modal" style={{height:"90vh" , width:"80vw",background:"gray",display:"flex",backgroundImage:"url(/cars.jpg)" , backgroundPosition:"center",backgroundSize:"cover" , backgroundRepeat:"no-repeat",flexDirection:"column",justifyContent:"space-between" ,position:"absolute" , inset:"0" ,marginLeft:"auto",marginRight:"auto",marginTop:"50px" , border:"10px  solid #6c7a89",borderRadius:"10px"}}>
    <h1 style={{fontSize:"170px",fontWeight:"bold", fontStyle:"italic", color:"white", fontFamily:"sans-serif",marginLeft:"auto",marginRight:"auto",marginTop:"40px", width:"fit-content"}}>
      Car Game
    </h1>
  {!countToggle? <button onClick={handleCount} style={{fontSize:"170px",fontWeight:"bold",maxWidth:"450px",width:"100%",textAlign:"center",background:"black", fontStyle:"italic", color:"gray", fontFamily:"sans-serif",marginLeft:"auto",marginRight:"auto",marginBottom:"40px",cursor:"pointer",borderRadius:"30px"}}>
    Start
   </button>:<h1 style={{fontSize:"170px",fontWeight:"bold", fontStyle:"italic", color:"gray", fontFamily:"sans-serif",marginLeft:"auto",marginRight:"auto",marginTop:"40px", width:"fit-content"}}>
    {count}
    </h1>}
    </div>
  </>
  );
};

export default ThreeScene;

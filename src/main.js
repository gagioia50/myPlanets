import * as THREE from 'three';
import {PlaneGeometry} from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js'
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { Planet} from './myclass';
import * as UTI from './util.js'

const gui = new GUI();
const stats = new Stats();
stats.dom.style.cssText = 'position:absolute;top:225px;right:0px;';
document.body.appendChild(stats.dom);

const scale = 1.875e-12
const startDate = new Date('25 april 2025 00:00:00');
let previousYear = 2025;
const startMillis = startDate.getTime();
let scaleFactor = 1.0;

const canvas = document.querySelector('canvas.threejs');
const linesData = await UTI.loadFile('./blob/main/src/data_25apr2025.txt');
const scene = UTI.create_scene();
const camera = UTI.initializeCamera();
const controls = UTI.initializeControls(camera, canvas);
const bodies = UTI.createBodies(linesData);
const myMeshes = UTI.createMeshes(bodies, scene);
const myMeshLines = UTI.createTrails(bodies, scene);
const planes = UTI.createNamePlanes(bodies, scene);
const renderer = UTI.initializeRenderer(canvas);
const planet = new Planet();
const initialDistance = controls.getDistance();

renderer.setAnimationLoop( animate );

// animate function
function animate() {
  controls.update();  
  stats.update();

  const currentDistance = controls.getDistance();
  scaleFactor = initialDistance / currentDistance;

  renderer.render( scene, camera );
  
  
  if (planet.fdt !== 0) {
    for (var i = 0; i < bodies.length; i++) {
      let loc_x = scale*bodies[i].x
      let loc_y = scale*bodies[i].z
      let loc_z = -scale*bodies[i].y

      myMeshes[i].position.set(loc_x, loc_y, loc_z)
      
      planes[i].position.set(loc_x, loc_y+2.0*bodies[i].radius/scaleFactor, loc_z)
      planes[i].lookAt(camera.position)

      if(scaleFactor > 1.0) {
        myMeshes[i].geometry.dispose();
        myMeshes[i].geometry = new THREE.SphereGeometry(bodies[i].radius/scaleFactor, 32, 32);

        planes[i].geometry.dispose();
        planes[i].geometry = new PlaneGeometry( 0.1/scaleFactor/0.5, 0.1/scaleFactor/0.5 );
        
        myMeshLines[i].material.lineWidth = 0.02/scaleFactor
      }

      bodies[i].points.push(new THREE.Vector3(loc_x, loc_y, loc_z))
      if (bodies[i].points.length === 1000) {
        bodies[i].points.shift()
      }
      myMeshLines[i].geometry.setPoints(bodies[i].points)
      planet.update_position(bodies)

    }
  }

  let anni = bodies[3].t/60/60/24/365.25;
  let myAnni = parseInt(anni);
  let text = "Anni="+myAnni+"\r"

  // create sun plane every year
  // let date = new Date(startMillis);
  // let year = date.getFullYear();
  // let currentYear = year + parseInt(anni);
  // if (Math.abs(currentYear - previousYear) === 1) {
  //   let sunPlane = UTI.createSunPlane(currentYear, scene);
  //   let sun_loc_x = scale*bodies[0].x
  //   let sun_loc_y = scale*bodies[0].z
  //   let sun_loc_z = -scale*bodies[0].y
  //   sunPlane.position.set(sun_loc_x+0.0001, sun_loc_y, sun_loc_z); 
  //   sunPlane.lookAt(camera.position);
  //   let sunPoint = UTI.createSunPoint();
  //   sunPoint.position.set(sun_loc_x, sun_loc_y, sun_loc_z);
    
  //   scene.add(sunPoint);
  //   previousYear = currentYear;
  // }

  let [checkMillis, currentMillis, currentStringDate] = UTI.create_currentDate(planet.checkDateString, startMillis, bodies);
  if (currentMillis > checkMillis) {
    planet.fdt = 0;
  }
  
  text += "Date= "+currentStringDate+"\r"+"\r"
  text += planet.calc_properties(bodies)+"\r";
  document.getElementById("properties").value = text

}   

// window resize event listener
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
})

// pause and unpause event listener
document.addEventListener('keydown', onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode === 80) { // P key
        planet.fdt = 0;
    }
    if (keyCode === 85) { // U key
        renderer.setAnimationLoop( animate );
        planet.change_values();
    } 
}

const orbitFolder = gui.addFolder('Orbit');
orbitFolder.add(planet, 'proCheckDate').name('Check Date');
orbitFolder.add(planet, 'proFdt').name('Delta time factor');
orbitFolder.add(planet, 'change_values').name('Change Values');

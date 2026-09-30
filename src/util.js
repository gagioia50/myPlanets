import * as THREE from 'three';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { Body } from './myclass';
import { createText } from './text2D_2.js';

export async function loadFile(filePath) {
    // let text = fetch(filePath)
    //     .then(res => res.text())
    //     .then(text => text.split("\n"));
    // console.log("Loaded file: " + text);
    // return text;
    
    const loader = new THREE.FileLoader();    
    const data = await loader.loadAsync( filePath );
    const linesData = data.split("\n");
    console.log("Loaded file: " + filePath + " with " + linesData.length + " lines.");
    return linesData;

    // Dati del 25 aprile 2025
    // const listText = [
    // "0,0.0,0.0,0.0,0.0,0.0,0.0,1.98841e30,0.09,yellow,Sun,\r",
    // "1,-7.3360953458583e8,-7.8535776230127e8,2.4763339970757e7,1.2560608404460e1,-4.0896885934101,-2.1597435963821e-1,1.98841e30,0.0,yellow,Sun,\r",
    // "1,8.815655261881426e9,-6.848100877829707e10,-6.383326051013235e9,3.847743632925000e4,9.297875142128023e3,-2.768077747009409e3,3.302e23,0.02,gray,Mer,\r",
    // "1,-6.2471325971922e10,-8.9829010760856e10,2.3637438190712e9,2.8548260347235e4,-2.0119938167307e4,-1.9230858482977e3,4.86850e24,0.03,orange,Ven,\r",
    // "1,-1.2446579399925e11,-8.6440912992370e10,3.0550425834626e7,1.6484670553324e4,-2.4620729875325e4,-3.2343664159384e-2,5.97219e24,0.04,blue,Ear,\r",
    // "1,-2.3432512960716e11,8.5668274992234e10,7.5647719380933e9,-7.4905129038196e3,-2.0656783439921e4,-2.4903112474481e2,6.41710e23,0.03,red,Mar,\r",
    // "1,2.8073283752176e10,7.6479968987877e11,-3.7999567112093e9,-1.3207564690262e4,1.0997963747155e3,2.9091201442300e2,1.89819e27,0.06,orange,Jup,\r",
    // "1,1.4236464553304e12,-1.7089102098136e11,-5.3711277049394e10,6.1686848085026e2,9.5699994390755e3,-1.9086881979391e2,5.68340e26,0.05,green,Sat,\r",
    // "1,1.6040896945596e12,2.4413004622454e12,-1.1714302557415e10,-5.7411382842673e3,3.4220891448126e3,8.7123577193333e1,8.68130e25,0.05,cyan,Ura,\r",
    // "1,4.4695855901464e12,-4.1761764563854e10,-1.0214617483986e11,1.4287768629848e1,5.4673824002405e3,-1.1229290564441e2,1.02409e26,0.04,green,Nep,\r",
    // "1,-2.936439997739e12,4.0949916568483e12,-1.4830330343896e12,8.3736415371605e2,3.8246982548192e2,1.6603940433458e2,2.00000e14,0.02,red,Hal,\r",
    // "1,-1.1861607944755E+12,-1.7594447738191E+12,2.6274429450890E+11,-3.9720404346230E+02,-6.7238134670156E+03,-3.3733514868419E+02,5.50000E+13,0.02,olive,38P,\r",
    // "1,-2.9827574288376E+11,8.3008967544342E+10,-1.7571131438143E+10,-1.8591308304827E+04,-1.2545626035965E+04,-1.1256401879531E+03,2.80000E+08,0.01,cyan,YR4"
    // ]
    // return listText;
}
    
export function initializeCamera() {
    const camera = new THREE.PerspectiveCamera( 50, window.innerWidth /window.innerHeight, 0.0001, 6000 );
    camera.position.z = 5
    return camera;
}

export function initializeControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = false
    return controls;
}

export function initializeRenderer(canvas){
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    return renderer;
}

export function create_scene() {
    // initialize scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000);
    // 3D coordinates
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper );
    // horizontal grid
    const gridHelper = new THREE.GridHelper(100, 100);
    scene.add(gridHelper );
    // directional light
    const dirLight = new THREE.DirectionalLight('white', 5);
    dirLight.position.set(-1, 0.5, 1);
    scene.add(dirLight);

    // solar system barycenter
    const geo = new THREE.SphereGeometry( 0.00005, 16, 16 );
    const mat = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
    const point = new THREE.Mesh( geo, mat );
    point.position.set(0, 0, 0)
    scene.add( point );
    return scene;
}

export function createSunPoint() {
    const geo = new THREE.SphereGeometry( 0.00003, 16, 16 );
    const mat = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const point = new THREE.Mesh( geo, mat );
    return point;
}

export function createTrails(bodies, scene) {
    var myMeshLines = []
    for (var i = 0; i < bodies.length; i++) {
        const lineGeometry = new MeshLineGeometry();
        const lineMaterial = new MeshLineMaterial({
            color: new THREE.Color(bodies[i].color),
            lineWidth: 0.02,
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
        });
        const meshLine = new THREE.Mesh(lineGeometry, lineMaterial);
        scene.add(meshLine);
        myMeshLines.push(meshLine)
    }
    myMeshLines[0].material.lineWidth = 0.00005
    myMeshLines[0].material.color = new THREE.Color(0xff0000)
    return myMeshLines;
}

export function createBodies(lines) {
    let items = []
    let bodies = []
    for (let i = 0; i < lines.length; i++) {
        items = lines[i].split(",")
        if (items[0] == '0') {
            continue
        }
        let body = new Body(items[0], Number(items[1]), Number(items[2]), Number(items[3]), Number(items[4]), 
                    Number(items[5]), Number(items[6]), Number(items[7]), Number(items[8]), items[9], items[10]);
        bodies.push(body);
    }
    return bodies;
}

export function createMeshes(bodies, scene) {
    var myMeshes = []
    for (var i = 0; i < bodies.length; i++) {
        const geo = new THREE.SphereGeometry(bodies[i].radius, 32, 32);
        const mat = new THREE.MeshStandardMaterial({color: new THREE.Color(bodies[i].color)});
        const mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh)
        myMeshes.push(mesh)
    }
    myMeshes[0].material.wireframe = false
    myMeshes[0].material.transparent = true
    myMeshes[0].material.opacity = 0.2
    return myMeshes;
}

function createCurrentDateString(date) {
  var d = date.getDate();
  var m = date.getMonth() + 1; //Month from 0 to 11
  var y = date.getFullYear();
  return d+"/"+m+"/"+y;
}

export function createNamePlanes(bodies, scene) {
    let planes = []
    for (let i = 0; i < bodies.length; i++) {
        let plane = createText(bodies[i].name)
        scene.add(plane)
        planes.push(plane);
    }
    return planes;
}

export function createSunPlane(year, scene) {
    let plane = createText(year, 0.00007)
        scene.add(plane)
    return plane;
}

export function create_currentDate(str, startMillis, bodies) {
    const checkDate = new Date(str);
      const checkMillis = checkDate.getTime();
      let currentMillis = startMillis + bodies[3].t*1000;
      let currentStringDate = createCurrentDateString(new Date(currentMillis));
      return [checkMillis, currentMillis, currentStringDate];
}

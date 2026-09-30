import * as THREE from 'three';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { Body } from './myclass';
import { createText } from './text2D_2.js';

export function getData() {

    const listText = 
    ['1,Sun,-7.3360953458583E+08,-7.8535776230127E+08,2.4763339970757E+07,1.2560608404460E+01,-4.0896885934101E+00,-2.1597435963821E-01,1.98841E+30,0.00,yellow\n', '1,Mer,8.8156552618814E+09,-6.8481008778297E+10,-6.3833260510132E+09,3.8477436329250E+04,9.2978751421280E+03,-2.7680777470094E+03,3.30200E+23,0.02,gray\n', '1,Ven,-6.2471325971922E+10,-8.9829010760856E+10,2.3637438190712E+09,2.8548260347235E+04,-2.0119938167307E+04,-1.9230858482977E+03,4.86850E+24,0.03,orange\n', '1,Ear,-1.2446579399925E+11,-8.6440912992370E+10,3.0550425834626E+07,1.6484670553324E+04,-2.4620729875325E+04,-3.2343664159384E-02,5.97219E+24,0.04,blue\n', '1,Mar,-2.3432512960716E+11,8.5668274992234E+10,7.5647719380933E+09,-7.4905129038196E+03,-2.0656783439921E+04,-2.4903112474481E+02,6.41710E+23,0.03,red\n', '1,Jup,2.8073283752176E+10,7.6479968987877E+11,-3.7999567112093E+09,-1.3207564690262E+04,1.0997963747155E+03,2.9091201442300E+02,1.89819E+27,0.06,orange\n', '1,Sat,1.4236464553304E+12,-1.7089102098136E+11,-5.3711277049394E+10,6.1686848085026E+02,9.5699994390755E+03,-1.9086881979391E+02,5.68340E+26,0.05,green\n', '1,Ura,1.6040896945596E+12,2.4413004622454E+12,-1.1714302557415E+10,-5.7411382842673E+03,3.4220891448126E+03,8.7123577193333E+01,8.68130E+25,0.05,cyan\n', '1,Nep,4.4695855901464E+12,-4.1761764563854E+10,-1.0214617483986E+11,1.4287768629848E+01,5.4673824002405E+03,-1.1229290564441E+02,1.02409E+26,0.04,green\n', '0,Plu,2.7732108288467E+12,-4.4737138511608E+12,-3.2346465632090E+11,4.7513319307916E+03,1.6540145376758E+03,-1.5391940930135E+03,1.30700E+22,0.02,orange\n', '1,Hal,-2.9364399977390E+12,4.0949916568483E+12,-1.4830330343896E+12,8.3736415371605E+02,3.8246982548192E+02,1.6603940433458E+02,2.00000E+14,0.02,red\n', '0,Moo,-1.2410340071991E+11,-8.6471939845097E+10,2.9714225107126E+07,1.6523806979119E+04,-2.3545361714106E+04,9.7622861056003E+01,7.34900E+22,0.02,white\n', '1,38P,-1.1861607944755E+12,-1.7594447738191E+12,2.6274429450890E+11,-3.9720404346230E+02,-6.7238134670156E+03,-3.3733514868419E+02,5.50000E+13,0.02,olive\n', '1,YR4,-2.9827574288376E+11,8.3008967544342E+10,-1.7571131438143E+10,-1.8591308304827E+04,-1.2545626035965E+04,-1.1256401879531E+03,2.80000E+08,0.01,cyan\n', '0,C95,6.3626896374349E+11,-3.1982341395386E+12,-6.6501833849940E+12,6.3547056259694E+02,-3.0890389576648E+03,-4.5807986827622E+03,6.78240E+16,0.01,blue\n']

    return listText;
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
        items[10] = items[10].slice(0, -1) // remove \r
        let body = new Body(items[0], items[1], Number(items[2]), Number(items[3]), Number(items[4]), 
                    Number(items[5]), Number(items[6]), Number(items[7]), Number(items[8]), Number(items[9]), items[10]);
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

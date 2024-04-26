"use client"

import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import ShaderComponent from './ShaderComponent';

export default function Home() {
  const [initEnter, setInitEnter] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetch('/api/pugHtml')
      .then(response => response.text())
      .then(data => {
          let parsedData = JSON.parse(data);
          setHtmlContent(parsedData.htmlContent);
          setInitEnter(true);
      })
      .catch(error => {
          console.error('Error fetching pug HTML:', error);
      });
  }, []); // 의존성 배열을 비워서 컴포넌트가 마운트될 때 한 번만 실행되게 합니다.

  useEffect(() => {
      if (initEnter) {
        init();
        return () => {
        };
      }
    }, [initEnter]); 

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let container: HTMLElement | null;
let start = Date.now();
let _width: number;
let _height: number;

function init() {
  let Theme = {_darkred: 0x000000}
  console.log("init started.")
  createWorld(Theme);
  createPrimitive();
  // createGUI();
  //---
  animation();
}

function createWorld(Theme: any) {
  console.log("createWorld started.")
  _width = window.innerWidth;
  _height= window.innerHeight;
  //---
  scene = new THREE.Scene();
  //scene.fog = new THREE.Fog(Theme._darkred, 8, 20);
  scene.background = new THREE.Color(Theme._darkred);
  //---
  camera = new THREE.PerspectiveCamera(55, _width/_height, 1, 1000);
  camera.position.z = 12;
  //---
  renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
  renderer.setSize(_width, _height);
  //---
  container = document.getElementById("container") as HTMLElement;
  container.appendChild(renderer.domElement);
  //---
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  console.log("onWindowResize started.")
  _width = window.innerWidth;
  _height = window.innerHeight;
  renderer.setSize(_width, _height);
  camera.aspect = _width / _height;
  camera.updateProjectionMatrix();
  console.log('- resize -');
}

let mat: THREE.ShaderMaterial;

let _primitive: PrimitiveElement;
class PrimitiveElement {
  mesh: THREE.Object3D;
  constructor(_vertexShader: any, _fragmentShader: any) {
    this.mesh = new THREE.Object3D();
    mat = new THREE.ShaderMaterial({
      wireframe: false,
      //fog: true,
      uniforms: {
        time: {
          type: "f",
          value: 0.0
        },
        pointscale: {
          type: "f",
          value: 0.0
        },
        decay: {
          type: "f",
          value: 0.0
        },
        complex: {
          type: "f",
          value: 0.0
        },
        waves: {
          type: "f",
          value: 0.0
        },
        eqcolor: {
          type: "f",
          value: 0.0
        },
        fragment: {
          type: "i",
          value: true
        },
        redhell: {
          type: "i",
          value: true
        }
      },
      vertexShader: _vertexShader?.textContent || '',
      fragmentShader: _fragmentShader?.textContent || ''
    }); 
    
    let mesh: THREE.Points;
    let geo = new THREE.IcosahedronBufferGeometry(3, 7);

    const bufferGeo: THREE.BufferGeometry = geo as THREE.BufferGeometry;
    mesh = new THREE.Points(bufferGeo, mat);

    this.mesh.add(mesh);
  }
}

function createPrimitive() {
  console.log("createPrimitive started.");
  _primitive = new PrimitiveElement(document.getElementById('vertexShader'), document.getElementById('fragmentShader'));
  scene.add(_primitive.mesh);
}

let options = {
  perlin: {
    vel: 0.002,
    speed: 0.00050,
    perlins: 1.0,
    decay: 0.10,
    complex: 0.30,
    waves: 20.0,
    eqcolor: 11.0,
    fragment: true,
    redhell: true
  },
  spin: {
    sinVel: 0.0,
    ampVel: 80.0,
  }
}

function animation() {
  requestAnimationFrame(animation);
  let performance = Date.now() * 0.003;
  
  _primitive.mesh.rotation.y += options.perlin.vel;
  _primitive.mesh.rotation.x = (Math.sin(performance * options.spin.sinVel) * options.spin.ampVel )* Math.PI / 180;
  //---
  mat.uniforms['time'].value = options.perlin.speed * (Date.now() - start);
  mat.uniforms['pointscale'].value = options.perlin.perlins;
  mat.uniforms['decay'].value = options.perlin.decay;
  mat.uniforms['complex'].value = options.perlin.complex;
  mat.uniforms['waves'].value = options.perlin.waves;
  mat.uniforms['eqcolor'].value = options.perlin.eqcolor;
  mat.uniforms['fragment'].value = options.perlin.fragment;
  mat.uniforms['redhell'].value = options.perlin.redhell;

  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

return (
  <div>
    {/* <ShaderComponent></ShaderComponent> */}
      <div id="container" />
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  </div>
);
}
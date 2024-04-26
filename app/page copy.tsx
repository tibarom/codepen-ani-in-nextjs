import React, { useState, useEffect } from 'react';
import * as THREE from 'three';

export default function Home() {
  const [vertexShaderCode, setVertexShaderCode] = useState('');
  const [fragmentShaderCode, setFragmentShaderCode] = useState('');
  const [initEnter, setInitEnter] = useState(false);
  const [scene, setScene] = useState(new THREE.Scene());
  const [camera, setCamera] = useState(new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 1000));
  const [renderer, setRenderer] = useState(new THREE.WebGLRenderer({ antialias: true, alpha: false }));

  useEffect(() => {
    fetch('/shaders/shader.vert')
      .then(response => response.text())
      .then(setVertexShaderCode);

    fetch('/shaders/shader.frag')
      .then(response => response.text())
      .then(setFragmentShaderCode);

    // Initialize renderer and append to container
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
    
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  useEffect(() => {
    if (vertexShaderCode && fragmentShaderCode) {
      init();
      setInitEnter(true);
    }
  }, [vertexShaderCode, fragmentShaderCode]);

  useEffect(() => {
    if (initEnter) {
      animation();
    }
  }, [initEnter]);

  const init = () => {
    // Scene setup
    scene.background = new THREE.Color(0x000000);
    camera.position.z = 12;

    // Create and add shader-based mesh to scene
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { 
          type: 'f', 
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
      vertexShader: vertexShaderCode,
      fragmentShader: fragmentShaderCode
    });

    const geo = new THREE.IcosahedronBufferGeometry(3, 7);
    const bufferGeo: THREE.BufferGeometry = geo as THREE.BufferGeometry;
    const mesh = new THREE.Points(bufferGeo, material);
    scene.add(mesh);
  };

  const onWindowResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };

  const animation = () => {
    requestAnimationFrame(animation);
    // Update shader uniforms etc.
    renderer.render(scene, camera);
  };

  return (
    <div>
      <div id="container" />
    </div>
  );
}

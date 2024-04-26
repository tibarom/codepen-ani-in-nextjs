// shader.vert
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec2 vUv;
varying float noise;

void main() {
  vUv = uv;
  // Vertex position 계산 로직을 추가
  vec3 newPosition = position + normal * sin(time);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}

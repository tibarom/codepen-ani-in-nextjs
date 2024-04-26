// shader.frag
precision mediump float;

varying vec2 vUv;
varying float noise;

uniform float time;
uniform sampler2D texture;

void main() {
  vec3 color = texture2D(texture, vUv + noise).rgb;
  gl_FragColor = vec4(color, 1.0);
}

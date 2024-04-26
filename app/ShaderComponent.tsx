import React, { useEffect, useState } from 'react';

const ShaderComponent = () => {
  const [vertexShaderCode, setVertexShaderCode] = useState('');
  const [fragmentShaderCode, setFragmentShaderCode] = useState('');

  useEffect(() => {
    fetch('/shaders/shader.vert')
      .then(response => response.text())
      .then(setVertexShaderCode);
    fetch('/shaders/shader.frag')
      .then(response => response.text())
      .then(setFragmentShaderCode);
  }, []);

  return (
    <div>
      {/* WebGL 초기화 및 셰이더 사용 로직 */}
      {vertexShaderCode && fragmentShaderCode && (
        <div>셰이더 로드 완료!</div>
      )}
    </div>
  );
};

export default ShaderComponent;

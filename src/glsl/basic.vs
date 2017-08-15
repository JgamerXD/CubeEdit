attribute vec3 aVertexPos;
attribute vec3 aVertexNormal;

uniform vec4 uColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec4 vColor;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix  * vec4(aVertexPos, 1.0);
  float cosTheta = clamp(
    dot(aVertexNormal,
     vec3(uModelViewMatrix[0].z,uModelViewMatrix[1].z,uModelViewMatrix[2].z))
     ,0.0,1.0)/2.0+0.5;
  vColor = vec4(uColor.rgb * cosTheta,uColor.a);
}

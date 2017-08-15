attribute vec3 aVertexPos;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec3 vTexCoords;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix  * vec4(aVertexPos, 1.0);
  vTexCoords = aVertexPos;
}

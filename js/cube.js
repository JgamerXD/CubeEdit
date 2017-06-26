var sizeX, sizeY, sizeZ;

var editIndexX=editIndexY=editIndexZ=0;

var currentEditColorPrim=currentEditColorSecond=0
var cubeClearColor = 7; // TODO: Default to 0?

// var cubeData;
var frames = [];
var currentIndex;
var currentFrame;

function getIndex(x,y,z) {
  return x + sizeX*z + sizeX*sizeX*y; //Swapped y and z to match Hardware TODO: make option
}

var cubeColormap = [
  0x000000,0x001290,0x008F15,0x009092,
  0x9B1708,0x9A2091,0x949119,0xB8B8B8,
  0x686868,0x0027FB,0x00F92C,0x00FCFE,
  0xFF3016,0xFF3FFC,0xFFFD33,0xFFFFFF
];

function colorToRgba(hex) {
    var r = ((hex >> 16) & 0xFF) / 255.0;
    var g = ((hex >> 8) & 0xFF) / 255.0;
    var b = (hex & 0xFF) / 255.0;

    return vec4.fromValues(r,g,b,1.0);
}

//Todo methods for editing cube --> need to call these OR call after editing (manually)
var dataChangedCallbacks = []
var editIndexChangedCallbacks = []

function notifyCubeDataChanged() {
  for (i = 0; i < dataChangedCallbacks.length; i++) {
    dataChangedCallbacks[i]();
  }
}
function notifyEditIndexChanged() {
  for (i = 0; i < dataChangedCallbacks.length; i++) {
    dataChangedCallbacks[i]();
  }
}


function clearFrame() {
  frames[currentIndex].fill(cubeClearColor);

  notifyCubeDataChanged();
}

function cutFrame() {
  frames.splice(currentIndex, 1);

  if(frames.length == 0)
    frames.push(newFrame());
  if(currentIndex >= frames.length)
    currentIndex=frames.length;

  currentFrame = frames[currentIndex];
  notifyCubeDataChanged();
}

function insertFrame() {
  var nf = newFrame();
  nf.fill(cubeClearColor);
  frames.splice(currentIndex+1, 0, nf);

  notifyCubeDataChanged();
}

function duplicateFrame() {
  frames.splice(currentIndex, 0, copyFrame(currentIndex));
  notifyCubeDataChanged();
}

function newFrame() {
  return (new Array(sizeX*sizeY*sizeZ)).fill(cubeClearColor);

}

function copyFrame(index) {
  return Array.from(frames[index]);
}

function setFrame(frame)
{
  frames[currentIndex].fill(frame)
}

var cubeInitCallbacks = []


function updateFrameRange() {
  var r = $("#FIRange")[0];
  r.max=frames.length-1;
  if(Number(r.value) >= frames.length) {
    r.value = String(frames.length-1);
    r.onchange()
  }

  $("#currentFrame").html(currentIndex);
  $("#maxFrame").html(frames.length-1);
}
dataChangedCallbacks.push(updateFrameRange)

function initCube(sx,sy,sz) {
  sizeX = sx;
  sizeY = sy;
  sizeZ = sz;


  frames.length = 0;

  currentIndex = 0
  frames.push(newFrame());
  currentFrame = frames[currentIndex];
  currentFrame.fill(cubeClearColor);

  editIndexZ=editIndexY=editIndexZ=0;

  for (var i = 0; i < cubeInitCallbacks.length; i++) {
    cubeInitCallbacks[i]();
  }
  updateFrameRange();


}

function lf(i) {
  if(i<0 || i>=frames.length) {
    console.log("invalid index");
    return;
  }

  currentIndex = i;
  currentFrame = frames[i];
  notifyCubeDataChanged();
}

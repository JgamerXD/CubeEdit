var sizeX, sizeY, sizeZ;

var editIndexX=editIndexY=editIndexZ=0;

var currentEditColorPrim=currentEditColorSecond=0
var cubeClearColor = 0; // TODO: Default to 0?

// var cubeData;
var frames = [];
var currentFrameIndex;
var currentFrame;

function getIndex(x,y,z) {
  return x + sizeX*z + sizeX*sizeX*y; //Swapped y and z to match Hardware TODO: make option
}

var colormaps = [];

var defaultColormaps = {
  2:[
    0x000000,0xffffff
  ],
  16:[
  0x000000,0x001290,0x008F15,0x009092,
  0x9B1708,0x9A2091,0x949119,0xB8B8B8,
  0x686868,0x0027FB,0x00F92C,0x00FCFE,
  0xFF3016,0xFF3FFC,0xFFFD33,0xFFFFFF
]};

var cmapsize;
var currentCmapIndex;
var currentColormap;

function colorToRgba(hex) {
    var r = ((hex >> 16) & 0xFF) / 255.0;
    var g = ((hex >> 8) & 0xFF) / 255.0;
    var b = (hex & 0xFF) / 255.0;

    return vec4.fromValues(r,g,b,1.0);
}

var cubeInitCallbacks = []

function initCube(sx,sy,sz,scmap = 16) {
  sizeX = sx;
  sizeY = sy;
  sizeZ = sz;


  frames.length = 0;

  currentFrameIndex = 0;
  frames.push(newFrame());
  currentFrame = frames[currentFrameIndex];

  colormaps.length = 0;

  currentCmapIndex = 0;
  cmapsize = scmap;
  colormaps.push(newColormap())
  currentColormap = colormaps[currentCmapIndex];

  editIndexZ=editIndexY=editIndexZ=0;

  for (var i = 0; i < cubeInitCallbacks.length; i++) {
    cubeInitCallbacks[i]();
  }
  updateFrameRange();


}

//Todo methods for editing cube --> need to call these OR call after editing (manually)
var dataChangedCallbacks = []
var editIndexChangedCallbacks = []


function notifyCubeDataChanged() {
  console.log("data changed");
  for (var i = 0; i < dataChangedCallbacks.length; i++) {
    dataChangedCallbacks[i]();
  }
}
function notifyEditIndexChanged() {
  console.log("ei changed");
  for (var i = 0; i < editIndexChangedCallbacks.length; i++) {
    editIndexChangedCallbacks[i]();
  }
}



function clearFrame() {
  frames[currentFrameIndex].fill(cubeClearColor);

  notifyCubeDataChanged();
}

function cutFrame() {
  frames.splice(currentFrameIndex, 1);

  if(frames.length == 0)
    frames.push(newFrame());
  if(currentFrameIndex >= frames.length)
    currentFrameIndex=frames.length-1;

  currentFrame = frames[currentFrameIndex];
  notifyCubeDataChanged();
}

function insertFrame() {
  var nf = newFrame();
  nf.fill(cubeClearColor);
  frames.splice(currentFrameIndex+1, 0, nf);
  lf(currentFrameIndex+1);

  notifyCubeDataChanged();
}

function duplicateFrame() {
  frames.splice(currentFrameIndex, 0, copyFrame(currentFrameIndex));
  lf(currentFrameIndex+1);
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
  frames[currentFrameIndex].fill(frame)
}


function emptyColormap(size) {
  return (new Array(size)).fill(0x000000);

}

function getDefaultColormap(size)
{
  if(defaultColormaps[size] != undefined)
    return Array.from(defaultColormaps[size])
  else {
    return emptyColormap(size)
  }
}

function clearColormap() {
  colormaps[currentCmapIndex] = getDefaultColormap(cmapsize);
  currentColormap = colormaps[currentCmapIndex];

  notifyCubeDataChanged();
}

function cutColormap() {
  colormaps.splice(currentCmapIndex, 1);

  if(colormaps.length == 0)
    colormaps.push(newColormap());
  if(currentCmapIndex >= colormaps.length)
    currentCmapIndex=colormaps.length-1;

  currentColormap = colormaps[currentCmapIndex];
  notifyCubeDataChanged();
}

function insertColormap() {
  var ncm = newColormap();
  colormaps.splice(currentCmapIndex+1, 0, ncm);
  lcmap(currentCmapIndex+1);
}

function duplicateColormap() {
  colormaps.splice(currentCmapIndex, 0, copyColormap(currentCmapIndex));
  lcmap(currentCmapIndex+1);
}

function newColormap() {
  return getDefaultColormap(cmapsize);

}

function copyColormap(index) {
  return Array.from(colormaps[index]);
}

function setColormap(colormap)
{
  currentColormap.fill(colormap);
  notifyCubeDataChanged();
}




function updateFrameRange() {
  var r = $("#FIRange")[0];
  r.max=frames.length-1;
  r.value = String(currentFrameIndex);

  $("#currentFrame").html(currentFrameIndex);
  $("#maxFrame").html(frames.length-1);
}
dataChangedCallbacks.push(updateFrameRange)

function updateCmapRange() {
  var r = $("#CMIRange")[0];
  r.max=colormaps.length-1;
  r.value = String(currentCmapIndex)

  $("#currentCmap").html(currentCmapIndex);
  $("#maxCmap").html(colormaps.length-1);
}
dataChangedCallbacks.push(updateCmapRange)

function lcmap(i) {
  if(i<0 || i>=colormaps.length) {
    console.log("invalid index");
    return;
  }

  currentCmapIndex = i;
  currentColormap = colormaps[i];

  notifyCubeDataChanged();
}

function lf(i) {
  if(i<0 || i>=frames.length) {
    console.log("invalid index");
    return;
  }

  currentFrameIndex = i;
  currentFrame = frames[i];
  notifyCubeDataChanged();
}

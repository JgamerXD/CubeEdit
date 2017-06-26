
$(document).ready(function() {

  cubeInitCallbacks.push(setupEditRanges);
  cubeInitCallbacks.push(() => {createXYEditor("#editXY");});
  cubeInitCallbacks.push(() => {createXZEditor("#editXZ");});
  cubeInitCallbacks.push(() => {createYZEditor("#editYZ");});

  initCube(4,4,4);
  createTable(16,"#palette",4);

  dataChangedCallbacks.push(updateEditbuttonColors);
  editIndexChangedCallbacks.push(updateEditbuttonColors);
	startGL();
})


function setupEditRanges() {
  var range;
  range = $("#XEIRange")[0]
  range.max = sizeX-1;
  range.vaue = "0"
  range.onchange()

  range = $("#YEIRange")[0]
  range.max = sizeY-1;
  range.vaue = "0"
  range.onchange()

  range = $("#ZEIRange")[0]
  range.max = sizeZ-1;
  range.vaue = "0"
  range.onchange()
}


// DEBUG

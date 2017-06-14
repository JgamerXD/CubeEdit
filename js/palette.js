var elements;

function createTable(numColors, table, colorsPerRow = 3) {
  var t = $(table)
  console.log(t)
  t.empty()
  // currentEditColorPrim = 0
  for (var i = 0; i < numColors; i++) {
    var d = $("<div>");
    ddom = d[0];
    ddom.className = "pickcolor";
    ddom.innerHTML = i;
    //ddom.style.width = 90.0/colorsPerRow+"%";
    ddom.onclick = function() {chooseColor(this);};
    ddom.colorPaletteIndex = i;
    setColor(ddom);
    // ddom.bgColor = cubeColormap[paletteIndex];
    // console.log(ddom);
    //console.log(d);
    t.append(d);


  }
  chooseColor({colorPaletteIndex:0});
  $("#currentColor").on("input",changeColor);
}

function changeColor() {
  var cString = $("#currentColor").val();
  // console.log(parseInt(cString.substring(1,7),16))
  cubeColormap[currentEditColorPrim] = parseInt(cString.substring(1,7),16);
  updateCmapButtonColors();
  notifyCubeDataChanged();
}

function setColor(e) {
  var col = "#" + ((0x1000000+cubeColormap[e.colorPaletteIndex]).toString(16)).slice(1,7);
  e.style.backgroundColor = col;
}

function updateCmapButtonColors() {
  var buttons = $(".pickcolor")
  for (var i = 0; i < buttons.length; i++) {
    setColor(buttons[i]);
  }
}


function chooseColor(e) {
  currentEditColorPrim = e.colorPaletteIndex;
  var col = "#" + ((0x1000000+cubeColormap[currentEditColorPrim]).toString(16)).slice(1,7);
  $("#currentColor")[0].value = col;
}

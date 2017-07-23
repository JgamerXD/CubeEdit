var elements;

function createTable(table, colorsPerRow = 3) {
  var t = $(table)
  console.log(t)
  t.empty()
  // currentEditColorPrim = 0
  for (var i = 0; i < cmapsize; i++) {
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
  currentColormap[currentEditColorPrim] = parseInt(cString.substring(1,7),16);
  notifyCubeDataChanged();
}

function setColor(e) {
  var col = "#" + ((0x1000000+currentColormap[e.colorPaletteIndex]).toString(16)).slice(1,7);
  e.style.backgroundColor = col;
}

function setPickerColor() {
  var col = "#" + ((0x1000000+currentColormap[currentEditColorPrim]).toString(16)).slice(1,7);
  cp = $("#currentColor")[0]
  // if (cp.value != col)
    cp.value = col;
}

function updateCmapButtonColors() {
  var buttons = $(".pickcolor")
  for (var i = 0; i < buttons.length; i++) {
    setColor(buttons[i]);
  }
  setPickerColor();
}


function chooseColor(e) {
  currentEditColorPrim = e.colorPaletteIndex;
  setPickerColor();
}

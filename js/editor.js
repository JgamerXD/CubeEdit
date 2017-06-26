function createXYEditor(elem) {
  var t = $(elem)
  // console.log(t)
  t.empty()
  maxdim=Math.max(sizeX,sizeY,sizeZ);
  for (var y = sizeY-1; y >= 0; y--) { //Inverted because of top->bottom y-Axis
    var r = $("<div class='editorrow'>")
    for (var x = 0; x < sizeX; x++) {
      var d = $("<div>");
      ddom = d[0];
      ddom.className = "editbtn square";
      ddom.style= "width:"+100.0/maxdim+"%;";
      // ddom.innerHTML = x + "-" + y;
      ddom.indexX = x;
      ddom.indexY = y;
      ddom.cubePos = function() {return [this.indexX,this.indexY,editIndexZ]};
      ddom.onclick = function() {setCubeColor(this);};
      setEditColor(ddom);
      r.append(d);
    }
    t.append(r);
  }
}

function createXZEditor(elem) {
  var t = $(elem)
  // console.log(t)
  t.empty()
  maxdim=Math.max(sizeX,sizeY,sizeZ);
  for (var z = 0; z < sizeZ; z++) {
    var r = $("<div class='editorrow'>")
    for (var x = 0; x < sizeX; x++) {
      var d = $("<div>");
      ddom = d[0];
      ddom.className = "editbtn square";
      ddom.style= "width:"+100.0/maxdim+"%;";
      // ddom.innerHTML = x + "-" + z;
      ddom.indexX = x;
      ddom.indexZ = z;
      ddom.cubePos = function() {return [this.indexX,editIndexY,this.indexZ]};
      ddom.onclick = function() {setCubeColor(this);};
      setEditColor(ddom);
      r.append(d);
    }
    t.append(r);
  }
}

function createYZEditor(elem) {
  var t = $(elem)
  // console.log(t)
  t.empty()
  maxdim=Math.max(sizeX,sizeY,sizeZ);
  for (var y = sizeY-1; y >= 0; y--) {
    var r = $("<div class='editorrow'>")
    for (var z = 0; z < sizeZ; z++) {
      var d = $("<div>");
      ddom = d[0];
      ddom.className = "editbtn square";
      ddom.style= "width:"+100.0/maxdim+"%;";
      // ddom.innerHTML = y + "-" + z;
      ddom.indexY = y;
      ddom.indexZ = z;
      ddom.cubePos = function() {return [editIndexX,this.indexY,this.indexZ]};
      ddom.onclick = function() {setCubeColor(this);};
      setEditColor(ddom);
      r.append(d);
    }
    t.append(r);
  }
}


function setEditColor(e) {
  // console.log(getIndex.apply(this,e.cubePos()));
  var col = ((0x1000000+cubeColormap[currentFrame[getIndex.apply(this,e.cubePos())]]).toString(16) + " ").slice(1,-1);
  e.style.backgroundColor = '#'+col;
}

function updateEditbuttonColors() {
  var buttons = $(".editbtn")
  for (var i = 0; i < buttons.length; i++) {
    setEditColor(buttons[i]);
  }
}

function setCubeColor(e) {
  currentFrame[getIndex(... e.cubePos())] = currentEditColorPrim;
  notifyCubeDataChanged();
}

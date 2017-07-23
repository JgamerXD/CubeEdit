function imported(data) {
  console.log(data);
  if(data.size) {
    if(data.size[0] != sizeX || data.size[1] != sizeY || data.size[2] != sizeZ)
      initCube.apply(this,data.size)
  }

  if(data.frames) {
    frames = data.frames;
    currentFrame = frames[0];
  }

  if(data.colormaps) {
    console.log(colormaps);
    colormaps = data.colormaps.maps;
    cmapsize = data.colormaps.size;
    currentCmapIndex = 0;
    currentColormap = colormaps[currentCmapIndex];
    createTable("#palette",4);
    console.log(colormaps);
  }

  notifyCubeDataChanged();
  $("#loadmodal").hide();
}

function importfile() {
  file = $("#loadfile")[0].files[0];
  // console.log(file);
  extension = file.name.split('.').pop();
  switch (extension) {
    case "json":
    console.log("loading .json");
    importJSON(file,imported);
    break;
    default:
    alert("File format not supported");
  }
}

function exportfile() {
  var file;
  switch ($('input[name="fileformat"]:checked').val()) {
    case "json":
      file = exportJSON();
      break;
    case "cua":
      file = exportCUA();
      // console.log("CUA");
      break;
    default:
      alert("ERROR: No or invalid file format selected!")
  }

  var fname = $("#filename").val();
  if (!fname.endsWith(file.extension))
    fname =  fname+file.extension;

  download(file.data,fname,file.type);

  $("#savemodal").hide()
}

function importJSON(file, onLoaded) {
  var reader = new FileReader();
  reader.onload = (e) => {
    data = {}
    console.log("reading...");
    // console.log(e.target.result);
    obj = JSON.parse(e.target.result);
    // console.log(obj);
    onLoaded(obj);
  }
  reader.readAsText(file);
  console.log("started loading");
}

function exportJSON() {
  var result = {};
  result.data = JSON.stringify({size:[sizeX,sizeY,sizeZ],
    frames:Array.from(frames),colormaps:{size:cmapsize,maps:colormaps}});
  result.extension = ".json";
  result.type = "application/json";
  return result;
}


function exportCUA() {
  var data = [];
  data.push(1); //version
  data.push(sizeX,sizeY,sizeZ);
  data.push(5); //update rate TODO: input field

  cmapbitsize = Math.ceil(Math.log2(cmapsize))
  console.log(cmapbitsize);
  if(cmapbitsize <=0 || cmapbitsize > 8) {
    throw "Error while creating .cua export: \nInvalid colormap size: has to be between 2 and 256"
  }

  data.push(cmapbitsize); //colormap size in bits (1..8)
  data.push(colormaps.length); //number of colormaps

  var cmapmask = 0xff >> cmapbitsize;
  for (var i = 0; i < colormaps.length; i++) {
    for (var j = 0; j < 2**cmapbitsize; j++) {
      if (j < colormaps[i].length) {
        data.push((colormaps[i][j]&0xff0000)>>16,(colormaps[i][j]&0x00ff00)>>8,colormaps[i][j]&0x0000ff);
      } else {
        data.push(0,0,0); //fill unused colors
      }
    }
  }

  data.push((frames.length & 0xff00)>>8, frames.length & 0x00ff) //number of frames


  var currentbyte = 0;
  var currentbit = 0;
  console.log(frames);
  for (var i = 0; i < frames.length; i++) {
    for (var j = 0; j < frames[i].length; j++) {
      currentbyte = currentbyte | (frames[i][j] & cmapmask)<<8-currentbit-cmapbitsize;
      currentbit = currentbit + cmapbitsize;
      if (currentbit >= 8) { //Byte full
        // console.log("byte");
        data.push(currentbyte);
        currentbyte = 0;
        currentbit = 0;
      }

    }
    if(currentbyte != 0) {
      data.push(currentbyte);
      currentbyte = 0;
      currentbit = 0;
    }
  }
  // console.log(data);

  var result = {};
  result.data = new Uint8Array(data);
  result.extension = ".cua";
  result.type = "application/octet-stream";
  return result;
}



// Function to download data to a file
function download(data, filename, type) {
  // return;
  var file = new Blob([data], {type: type});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
    var a = document.createElement("a"),
            url = URL.createObjectURL(file);
    if (typeof a.download != "undefined") {
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        }, 0);
    } else {
      if(type == "application/octet-stream"){
        data = btoa(String.fromCharCode.apply(null, data));
      }
      $("#utildiv").html(String(data));
      $("#utilmodal").show();
    }
  }
}

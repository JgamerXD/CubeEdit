function imported(data) {
  if(data.size) {
    if(data.size[0] != sizeX || data.size[1] != sizeY || data.size[2] != sizeZ)
      initCube.apply(this,data.size)
  }

  if(data.frames) {
    frames = data.frames;
    lf(0);
  }

  if(data.cmap) {
    console.log(cubeColormap);
    cubeColormap = data.cmap;
    createTable(data.cmap.length,"#palette",4);
    console.log(cubeColormap);
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
    frames:Array.from(frames),cmap:cubeColormap});
  result.extension = ".json";
  result.type = "application/json";
  return result;
}


function exportCUA() {
  var data = [];
  data.push(1); //version
  data.push(sizeX,sizeY,sizeZ);
  data.push(5); //update rate TODO: input field

  var cmapsize = 4;
  data.push(cmapsize); //colormap size in bits (1|2|4|8)
  data.push(1); //number of colormaps TODO: implement multiple colormaps

  var cmapmask = 0xff >> cmapsize;

  for (var i = 0; i < cubeColormap.length; i++) {
    data.push((cubeColormap[i]&0xff0000)>>16,(cubeColormap[i]&0x00ff00)>>8,cubeColormap[i]&0x0000ff);
  }

  data.push((frames.length & 0xff00)>>8, frames.length & 0x00ff) //number of frames


  var currentbyte = 0;
  var currentbit = 0;
  console.log(frames);
  for (var i = 0; i < frames.length; i++) {
    for (var j = 0; j < frames[i].length; j++) {
      currentbyte = currentbyte | (frames[i][j] & cmapmask)<<8-currentbit-cmapsize;
      currentbit = currentbit + cmapsize;
      if (currentbit >= 8) { //Byte full
        console.log("byte");
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

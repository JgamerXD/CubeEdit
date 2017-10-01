
var defaultColormaps = {
  2:[
    0x000000,0xffffff
  ],
  4:[
    0x000000,0xff0000,
    0x00ff00,0x0000ff
  ],
  16:[
    0x000000,0x001290,0x008F15,0x009092,
    0x9B1708,0x9A2091,0x949119,0xB8B8B8,
    0x686868,0x0027FB,0x00F92C,0x00FCFE,
    0xFF3016,0xFF3FFC,0xFFFD33,0xFFFFFF
  ]};


export function newCube(sx,sy,sz,scmap = 16) {
  let cube = {
    size:{},
    frames:{
      byId:{},
      all:[],
      lastId:0
    },
    colormaps:{
      byId:{},
      all:[],
      lastId:0
    },
    edit:{
      x:0,
      y:0,
      z:0,
      primaryColor:1,
      secondaryColor:0,
      currentColormap:0,
      currentFrame:0
    }
  };

  cube.size.x = sx;
  cube.size.y = sy;
  cube.size.z = sz;

  let fr = newFrame(getSize(cube.size));
  fr.id=0;
  cube.frames.byId[fr.id] = fr;
  cube.frames.all[0]=fr.id;

  cube.cmapsize = scmap;
  let cm = newColormap(scmap);
  cm.id=0;
  cube.colormaps.byId[cm.id]=cm;
  cube.colormaps.all[0]=cm.id;
  return cube;
}

export function normalize(cube){
  let ecube = {
    size:{x:cube.size[0],y:cube.size[1],z:cube.size[1]},
    frames:{
      byId:{},
      all:[],
      lastId:0
    },
    cmapsize:cube.cmapsize,
    colormaps:{
      byId:{},
      all:[],
      lastId:0
    },
    edit:{
      x:0,
      y:0,
      z:0,
      primaryColor:1,
      secondaryColor:0,
      currentColormap:0,
      currentFrame:0
    }
  };


  //frames
  for (let i = 0; i < cube.frames.length; i++) {
    let fr = {id:i,data:cube.frames[i]};
    ecube.frames.byId[i]=fr;
    ecube.frames.all.push(i);
    ecube.frames.lastId=i;
  }
  //colormaps
  for (let i = 0; i < cube.colormaps.length; i++) {
    let cm = {id:i,data:cube.colormaps[i]};
    ecube.colormaps.byId[i]=cm;
    ecube.colormaps.all.push(i);
    ecube.colormaps.lastId=i;
  }
  return ecube;
}

export function denormalize(ecube) {
  return {
    size:[ecube.size.x,ecube.size.y,ecube.size.z],
    cmapsize:ecube.cmapsize,
    colormaps:ecube.colormaps.all.map( id => ecube.colormaps.byId[id].data),
    frames:ecube.frames.all.map( id => ecube.frames.byId[id].data)
  }

}

export function getIndex(size,x,y,z) {
  return x + size.x*z + size.z*size.x*y; //Swapped y and z to match Hardware TODO: make option
}

export function getSize(size) {
  return size.x*size.y*size.z;
}

function filter(obj,condition) {
  let newObj = {};
  for (var variable in obj) {
    if (obj.hasOwnProperty(variable)) {
      if(condition(obj[variable]))
        newObj[variable]=obj[variable]
    }
  }
  return newObj;
}

function nextFrameId(cube) {
  return cube.frames.lastId+1;
}

function nextCmapId(cube) {
  return cube.colormaps.lastId+1;
}

export function clearFrame(cube,frameId) {
  return {
    ...cube,
    frames:{
      ...cube.frames,
      byId:{
        ...cube.frames.byId,
        [frameId]:{
          ...cube.frames.byId[frameId],
          data:new Array(getSize(cube.size)).fill(0)
        }
      }
    }
  };
}

export function fillFrame(cube,frameId,color) {
  return {
    ...cube,
    frames:{
      ...cube.frames,
      [frameId]:{
        ...cube.frames[frameId],data:new Array(getSize(cube.size)).fill(color)
      }
    }
  };
}

export function cutFrame(cube,frameId) {
  let frames = {
    ...cube.frames,
    byId:filter(cube.frames.byId,e => e.id !== frameId),
    all:cube.frames.all.filter(e => e !== frameId),
  }

  if(frames.all.length === 0) {
    return insertNewFrame({...cube,frames:frames},0)
  }

  return {...cube,frames:frames}; //vielleicht Problem: alter Frame bleibt ?????
}

export function insertNewFrame(cube,index) {
  let nf = newFrame(getSize(cube.size));

  nf.id = nextFrameId(cube);

  let all = cube.frames.all.slice();
  all.splice(index,0,nf.id)

  return {
    ...cube,
    frames:{
      byId:{...cube.frames.byId,[nf.id]:nf},
      all:all,
      lastId:nf.id
    }
  };
}

export function duplicateFrame(cube,frameId) {
  let dup = copyFrame(cube,frameId);
  dup.id = nextFrameId(cube);
  let index = cube.frames.all.indexOf(frameId)+1;

  let all = cube.frames.all.slice();
  all.splice(index,0,dup.id)

  return {
    ...cube,
    frames:{
      byId: {
        ...cube.frames.byId,
        [dup.id]:dup
      },
      all:all,
      lastId:dup.id
    }
  };
}

export function newFrame(size,cms) {
  return {
    data:([... new Array(size)].map(() => {
      return Math.floor(Math.random()*16);
    }))
  }
}
// export function newFrame(size) {
//   return {
//     data:(new Array(size)).fill(0)
//   }
// }

export function copyFrame(cube,frameId) {
  return {data:Array.from(cube.frames.byId[frameId].data)};
}

export function setFrame(cube,frameId,frame){
  return {
    ...cube,
    frames:{
      ...cube.frames,
      byId:{
        ...cube.frames.byId,
        [frameId]:{
          ...cube.frames.byId[frameId],
          data:Array.from(frame)
        }
      }
    }
  };
}


export function moveFrame(cube) {
  return cube
}

export function newColormap(size) {
  return {data:getDefaultColormapData(size)};
}

export function copyColormap(cube,cmapeId) {
  return Array.from(cube.colormaps.byId[cmapeId].data);
}

export function emptyColormapData(size) {
  return (new Array(size)).fill(0x000000);
}

export function getDefaultColormapData(size)
{
  if(defaultColormaps[size] !== undefined) {
    return Array.from(defaultColormaps[size]);
  } else {
    return emptyColormapData(size);
  }
}

export function clearColormap(cube,cmapid) { //reset to default?
  return {
    ...cube,colormaps:{...cube.colormaps,byId:{...cube.colormaps.byId,[cmapid]:{...cube.colormaps.byId[cmapid],data:new Array(cube.cmapsize).fill(0x000000)}}}};
}

export function cutColormap(cube,cmapId) {
  let cmaps = {
    ...cube.colormaps,
    byId:filter(cube.colormaps.byId,e => e.id !== cmapId),
    all:cube.colormaps.all.filter(e => e !== cmapId)
  }
  if(cmaps.all.length === 0) {
    return insertNewColormap({...cube,colormaps:cmaps},0)
  }

  return {...cube,colormaps:cmaps};
}

export function insertNewColormap(cube,index) { //after instead of index?
  var ncm = newColormap(cube.cmapsize);
  ncm.id = nextCmapId(cube);

  let all = cube.colormaps.all.slice();
  all.splice(index,0,ncm.id)

  return {
    ...cube,
    colormaps:{
      byId:{...cube.colormaps.byId,[ncm.id]:ncm},
      all:all,
      lastId:ncm.id
    }
  };
}

export function duplicateColormap(cube,cmapId) {
  let dup = copyColormap(cmapId);
  dup.id = cmapId(cube);
  let index = cube.colormaps.all.indexOf(cmapId);

  let all = cube.colormaps.all.slice();
  all.splice(index,0,dup.id)

  return {...cube,
    colormaps:{
      byId: {
        ...cube.colormaps.byId,
        [dup.id]:dup
      },
      all:all,
      lastId:dup.id
    }
  };
}

export function moveColormap(cube) {
  return cube
}

export function setColormap(cube,cmapId,colormap)
{
  return {
    ...cube,
    colormaps:{
      ...cube.colormaps,
      byId:{
        ...cube.colormaps.byId,
        [cmapId]:{
          ...cube.colormaps.byId[cmapId],
          data:Array.from(colormap)
        }
      }
    }
  };
}

export function setEditIndexX(cube,newX) {
  return {...cube,edit:{...cube.edit,x:newX}}
}
export function setEditIndexY(cube,newY) {
  return {...cube,edit:{...cube.edit,y:newY}}
}
export function setEditIndexZ(cube,newZ) {
  return {...cube,edit:{...cube.edit,z:newZ}}
}
export function setPrimaryColor(cube,color) {
  return {...cube,edit:{...cube.edit,primaryColor:color}}
}
export function setSecondaryColor(cube,color) {
  return {...cube,edit:{...cube.edit,secondaryColor:color}}
}

export function setFrameIndex(cube,newFrame) {
  return {...cube,edit:{...cube.edit,currentFrame:newFrame}}
}
export function setColormapIndex(cube,newColormap) {
  return {...cube,edit:{...cube.edit,currentColormap:newColormap}}
}

//selectors


export function getCurrentFrameId(cube) {
  return cube.frames.all[cube.edit.currentFrame];
}

export function getCurrentFrame(cube) {
  return cube.frames.byId[cube.frames.all[cube.edit.currentFrame]];
}

export function getFrame(cube,id) {
  return cube.frames.byId[id];
}

export function getFrameId(cube,index) {
  return cube.frames.all[index];
}
export function getFrameIndex(cube,id) {
  return cube.frames.all.indexOf(id);
}

export function numberOfFrames(cube) {
  return cube.frames.all.length;
}

export function getNextFrame(cube) {
  if (cube.edit.currentFrame < numberOfFrames(cube)-1)
  return cube.edit.currentFrame + 1;
  else return undefined;
}
export function getPreviousFrame(cube) {
  if (cube.edit.currentFrame > 0)
  return cube.edit.currentFrame - 1;
  else return undefined;
}

export function getFallbackFrame(cube) {
  if (getPreviousFrame(cube))
    return getPreviousFrame(cube);
  else if (getNextFrame(cube))
    return getNextFrame(cube);
  else
    return undefined;
}


export function getCurrentColormapId(cube) {
  return cube.colormaps.all[cube.edit.currentColormap];
}

export function getCurrentColormap(cube) {
  return cube.colormaps.byId[cube.colormaps.all[cube.edit.currentColormap]];
}

export function getColormap(cube,id) {
  return cube.colormaps.byId[id];
}

export function getColormapId(cube,index) {
  return cube.colormaps.all[index];
}
export function getColormapIndex(cube,id) {
  return cube.colormaps.all.indexOf(id);
}

export function numberOfColormaps(cube) {
  return cube.colormaps.all.lenght;
}

export function getNextColormap(cube) {
  if (cube.edit.currentColormap < numberOfColormaps(cube)-1)
  return cube.edit.currentColormap + 1;
  else return undefined;
}
export function getPreviousColormap(cube) {
  if (cube.edit.currentColormap > 0)
  return cube.edit.currentCmap - 1;
  else return undefined;
}

export function getFallbackColormap(cube) {
  if (getPreviousColormap(cube))
    return getPreviousColormap(cube);
  else if (getNextColormap(cube))
    return getNextColormap(cube);
  else
    return undefined;
}

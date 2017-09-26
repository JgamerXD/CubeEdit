import * as Cube from './cube.js'
import * as types from './types.js'




export function newCube(sx,sy,sz,cmsize) {
  return {
    type:types.EDITCUBE_NEW_CUBE,
    payload:Cube.newCube(sx,sy,sz,cmsize)
  };
}
export function loadCube(cube) {
  return {
    type:types.EDITCUBE_LOAD_CUBE,
    payload: {
      cube
    }
  };
}
// export function saveCube(format,name) {
//
// }
export function newFrame(index) {
  return {
    type:types.EDITCUBE_NEW_FRAME,
    payload:index
  };
}
export function setFrame(id,frame) {
  return {
    type:types.EDITCUBE_SET_FRAME,
    payload:{
      id:id,
      frame:frame
    }
  };
}
export function cutFrame(id) {
  return {
    type:types.EDITCUBE_CUT_FRAME,
    payload:id
  };
}
export function moveFrame(id,toIndex) {
  return {
    type:types.EDITCUBE_MOVE_FRAME,
    payload:{
      id:id,
      toIndex:toIndex
    }
  };
}
export function duplicateFrame(id) {
  return {
    type:types.EDITCUBE_DUPLICATE_FRAME,
    payload:id
  };
}
export function clearFrame(id) {
  return {
    type:types.EDITCUBE_CLEAR_FRAME,
    payload:id
  };
}



export function newColormap(index) {
  return {
    type:types.EDITCUBE_NEW_COLORMAP,
    payload:index
  };

}
export function setColormap(id,colormap) {
  return {
    type:types.EDITCUBE_SET_COLORMAP,
    payload: {
      id:id,
    colormap:colormap}
  };
}
export function cutColormap(id) {
  return {
    type:types.EDITCUBE_CUT_COLORMAP,
    payload:id
  };
}
export function moveColormap(id,toIndex) {
  return {
    type:types.EDITCUBE_MOVE_COLORMAP,
    payload: {
      id:id,
      toIndex:toIndex
    }
  };
}
export function duplicateColormap(id) {
  return {
    type:types.EDITCUBE_DUPLICATE_COLORMAP,
    payload:id
  };
}
export function clearColormap(id) {
  return {
    type:types.EDITCUBE_CLEAR_COLORMAP,
    payload:id
  };
}


export function draw(x,y,z,color) {
  return {
    type:types.EDITCUBE_DRAW,
    payload:{
      x:x,y:y,z:z,
      color:color
    }
  };
}

export function drawShape(shape,...args) {
  return {
    type:types.EDITCUBE_DRAW_SHAPE,
    payload:{
      shape:shape,
      args:args
    }
  };
}



export function setEditIndexX(index) {
  return {
    type:types.EDITCUBE_SET_INDEX_X,
    payload:index
  };
}
export function setEditIndexY(index) {
  return {
    type:types.EDITCUBE_SET_INDEX_Y,
    payload:index
  };
}
export function setEditIndexZ(index) {
  return {
    type:types.EDITCUBE_SET_INDEX_Z,
    payload:index
  };
}
export function setPrimaryColor(color) {
  return {
    type:types.EDITCUBE_SET_PRIMARY_COLOR,
    payload:color
  };
}
export function setSecondaryColor(color) {
  return {
    type:types.EDITCUBE_SET_SECONDARY_COLOR,
    payload:color
  };
}

export function setEditFrameIndex(index) {
  return {
    type:types.EDITCUBE_SET_FRAME_INDEX,
    payload:index
  };
}
export function setEditColormapIndex(index) {
  return {
    type:types.EDITCUBE_SET_COLORMAP_INDEX,
    payload:index
  };
}

import * as actions from './actions';
import * as selectors from './selectors';
import * as Cube from './cube'

export const newCube = actions.newCube;
export const loadCube = actions.loadCube;

export const newFrame = actions.newFrame;
export const setFrame = actions.setFrame;
export const cutFrame = (id) => (dispatch,getState) => {
  let state = getState();
  if (selectors.getCurrentFrameId(state) === id) {
      dispatch(actions.setEditFrameIndex(selectors.getFallbackFrame(state)));
  }
  dispatch(actions.cutFrame(id));
}
export const moveFrame = actions.moveFrame;
export const duplicateFrame = actions.duplicateFrame;
export const clearFrame = actions.clearFrame;

export const newColormap = actions.newColormap;
export const setColormap = actions.setColormap;
export const setCurrentColormapColor = (index,color) => (dispatch,getState) => {
  let state=getState();
  let nc = selectors.getCurrentColormap(state).data.slice();
  nc[index]=color;
  // console.log(actions.setColormap(selectors.getCurrentColormapId(state),nc));
  dispatch(actions.setColormap(selectors.getCurrentColormapId(state),nc));
}
export const cutColormap = (id) => (dispatch,getState) => {
  let state = getState();
  if (selectors.getCurrentColormapId(state) === id) {
      dispatch(actions.setEditColormapIndex(selectors.getFallbackColormap(state)));
  }
  dispatch(actions.cutColormap(id));
}
export const moveColormap = actions.moveColormap;
export const duplicateColormap = actions.duplicateColormap;
export const clearColormap = actions.clearColormap;

export const draw = actions.draw;
export function drawWithPrimaryColor(x,y,z) {
  return (dispatch,getState) => {
    let state = getState();
    dispatch(actions.draw(x,y,z,selectors.getPrimaryEditColor(state)));
  };
}
export function drawWithSecondaryColor(x,y,z) {
  return (dispatch,getState) => {
    let state = getState();
    dispatch(actions.draw(x,y,z,selectors.getSecondaryEditColor(state)));
  };
}
export const drawShape = actions.drawShape;

export const setEditIndexX = actions.setEditIndexX;
export const setEditIndexY = actions.setEditIndexY;
export const setEditIndexZ = actions.setEditIndexZ;
export const setPrimaryColor = actions.setPrimaryColor;
export const setSecondaryColor = actions.setSecondaryColor;
export const setEditFrameIndex = actions.setEditFrameIndex;
export const setEditColormapIndex = actions.setEditColormapIndex;

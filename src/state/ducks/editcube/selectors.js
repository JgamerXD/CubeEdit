import * as Cube from './cube';


export const getSize = state => state.editcube.size;


export const getEditIndexX = state => state.editcube.edit.x;
export const getEditIndexY = state => state.editcube.edit.y;
export const getEditIndexZ = state => state.editcube.edit.z;
export const getPrimaryEditColor = state => state.editcube.edit.primaryColor;
export const getSecondaryEditColor = state => state.editcube.edit.secondaryColor;

export function getCurrentFrameId(state) {
	return Cube.getCurrentFrameId(state.editcube);
}

export function getCurrentFrame(state) {
	return Cube.getCurrentFrame(state.editcube);
}
export const getCurrentFrameIndex = state => state.editcube.edit.currentFrame;

export function getFrame(state,id) {
	return Cube.getFrame(state.editcube,id);
}

export function getFrameId(state,index) {
	return Cube.getFrameId(state.editcube,index);
}
export function getFrameIndex(state,id) {
	return Cube.getFrameIndex(state.editcube,id);
}

export function numberOfFrames(state) {
	return Cube.numberOfFrames(state.editcube);
}

export function getNextFrame(state) {
	return Cube.getNextFrame(state.editcube);
}
export function getPreviousFrame(state) {
	return Cube.getPreviousFrame(state.editcube);
}

export function getFallbackFrame(state) {
	return Cube.getFallbackFrame(state.editcube);
}


export function getCurrentColormapId(state) {
	return Cube.getCurrentColormapId(state.editcube);
}

export function getCurrentColormap(state) {
	return Cube.getCurrentColormap(state.editcube);
}

export const getCurrentColormapIndex = state => state.editcube.edit.currentColormap;


export function getColormap(state,id) {
	return Cube.getColormap(state.editcube,id);
}

export function getColormapId(state,index) {
	return Cube.getColormapId(state.editcube,index);
}
export function getColormapIndex(state,id) {
	return Cube.getColormapIndex(state.editcube,id);
}

export function numberOfColormaps(state) {
	return Cube.numberOfColormaps(state.editcube);
}

export function getNextColormap(state) {
	return Cube.getNextColormap(state.editcube);
}
export function getPreviousColormap(state) {
	return Cube.getPreviousColormap(state.editcube);
}

export function getFallbackColormap(state) {
	return Cube.getFallbackColormap(state.editcube);
}

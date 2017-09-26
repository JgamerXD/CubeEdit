import React from 'react';
import {connect} from 'react-redux';
import * as cube from 'state/ducks/editcube/';
import {FrameControlButtons,ButtonSlider} from './gui';




const FrameControlComponent = props => {
  return <div className="container bordered">
    <ButtonSlider
      name  = "Frame"
      min   = "0"
      value = {props.currentFrameIndex}
      max   = {props.numberOfFrames-1}
      onValueChange = {props.setCurrent} />
    <FrameControlButtons
      add       = {e => props.add(e,props.currentFrameIndex)}
      reset     = {e => props.reset(e,props.currentFrame)}
      cut       = {e => props.cut(e,props.currentFrame)}
      duplicate = {e => props.duplicate(e,props.currentFrame)}
      save      = {props.save}
      load      = {props.load} />
  </div>
}

const mapStateToProps = state => {
  // console.log(state);
  return {
    currentFrame:cube.selectors.getCurrentFrameId(state),
    currentFrameIndex:cube.selectors.getCurrentFrameIndex(state),
    numberOfFrames:cube.selectors.numberOfFrames(state)
  }
}


const mapDispatchToProps = (dispatch,ownProps) => {
  console.log(ownProps);
  return {
    setCurrent: frameIndex => {
      dispatch(cube.operations.setEditFrameIndex(frameIndex));
    },
    add: (e,frameIndex) => {
      dispatch(cube.operations.newFrame(frameIndex));
    },
    duplicate:( e,frameId) => {
      dispatch(cube.operations.duplicateFrame(frameId));
    },
    cut: (e,frameId) => {
      dispatch(cube.operations.cutFrame(frameId));
    },
    reset: (e,frameId) => {
      dispatch(cube.operations.clearFrame(frameId));
    },
    load: e => {
      console.log("load cube");
    },
    save: e => {
      console.log("save cube");
    },

  }
}

const FrameControl = connect(
  mapStateToProps,
  mapDispatchToProps
)(FrameControlComponent)

export default FrameControl;

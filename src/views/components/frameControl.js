import React from 'react';
import {connect} from 'react-redux';
import * as cube from 'state/ducks/editcube/';
import {FrameControlButtons,ButtonSlider} from './gui';




const FrameControlComponent = props => {
  return <div className="container bordered">
    <ButtonSlider
      name="Frame"
      min="0"
      value={props.currentFrameIndex}
      max={props.numberOfFrames-1}
      onValueChange={props.setCurrent} />
    <FrameControlButtons
      add={props.add}
      reset={props.reset}
      cut={props.cut}
      duplicate={props.duplicate}
      save={props.save}
      load={props.load} />
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
    setCurrent: i => {
      dispatch(cube.operations.setEditFrameIndex(i));
    },
    add: e => {
      dispatch(cube.operations.newFrame(ownProps.currentFrameIndex));
    },
    duplicate: e => {
      dispatch(cube.operations.duplicateFrame(ownProps.currentFrame));
    },
    cut: e => {
      dispatch(cube.operations.cutFrame(ownProps.currentFrame));
    },
    reset: e => {
      dispatch(cube.operations.clearFrame(ownProps.currentFrame));
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

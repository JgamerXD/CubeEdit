import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.css'
import '../css/style.css'
// import {get} from './getfile';


export function FrameControlButtons(props){
  return <div className="control">
    <BigButton title="delete frame" icon="fa fa-eraser" color="maroon" action={props.reset} />
    <BigButton title="cut frame" icon="fa fa-scissors" color="darkSlateGrey" action={props.cut} />
    <BigButton title="add frame" icon="fa fa-plus" color="darkOliveGreen" action={props.add} />
    <BigButton title="copy frame" icon="fa fa-copy" color="maroon" action={props.duplicate} />
    <BigButton title="save cube" icon="fa fa-save" color="darkBlue" action={props.save} />
    <BigButton title="load cube" icon="fa fa-file" color="darkGrey" action={props.load} />
  </div>

}
export function ColormapControlButtons(props){
    return <div className="control">
      <BigButton title="erase colormap" icon="fa fa-eraser" color="maroon" action={props.reset} />
      <BigButton title="cut colormap" icon="fa fa-scissors" color="darkSlateGrey" action={props.cut} />
      <BigButton title="add colormap" icon="fa fa-plus" color="darkOliveGreen" action={props.add} />
      <BigButton title="copy colormap" icon="fa fa-copy" color="maroon" action={props.duplicate} />
    </div>
}



export class BigButton extends React.Component {
  render() {
    const title = this.props.title;
    const icon = this.props.icon;
    const color = this.props.color;
    const action = this.props.action;

    let style = {color:color};

    return <button type="button" className={"bigbutton " + this.props.className} title={title} onClick={action}>
					<i className={icon} style={style}></i>
      </button>
  }
}
BigButton.defaultProps = {className:""};

export class ButtonSlider extends React.Component {
  constructor(props) {
    super(props);
    this.newValue = this.newValue.bind(this);
    this.incr = this.incr.bind(this);
    this.decr = this.decr.bind(this);
  }
  render() {
    const min = this.props.min,
    max = this.props.max,
    name = this.props.name,
    value = this.props.value;

    return <div className="buttonrange">
      <BigButton icon={this.props.decrIcon} color={this.props.color} className="buttonrange-less" action={this.decr} />
      <span className="buttonrange-label"> {name}: <input className="noSpinner" type="number" value={value} min="0" max={max} onChange={this.newValue} style={{width:"2em",textAlign:"right"}} /> /{max}</span>
      <input type="range" ref="slider" step="1" min={min} max={max} value={value} onChange={this.newValue} className="buttonrange-slider" />
      <BigButton icon={this.props.incrIcon} color={this.props.color} className="buttonrange-more" action={this.incr} />
    </div>
  }

  newValue(e) {
    this.props.onValueChange(Math.max(0,Math.min(this.props.max,Number(e.target.value))))
  }

  incr() {
    this.refs.slider.stepUp();
    this.props.onValueChange(Number(this.refs.slider.value));
  }

  decr() {
    this.refs.slider.stepDown();
    this.props.onValueChange(Number(this.refs.slider.value));
  }
}
ButtonSlider.defaultProps = {min:0,value:-1,max:10,decrIcon:"fa fa-minus", incrIcon:"fa fa-plus"}

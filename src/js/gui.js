import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.css'
import '../css/style.css'
// import {get} from './getfile';


export class FrameControl extends React.Component {
  render() {
    return <div className="control">
      <BigButton title="delete frame" icon="fa fa-eraser" color="maroon" action={console.log("erase frame")} />
      <BigButton title="cut frame" icon="fa fa-scissors" color="darkSlateGrey" action={console.log("cut frame")} />
      <BigButton title="add frame" icon="fa fa-plus" color="darkOliveGreen" action={console.log("add frame")} />
      <BigButton title="copy frame" icon="fa fa-copy" color="maroon" action={console.log("copy frame")} />
      <BigButton title="save cube" icon="fa fa-save" color="darkBlue" action={console.log("save cube")} />
      <BigButton title="load cube" icon="fa fa-file" color="darkGrey" action={console.log("load cube")} />
    </div>
  }
}
export class ColormapControl extends React.Component {
  render() {
    return <div className="control">
      <BigButton title="erase colormap" icon="fa fa-eraser" color="maroon" action={console.log("erase colormap")} />
      <BigButton title="cut colormap" icon="fa fa-scissors" color="darkSlateGrey" action={console.log("cut colormap")} />
      <BigButton title="add colormap" icon="fa fa-plus" color="darkOliveGreen" action={console.log("add colormap")} />
      <BigButton title="copy colormap" icon="fa fa-copy" color="maroon" action={console.log("copy colormap")} />
    </div>
  }
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

    this.state = {value:5};
    this.incr = this.incr.bind(this);
    this.decr = this.decr.bind(this);
    this.change = this.change.bind(this);
  }
  render() {
    const min = this.props.min,
    max = this.props.max,
    name = this.props.name,
    value = this.state.value;

    return <div className="buttonrange">
      <BigButton icon={this.props.decrIcon} className="buttonrange-less" action={this.decr} />
      <span className="buttonrange-label"> {name}: {value}/{max}</span>
      <input type="range" step="1" min={min} max={max} value={value} onChange={this.change} className="buttonrange-slider" />
      <BigButton icon={this.props.incrIcon} className="buttonrange-more" action={this.incr} />
    </div>
  }

  change(e) {
    this.setState({value:e.target.value});
  }

  incr() {
    this.setState((prev) => {return {...prev,value:Math.min((prev.value + 1),this.props.max)}});
  }

  decr() {
    this.setState((prev) => {return {...prev,value:Math.max((prev.value - 1),this.props.min)}});
  }
}
ButtonSlider.defaultProps = {min:0,max:10,decrIcon:"fa fa-minus", incrIcon:"fa fa-plus"}

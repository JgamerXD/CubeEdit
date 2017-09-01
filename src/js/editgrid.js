import React, { Component } from 'react';
// import * as Cube from './Cube.js';
import '../css/style.css';
export class Editgrid extends React.Component {
	constructor(props) {
		super(props);

  }

  render(){
    const width = this.props.width;
    const height = this.props.height;
    //TODO: generate from cube prop
    let maxdim = Math.max(width,height);
    let diffx = maxdim - width;
    let diffy = maxdim - height;
    let gridstyle = {
      display:'grid',
			// gridGap:"10px",
      gridTemplateColumns: fractions(maxdim,width),
      gridTemplateRows: fractions(maxdim,height),
			gridAutoFlow:"column",
			width:width/maxdim*100+"%",
			height:height/maxdim*100+"%"
    }
		console.log(gridstyle);
		let contstyle = {
			display:"flex",
			padding:"5px",
			border:"3px solid black",
			justifyContent:"center",
			alignItems:"center",
			boxSizing:"border-box",
		}
		let entries = [];
		for (var i = 0; i < width; i++) {
			for (var j = 0; j < height; j++) {
				entries.push(<Editgridentry x={i} y={j} z={0} key={i*height+j} />);
			}
		}

    return <div className="square">
			<div className="content" style={contstyle}>
				<div style={gridstyle}>{entries}</div>
			</div>
		</div>
  }
}

function fractions(max,value){
	return repeat(value,"1fr");


  if(max-value === 0) {
    return repeat(value,"1fr");
  }
  else if(max-value % 2 === 0) { //Even difference -> only whole fractions
    return fr("[empty]",(max-value)/2)
      + repeat(value,"1fr")
      + fr("[empty]",(max-value)/2)
  }
  else {
    return "[empty] 0.5fr "
      + fr("[empty]",(max-value-1)/2)
      + repeat(value,"1fr")
      + fr("[empty]",(max-value-1)/2)
      + "[empty] 0.5fr";
  }
}

function repeat(amount,content) {
  if(amount === 0) return "";
  else if (amount === 1) return content;
  else return "repeat("+ amount + "," + content +") ";
}

function fr(name,amount) {
	if(amount === 0) return "";
	else return name + " " + amount + "fr ";
}

export class Editgridentry extends React.Component {
	constructor(props) {
		super(props);
    this.oncubechange = this.props.oncubechange;
		this.md = this.md.bind(this);
  }

  md(e) {
		console.log(this.props.x,this.props.y,this.props.z);
    switch (e.button) {
      case 0: //leftclick
        // this.setColor(primaryColor);
        break;
      case 1: //middleclick
        // this.adoptColor(e.shiftKey);
        break;
      case 2://rightclick
        // this.setColor(secondaryColor);
        break;
      default:
    }
    e.preventDefault();
  }

  setColor(color) {
		//TODO: Set color
  }

  adoptColor(shift) {
		//TODO: set edit color
  }

  oncontextmenu(e) {
    e.preventDefault();
  }

  render(){
    const x = this.props.x, y = this.props.y, z = this.props.z;
    let entrystyle = {
			//TODO:from Cube
			margin:"5px",
      backgroundColor:"hsl("+((x*y*9)%360) + ",100%,50%)"
    }

    return <div className="square" onMouseDown={this.md} style={entrystyle}></div>
  }
}

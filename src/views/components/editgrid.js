import React from 'react';
import * as Cube from 'state/ducks/editcube/cube.js';
import {getHtmlColor} from 'utils'

import 'views/css/style.css';

export default class Editgrid extends React.Component {
	constructor(props) {
		super(props);
		this.entryMouseDownCallback = this.entryMouseDownCallback.bind(this);

  }

  render(){
    const width = this.props.width;
    const height = this.props.height;
    //TODO: generate from cube prop
    let maxdim = Math.max(width,height);

    let gridstyle = {
      display:'grid',
			// gridGap:"10px",
      gridTemplateColumns: fractions(maxdim,width),
      gridTemplateRows: fractions(maxdim,height),
			gridAutoFlow:"column",
			width:width/maxdim*100+"%",
			height:height/maxdim*100+"%"
    }
		// console.log(this.props);
		let contstyle = {
			display:"flex",
			padding:"3px",
			border:"10px solid " + this.props.color,
			justifyContent:"center",
			alignItems:"center",
			boxSizing:"border-box",
		}
		let entries = [];
		for (var i = 0; i < width; i++) {
			for (var j = 0; j < height; j++) {
				let pos = this.props.getPos(i,j)
				// console.log(this.props.colormap[this.props.frame[Cube.getIndex.apply(null,[this.props.frameSize],pos)]]);
				let col = getHtmlColor(this.props.colormap[this.props.frame[Cube.getIndex(this.props.frameSize,pos[0],pos[1],pos[2])]]);
				entries.push(<Editgridentry x={pos[0]} y={pos[1]} z={pos[2]} onMouseDownCallback={this.props.onMouseDownCallback} color={col} key={i*height+j} />);
			}
		}

    return <div className="square">
			<div className="content" style={contstyle}>
				<div style={gridstyle}>{entries}</div>
			</div>
		</div>
  }

	entryMouseDownCallback(e,x,y,z) {

		e.preventDefault();
	}

}

function fractions(max,value){
	return repeat(value,"1fr");


  // if(max-value === 0) {
  //   return repeat(value,"1fr");
  // }
  // else if(max-value % 2 === 0) { //Even difference -> only whole fractions
  //   return fr("[empty]",(max-value)/2)
  //     + repeat(value,"1fr")
  //     + fr("[empty]",(max-value)/2)
  // }
  // else {
  //   return "[empty] 0.5fr "
  //     + fr("[empty]",(max-value-1)/2)
  //     + repeat(value,"1fr")
  //     + fr("[empty]",(max-value-1)/2)
  //     + "[empty] 0.5fr";
  // }
}

function repeat(amount,content) {
  if(amount === 0) return "";
  else if (amount === 1) return content;
  else return "repeat("+ amount + "," + content +") ";
}

// function fr(name,amount) {
// 	if(amount === 0) return "";
// 	else return name + " " + amount + "fr ";
// }

export class Editgridentry extends React.Component {
	constructor(props) {
		super(props);
		this.onMouseDown = this.onMouseDown.bind(this);
	}
  oncontextmenu(e) {
    e.preventDefault();
  }
	onMouseDown(e){
		const x = this.props.x, y = this.props.y, z = this.props.z;
		this.props.onMouseDownCallback(e,x,y,z);
	}

  render(){
    const x = this.props.x, y = this.props.y, z = this.props.z;
    let entrystyle = {
			border:"1px solid black",
			margin:"5px",
      backgroundColor:this.props.color
    }


    return <div className="square" x={x} y={y} z={z} onMouseDown={this.onMouseDown} onContextMenu={this.oncontextmenu} style={entrystyle}></div>
  }
}

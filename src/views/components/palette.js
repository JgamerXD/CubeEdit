
import '../css/style.css'

import React, { Component } from 'react';
import {getHtmlColor} from 'utils'


export default class Palette extends React.Component {
	constructor(props) {
		super(props);
		this.clickCallback = this.clickCallback.bind(this);
  }

  render(){
		const colors = this.props.colors;
		// console.log(this.props);

		let colorsstyle = {
			display:"grid",
			gridGap:"5px",
      gridTemplateColumns:"repeat(auto-fill, minmax(50px,1fr)",
      overflow:"vertical"
		}

		let entries = [];
		for (var i = 0; i < colors.length; i++) {
				entries.push(<PaletteColorButton index={i} key={i} clickCallback={this.clickCallback} color={getHtmlColor(colors[i])} />);
		}

    return <div className="">
			<div className="colors" style={colorsstyle}>
				{entries}
			</div>
		</div>
  }
	clickCallback(e,index) {
		console.log(index,e.shiftKey)
		this.props.selectColor(e.shiftKey,index);
		e.preventDefault;
	}
}

export class PaletteColorButton extends React.Component {

  render(){
    const color = this.props.color; //from state?
    const index = this.props.index;

    let style = {
      backgroundColor:color,
      color:"white",
      border:"1px solid black",
      // mixBlendMode:"difference"
    }

    return <div className="square" onClick={e=>this.props.clickCallback(e,index)} style={style}><span className="contrast">{index}</span></div>
  }
}
PaletteColorButton.defaultProps = {
  color:"#FF00FF"
}

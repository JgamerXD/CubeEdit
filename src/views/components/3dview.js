import React from 'react';
import * as glm from 'gl-matrix'

import basic_fs 	from 'glsl/basic.fs'
import basic_vs 	from 'glsl/basic.vs'
import cubemap_vs from 'glsl/cubemap.vs'
import cubemap_fs from 'glsl/cubemap.fs'

import * as Cube from 'state/ducks/editcube/cube'

import cmfront from 'img/cubemaps/small/front.jpg'
import cmback from 'img/cubemaps/small/back.jpg'
import cmright from 'img/cubemaps/small/right.jpg'
import cmleft from 'img/cubemaps/small/left.jpg'
import cmtop from 'img/cubemaps/small/top.jpg'
import cmbottom from 'img/cubemaps/small/bottom.jpg'

// const vup = glm.vec3.fromValues(0.0,1.0,0.1);



export default class GL3DView extends React.Component {
	constructor(props) {
		super(props);


		this.basicShaderReady = false;
		this.skyboxReady = false;

		this.cubeDist = 5.0

		this.camera = {pos:glm.vec3.fromValues(0,0,0), dist:40, pitch:Math.PI/8, yaw:Math.PI*1/8};
		this.mvmStack = [];

		this.render = this.render.bind(this);
		this.startGL = this.startGL.bind(this);
		this.renderGL = this.renderGL.bind(this);
		this.setMatrixUniforms = this.setMatrixUniforms.bind(this);
		this.requestAnimation = function() {
			window.requestAnimationFrame(this.renderGL);
		}.bind(this)


		this.mouseDown = false;
		// this.translate = false;
		this.changeViewTouch = -1;

		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);

		this.handleMouseWheel = this.handleMouseWheel.bind(this);

		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);



	}

	render() {

		this.requestAnimation();
		return <canvas ref="canvas" className="glCanvas fill"></canvas>;
	}

	componentDidMount() {
		this.gl = this.startGL(this.refs.canvas);
		this.resize(this.refs.canvas);
		this.renderGL();
	}


	startGL(canvas) {
		//console.log($("#basic-fs")[0].type);

		this.calcInitialCameraPos(this.camera,this.props.size,this.cubeDist);

		var gl = initWebGL(canvas);

		this.initViewport(gl,canvas);
		this.initMatrices(canvas);
		// console.log(mvMatrix)
		//mat4.translate(mvMatrix,mvMatrix,[-1.0,1.0,-7.0]);
		this.cubeModel = createCube(gl);
		this.initBasicShader(gl).then(shader => {
			this.basicShader = shader;
			this.basicShaderReady = true;
			console.log("basic shader ready");
			window.requestAnimationFrame(this.renderGL);
		});


		this.skyboxCube = createSkybox(gl);
		// console.log("Cubemap" ,this.props.cubemap);
		Promise.all([loadCubeMap(this.props.cubemap,gl),this.initCubemapShader(gl)])
		.then(([cubemap,shader]) => {
			this.skyboxTexture = cubemap;
			this.cubemapShader = shader;
			this.skyboxReady = true;
			console.log("cubemap + shader ready");
			window.requestAnimationFrame(this.renderGL);
		})


		gl.clearColor(0.8,0.8,1.0,1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);






		canvas.addEventListener("wheel", this.handleMouseWheel);
		canvas.addEventListener("mousedown", this.handleMouseDown);
		document.addEventListener("mousemove", this.handleMouseMove);
		document.addEventListener("mouseup", this.handleMouseUp);

		canvas.addEventListener("touchstart", this.handleTouchStart);
		document.addEventListener("touchmove", this.handleTouchMove);
		document.addEventListener("touchend", this.handleTouchEnd);


		// canvas.onresize = function() {resize(gl.canvas)};
		window.addEventListener("resize", ()=>this.resize(this.gl.canvas));

		// console.log(canvas)
		return gl;
		//window.requestAnimationFrame(render, canvas);

		// $.ajaxSetup({
	  //     "error":function(obj,text,error) {alert("error while loading " + obj + ":  " + text + "\n" + error)}
		// });

		//alert("webgl!");

	}


	renderGL() {
		console.log("render");
		let gl = this.gl;
		// const axes = this.props.axes;
		const size = this.props.size;
		const frame = this.props.frame;
		const colormap = this.props.colormap;

		// this.resize(gl.canvas)
		gl.viewport(0,0,gl.canvas.width,gl.canvas.height);

		calcMVM(this.mvMatrix,this.camera);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		if(this.basicShaderReady) {

			gl.useProgram(this.basicShader);

			gl.bindBuffer(gl.ARRAY_BUFFER,this.cubeModel.buffer);
			gl.vertexAttribPointer(this.basicShader.vertexPositionAttribute,this.cubeModel.vertSize,gl.FLOAT,false,0,0);

			this.setMatrixUniforms(this.basicShader);

			gl.bindBuffer(gl.ARRAY_BUFFER,this.cubeModel.normals);
			gl.vertexAttribPointer(this.basicShader.vertexNormalAttribute,this.cubeModel.normSize,gl.FLOAT,false,0,0);

			//gl.drawArrays(gl.TRIANGLES, 0, 24);
			// console.log(size,frame,colormap);
			// TODO: Add support for other layouts
			for(let i=0;i<size.x;i++)
				for(let j=0;j<size.y;j++)
					for(let k=0;k<size.z;k++) {

						this.mvmStack.push(glm.mat4.clone(this.mvMatrix));
						glm.mat4.translate(this.mvMatrix,this.mvMatrix,[this.cubeDist*i,this.cubeDist*j,this.cubeDist*k]);

						// console.log(Cube.getIndex(size,i,j,k),frame[Cube.getIndex(size,i,j,k)],colorToRgba(colormap[frame[Cube.getIndex(size,i,j,k)]]));


						gl.uniformMatrix4fv(this.basicShader.mvMatrixUniform, false, this.mvMatrix);
						gl.uniform4fv(this.basicShader.meshColorUniform, colorToRgba(colormap[frame[Cube.getIndex(size,i,j,k)]]));


						// setMatrixUniforms(basicShaderProgram);

						gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.cubeModel.indices);
						gl.drawElements(this.cubeModel.primtype,this.cubeModel.nIndices,gl.UNSIGNED_SHORT,0);

						this.mvMatrix = this.mvmStack.pop();
					}
		}
		if(this.skyboxReady) {
			gl.useProgram(this.cubemapShader);

			this.setMatrixUniforms(this.cubemapShader);

			gl.bindBuffer(gl.ARRAY_BUFFER,this.skyboxCube.buffer);
			gl.vertexAttribPointer(this.cubemapShader.vertexPositionAttribute,this.skyboxCube.vertSize,gl.FLOAT,false,0,0);

			gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.skyboxTexture);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.skyboxCube.indices);
			gl.drawElements(this.skyboxCube.primtype,this.skyboxCube.nIndices,gl.UNSIGNED_SHORT,0);
		}
		// console.log("draw");
		//mat4.rotate(mvMatrix,mvMatrix,Math.PI/400,vup);

		// window.requestAnimationFrame(render);

	}

	initBasicShader(gl) {
		// console.log("shaders")
		return Promise.all([getShader(gl, basic_vs, gl.VERTEX_SHADER),getShader(gl, basic_fs,gl.FRAGMENT_SHADER)])
		.then(([basicvs,basicfs]) => {
			return new Promise((resolve,reject) => {
				var bsp = gl.createProgram();
				gl.attachShader(bsp, basicvs);
				gl.attachShader(bsp, basicfs);
				gl.linkProgram(bsp);

				if (!gl.getProgramParameter(bsp, gl.LINK_STATUS)) {
					throw new Error("Could not initialise baic shaders");
				}

				//gl.useProgram(bsp);



				bsp.vertexPositionAttribute = gl.getAttribLocation(bsp,"aVertexPos");
				gl.enableVertexAttribArray(bsp.vertexPositionAttribute);

				bsp.vertexNormalAttribute = gl.getAttribLocation(bsp,"aVertexNormal");
				gl.enableVertexAttribArray(bsp.vertexNormalAttribute)

				bsp.meshColorUniform = gl.getUniformLocation(bsp,"uColor");

				bsp.pMatrixUniform = gl.getUniformLocation(bsp,"uProjectionMatrix");
				bsp.mvMatrixUniform = gl.getUniformLocation(bsp,"uModelViewMatrix");

				// this.basicShader = bsp;
				resolve(bsp);
			})

		}).catch(e => {
			alert(e);
		})
	}

	initCubemapShader(gl) {
		return Promise.all([getShader(gl, cubemap_vs, gl.VERTEX_SHADER),getShader(gl, cubemap_fs,gl.FRAGMENT_SHADER)])
		.then(([cubevs,cubefs]) => {
			return new Promise((resolve,reject) => {
				// gl.useProgram(basicShaderProgram);

				let csp = gl.createProgram();
				gl.attachShader(csp, cubevs);
				gl.attachShader(csp, cubefs);
				gl.linkProgram(csp);

				if (!gl.getProgramParameter(csp, gl.LINK_STATUS)) {
					throw new Error("Could not initialise cubemap shaders");
				}

				//gl.useProgram(csp);

				csp.vertexPositionAttribute = gl.getAttribLocation(csp,"aVertexPos");
				gl.enableVertexAttribArray(csp.vertexPositionAttribute);

				csp.skyboxTexUniform = gl.getUniformLocation(csp,"uSkybox");
				csp.pMatrixUniform = gl.getUniformLocation(csp,"uProjectionMatrix");
				csp.mvMatrixUniform = gl.getUniformLocation(csp,"uModelViewMatrix");

				// this.cubemapShader = csp;
				resolve(csp);
			})
		}).catch(e => {
			alert(e);
		})
	}



	initViewport(gl, canvas) {
		gl.viewport(0, 0, canvas.width, canvas.height);
	}



	initMatrices(canvas) {
		// console.log("matricies")
		this.mvMatrix = glm.mat4.create();

		this.pMatrix = glm.mat4.create();
		glm.mat4.perspective(this.pMatrix, Math.PI / 4,
			canvas.width / canvas.height, 0.001, 2000);
	}



	setMatrixUniforms(shaderProgram) {
		this.gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, this.mvMatrix);
		this.gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, this.pMatrix);
	}

	resize(canvas) {
		// console.log("resize")
		var realToCSSPixels = window.devicePixelRatio;

	  // Lookup the size the browser is displaying the canvas in CSS pixels
	  // and compute a size needed to make our drawingbuffer match it in
	  // device pixels.
	  var displayWidth  = Math.floor(canvas.clientWidth  * realToCSSPixels);
	  var displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);

		// Check if the canvas is not the same size.
		if (canvas.width  !== displayWidth ||
				canvas.height !== displayHeight) {

			// Make the canvas the same size
			canvas.width  = displayWidth;
			canvas.height = displayHeight;
		}

		glm.mat4.perspective(this.pMatrix, Math.PI / 4,
			canvas.width / canvas.height, 0.001, 1000); //gl. ?


		// window.requestAnimationFrame(render, canvas);
		this.requestAnimation();
	}

	calcInitialCameraPos(camera,size,dist) {
		// const axes = this.props.axes;
		// const size = this.props.size;
		camera.pos = glm.vec3.fromValues((dist*size.x-dist)/2.0,
																		 (dist*size.y-dist)/2.0,
																		 (dist*size.z-dist)/2.0)
	}

	/*------------------------------------------------------------------------------
	---------------------------------EVENTS-----------------------------------------
	------------------------------------------------------------------------------*/

	handleMouseDown(event) {
	  this.mouseDown = true;
		// if (event.shiftKey)
		// 	this.translate = true;
	  this.lastMouseX = event.clientX;
	  this.lastMouseY = event.clientY;
	}

	handleMouseUp(event) {
	  this.mouseDown = false;
		this.translate = false;
	}

	handleMouseMove(event) {
	  if (!this.mouseDown) {
	    return;
	  }
	  var newX = event.clientX;
	  var newY = event.clientY;

	  var deltaX = newX - this.lastMouseX;
		var deltaY = newY - this.lastMouseY;

	  this.camera.pitch = modf(this.camera.pitch + Math.PI/200 * deltaX,2*Math.PI);
	  this.camera.yaw = modf(this.camera.yaw + Math.PI/200 * deltaY,2*Math.PI);

	  this.lastMouseX = newX;
	  this.lastMouseY = newY;

		// window.requestAnimationFrame(this.render);
		this.requestAnimation();
	}

	handleTouchStart(event) {
		if(event.touches.length === 1) {
			event.preventDefault();
			this.changeViewTouch = event.touches[0].identifier;
			this.lastTouchX = event.touches[0].clientX;
			this.lastTouchY = event.touches[0].clientY;
		} else {
			this.changeViewTouch=-1
		}

		// console.log("down");
	}

	handleTouchEnd(event) {
	  this.changeViewTouch = -1;
		// console.log("up");
	}

	handleTouchMove(event) {

		// console.log("move touch "+changeViewTouch);
	  if (this.changeViewTouch === -1) {
	    return;
	  }
		//console.log(event.touches);
		for (var t in event.touches) {
			if (event.touches[t].identifier === this.changeViewTouch) {
				event.preventDefault();
			  var newX = event.touches[t].clientX;
			  var newY = event.touches[t].clientY;

				// console.log("moving");

			  var deltaX = newX - this.lastTouchX;

			  this.camera.pitch = modf(this.camera.pitch + Math.PI/200 * deltaX,2*Math.PI);

			  var deltaY = newY - this.lastTouchY;
			  this.camera.yaw = modf(this.camera.yaw + Math.PI/200 * deltaY,2*Math.PI);


			  this.lastTouchX = newX;
			  this.lastTouchY = newY;
				this.requestAnimation();
			}
		}

		// console.log("move");
	}


	handleMouseWheel(event) {
		var delta = Math.max(-1, Math.min(1, (event.deltaY)));

		this.camera.dist += delta;
		this.requestAnimation();
		event.preventDefault();
	}

	/*------------------------------------------------------------------------------
	-------------------------------END EVENTS---------------------------------------
	------------------------------------------------------------------------------*/
}

GL3DView.defaultProps = {
	axes:{x:"x",y:"y",z:"z"},
	cubemap:{
		left:cmleft,right:cmright,top:cmtop,bottom:cmbottom,front:cmfront,back:cmback
	}
}

//var animPending = false





// function onChange() {
// 	window.requestAnimationFrame(render);
// }

function calcMVM(mvMatrix,camera) {
	// console.log(mvMatrix)
	// console.log(camera)
	glm.mat4.identity(mvMatrix);
	glm.mat4.translate(mvMatrix,mvMatrix,[0,0,-camera.dist]);
	glm.mat4.rotate(mvMatrix,mvMatrix,camera.yaw,[1,0,0]);
	glm.mat4.rotate(mvMatrix,mvMatrix,camera.pitch,[0,1,0]);
	// console.log(mvMatrix)
	var inv = glm.vec3.create()
	glm.vec3.negate(inv,camera.pos);
	// console.log(inv)
	glm.mat4.translate(mvMatrix,mvMatrix,inv);//camera.pos);
	// console.log(mvMatrix)
}


//Debug functions
/*
function throwOnGLError(err, funcName, args) {
  throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
};

function logGLCall(functionName, args) {
   console.log("gl." + functionName + "(" +
      WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
}

function validateNoneOfTheArgsAreUndefined(functionName, args) {
  for (var ii = 0; ii < args.length; ++ii) {
    if (args[ii] === undefined) {
      console.error("undefined passed to gl." + functionName + "(" +
                     WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
    }
  }
}



function logAndValidate(functionName, args) {
	validateNoneOfTheArgsAreUndefined(functionName, args);
	//logGLCall(functionName, args);
}
*/




function modf(x,y) {
	return x-y*Math.floor(x/y);
}

function colorToRgba(color) {
	return glm.vec4.fromValues(
		((color & 0xFF0000) >> 16)/255.0,
		((color & 0x00FF00) >> 8)/255.0,
		(color & 0x0000FF)/255.0,
		1.0);
}

function initWebGL(canvas) {
	// console.log("resize")
	var gl = null;
	var msg = "Your browser does not support WebGL, " +
		"or it is not enabled by default.";
	try {
		gl = canvas.getContext("webgl");
		if(!gl) {
			gl = canvas.getContext("experimental-webgl");
			alert("WebGL support is experimental, not everithing might work as expected!")
		}
		//gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError, logAndValidate);
	} catch (e) {
		console.log("catch");
		msg = "Error creating WebGL Context!: " + e.toString();
	}

	if (!gl) {
		alert(msg);
		throw new Error(msg);
	}

	console.log("created WebGL context");

	return gl;
}


function getShader(gl, file, type) {
		return fetch(file).then(res => res.text()).then(src => new Promise((resolve,reject) => {
			// console.log(gl,type,src)
			let shader = gl.createShader(type);
			gl.shaderSource(shader, src);
			gl.compileShader(shader);

			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				throw new Error(gl.getShaderInfoLog(shader));
			}

			resolve(shader);

		})).catch((e) => {
			alert("Error loading shader:" + file +"<"+type+">");
			console.log(e);
		});
}








// Create the vertex, color and index data for a multi-colored cube
function createCube(gl) {
	// console.log("createCube: " + gl)

	// Vertex Data
	var vertexBuffer;
	vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	var verts = [
		// Front face
		-1.0, -1.0, 1.0,
		1.0, -1.0, 1.0,
		1.0, 1.0, 1.0,
		-1.0, 1.0, 1.0,

		// Back face
		-1.0, -1.0, -1.0,
		-1.0, 1.0, -1.0,
		1.0, 1.0, -1.0,
		1.0, -1.0, -1.0,

		// Top face
		-1.0, 1.0, -1.0,
		-1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		1.0, 1.0, -1.0,

		// Bottom face
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		1.0, -1.0, 1.0,
		-1.0, -1.0, 1.0,

		// Right face
		1.0, -1.0, -1.0,
		1.0, 1.0, -1.0,
		1.0, 1.0, 1.0,
		1.0, -1.0, 1.0,

		// Left face
		-1.0, -1.0, -1.0,
		-1.0, -1.0, 1.0,
		-1.0, 1.0, 1.0,
		-1.0, 1.0, -1.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);


	//normals
	var vertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexNormalBuffer);

	var vertexNormals = [
		// Fron face
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		// Back face
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,

		// Top face
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,

		// Bottom face
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,

		// Right face
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,

		// Left face
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

	// Index data (defines the triangles to be drawn)
	var cubeIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
	var cubeIndices = [
		0, 1, 2, 			0, 2, 3, // Front face
		4, 5, 6, 			4, 6, 7, // Back face
		8, 9, 10, 		8, 10, 11, // Top face
		12, 13, 14, 	12, 14, 15, // Bottom face
		16, 17, 18, 	16, 18, 19, // Right face
		20, 21, 22, 	20, 22, 23 // Left face
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

	var result = {
		buffer: vertexBuffer,
		normals: vertexNormalBuffer,
		//colorBuffer: colorBuffer,
		indices: cubeIndexBuffer,
		vertSize: 3,
		nVerts: 24,
		normSize:3,
		nNorms: 24,
		//colorSize: 4,
		//nColors: 24,
		nIndices: 36,
		primtype: gl.TRIANGLES
	};

	return result;
}

// Create the vertex, color and index data for a multi-colored cube
function createSkybox(gl) {
	// console.log("createSkybox: " + gl)
	// Vertex Data
	var vertexBuffer;
	vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	var verts = [
		// Front face
		-300.0, -300.0, 300.0,
		300.0, -300.0, 300.0,
		300.0, 300.0, 300.0,
		-300.0, 300.0, 300.0,

		// Back face
		-300.0, -300.0, -300.0,
		-300.0, 300.0, -300.0,
		300.0, 300.0, -300.0,
		300.0, -300.0, -300.0,

		// Top face
		-300.0, 300.0, -300.0,
		-300.0, 300.0, 300.0,
		300.0, 300.0, 300.0,
		300.0, 300.0, -300.0,

		// Bottom face
		-300.0, -300.0, -300.0,
		300.0, -300.0, -300.0,
		300.0, -300.0, 300.0,
		-300.0, -300.0, 300.0,

		// Right face
		300.0, -300.0, -300.0,
		300.0, 300.0, -300.0,
		300.0, 300.0, 300.0,
		300.0, -300.0, 300.0,

		// Left face
		-300.0, -300.0, -300.0,
		-300.0, -300.0, 300.0,
		-300.0, 300.0, 300.0,
		-300.0, 300.0, -300.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);


	//normals
	var vertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexNormalBuffer);

	var vertexNormals = [
		// Fron face
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,

		// Back face
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		// Top face
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,

		// Bottom face
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		// Right face
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,

		// Left face
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

	// Index data (defines the triangles to be drawn)
	var cubeIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
	var cubeIndices = [
		2,1,0,				3,2,0,			// Front face
		6,5,4,				7,6,4,			// Back face
		10,9,8,				11,10,8,		// Top face
		14,13,12,			15,14,12,		// Bottom face
		18,17,16,			19,18,16,		// Right face
		22,21,20,			23,22,20		// Left face
	];


	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

	var result = {
		buffer: vertexBuffer,
		normals: vertexNormalBuffer,
		//colorBuffer: colorBuffer,
		indices: cubeIndexBuffer,
		vertSize: 3,
		nVerts: 24,
		normSize:3,
		nNorms: 24,
		//colorSize: 4,
		//nColors: 24,
		nIndices: 36,
		primtype: gl.TRIANGLES
	};

	return result;
}

function loadCubeMap(cubemap,gl) {
		// console.log("loadCubeMap")
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		var faces = [["right", gl.TEXTURE_CUBE_MAP_POSITIVE_X],
					 ["left", gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
					 ["top", gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
					 ["bottom", gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
					 ["back", gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
					 ["front", gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]];
		return Promise.all(faces.map(([side,glface]) => { //Load all images
			return new Promise(function(resolve, reject) {
				let image = new Image();
				image.onload = function () {
					gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
					gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
					gl.texImage2D(glface, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
					resolve();
				}
				image.src = cubemap[side];
			});
		})).then(() => new Promise(function(resolve, reject) {
			gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
			// requestAnimationFrame(render);
			resolve(texture);
		}));
}

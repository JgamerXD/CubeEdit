import React, { Component } from 'react';
import {get} from './getfile';

import basic_fs 	from './glsl/basic.fs'
import basic_vs 	from './glsl/basic.vs'
import cubemap_vs from './glsl/cubemap.vs'
import cubemap_fs from './glsl/cubemap.fs'

const glm = require("gl-matrix");


class GL3DView extends React.Component {
	constructor(props) {
		super(props);



		this.mouseDown = false;
		this.changeViewTouch = -1;

		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);

		this.handleMouseWheel = this.handleMouseWheel.bind(this);

		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);

	}

	render() {
		return <canvas ref="canvas"></canvas>
	}

	componentDidMount() {
		this.startGL(this.refs.canvas);
	}


	startGL(canvas) {
		//console.log($("#basic-fs")[0].type);

		this.calcInitialCameraPos(camera);

		gl = initWebGL(canvas);
		initViewport(gl,canvas);
		initMatrices(canvas);
		// console.log(mvMatrix)
		//mat4.translate(mvMatrix,mvMatrix,[-1.0,1.0,-7.0]);
		initShaders(gl);
		cubeModel = createCube(gl);
		skyboxCube = createSkybox(gl);
		skyboxTexture = loadCubeMap("cubemaps/small");

		gl.clearColor(0.8,0.8,1.0,1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);






		canvas.onwheel = handleMouseWheel;
		canvas.onmousedown = handleMouseDown;
		document.onmouseup = handleMouseUp;
		document.onmousemove = handleMouseMove;

		canvas.ontouchstart = handleTouchStart;
		document.ontouchmove = handleTouchMove;
		document.ontouchend = handleTouchEnd;


		// canvas.onresize = function() {resize(gl.canvas)};
		window.onresize = render;

		// console.log(canvas)
		renderGL();
		//window.requestAnimationFrame(render, canvas);

		// $.ajaxSetup({
	  //     "error":function(obj,text,error) {alert("error while loading " + obj + ":  " + text + "\n" + error)}
		// });

		//alert("webgl!");

	}



	renderGL() {
		//console.log(gl.canvas);
		resize(gl.canvas)
		gl.viewport(0,0,gl.canvas.width,gl.canvas.height);

		calcMVM(mvMatrix,camera);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.useProgram(basicShader);

		gl.bindBuffer(gl.ARRAY_BUFFER,cubeModel.buffer);
		gl.vertexAttribPointer(basicShader.vertexPositionAttribute,cubeModel.vertSize,gl.FLOAT,false,0,0);

		setMatrixUniforms(basicShader);

		gl.bindBuffer(gl.ARRAY_BUFFER,cubeModel.normals);
		gl.vertexAttribPointer(basicShader.vertexNormalAttribute,cubeModel.normSize,gl.FLOAT,false,0,0);

		//gl.drawArrays(gl.TRIANGLES, 0, 24);
		for(i=0;i<sizeX;i++)
			for(j=0;j<sizeY;j++)
				for(k=0;k<sizeZ;k++) {

					mvmStack.push(mat4.clone(mvMatrix));
					mat4.translate(mvMatrix,mvMatrix,[cubeDist*i,cubeDist*j,cubeDist*k]);




					gl.uniformMatrix4fv(basicShader.mvMatrixUniform, false, mvMatrix);
					gl.uniform4fv(basicShader.meshColorUniform, colorToRgba(currentColormap[currentFrame[getIndex(i,j,k)]]));


					// setMatrixUniforms(basicShaderProgram);

					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,cubeModel.indices);
					gl.drawElements(cubeModel.primtype,cubeModel.nIndices,gl.UNSIGNED_SHORT,0);

					mvMatrix = mvmStack.pop();
				}

		if(skyboxTexture) {
			gl.useProgram(cubemapShader);

			setMatrixUniforms(cubemapShader);

			gl.bindBuffer(gl.ARRAY_BUFFER,skyboxCube.buffer);
			gl.vertexAttribPointer(cubemapShader.vertexPositionAttribute,skyboxCube.vertSize,gl.FLOAT,false,0,0);

			gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxTexture);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,skyboxCube.indices);
			gl.drawElements(skyboxCube.primtype,skyboxCube.nIndices,gl.UNSIGNED_SHORT,0);
		}
		// console.log("draw");
		//mat4.rotate(mvMatrix,mvMatrix,Math.PI/400,vup);

		// window.requestAnimationFrame(render);

	}

	initBasicShader(gl) {
		// console.log("shaders")
		Promise.all([getShader(gl, basic_vs,gl.VERTEX_SHADER),getShader(gl, basic_fs,gl.FRAGMENT_SHADER)])
		.then(([basicvs,basicfs]) => {
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

			this.basicShader = bsp;

		}).catch(e => {
			alert(e);
		})
	}

	initCubemapShader(gl) {
		Promise.all([getShader(gl, cubemap_vs,gl.GL_VERTEX_SHADER),getShader(gl, cubemap_fs,gl.GL_FRAGMENT_SHADER)])
		.then(([cubevs,cubefs]) => {
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

			this.cubemapShader = csp;
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
		this.gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
		this.gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
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
		if (canvas.width  != displayWidth ||
				canvas.height != displayHeight) {

			// Make the canvas the same size
			canvas.width  = displayWidth;
			canvas.height = displayHeight;
		}

		glm.mat4.perspective(pMatrix, Math.PI / 4,
			canvas.width / canvas.height, 0.001, 1000); //gl. ?


		// window.requestAnimationFrame(render, canvas);
	}

	calcInitialCameraPos(camera,cube,dist)
	{
		camera.pos = glm.vec3.fromValues((dist*cube.size[0]-dist)/2.0,
																		 (dist*cube.size[1]-dist)/2.0,
																		 (dist*cube.size[2]-dist)/2.0)
	}

	/*------------------------------------------------------------------------------
	---------------------------------EVENTS-----------------------------------------
	------------------------------------------------------------------------------*/

	handleMouseDown(event) {
	  this.mouseDown = true;
	  this.lastMouseX = event.clientX;
	  this.lastMouseY = event.clientY;
	}

	handleMouseUp(event) {
	  this.mouseDown = false;
	}




	handleMouseMove(event) {
	  if (!mouseDown) {
	    return;
	  }
	  var newX = event.clientX;
	  var newY = event.clientY;

	  var deltaX = newX - lastMouseX;

	  this.camera.pitch = modf(camera.pitch + Math.PI/200 * deltaX,2*Math.PI);

	  var deltaY = newY - lastMouseY;
	  this.camera.yaw = modf(camera.yaw + Math.PI/200 * deltaY,2*Math.PI);


	  this.lastMouseX = newX;
	  this.lastMouseY = newY;

		// window.requestAnimationFrame(render, canvas);
		this.requestAnimation();
	}

	handleTouchStart(event) {
		if(event.touches.length == 1) {
			event.preventDefault();
			this.changeViewTouch = event.touches[0].identifier;
			this.lastTouchX = event.touches[0].clientX;
			this.lastTouchY = event.touches[0].clientY;
		} else {
			changeViewTouch=-1
		}

		// console.log("down");
	}


	handleTouchEnd(event) {
	  this.changeViewTouch = -1;
		// console.log("up");
	}



	handleTouchMove(event) {

		// console.log("move touch "+changeViewTouch);
	  if (this.changeViewTouch == -1) {
	    return;
	  }
		//console.log(event.touches);
		for (var t in event.touches) {
			if (event.touches[t].identifier ==this. changeViewTouch) {
				event.preventDefault();
			  var newX = event.touches[t].clientX;
			  var newY = event.touches[t].clientY;

				// console.log("moving");

			  var deltaX = newX - lastTouchX;

			  this.camera.pitch = modf(camera.pitch + Math.PI/200 * deltaX,2*Math.PI);

			  var deltaY = newY - lastTouchY;
			  this.camera.yaw = modf(camera.yaw + Math.PI/200 * deltaY,2*Math.PI);


			  this.lastTouchX = newX;
			  this.lastTouchY = newY;
				window.requestAnimationFrame(render);
			}
		}

		// console.log("move");
	}


	handleMouseWheel(event) {
		var delta = Math.max(-1, Math.min(1, (event.deltaY)));

		camera.dist += delta;
		window.requestAnimationFrame(render, canvas);
	}

	/*------------------------------------------------------------------------------
	-------------------------------END EVENTS---------------------------------------
	------------------------------------------------------------------------------*/
}

var mvMatrix;
var pMatrix;
var cubeModel;
var gl;
var canvas;

var basicShader;
var cubemapShader;

var skyboxTexture;

var vup = glm.vec3.fromValues(0.0,1.0,0.1);

var cubeDist = 5.0

var camera = {pos:glm.vec3.fromValues(0,0,0), dist:40, pitch:Math.PI/8, yaw:Math.PI*1/8};

var mvmStack = [];

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
		return get(file).then((src) => new Promise((resolve,reject) => {
			var shader = gl.createShader(type);
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

function loadCubeMap(basePath,gl) {
		// console.log("loadCubeMap")
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		var faces = [["right.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_X],
					 ["left.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
					 ["top.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
					 ["bottom.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
					 ["back.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
					 ["front.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]];
		return Promise.all(faces.map(([file,face]) => { //Load all images
			return new Promise(function(resolve, reject) {
				let image = new Image();
				image.onload = function () {
					gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
					gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
					gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
					resolve();
				}
				image.src = basePath + '/' + file;
			});
		})).then(() => new Promise(function(resolve, reject) {
			gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
			// requestAnimationFrame(render);
			resolve(texture);
		}));
}

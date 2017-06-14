var mvMatrix;
var pMatrix;
var cubeModel;
var gl;
var canvas;

var basicShader;
var cubemapShader;

var skyboxTexture;

var vup = vec3.fromValues(0.0,1.0,0.1);

var cubeDist = 5.0

var camera = {pos:vec3.fromValues(0,0,0), dist:40, pitch:Math.PI/8, yaw:Math.PI*1/8};

var mvmStack = [];

//var animPending = false

function startGL() {
	canvas = $("#3dview")[0];
	//console.log($("#basic-fs")[0].type);

	cubeInitCallbacks.push(function() {calcCameraPos(camera)});
	dataChangedCallbacks.push(onChange);
	calcCameraPos(camera);

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
	render();
	//window.requestAnimationFrame(render, canvas);

	// $.ajaxSetup({
  //     "error":function(obj,text,error) {alert("error while loading " + obj + ":  " + text + "\n" + error)}
	// });

	//alert("webgl!");

}

function render() {
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
				gl.uniform4fv(basicShader.meshColorUniform, colorToRgba(cubeColormap[currentFrame[getIndex(i,j,k)]]));


				// setMatrixUniforms(basicShaderProgram);

				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,cubeModel.indices);
				gl.drawElements(cubeModel.primtype,cubeModel.nIndices,gl.UNSIGNED_SHORT,0);

				mvMatrix = mvmStack.pop();
			}

	if(skyboxTexture.ready) {
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

function onChange() {
	window.requestAnimationFrame(render);
}

function calcCameraPos(camera)
{
	camera.pos = vec3.fromValues((cubeDist*sizeX-cubeDist)/2.0,(cubeDist*sizeY-cubeDist)/2.0,(cubeDist*sizeZ-cubeDist)/2.0)
}

function calcMVM(mvMatrix,camera) {
	// console.log(mvMatrix)
	// console.log(camera)
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix,mvMatrix,[0,0,-camera.dist]);
	mat4.rotate(mvMatrix,mvMatrix,camera.yaw,[1,0,0]);
	mat4.rotate(mvMatrix,mvMatrix,camera.pitch,[0,1,0]);
	// console.log(mvMatrix)
	var inv = vec3.create()
	vec3.negate(inv,camera.pos);
	// console.log(inv)
	mat4.translate(mvMatrix,mvMatrix,inv);//camera.pos);
	// console.log(mvMatrix)
}


/*------------------------------------------------------------------------------
---------------------------------EVENTS-----------------------------------------
------------------------------------------------------------------------------*/

var mouseDown = false;
function handleMouseDown(event) {
  mouseDown = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
}

function handleMouseUp(event) {
  mouseDown = false;
}


function modf(x,y) {
	return x-y*Math.floor(x/y);
}

function handleMouseMove(event) {
  if (!mouseDown) {
    return;
  }
  var newX = event.clientX;
  var newY = event.clientY;

  var deltaX = newX - lastMouseX;

  camera.pitch = modf(camera.pitch + Math.PI/200 * deltaX,2*Math.PI);

  var deltaY = newY - lastMouseY;
  camera.yaw = modf(camera.yaw + Math.PI/200 * deltaY,2*Math.PI);


  lastMouseX = newX;
  lastMouseY = newY;

	window.requestAnimationFrame(render, canvas);
}


var changeViewTouch=-1
function handleTouchStart(event) {
	if(event.touches.length == 1) {
		event.preventDefault();
		changeViewTouch = event.touches[0].identifier;
		lastTouchX = event.touches[0].clientX;
		lastTouchY = event.touches[0].clientY;
	} else {
		changeViewTouch=-1
	}

	// console.log("down");
}


function handleTouchEnd(event) {
  changeViewTouch = -1;
	// console.log("up");
}



function handleTouchMove(event) {

	console.log("move touch "+changeViewTouch);
  if (changeViewTouch == -1) {
    return;
  }
	//console.log(event.touches);
	for (var t in event.touches) {
		if (event.touches[t].identifier == changeViewTouch) {
			event.preventDefault();
		  var newX = event.touches[t].clientX;
		  var newY = event.touches[t].clientY;

			console.log("moving");

		  var deltaX = newX - lastTouchX;

		  camera.pitch = modf(camera.pitch + Math.PI/200 * deltaX,2*Math.PI);

		  var deltaY = newY - lastTouchY;
		  camera.yaw = modf(camera.yaw + Math.PI/200 * deltaY,2*Math.PI);


		  lastTouchX = newX;
		  lastTouchY = newY;
			window.requestAnimationFrame(render);
		}
	}

	// console.log("move");
}


function handleMouseWheel(event) {
	var delta = Math.max(-1, Math.min(1, (event.deltaY)));

	camera.dist += delta;
	window.requestAnimationFrame(render, canvas);
}

/*------------------------------------------------------------------------------
-------------------------------END EVENTS---------------------------------------
------------------------------------------------------------------------------*/

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




function initWebGL(canvas) {
	// console.log("resize")
	var gl = null;
	var msg = "Your browser does not support WebGL, " +
		"or it is not enabled by default.";
	try {
		gl = canvas.getContext("webgl");
		//gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError, logAndValidate);
	} catch (e) {
		msg = "Error creating WebGL Context!: " + e.toString();
	}

	if (!gl) {
		alert(msg);
		throw new Error(msg);
	}

	return gl;
}

function resize(canvas) {
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

	mat4.perspective(pMatrix, Math.PI / 4,
		gl.canvas.width / gl.canvas.height, 0.001, 1000);


	// window.requestAnimationFrame(render, canvas);
}

function getShader(gl, id) {
		var shaderScript = $(id)[0];
		if (!shaderScript) {
				return null;
		}

		var str = shaderScript.text;
		//console.log(id + "  " + str);

		var shader;
		if (shaderScript.type == "x-shader/x-fragment") {
				shader = gl.createShader(gl.FRAGMENT_SHADER);
		} else if (shaderScript.type == "x-shader/x-vertex") {
				shader = gl.createShader(gl.VERTEX_SHADER);
		} else {
				alert("Error loading shader:" + id +"<"+shaderScript.type+">");
				console.log(str);
				return null;
		}

		gl.shaderSource(shader, str);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				alert(gl.getShaderInfoLog(shader));
				return null;
		}

		return shader;
}




function initShaders(gl) {
	// console.log("shaders")
	var fragmentShader = getShader(gl, "#basic-fs");
	var vertexShader = getShader(gl, "#basic-vs");

	var bsp = gl.createProgram();
	gl.attachShader(bsp, vertexShader);
	gl.attachShader(bsp, fragmentShader);
	gl.linkProgram(bsp);

	if (!gl.getProgramParameter(bsp, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	//gl.useProgram(bsp);



	bsp.vertexPositionAttribute = gl.getAttribLocation(bsp,"aVertexPos");
	gl.enableVertexAttribArray(bsp.vertexPositionAttribute);

	bsp.vertexNormalAttribute = gl.getAttribLocation(bsp,"aVertexNormal");
	gl.enableVertexAttribArray(bsp.vertexNormalAttribute)

	bsp.meshColorUniform = gl.getUniformLocation(bsp,"uColor");

	bsp.pMatrixUniform = gl.getUniformLocation(bsp,"uProjectionMatrix");
	bsp.mvMatrixUniform = gl.getUniformLocation(bsp,"uModelViewMatrix");

	basicShader = bsp;

	// gl.useProgram(basicShaderProgram);
	var fragmentShader = getShader(gl, "#cubemap-fs");
	var vertexShader = getShader(gl, "#cubemap-vs");

	var csp = gl.createProgram();
	gl.attachShader(csp, vertexShader);
	gl.attachShader(csp, fragmentShader);
	gl.linkProgram(csp);

	if (!gl.getProgramParameter(csp, gl.LINK_STATUS)) {
		alert("Could not initialise cubemap shaders");
	}

	//gl.useProgram(csp);

	csp.vertexPositionAttribute = gl.getAttribLocation(csp,"aVertexPos");
	gl.enableVertexAttribArray(csp.vertexPositionAttribute);

	csp.skyboxTexUniform = gl.getUniformLocation(csp,"uSkybox");
	csp.pMatrixUniform = gl.getUniformLocation(csp,"uProjectionMatrix");
	csp.mvMatrixUniform = gl.getUniformLocation(csp,"uModelViewMatrix");

	cubemapShader = csp;
}



function initViewport(gl, canvas) {
	gl.viewport(0, 0, canvas.width, canvas.height);
}



function initMatrices(canvas) {
	// console.log("matricies")
	mvMatrix = mat4.create();

	pMatrix = mat4.create();
	mat4.perspective(pMatrix, Math.PI / 4,
		canvas.width / canvas.height, 0.001, 2000);
}



function setMatrixUniforms(shaderProgram) {
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
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

function loadCubeMap(base) {
	// console.log("loadCubeMap")
	var image_counter = 0

	var texture = gl.createTexture();
	texture.ready = false;
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
	for (var i = 0; i < faces.length; i++)
	{
		var face = faces[i][1];
		var image = new Image();
		image.onload = function (texture, face, image) {
			return function () {
				gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
				gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
				image_counter++;
				if (image_counter == 6)
				{
					gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
					texture.ready = true;
					requestAnimationFrame(render);
				}

			}
		}(texture, face, image);
		image.src = base + '/' + faces[i][0];
	}
	return texture;
}

import * as Cube from './cube'

export const shapes = {
  POINT:"point",
  LINE:"line",
  CUBOID:"cuboid",
  FILLED_CUBOID:"filledCuboid",
  SPHERE:"sphere",
}

export function draw(size,frame,pos,color) {
  // console.log(pos);
  frame[Cube.getIndex(size,pos[0],pos[1],pos[2])]=color;
};

export function drawShape(size,frame,shape,...args){
  switch (shape) {
    case shapes.POINT:
      draw(size,frame,args);
      break;
    case shapes.LINE:
      drawLine(size,frame,args);
      break;
    case shapes.CUBOID:
      drawCuboid(size,frame,args);
      break;
    case shapes.FILLED_CUBOID:
      fillCuboid(size,frame,args);
      break;
    case shapes.SPHERE:
      drawSphere(size,frame,args);
      break;
    default:

  }
}

export function drawLine(size,frame,pos1,pos2,color) {
  let sx = pos2[0] - pos1[0];
  let sy = pos2[1] - pos1[1];
  let sz = pos2[2] - pos1[2];


  let maxDim = Math.max(Math.abs(sx), Math.max(Math.abs(sy), Math.abs(sz)));
  if (maxDim === 0) {
    frame[Cube.getIndex(size,pos1[0],pos1[1],pos1[2])]=color;
    return;
  }

  let stepx = sx / maxDim;
  let stepy = sy / maxDim;
  let stepz = sz / maxDim;


  for (let i = 0; i <= maxDim; i++)
    frame[Cube.getIndex(size,Math.floor(pos1[0] + stepx * i+0.5), Math.floor(pos1[1] + stepy * i+0.5), Math.floor(pos1[2] + stepz * i+0.5))]= color;
};

export function drawCuboid(size,frame,pos1,pos2,color) {
  for (let i = pos1[0]; i < pos2[0]; i++) {
    frame[Cube.getIndex(size,i,pos1[1],pos1[2])]=color;
    frame[Cube.getIndex(size,i,pos1[1],pos2[2])]=color;
    frame[Cube.getIndex(size,i,pos2[1],pos1[2])]=color;
    frame[Cube.getIndex(size,i,pos2[1],pos2[2])]=color;
  }
  for (let j = pos1[1]+1; j < pos2[1]-1; j++) {
    frame[Cube.getIndex(size,pos1[0],j,pos1[2])]=color;
    frame[Cube.getIndex(size,pos1[0],j,pos2[2])]=color;
    frame[Cube.getIndex(size,pos2[0],j,pos1[2])]=color;
    frame[Cube.getIndex(size,pos2[0],j,pos2[2])]=color;
  }
  for (let k = pos1[2]+1; k < pos2[2]-1; k++) {
    frame[Cube.getIndex(size,pos1[0],pos1[1],k)]=color;
    frame[Cube.getIndex(size,pos1[0],pos2[1],k)]=color;
    frame[Cube.getIndex(size,pos2[0],pos1[1],k)]=color;
    frame[Cube.getIndex(size,pos2[0],pos2[1],k)]=color;
  }

};

export function fillCuboid(size,frame,pos1,pos2,color) {
  for (let i = pos1[0]; i < pos2[0]; i++) {
    for (let j = pos1[1]; j < pos2[1]; j++) {
      for (let k = pos1[2]; k < pos2[2]; k++) {
        frame[Cube.getIndex(size,i,j,k)]=color;
      }
    }
  }
};

export function drawSphere(size,frame,pos,radius,color,innerRadius=0) {
  var dist=0
  for (let i = 0; i < size.x; i++) {
    for (let j = 0; j < size.y; j++) {
      for (let k = 0; k < size.z; k++) {
        dist = Math.sqrt((i-pos[0])*(i-pos[0])+(j-pos[1])*(j-pos[1])+(k-pos[2])*(k-pos[2]))
        if(dist <= radius && dist >= innerRadius)
          frame[Cube.getIndex(size,i,j,k)]=color;
      }
    }
  }
};

export function drawFullFrame(size,frame,newFrame) {
  frame.fill(newFrame);
};

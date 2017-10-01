import * as Cube from './Cube';
import {siren4x4internal as siren,
  siren4x4denorm as siren_D,
  approach4x4internal as approach,
  approach4x4denorm as approach_D,
  test as t
 } from 'utils/testcube';

let c = Cube.newCube(2,2,2,4);

beforeEach(() => {
});

test.skip("clone test",()=>{
  let a = {1:["hello","world"],2:{foo:"foo",bar:"bar"}}
  let b = {...a}
  expect(b).toEqual(a);
  expect(b).not.toBe(a);
  let c = {...a,2:{...a[2],bar:"no"}}
  expect(c).not.toEqual(a);
});

test("new cube", () => {
  expect(c).toEqual({
  	"size": {x:2, y:2, z:2},
  	"frames": {
  		"byId": {
  			0:{id:0,data:[0,0,0,0,0,0,0,0]},},
  		"all":[0],
      "lastId":0
  	},
  	"cmapsize": 4,
  	"colormaps":{
  		"byId": {
  				0:{id:0,data:[
            0x000000,0xff0000,
            0x00ff00,0x0000ff
          ]}
  		},
  		"all":[0],
      "lastId":0
    },
    edit:{
      x:0,
      y:0,
      z:0,
      primaryColor:1,
      secondaryColor:0,
      currentColormap:0,
      currentFrame:0
    }

  });
});

test("normalize cube",()=>{
  expect(Cube.normalize(siren_D)).toEqual(siren);
  expect(Cube.normalize(approach_D)).toEqual(approach);
})
test("denormalize cube",()=>{
  expect(Cube.denormalize(siren)).toEqual(siren_D);
  expect(Cube.denormalize(approach)).toEqual(approach_D);
})

test("new colormap",()=>{
  expect(Cube.newColormap(5))
  .toEqual({data:new Array(5).fill(0)})
  expect(Cube.newColormap(16))
  .toEqual({data:[
    0x000000,0x001290,0x008F15,0x009092,
    0x9B1708,0x9A2091,0x949119,0xB8B8B8,
    0x686868,0x0027FB,0x00F92C,0x00FCFE,
    0xFF3016,0xFF3FFC,0xFFFD33,0xFFFFFF
  ]});
})

test("new frame",()=>{
  expect(Cube.newFrame(5))
  .toEqual({data:new Array(5).fill(0)})
  expect(Cube.newFrame(16))
  .toEqual({data:new Array(16).fill(0)})
})


test("get index IMPORTANT: Y and Z are swapped", () => {
  expect(Cube.getIndex(c,0,0,0)).toBe(0);
  expect(Cube.getIndex(c,1,0,0)).toBe(1);
  expect(Cube.getIndex(c,0,0,1)).toBe(2);
  expect(Cube.getIndex(c,0,1,0)).toBe(4);
});

test("get size", () => {
  expect(Cube.getSize(c.size)).toBe(8);
  expect(Cube.getSize(siren.size)).toBe(64);
  expect(Cube.getSize(t.size)).toBe(1);
});

describe("clear frame",()=>{
  describe("empty Cube",()=>{
    let id = c.frames.all[0];
    let nc = Cube.clearFrame(c,id);

    test("to be clear", () => {
      expect(nc)
        .toEqual({...c,frames:{...c.frames,byId:{...c.frames.byId,[id]:{...c.frames.byId[id],data:new Array(Cube.getSize(c.size)).fill(0)}}}});
    });
    test("to be a different object",()=>{
      expect(nc).not.toBe(c);
      });
    });

  describe("siren Cube",()=>{
    let id = siren.frames.all[2];
    let nc = Cube.clearFrame(siren,id);

    test("to be clear", () => {
      expect(nc)
        .toEqual({...siren,frames:{...siren.frames,byId:{...siren.frames.byId,[id]:{...siren.frames.byId[id],data:new Array(Cube.getSize(siren.size)).fill(0)}}}});
    });
    test("to be a different object",()=>{
      expect(nc).not.toBe(siren);
    });
  });
  describe("test Cube",()=>{
    let id = 2;
    let nc = Cube.clearFrame(t,id);

    test("to be clear", () => {
      expect(nc)
        .toEqual({
        	size: {x:1, y:1, z:1},
        	cmapsize: 4,
        	frames: {
        		byId: {1:{id:1,data:[11]},2:{id:2,data:[0]},3:{id:3,data:[33]},},
        		all:[1,2,3],lastId:3
        	},
        	colormaps: {
        		byId: {1:{id:1,data:[ 0,  1,  2,  3]},2:{id:2,data:[10, 11, 12, 13]},3:{id:3,data:[20, 21, 22, 23]}},
        		all:[1,2,3],lastId:3
        	}
        });
    });
    test("to be a different object",()=>{
      expect(nc).not.toBe(t);
    });
  });
});


describe("clear colormap",()=>{
  describe("empty Cube",()=>{
    let id = c.colormaps.all[0]
    let nc = Cube.clearColormap(c,id)
    test("to be clear", () => {
      expect(nc)
        .toEqual({...c,colormaps:{...c.colormaps,byId:{...c.colormaps.byId,[id]:{...c.colormaps.byId[id],data:new Array(4).fill(0)}}}});
    });
    test("to be a different object",()=>{
      expect(nc).not.toBe(c);
      });
    });

  describe("siren Cube",()=>{
    let id = siren.colormaps.all[2];
    let nc = Cube.clearColormap(siren,id);

    test("to be clear", () => {
      expect(nc)
        .toEqual({...siren,colormaps:{...siren.colormaps,byId:{...siren.colormaps.byId,[id]:{...siren.colormaps.byId[id],data:new Array(4).fill(0)}}}});
    });
    test("to be a different object",()=>{
      expect(nc).not.toBe(siren);
    });
  });

  describe("test Cube",()=>{
    let id = 2;
    let nc = Cube.clearColormap(t,id);

    test("to be clear", () => {
      expect(nc)
        .toEqual({
        	size: {x:1, y:1, z:1},
        	cmapsize: 4,
        	frames: {
        		byId: {1:{id:1,data:[11]},2:{id:2,data:[33]},3:{id:3,data:[33]},},
        		all:[1,2,3],lastId:3
        	},
        	colormaps: {
        		byId: {1:{id:1,data:[ 0,  1,  2,  3]},2:{id:2,data:[0,0,0,0]},3:{id:3,data:[20, 21, 22, 23]}},
        		all:[1,2,3],lastId:3
        	}
        });
    });
    test("to be a different object",()=>{
      expect(nc).not.toBe(t);
    });
  });
});

test("copy frame",()=>{
  let id = 3;
  expect(Cube.copyFrame(t,id))
  .toEqual([33]);
})

test("copy cmap",()=>{
  let id = 3;
  expect(Cube.copyColormap(t,id))
  .toEqual([20,21,22,23]);
})

test("cut frame",()=>{
  let id = 2;
  expect(Cube.cutFrame(t,id))
  .toEqual({
  	size: {x:1, y:1, z:1},
  	cmapsize: 4,
  	frames: {
  		byId: {1:{id:1,data:[11]},3:{id:3,data:[33]},},
  		all:[1,3],lastId:3
  	},
  	colormaps: {
  		byId: {1:{id:1,data:[ 0,  1,  2,  3]},2:{id:2,data:[10, 11, 12, 13]},3:{id:3,data:[20, 21, 22, 23]}},
  		all:[1,2,3],lastId:3
  	}
  });
  expect(Cube.cutFrame(Cube.cutFrame(Cube.cutFrame(t,1),2),3))
  .toEqual({
  	size: {x:1, y:1, z:1},
  	cmapsize: 4,
  	frames: {
  		byId: {4:{id:4,data:[0]}},
      all:[4],lastId:4
  	},
  	colormaps: {
  		byId: {1:{id:1,data:[ 0,  1,  2,  3]},2:{id:2,data:[10, 11, 12, 13]},3:{id:3,data:[20, 21, 22, 23]}},
  		all:[1,2,3],lastId:3
  	}
  });
});


describe("insert frame",()=>{
  test("normal",()=>{
    let exp = {...t};
    exp.frames = {
      byId: {1:{id:1,data:[11]},2:{id:2,data:[33]},3:{id:3,data:[33]},4:{id:4,data:[0]}},
      all:[1,2,4,3],lastId:4
    }
    expect(Cube.insertNewFrame(t,2))
    .toEqual(exp);

    exp.frames = {
      byId: {1:{id:1,data:[11]},2:{id:2,data:[33]},3:{id:3,data:[33]},4:{id:4,data:[0]}},
      all:[4,1,2,3],lastId:4
    }
    expect(Cube.insertNewFrame(t,0))
    .toEqual(exp);

    exp.frames = {
      byId: {1:{id:1,data:[11]},2:{id:2,data:[33]},3:{id:3,data:[33]},4:{id:4,data:[0]}},
      all:[1,2,3,4],lastId:4
    }
    expect(Cube.insertNewFrame(t,3))
    .toEqual(exp);

    expect(Cube.insertNewFrame(t,3))
    .not.toBe(t);
  });
  test("invalid args",()=>{

  });
});




test("cut colormap",()=>{
  let exp = {...t};
  let id = 2;

  exp.colormaps = {
    byId: {1:{id:1,data:[ 0,  1,  2,  3]},3:{id:3,data:[20, 21, 22, 23]}},
    all:[1,3],lastId:3
  }
  expect(Cube.cutColormap(t,id))
  .toEqual(exp);

  exp.colormaps = {
    byId: {4:{id:4,data:[0x000000,0xff0000,0x00ff00,0x0000ff]}},
    all:[4],lastId:4
  }
  expect(Cube.cutColormap(Cube.cutColormap(Cube.cutColormap(t,1),2),3))
  .toEqual(exp);
});


test("insert colormap",()=>{
  expect(Cube.insertColormap(t,2))
  .toEqual({
    size: {x:1, y:1, z:1},
    cmapsize: 4,
    frames: {
      byId: {1:{id:1,data:[11]},2:{id:2,data:[33]},3:{id:3,data:[33]},},
      all:[1,2,3],lastId:3
    },
    colormaps: {
      byId: {1:{id:1,data:[ 0,  1,  2,  3]},2:{id:2,data:[10, 11, 12, 13]},3:{id:3,data:[20, 21, 22, 23]},4:{id:4,data:[0x000000,0xff0000,0x00ff00,0x0000ff]}},
      all:[1,2,4,3],lastId:4
    }
  });
  expect(Cube.insertColormap(t,0))
  .toEqual({
    size: {x:1, y:1, z:1},
    cmapsize: 4,
    frames: {
      byId: {1:{id:1,data:[11]},2:{id:2,data:[33]},3:{id:3,data:[33]},},
      all:[1,2,3],lastId:3
    },
    colormaps: {
      byId: {1:{id:1,data:[ 0,  1,  2,  3]},2:{id:2,data:[10, 11, 12, 13]},3:{id:3,data:[20, 21, 22, 23]},4:{id:4,data:[0x000000,0xff0000,0x00ff00,0x0000ff]}},
      all:[4,1,2,3],lastId:4
    }
  });
  expect(Cube.insertColormap(t,3))
  .toEqual({
    size: {x:1, y:1, z:1},
    cmapsize: 4,
    frames: {
      byId: {1:{id:1,data:[11]},2:{id:2,data:[33]},3:{id:3,data:[33]},},
      all:[1,2,3],lastId:3
    },
    colormaps: {
      byId: {1:{id:1,data:[ 0,  1,  2,  3]},2:{id:2,data:[10, 11, 12, 13]},3:{id:3,data:[20, 21, 22, 23]},4:{id:4,data:[0x000000,0xff0000,0x00ff00,0x0000ff]}},
      all:[1,2,3,4],lastId:4
    }
  });
});

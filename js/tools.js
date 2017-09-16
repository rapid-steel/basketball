var Tools = {

  'arrow-full': {
    type: 'Arrow',
    params: {
      points: [3,8, 45,18],
      strokeWidth: 3,
      stroke: 'blue',
      fill: 'blue',
      pointerWidth: 10,
      pointerHeight: 25
    }
  },
  'arrow-dashed': {
    type: 'Arrow',
    params: {
      points: [3,8, 45,18],
      dash: [15, 6],
      strokeWidth: 3,
      stroke: 'green',
      fill: 'green',
      pointerWidth: 10,
      pointerHeight: 25
    }
  },
  'arrow-curved': {
    type: 'Arrow',
    params: {
      points: [0,12, 3,12, 8,21, 8,4, 14,6, 15,19, 20,5, 25,16, 28,6, 45,20],
      strokeWidth: 3,
      stroke: 'red',
      fill: 'red',
      tension: 1,
      pointerWidth: 10,
      pointerHeight: 25}
  },
  'line-curved': {
    type: 'Line',
    params: {
      points: [1,12, 5,5, 10,14, 15,16, 20,12, 25,21, 27,8, 32,4, 35,6, 40,17, 45, 15, 49,12],
      strokeWidth: 2,
      stroke: 'magenta',
      tension: 1
    }
  }

};

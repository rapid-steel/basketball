var Draw = function(layers) {
  this.layers = layers;
  this.tools = Tools;
};

Draw.prototype.background = function() {

  var image = new Image(),
  _this = this;

  image.onload = function() {
    _this.addBG(image);
  };

  image.src = 'background.jpg';

};

Draw.prototype.addBG = function(image) {

  this.layers.background
    .add(new Konva.Rect({x: 0, y: -125, width: 650, height: 650, fill: '#f18624'}))
    .add(new Konva.Image({image: image, x:0, y:0, width: 650, height: 400}));

  this.layers.background.draw();

};




Draw.prototype.addToolboxBG = function() {
  var width = 650,
    height = 400,
    toolboxBG = new Konva.Group(),
    colors =
      [['#f1cf86', '#fff059'], ['#e0bf86', '#ffe26c'], ['#d5b084', '#fddb7f']];

  this.layers.elements.x(width);

  toolboxBG
    .add(new Konva.Rect({x: 0, y: 0, width: 40, height: height, fill: '#fffca8'}));

  colors.forEach(function(item, index) {
    toolboxBG
      .add(new Konva.Rect({x: 40 + index*40, y: 0, width: 30, height: height, fill: item[1]}))
      .add(new Konva.Rect({x: 70 + index*40, y: 0, width: 10, height: height, fill: item[0]}));
  }, this);

  toolboxBG
    .add(new Konva.Rect({x:5, y:120, width:140, height: 75, fill: 'rgba(0,0,0,1)', cornerRadius: 10}))
    .add(new Konva.Rect({x:5, y:260, width:140, height: 135, fill: 'rgba(0,0,0,1)', cornerRadius: 10}))
    .add(new Konva.Line({points: [0,0, 0,400], stroke: 'black', strokeWidth: 2}));

  this.layers.toolbox.add(toolboxBG);

};


Draw.prototype.addLineButtons = function() {
  var table = [
    {x:0,y:0, text: 'Straight Arrow', width: 85},
      {x:1,y:0, text: 'Dashed Arrow', width: 85},
      {x:0,y:1, text: 'Curved Arrow', width: 80},
      {x:1,y:1, text: 'Curved Line', width: 75}],
    i = 0;

  for(var tool in this.tools) {
    var lineButton = new Konva.Group({x: 20 + table[i].x*60,  y: 125 + table[i].y*35, name: 'line-bt', id: tool}),
      lineParams = this.tools[tool].params,
      line = new Konva[this.tools[tool].type](lineParams),
      title = new Konva.Group({name: 'title', x:-25, y: 25, visible: false, zIndex: 10})
        .add( new Konva.Rect({x: 0, y: 0, width: table[i].width, height: 20, fill: 'rgba(0,0,0,.7)', stroke: 'white', strokeWidth: 2, cornerRadius: 5}))
        .add(new Konva.Text({x: 4, y: 4, fontSize: 12, stroke: 'white', strokeWidth: 1, text: table[i].text})),
      light = new Konva.Rect({x: -2, y: -2, width: 54, height: 34, fill: '#fff9b4', cornerRadius: 8, name: 'light'});

    light.cache();
    light.filters([Konva.Filters.Blur]);
    light.blurRadius(3);
    light.visible(false);

    lineButton
      .add(light)
      .add(new Konva.Rect({x: 0, y: 0, width: 50, height: 30, stroke: 'black', fill: '#feffdb', strokeWidth: 2, cornerRadius: 5, zIndex: 1}))
      .add(line)
      .add(title);

    this.layers.toolbox.add(lineButton);



    i++;
  }
};
Draw.prototype.addObjects = function() {
  var _this = this,
    player = new Konva.Group({
      name: 'draggable number',
      draggable: true,
      id: 'blue1'
    })
      .add(new Konva.Circle({x:0, y:0, radius: 22, fill: '#c7eeff', name: 'light'}))
      .add(new Konva.Circle({x:0, y:0, radius: 16, fill: 'blue',
        stroke: 'black', strokeWidth: 2, name: 'color'}))
      .add(new Konva.Circle({x: -8, y: -8, radius: 5, fill: 'white', opacity: 0.6}))
      .add(new Konva.Text({x: -5, y: -8, text: '', fill: 'white', stroke: 'black',
        strokeWidth: 1, fontSize: 20, fontFamily: 'Impact', name: 'text'})),

    playerRed = player.clone({id: 'red1'}),

    judge = player.clone({id: false}),

    ball = new Konva.Group({
      name: 'draggable',
      draggable: true
    })
      .add(new Konva.Circle({x:0, y:0, radius: 20, fill: '#c7eeff', name: 'light'}))
      .add(new Konva.Circle({x: 0, y:0, radius: 15, stroke: 'black', strokeWidth: 1.5})),

    cone = new Konva.Group({
      name: 'draggable',
      draggable: true
    })
      .add(new Konva.Line({points: [-6,26, 16,26, 16,18, 14,18, 11.5,-3, -1.5,-3], fill: '#c7eeff', closed: true, name: 'light'}))
      .add(new Konva.Line({points: [-4,23, 14, 23, 11,18, -1, 18], fill: 'black', closed: true}))
      .add(new Konva.Line({points: [0,20, 10,20, 7.5,0, 2.5,0], fill: '#ff7b00', stroke: 'black', strokeWidth: 1, closed: true}))
      .add(new Konva.Line({points: [0.5,16, 9.5,16, 9,12, 1,12], fill: '#fbf8f2', closed: true}))
      .add(new Konva.Line({points: [1.5,8, 8.5,8, 8,4, 2,4], fill: '#fbf8f2', closed: true}))
      .add(new Konva.Line({points: [6,20, 9,20, 9,0, 6,0], fill: 'black', closed: true, opacity: .2}))
      .add(new Konva.Line({points: [2,20, 3,20, 3,0, 2,0], fill: 'white', closed: true, opacity: .5}))
      .add(new Konva.Line({points: [0.5,22, 1,20, 4.5,20, 5,22], fill: 'white', closed: true, opacity: .7})),

    text =  new Konva.Group({
      name: 'draggable input',
      draggable: true
    })
      .add(new Konva.Rect({x:-8, y:-6, width: 46, height: 28, fill: '#c7eeff', name: 'light'}))
      .add(new Konva.Rect({x:-5, y:-3, width: 40, height: 22, stroke: 'blue', strokeWidth: 2, fill: 'white', cornerRadius: 5, name: 'text-container'}))
      .add(new Konva.Text({x: 1, y: 1, text: 'text', fill: 'grey', fontSize: 12, fontFamily: 'Courier New', name: 'text'})),

    number = new Konva.Group({
      name: 'draggable input number',
      draggable: true,
      id: 'num1'
    })
      .add(new Konva.Rect({x:-8, y:-7, width: 23.8, height: 32, fill: '#c7eeff', name: 'light'}))
      .add(new Konva.Rect({x:-5, y:-4, width: 17.8, height: 24, stroke: 'blue', strokeWidth: 2, fill: 'white', name: 'text-container'}))
      .add(new Konva.Text({x: 1, y: 2, text: '1',  fill: 'blue', fontFamily: 'Impact', fontSize: 14, name: 'text'})),


    arrow = new Konva.Group({
      name: 'draggable transform',
      draggable: true
    })
      .add(new Konva.Line({points: [18,-7.5, -12,-11, -7,0, -12,11, 18,7.5, 18,20, 42,0, 18,-20], fill: '#c7eeff', closed: true, name: 'light'}))
      .add(new Konva.Line({points: [0,-6.5, -7,-7.5, -3,0, -7,7.5, 0,6.5], fill: 'white', closed: true}))
      .add(new Konva.Line({points: [0,-6.5, -7,-7.5, -3,0, -7,7.5, 0,6.5], strokeWidth: 2, stroke: 'black'}))

      .add(new Konva.Line({points: [0,-6.5, 22,-4,  22,4, 0,6.5], fill: 'white', closed: true, name: 'body'}))
      .add(new Konva.Line({points: [0,-6.5, 22,-4], strokeWidth: 2, stroke: 'black',name: 'body'}))
      .add(new Konva.Line({points: [0,6.5, 22,4], strokeWidth: 2, stroke: 'black',name: 'body'}))
      .add(new Konva.Line({points: [ -1,-5, 0,-12, 15,0, 0,12, -1,5], x: 22, strokeWidth: 2, stroke: 'black', fill: 'white', closed: true, name: 'head'}))
      .add(new Konva.Line({points: [ -2,-4, -2,4], x: 22, strokeWidth: 5, stroke: 'white', name: 'head'})),


    wall = new Konva.Group({
      name: 'draggable transform',
      draggable: true
    })
      .add(new Konva.Rect({x:-3, y:-11.5, width: 36, height: 23, fill: '#c7eeff', name: 'light'}))
      .add(new Konva.Rect({x:0, y:-8.5, width: 30, height:17, fill: 'black', name: 'body'}))
      .add(new Konva.Rect({x:0, y:-6.5, width: 30, height:13, fill: 'blue', name: 'body color'}))
      .add(new Konva.Rect({x:0, y:-6.5, width: 30, height:7, fill: 'white', opacity: .4, name: 'body'}))
      .add(new Konva.Line({x:0, points: [0,7.5, 0,-7.5], stroke: 'black', strokeWidth: 2}))
      .add(new Konva.Line({x:30, points: [0,7.5, 0,-7.5], stroke: 'black', strokeWidth: 2, name: 'head'})),

    wallRed = wall.clone(),

    ladder = new Konva.Group({
      name: 'draggable transform',
      draggable: true
    })
      .add(new Konva.Rect({x:0, y:0, width:60, height:10, name: 'body', fill: 'transparent', scaleX: 1}))
      .add(new Konva.Line({points: [0,0, 0,15], x:60, y:0, name: 'head', stroke: 'black', strokeWidth: 3}))
      .add(new Konva.Line({points: [0,0, 0,15], x:45, y:0, name: 'middle', stroke: 'black', strokeWidth: 3}))
      .add(new Konva.Line({points: [0,0, 0,15], x:30, y:0, name: 'middle', stroke: 'black', strokeWidth: 3}))
      .add(new Konva.Line({points: [0,0, 0,15], x:15, y:0, name: 'middle', stroke: 'black', strokeWidth: 3}))
      .add(new Konva.Line({points: [0,0, 0,15], x:0, y:0, name: 'middle', stroke: 'black', strokeWidth: 3}))
      .add(new Konva.Line({points: [0,0, 60,0], x:0, y:0, name: 'body', stroke: 'black', strokeWidth: 3}))
      .add(new Konva.Line({points: [0,15, 60,15], x:0, y:0, name: 'body', stroke: 'black', strokeWidth: 3}))
    ,

    img = new Image();

  img.onload = function() {
    ball.add(new Konva.Image({image: img, x:-15, y:-15, width:30, height:30}));
    _this.layers.toolbox.draw();

  };

  img.src = 'ball.png';

  playerRed.find('.color').fill('red');
  judge.find('.color').fill('black');
  judge.find('Text').text('C');
  wallRed.find('.color').fill('red');


  this.layers.toolbox
    .add(player.x(30).y(20))
    .add(playerRed.x(30).y(70))
    .add(judge.x(75).y(20))
    .add(ball.x(65).y(70))
    .add(cone.x(85).y(60))
    .add(text.x(110).y(95))
    .add(number.x(75).y(95))
    .add(arrow.x(20).y(105))
    .add(wall.x(110).y(5).rotation(90))
    .add(wallRed.x(110).y(55).rotation(90))
    .add(ladder.x(140).y(20).rotation(90));

  var titleArr = [
    {text: 'Domestic players', y: 20, xRect: -50, width: 103},
    {text: 'Visiting players', y: 20, xRect: -50, width: 103},
    {text: 'Judge', y: 20, xRect: -10, width: 43},
    {text: 'Ball', xRect: -10, y: 20, width: 30},
    {text: 'Cone', xRect: -45, y: 0, width: 36},
    {text: 'Text', xRect: -10, y: -25, width: 32},
    {text: 'Number', xRect: -15, y: -25, width: 53},
    {text: 'Arrow', xRect: -15, y: -32, width: 40},
    {text: 'Blue wall', xRect:-30, y: 40, width: 57},
    {text: 'Red wall', xRect: -30, y: 40, width: 57},
    {text: 'Ladder', xRect: -10, y: 50, width: 47}
    ];

  this.layers.toolbox.find('.draggable').forEach(function(elem, index) {
    var params = titleArr[index],
    light = elem.find('.light');

    light.visible(false);
    light.cache();
    light.filters([Konva.Filters.Blur]);
    light.blurRadius(2);

    elem.add(new Konva.Group({name: 'title', y: params.y, rotation: -elem.rotation(), visible: false})
      .add( new Konva.Rect({x: params.xRect, y: 0, width: params.width, height: 20, fill: 'rgba(0,0,0,.7)', stroke: 'white', strokeWidth: 2, cornerRadius: 5}))
      .add(new Konva.Text({x: params.xRect + 4, y: 4, fontSize: 12, stroke: 'white', strokeWidth: 1, text: params.text})))
  });


};


Draw.prototype.addButtons = function() {
  var fullCourtModeButton = new Konva.Group({
      id: 'fullCourtModeOn',
      name: 'tlbox-bt'
    })
      .add(new Konva.Rect({x:0, y:0, width: 65, height: 45, fill: '#eabf89', stroke: 'black', strokeWidth: 2}))
      .add(new Konva.Rect({x:3, y:7, width: 59, height: 31, stroke: 'white', strokeWidth: 1, fill: '#ffe0b3'}))
      .add(new Konva.Line({points: [32.5,7, 32.5,38], stroke: 'white', strokeWidth: 1}))
      .add(new Konva.Line({points: [3,8.4, 9.3,8.4], stroke: 'white', strokeWidth: 1}))
      .add(new Konva.Line({points: [3,36.6, 9.3,36.6], stroke: 'white', strokeWidth: 1}))
      .add(new Konva.Arc({x: 9.3, y: 22.5, innerRadius: 14.1, outerRadius: 14.1, stroke: 'white', strokeWidth: 1, rotation: -90, angle: 180}))
      .add(new Konva.Line({points: [62,8.4, 55.7,8.4], stroke: 'white', strokeWidth: 1}))
      .add(new Konva.Line({points: [62,36.6, 55.7,36.6], stroke: 'white', strokeWidth: 1}))
      .add(new Konva.Arc({x: 55.7, y: 22.5, innerRadius: 14.1, outerRadius: 14.1, stroke: 'white', strokeWidth: 1, rotation: 90, angle: 180}))
      .add(new Konva.Circle({x:32.5, y:22.5, radius: 3.8, stroke: 'white', strokeWidth: 1, fill: '#eabf89'}))
      .add(new Konva.Rect({x:3, y:17.25, width: 12.2, height: 10.5, stroke: 'white', strokeWidth: 1, fill: '#eabf89'}))
      .add(new Konva.Rect({x:49.8, y:17.25, width: 12.2, height: 10.5, stroke: 'white', strokeWidth: 1, fill: '#eabf89'}))
      .add(new Konva.Group({name: 'title', x: -15, y: -18, visible: false})
        .add( new Konva.Rect({x: 0, y: 0, width: 60, height: 20, fill: 'rgba(0,0,0,.7)', stroke: 'white', strokeWidth: 2, cornerRadius: 5}))
        .add(new Konva.Text({x: 4, y: 4, fontSize: 12, stroke: 'white', strokeWidth: 1, text: 'Full court'}))),

    halfCourtModeButton = new Konva.Group({
      id: 'halfCourtModeOn',
      name: 'tlbox-bt'
    })
      .add(new Konva.Rect({x:0, y:0, width: 65, height: 45, fill: '#eabf89', stroke: 'black', strokeWidth: 2}))
      .add(new Konva.Rect({x:10, y:3, width: 45, height: 41, stroke: 'white', strokeWidth: 1, fill: '#ffe0b3'}))
      .add(new Konva.Line({points: [12.325,3, 12.325,12], stroke: 'white', strokeWidth: 1}))
      .add(new Konva.Line({points: [52.675,3, 52.675,12], stroke: 'white', strokeWidth: 1}))
      .add(new Konva.Arc({x: 32.875, y: 12, innerRadius: 20.25, outerRadius: 20.25, stroke: 'white', strokeWidth: 1, angle: 180}))
      .add(new Konva.Rect({x:25.25, y:3, width: 14.7, height: 17.7, stroke: 'white', strokeWidth: 1, fill: '#eabf89'}))
      .add(new Konva.Arc({x: 32.5, y: 44, outerRadius: 5.4, stroke: 'white', strokeWidth: 1,  fill: '#eabf89', angle: 180, rotation: 180}))
      .add(new Konva.Group({name: 'title', x: -15, y: -18, visible: false})
        .add( new Konva.Rect({x: 0, y: 0, width: 60, height: 20, fill: 'rgba(0,0,0,.7)', stroke: 'white', strokeWidth: 2, cornerRadius: 5}))
        .add(new Konva.Text({x: 4, y: 4, fontSize: 12, stroke: 'white', strokeWidth: 1, text: 'Half court'}))),

    deleteModeButton = new Konva.Group({
      id: 'deleteModeOn',
      name: 'tlbox-bt',
      opacity: .7
    })
      .add(new Konva.Rect({x:0, y:0, width: 63, height: 35, cornerRadius: 5, fill: 'rgba(0,0,0,.7)', stroke: 'white', strokeWidth: 2}))
      .add(new Konva.Text({x:3, y:10, text: 'DELETE', fill: 'white', fontSize: 15})),

    clearButton = new Konva.Group({
      id: 'clearCourt',
      name: 'tlbox-bt'
    })
      .add(new Konva.Rect({x:0, y:0, width: 63, height: 35, cornerRadius: 5, fill: 'rgba(0,0,0,.7)', stroke: 'white', strokeWidth: 2}))
      .add(new Konva.Text({x:8, y:10, text: 'CLEAR', fill: 'white', fontSize: 15})),

    addFrameButton = new Konva.Group({
      id: 'addFrame',
      name: 'frm-bt'
    })
      .add(new Konva.Rect({x:0, y:0, width: 60, height: 25, cornerRadius: 8, fill: 'rgba(0,0,0,.7)', stroke: 'white', strokeWidth: 2}))
      .add(new Konva.Text({x:12, y:5, text: 'ADD', fill: 'white', fontSize: 18})),

    showFramesButton = new Konva.Group({
      id: 'showFrames',
      name: 'frm-bt'
    })
      .add(new Konva.Rect({x:0, y:0, width: 60, height: 25, cornerRadius: 8, fill: 'rgba(0,0,0,.7)', stroke: 'white', strokeWidth: 2}))
      .add(new Konva.Text({x:16, y:5, text: 'ALL', fill: 'white', fontSize: 18})),

    saveJPGButton = new Konva.Group({
      id: 'saveJpg',
      name: 'tlbox-bt'
    })
      .add(new Konva.Rect({x:0, y:0, width: 60, height: 25, cornerRadius: 8, fill: 'rgba(0,0,0,.7)', stroke: 'white', strokeWidth: 2}))
      .add(new Konva.Text({x:12, y:5, text: 'JPG', fill: 'white', fontSize: 18})),

    savePDFButton = new Konva.Group({
      id: 'savePdf',
      name: 'tlbox-bt'
    })
      .add(new Konva.Rect({x:0, y:0, width: 60, height: 25, cornerRadius: 8, fill: 'rgba(0,0,0,.7)', stroke: 'white', strokeWidth: 2}))
      .add(new Konva.Text({x:13, y:5, text: 'PDF', fill: 'white', fontSize: 18})),


    moveModeButton = new Konva.Group({
      id: 'moveModeOn',
      name: 'tlbox-bt mode-tlbox-bt',
      visible: false,
      opacity: 1
    })
      .add(new Konva.Rect({x:0, y:0, width: 70, height: 28, cornerRadius: 12.5, fill: 'rgba(0,0,0,.7)', stroke: 'white', strokeWidth: 2}))
      .add(new Konva.Text({x:12, y:6, text: 'MOVE', fill: 'white', fontSize: 16})),

    transformModeButton = new Konva.Group({
      id: 'transformModeOn',
      name: 'tlbox-bt mode-tlbox-bt',
      visible: false,
      opacity: .7
    })
      .add(new Konva.Rect({x:0, y:0, width: 125, height: 28, cornerRadius: 12.5, fill: 'rgba(0,0,0,.7)', stroke: 'white', strokeWidth: 2}))
      .add(new Konva.Text({x:12, y:6, text: 'TRANSFORM', fill: 'white', fontSize: 16})),

    deleteElemButton = new Konva.Group({
      id: 'deleteElem',
      name: 'tlbox-bt',
      visible: false
    })
      .add(new Konva.Rect({x:0, y:0, width: 85, height: 28, cornerRadius: 12.5, fill: 'rgba(0,0,0,.7)', stroke: 'white', strokeWidth: 2}))
      .add(new Konva.Text({x:12, y:6, text: 'DELETE', fill: 'white', fontSize: 16}))
  ;

  this.layers.toolbox
    .add(new Konva.Text({x:42, y:200, text: 'C O U R T   M O D E', fontSize: 8, fill: 'black'}))
    .add(fullCourtModeButton.x(7.5).y(210))
    .add(halfCourtModeButton.x(77.5).y(210))
    .add(deleteModeButton.x(9).y(264))
    .add(clearButton.x(78).y(264))
    .add(new Konva.Text({x:6, y:307, text: 'A N I M A T I O N   F R A M E S',  fontSize: 9, fill: 'white'}))
    .add(addFrameButton.x(13).y(320))
    .add(showFramesButton.x(78).y(320))
    .add(new Konva.Text({x:32, y:352, text: 'S A V E   I M A G E', fontSize: 10, fill: 'white'}))
    .add(saveJPGButton.x(13).y(365))
    .add(savePDFButton.x(78).y(365))
    .add(moveModeButton.x(-435).y(370))
    .add(transformModeButton.x(-340).y(370))
    .add(deleteElemButton.x(-150).y(370))
    .draw();

};


Draw.prototype.toolbox = function() {

  this.layers.toolbox.x(650);

  this.addToolboxBG();
  this.addLineButtons();
  this.addObjects();
  this.addButtons();

};


Draw.prototype.framesLayer = function() {

  var background = new Konva.Group({x:0, y:0, name:'frBG'})
    .add( new Konva.Rect({x:0, y:0, width: 800, height: 400, fill: 'black', opacity: .7})),

    buttons = {
      deleteButton: new Konva.Group({
        id: 'deleteFrames',
        y: 360,
        opacity: .7
      })
        .add(new Konva.Rect({x:0, y:0, width: 77, height: 32, cornerRadius: 8}))
        .add(new Konva.Text({text: 'DELETE'})),

      clearButton: new Konva.Group({
        id: 'clearFrames',
        y: 360
      })
        .add(new Konva.Rect({x:0, y:0, width: 70, height: 32, cornerRadius: 8}))
        .add(new Konva.Text({text: 'CLEAR'})),

      loadButton: new Konva.Group({
        id: 'loadFrame',
        y: 360
      })
        .add(new Konva.Rect({x:0, y:0, width: 120, height: 32, cornerRadius: 8}))
        .add(new Konva.Text({text: 'LOAD IMAGE'})),

      savePDFButton: new Konva.Group({
        id: 'saveFramesAsPdf',
        y: 360
      })
        .add(new Konva.Rect({x:0, y:0, width: 120, height: 32, cornerRadius: 8}))
        .add(new Konva.Text({text: 'SAVE AS PDF'})),

      saveGIFButton: new Konva.Group({
        id: 'saveFramesAsGif',
        y: 360
      })
        .add(new Konva.Rect({x:0, y:0, width: 115, height: 32, cornerRadius: 8}))
        .add(new Konva.Text({text: 'SAVE AS GIF'})),

      closeButton: new Konva.Group({
        id: 'closeFrames',
        y: 360
      })
        .add(new Konva.Rect({x:0, y:0, width: 70, height: 32, cornerRadius: 8}))
        .add(new Konva.Text({text: 'CLOSE'})),

      toPrevButton: new Konva.Group({
        id: 'toPrevPage'
      })
        .add(new Konva.Line({points: [0,0, 10,8, 8,4, 35,4, 35,-4, 8,-4, 10,-8], closed: true})),

      toPrevFrameButton: new Konva.Group({
        id: 'toPrevFrame',
        visible: false
      })
        .add(new Konva.Line({points: [0,-15, -20,0, 0,15], closed: true, tension: 0.2}))

  };

  buttons.toNextButton = buttons.toPrevButton.clone().id('toNextPage').scaleX(-1);
  buttons.toNextFrameButton = buttons.toPrevFrameButton.clone().id('toNextFrame').scaleX(-1);

  for (var button in buttons) {
    buttons[button].name('frm-bt');
    buttons[button].find('Rect').stroke('white').strokeWidth(2).fill('rgba(0,0,0,.7)');
    buttons[button].find('Line').stroke('white').strokeWidth(2).fill('rgba(0,0,0,.7)');
    buttons[button].find('Text').fill('white').fontSize(16).x(10).y(9);
  }

  this.layers.frames
    .add(background)
    .add(buttons.deleteButton.x(25))
    .add(buttons.clearButton.x(125))
    .add(buttons.loadButton.x(260))
    .add(buttons.savePDFButton.x(400))
    .add(buttons.saveGIFButton.x(540))
    .add(buttons.closeButton.x(720))
    .add(buttons.toNextButton.x(500).y(330))
    .add(buttons.toPrevButton.x(250).y(330))
    .add(buttons.toPrevFrameButton.x(75).y(190))
    .add(buttons.toNextFrameButton.x(725).y(190));

};
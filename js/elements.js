var Elements = function(stage, layers) {
  var _this = this;

  this.stage = stage;
  this.layers = layers;

  this.input = false;
  this.drawing = false;
  this.transformShape = false;
  this.drawingTool = false;
  this.drawingLine = false;

  this.tools = Tools;
  this.pointCount = 2;

  this.inputElem = document.getElementById('text-input');
  this.inputElem.style.display = 'none';
  this.inputElem.addEventListener('keypress', function(event) {
    _this.isEnter(event);
  });

  this.inputElem.addEventListener('input', function(event) {
    _this.setInputWidth();
  })

};


Elements.prototype.cloneElement = function(element) {
  var id = element.id() || '',
    clone = element.clone({x: element.x(), y: element.y()}),
    _this = this;

  this.layers.toolbox.add(clone);
  element.find('.title').visible(false);
  clone.find('.light').visible(true);

  if(id) {
    clone.id(id.slice(0,-1) + (+id.slice(-1)+1));
    element
      .findOne('.text')
      .text(id.slice(-1));

    if(clone.name().indexOf('input')!==-1)
      clone
        .findOne('.text')
        .text(clone.id().slice(-1));
  }

  element.setZIndex(2);
  clone.setZIndex(1);
  element.find('.title').destroy();
  clone.find('.title').visible(false);

  element.on('touchend mouseup', function() {
    var inputClass = element.name().indexOf('input') !== -1
        ? ' input'
        : '',
      transformClass = element.name().indexOf('transform') !== -1
        ? ' transform'
        : '';

    _this.layers.elements
      .add(
        element
          .clone({x: element.x(), y: element.y()})
          .off('touchstart mousedown')
          .name('selectable' + inputClass + transformClass) )
      .draw();

    element.destroy();
    clone.find('.light').visible(false);
    _this.layers.toolbox.draw();
  });
};


Elements.prototype.startTransform = function(target) {
  var _this = this;

  this.transformShape = target;

  this.stage.on('mousemove', function() {
    _this.transform();
  });

  this.stage.on('mouseup', function() {
    _this.stopTransform();
  });

};

Elements.prototype.stopTransform = function() {
  this.transform();
  this.transformShape = false;
  this.stage.off('mousemove').off('mouseup');
};

Elements.prototype.transform = function() {

  var body = this.transformShape.find('.body'),
    head = this.transformShape.find('.head'),
    middle = this.transformShape.find('.middle'),
    bodyLength = head[0].x(),
    pos = this.stage.getPointerPosition(),
    pos0 = {x: this.transformShape.x() + 650, y: this.transformShape.y()},
    h = Math.sqrt(Math.pow((pos.x - pos0.x), 2) + Math.pow((pos.y - pos0.y), 2)),
    scale = h / bodyLength * body[0].scaleX(),
    angle = Math.acos( (pos.x - pos0.x) / h ) *  Math.sign(pos.y - pos0.y)
      / Math.PI * 180;

  if (middle)
    middle.forEach( function(elem) {elem.x(elem.x() * scale / body[0].scaleX())} );
  body.scaleX(scale);
  head.x(h);

  this.transformShape.rotation(angle || 0);

  this.layers.elements.draw();
};

Elements.prototype.editText = function(clicked) {
  var textElement = clicked.findOne('.text');

  this.input = clicked;
  clicked.draggable(false);

  this.inputElem.style.display = 'block';
  this.inputElem.style.left = clicked.x() + 650 + 'px';
  this.inputElem.style.top = clicked.y()  +  'px';
  this.inputElem.style.width =  textElement.width() + 'px';
  this.inputElem.style.height =  textElement.height() + 'px';
  this.inputElem.style.lineHeight =  textElement.height() + 'px';
  this.inputElem.style.fontFamily =  textElement.fontFamily();
  this.inputElem.style.fontSize =  textElement.fontSize() + 'px';
  this.inputElem.style.color =  textElement.fill();
  this.inputElem.value = textElement.text() || '';
};

Elements.prototype.setInputWidth = function() {
  var textElement = this.input.findOne('.text');

  textElement.text(this.inputElem.value);
  this.inputElem.style.width = textElement.getWidth() + 'px';
  this.input.findOne('.text-container').width(textElement.getWidth() + 12);
  this.layers.elements.draw();
};


Elements.prototype.saveText = function() {
  this.setInputWidth();
  this.inputElem.style.display = 'none';
  this.input.draggable(true);
  this.input = false;
};


Elements.prototype.isEnter = function(event) {
  if (event.keyCode === 13 && this.input)
    this.saveText();
};


Elements.prototype.stopDraw = function() {
  this.drawingTool = false;
  this.drawing = false;
  this.pointCount = 2;
};


Elements.prototype.setDrawingTool = function(id) {
  this.drawingTool = id;
  this.drawingLine = false;
};


Elements.prototype.startDraw = function() {
  switch (this.drawingTool) {
    case 'arrow-full':
    case 'arrow-dashed':

      this.drawStraightLine();
      break;

    case 'arrow-curved':
    case 'line-curved':

      this.drawCurvedLine();
      break;
  }
};


Elements.prototype.drawStraightLine = function() {
  var pos = this.stage.getPointerPosition(),
    lineAttrs = this.tools[this.drawingTool].params,
    _this = this;

    lineAttrs.points = [pos.x, pos.y];
    this.drawingLine = new Konva.Arrow(lineAttrs);

    this.layers.lines
      .add( new Konva.Group()
        .name('selectable')
        .add(this.drawingLine));

  this.stage.on('mousemove touchmove', function() {
    var pos = _this.stage.getPointerPosition();

    _this.drawingLine.points(_this.drawingLine.points().slice(0,2).concat([pos.x, pos.y]));
    _this.layers.lines.draw();
  });

  this.stage.on('touchend mouseup ', function () {
    var pos = _this.stage.getPointerPosition();

    _this.drawingLine.points(_this.drawingLine.points().slice(0,2).concat([pos.x, pos.y]));
    _this.layers.lines.draw();
    _this.drawingLine = false;
    _this.stage.off('mousemove touchmove').off('mouseup touchend');
  });

};

Elements.prototype.drawCurvedLine = function() {
  var pos = this.stage.getPointerPosition(),
    lineAttrs = this.tools[this.drawingTool].params,
    _this = this;

  lineAttrs.points = [pos.x, pos.y];
  this.drawingLine = new Konva[this.tools[this.drawingTool].type](lineAttrs);

  this.layers.lines
    .add( new Konva.Group()
      .name('selectable')
      .add(this.drawingLine));

  this.stage.on('mousemove touchmove', function() {
    _this.pointCount++;
    if (_this.pointCount>2) {
      var pos = _this.stage.getPointerPosition();
      _this.count = 0;
      _this.drawingLine.points(_this.drawingLine.points().concat([pos.x, pos.y]));
      _this.layers.lines.draw();
    }
  });

  this.stage.on('mouseup touchend', function () {
    _this.drawingLine = false;
    _this.stage.off('mousemove touchmove').off('mouseup touchend');
  });

};

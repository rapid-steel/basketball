window.onload = function() {
  var court = new Court();
  court.init();
};


function Court() {
  this.element = document.getElementById('canvas-container');
}


Court.prototype.init = function() {

  this.stage = new Konva.Stage({
    container: this.element,
    width: 800,
    height: 400
  });

  this.layers = {};
  [ 'background', 'lines', 'toolbox', 'elements', 'frames' ].forEach(function(key) {
    this.layers[key] = new Konva.Layer();
    this.stage.add(this.layers[key]);
  }, this);

  this.draw = new Draw(this.layers);
  this.frames = new Frames(this.stage, this.layers.frames);
  this.toolbox = new Toolbox(this.stage, this.layers);
  this.elements = new Elements(this.stage, this.layers);
  this.tools = Tools;

  this.render();
  this.delegateEvents();
};


Court.prototype.render = function() {
  this.draw.background();
  this.draw.toolbox();
  this.draw.framesLayer();
};


Court.prototype.delegateEvents = function() {
  var _this = this;

  this.stage.find('.draggable, .line-bt, .tlbox-bt, .frame, .frm-bt')
    .on('mouseover', function (event) {
      _this.stage.container().style.cursor = 'pointer';
      var group = event.target.parent,
        title = group.find('.title');
      if (title) {
        group.setZIndex(100);
        title.visible(true);
        _this.layers.toolbox.draw();
      }
    })
    .on('mouseout', function (event) {
      _this.stage.container().style.cursor = 'default';
      var group = event.target.parent,
        title = group.find('.title');
      if (title) {
        title.visible(false);
        group.setZIndex(1);
        _this.layers.toolbox.draw();
      }
    });

  this.stage.find('.line-bt').on('touchend mouseup', function() {
    this.find('.light').visible(false);
  });

  this.stage.on('touchstart mousedown', function(event) {
    _this.onMousedownStage(event);
  });


  this.stage.on('tap click', function(event) {
    _this.onClickStage(event);
  });

};


Court.prototype.onMousedownStage = function(event) {
  var mousedGroup = event.target.parent,
    name = mousedGroup.name() || '';

  this.stage.find('.mode-tlbox-bt').visible(
    name.indexOf('transform')!==-1 || name.indexOf('mode-tlbox-bt')!==-1
  );

  if (this.elements.drawingTool && this.stage.getPointerPosition().x < 650)
    this.elements.startDraw();
  else this.elements.stopDraw();

  if(name.indexOf('draggable')!==-1) {
    this.toolbox.moveModeOn();
    this.elements.cloneElement(mousedGroup);
  }

  if(name==='line-bt') {
    mousedGroup.find('.light').visible(true);
    this.elements.setDrawingTool(mousedGroup.id());
  }


  if(name.indexOf('selectable')!==-1) {
    this.toolbox.selectElem(mousedGroup);
  } else
    if(mousedGroup.id()!=='deleteElem') {
      this.stage.find('#deleteElem').visible(false);
      this.toolbox.selected = false;
    }

  if(name=='selectable transform'
    && this.toolbox.editMode=='transform')
    switch (event.type) {
      case 'mousedown':
        this.elements.startTransform(mousedGroup) ;
        break;
      case 'touchstart':
        mousedGroup.rotation(mousedGroup.rotation() + 45);
        break;

    }

  this.layers.toolbox.draw();
};


Court.prototype.onClickStage = function(event) {
  var clickedGroup = event.target.parent,
    name = clickedGroup.name() || '';

  if (this.elements.input)
    this.elements.saveText();

  if(name.indexOf('input')!==-1 && !this.toolbox.deleteMode)
    this.elements.editText(clickedGroup);

  if(name.indexOf('selectable')!==-1)
    this.elements.stopDraw();


  if(name.indexOf('tlbox-bt')!==-1)
    this.toolbox[clickedGroup.id()]();


  if(name.indexOf('frm-bt')!==-1)
    this.frames[clickedGroup.id()]();


  if(name.indexOf('frame')!==-1)
    this.frames.onClick(clickedGroup);

  if(name == 'frBG')
    this.frames.hideFrameFull();

  this.layers.toolbox.draw();

};






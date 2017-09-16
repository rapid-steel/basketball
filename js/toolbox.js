var Toolbox = function(stage, layers) {
  this.stage = stage;
  this.layers = layers;

  this.selected = false;
  this.editMode = 'move';
  this.courtMode = 'full';
  this.deleteMode = false;

};

Toolbox.prototype.moveModeOn = function() {
  this.editMode = 'move';
  this.stage.find('.transform').draggable(true);
  this.layers.toolbox.find('#moveModeOn').opacity(1);
  this.layers.toolbox.find('#transformModeOn').opacity(.7);
};

Toolbox.prototype.transformModeOn = function() {
  this.editMode = 'transform';
  this.stage.find('.transform').draggable(false);
  this.stage.find('.draggable').draggable(true);
  this.layers.toolbox.find('#moveModeOn').opacity(.7);
  this.layers.toolbox.find('#transformModeOn').opacity(1);
};


Toolbox.prototype.fullCourtModeOn = function() {
  this.courtMode = 'full';

  this.layers.background
    .scaleX(1)
    .scaleY(1)
    .rotation(0)
    .x(1)
    .draw();

  this.clearCourt();
};


Toolbox.prototype.halfCourtModeOn = function() {
  var width = 650,
    height = 400,
    scale = (height - 20) / (width  - 20) * 2,
    x = width - 15/28*(height - 20)/2 +10;

  this.layers.background
    .scaleX(scale)
    .scaleY(scale)
    .rotation(90)
    .x(x)
    .draw();

  this.clearCourt();

};

Toolbox.prototype.selectElem = function(elem) {

  this.stage.find('#deleteElem').visible(true);
  this.selected = elem;
  if (this.deleteMode)
    this.deleteElem();

  this.layers.toolbox.draw();

};

Toolbox.prototype.deleteElem = function() {
  this.selected.destroy();
  this.layers.elements.draw();
  this.layers.lines.draw();
  this.stage.find('#deleteElem').visible(false);
};


Toolbox.prototype.deleteModeOn = function() {
  var op;

  this.deleteMode = !this.deleteMode;
  op = this.deleteMode ? 1 : .7;
  this.layers.toolbox.find('#deleteModeOn').opacity(op);
};


Toolbox.prototype.clearCourt = function() {
  this.layers.elements.find('Group').destroy();
  this.layers.elements.draw();

  this.layers.toolbox.find('.number').forEach( function(player) {
    player.id(player.id().slice(0, -1) + 1);
  });
  this.layers.lines.find('Group').destroy();
  this.layers.lines.draw();
};


Toolbox.prototype.saveJpg = function() {
  var dataUrl = this.stage.toDataURL({
    mimeType: "image/jpg",
    x: 0, y: 0,
    width: 650,
    height: 400});
  window.open(dataUrl);
};

Toolbox.prototype.savePdf = function() {
  var dataUrl = this.stage.toDataURL({
      mimeType: "image/jpg",
      x: 0, y: 0,
      width: 650,
      height: 400}),
    xhr = new XMLHttpRequest();

  xhr.open('POST', 'make-pdf.php');
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

  xhr.onload = function() {
    window.open('/basketball/' + xhr.responseText);
  };

  xhr.send(JSON.stringify({data: [dataUrl]}));

};
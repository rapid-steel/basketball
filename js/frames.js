var Frames = function(stage, layer) {
  var _this = this;

  this.stage = stage;
  this.layer = layer;
  this.animationFrames = [];
  this.framesPage = 1;
  this.frameFull = false;
  this.deleteFramesMode = false;

  this.imgInputLabel = document.getElementById('img-input-label');
  this.imgInputLabel.style.display = 'none';

  document.getElementById('img-input').addEventListener('change', function () {
    _this.loadFrame();
  });

};


Frames.prototype.rearrangeFrames = function() {

  this.layer.find('.frame').forEach(function(frame, index) {
    frame.x(15 + 160*(index % 5)).y(15 + 100*(Math.floor((index % 15) / 5)));
  });

  if(this.animationFrames.length / 15 + 1 <= this.framesPage && this.framesPage!==1)
    this.framesPage--;

  this.showFrames();
};


Frames.prototype.showFrames = function() {

  this.layer.find('.frame').forEach(function(frame, index) {
    if (index < this.framesPage*15 && index >= (this.framesPage-1)*15)
      frame.show();
    else
      frame.hide();
  }, this);

  this.layer
    .find('#toNextPage')
    .visible(this.animationFrames.length/15 > this.framesPage);

  this.layer
    .find('#toPrevPage')
    .visible(this.framesPage > 1);

  this.layer.show().draw();
  this.imgInputLabel.style.display = 'block';

};


Frames.prototype.closeFrames = function() {

  if (this.frameFull!==false)
    this.hideFrameFull();

  this.layer.hide().draw();
  this.imgInputLabel.style.display = 'none';

};



Frames.prototype.onClick = function(clicked) {

  var index = this.layer.find('.frame').indexOf(clicked);

  if (this.deleteFramesMode) {
    this.animationFrames.splice(index, 1);
    if(this.frameFull)
      this.hideFrameFull();
    clicked.destroy();
    this.rearrangeFrames();
  } else {
    this.frameFull = index;
    this.showFrameFull();
  }

};

Frames.prototype.addFrame = function() {

  var dataUrl = this.stage.toDataURL({
      mimeType: "image/jpg",
      x: 0, y: 0,
      width: 650,
      height: 400}),
    _this = this,
    img = new Image(),
    index = this.animationFrames.length;

  img.src = dataUrl;

  img.onload = function() {
    _this.drawNewFrame(img, index);
  };

};


Frames.prototype.loadFrame = function() {

  var formData = new FormData(),
    xhr = new XMLHttpRequest(), _this = this;

  formData.append('img', document.getElementById('img-input').files[0]);

  xhr.open('POST', 'load-img.php');
  xhr.onload = function() {

    var img = new Image();

    img.onload = function() {
      _this.drawNewFrame(img, _this.animationFrames.length);
      _this.showFrames();
    };
    img.src = xhr.responseText;
  };

  xhr.send(formData);

};


Frames.prototype.drawNewFrame = function(img, index) {
  var newFrame = new Konva.Group({name: 'frame', visible: false})
    .add(new Konva.Rect({x: -20, y: -20, width: 690, height: 440, stroke: 'white', strokeWidth: 8, cornerRadius: 25, name: 'border'}))
    .add(new Konva.Image({image: img, x:0, y:0, width: 650, height: 400}));

  this.layer
    .add(newFrame.scaleX(.2).scaleY(.2).x(15 + 160*(index % 5)).y(15 + 100*(Math.floor((index % 15) / 5))));
  this.animationFrames.push(img.src);

};


Frames.prototype.showFrameFull = function() {

  this.layer.find('.frame').hide();

  this.layer.find('.frame')[this.frameFull]
    .show()
    .scaleX(.85)
    .scaleY(.85)
    .x(123.75)
    .y(10)
    .find('.border').hide();

  this.layer.find('#toPrevFrame').visible(this.frameFull!==0);
  this.layer.find('#toNextFrame').visible(this.frameFull!==this.animationFrames.length - 1);

  this.layer.draw();

};

Frames.prototype.hideFrameFull = function() {
  if (this.frameFull!==false) {
    this.layer.find('.frame')[this.frameFull]
      .scaleX(.2)
      .scaleY(.2)
      .x(15 + 160*(this.frameFull % 5))
      .y(15 + 100*(Math.floor((this.frameFull % 15) / 5)))
      .find('.border').show();

    this.frameFull = false;
    this.showFrames();

    this.layer.find('#toPrevFrame').hide();
    this.layer.find('#toNextFrame').hide();

    this.layer.draw();
  }

};

Frames.prototype.toNextFrame = function() {
  var frame = this.frameFull;
  this.hideFrameFull();
  this.frameFull = frame +1;
  this.showFrameFull();
};

Frames.prototype.toPrevFrame = function() {
  var frame = this.frameFull;
  this.hideFrameFull();
  this.frameFull = frame - 1;
  this.showFrameFull();
};



Frames.prototype.deleteFrames = function() {
  var op;

  this.deleteFramesMode = !this.deleteFramesMode;
  op = this.deleteFramesMode ? 1 : .7;
  this.layer.find('#deleteFrames').opacity(op);
  this.layer.draw();

};

Frames.prototype.clearFrames = function() {

  this.animationFrames = [];
  this.framesPage = 1;
  this.frameFull = false;
  this.layer.find('.frame').destroy();
  this.layer.draw();

};



Frames.prototype.toNextPage = function() {
  if (this.animationFrames.length/15 > this.framesPage)
    this.framesPage++;

  this.showFrames();
};

Frames.prototype.toPrevPage = function() {
  if (this.framesPage > 1)
    this.framesPage--;

  this.showFrames();
};



Frames.prototype.saveFramesAsPdf = function() {
  this.sendReq('make-pdf.php');
};


Frames.prototype.saveFramesAsGif = function() {
  this.sendReq('make-gif.php');
};


Frames.prototype.sendReq = function(url) {
  var xhr = new XMLHttpRequest();

  xhr.open('POST', url);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

  xhr.onload = function() {
    window.open('/basketball/' + xhr.responseText);
  };

  xhr.send(JSON.stringify({data: this.animationFrames}));
};
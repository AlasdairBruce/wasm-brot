export class RectSelector {
  constructor(canvas, onSelect) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.offset = offset(canvas);
    this.startX = this.mouseX = -1;
    this.startY = this.mouseY = -1;
    this.isDown = false;
    this.isDrawing = false;
    this.onSelect = onSelect;
    this.autoSelect = true;

    var self = this;
    canvas.addEventListener('mousedown', function(e) {
      self.mousedown(e);
    });
    canvas.addEventListener('mouseup', function(e) {
      self.mouseup(e);
    });
    canvas.addEventListener('mousemove', function(e) {
      self.mousemove(e);
    });
    canvas.addEventListener('dblclick', function(e) {
      self.dblclick(e);
    });
    window.addEventListener('keyup', function(e) {
      if (e.keyCode >= 38 && e.keyCode <= 40) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });
    window.addEventListener('keydown', e => {
      if (e.keyCode >= 37 && e.keyCode <= 40) {
        var dx = e.keyCode == 37 ? -1 : e.keyCode == 39 ? 1 : 0;
        var dy = e.keyCode == 38 ? -1 : e.keyCode == 40 ? 1 : 0;
        dx = dx * 25;
        dy = dy * 25;
        e.preventDefault();
        e.stopPropagation();
        this.onSelect(dx, dy, this.canvas.width + dx, this.canvas.height + dy);
        return false;
      }
    });
  }
  
  mousedown(e) {
    this.aspect = canvas.height * 1.0 / canvas.width * 1.0;
    this.isDown = true;
  }

  mouseup(e) {
    this.canvas.style.cursor = "default";
    if (this.isDown || (this.isDrawing && this.autoSelect)) {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      var ex = parseInt(e.clientX - this.offset.left);
      var ey = parseInt(e.clientY - this.offset.top);
      var mnx = Math.min(this.startX, this.mouseX);
      var mxx = Math.max(this.startX, this.mouseX);
      var mny = Math.min(this.startY, this.mouseY);
      var mxy = Math.max(this.startY, this.mouseY);
      if ((this.isDrawing && this.autoSelect) || (ex > mnx && ex < mxx && ey > mny && ey < mxy)) {
        this.onSelect(mnx, mny, mxx, mxy);
      }
    }
    this.isDown = false;
    this.isDrawing = false;
  }


  dblclick(e) {
    var ex = parseInt(e.clientX - this.offset.left);
    var ey = parseInt(e.clientY - this.offset.top);
    var dx = this.canvas.width / 10.0;
    var dy = this.canvas.height / 10.0;
    var mnx = Math.min(this.canvas.width - dx, Math.max(0, ex - dx / 2.0));
    var mxx = Math.round(mnx + dx);
    var mny = Math.min(this.canvas.height - dy, Math.max(0, ey - dy / 2.0));
    var mxy = Math.round(mny + dy);
    var self = this;
    this.onSelect(mnx, mny, mxx, mxy);
  }

  mousemove(e) {
    if (this.isDown) {
      this.isDown = false;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.canvas.style.cursor = "crosshair";
      this.startX = parseInt(e.clientX - this.offset.left);
      this.startY = parseInt(e.clientY - this.offset.top);
      this.isDrawing = true;
    }
    if (this.isDrawing) {
      this.mouseX = parseInt(e.clientX - this.offset.left);
      var ey = parseInt(e.clientY - this.offset.top);
      var sgn = Math.sign(ey - this.startY) * Math.sign(this.mouseX - this.startX);
      this.mouseY = this.startY + this.aspect * sgn * (this.mouseX - this.startX);
    
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.ctx.beginPath()
      this.ctx.rect(this.startX, this.startY, this.mouseX - this.startX, this.mouseY - this.startY);
      this.ctx.stroke();
    }
  }
}

function offset(elem) {
  if ( !elem ) {
    return;
  }

  var rect = elem.getBoundingClientRect();

  // Make sure element is not hidden (display: none) or disconnected
  if (rect.width || rect.height || elem.getClientRects().length) {
    var doc = elem.ownerDocument;
    var win = doc.defaultView || doc.parentWindow;
    var docElem = doc.documentElement;
    return {
      top: rect.top + win.pageYOffset - docElem.clientTop,
      left: rect.left + win.pageXOffset - docElem.clientLeft
    };
  }
}


export class Example {
  constructor(example) {
    this.example = example;

    this.x = example.querySelector("#exampleX");
    this.y = example.querySelector("#exampleY");
    this.i = example.querySelector("#exampleI");
    this.go = example.querySelector("#exampleGo");
    this.stop = example.querySelector("#exampleStop");
    this.status = example.querySelector("#exampleStatus");

    this.axes = example.querySelector(".axes");
    this.anim = example.querySelector(".anim");

    this.go.onclick = () => this.startAnimation();
    this.stop.onclick = () => this.stopAnimation();

    this.anim.style.width = this.axes.clientWidth + "px";
    this.anim.style.height = this.axes.clientHeight + "px";

    new ResizeObserver(() => {
      console.log("Resize: " + [this.axes.clientWidth, this.axes.clientHeight]);
      this.anim.style.width = this.axes.clientWidth + "px";
      this.anim.style.height = this.axes.clientHeight + "px";
      this.drawAxes();
      if (this.animation) {
        clearInterval(this.animation);
      }
    }).observe(this.axes);

    this.drawAxes();
  }

  show(x, y) {
    this.x.value = x;
    this.y.value = y;
    this.startAnimation();
  }

  calculateSizes() {
    var w = this.axes.width;
    var h = this.axes.height;

    var ox = w / 2;
    var oy = h / 2;

    var unit = (w > h) ? (h - 10) / 4.0 : (w - 10) / 4.0;

    return { w: w, h: h, ox: ox, oy: oy, unit: unit }
  }

  translatePoint(sz, x, y) {
    return [ sz.ox + Math.round(x * sz.unit), sz.oy + Math.round(y * sz.unit) ];
  }

  drawAxes() {
    var ctx = this.axes.getContext("2d");
    var sz = this.calculateSizes();

    console.log("drawAxes");
    console.log(sz);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.clearRect(0, 0, sz.w, sz.h);
    ctx.beginPath();
    ctx.moveTo(sz.ox - 2 * sz.unit - 10, sz.oy);
    ctx.lineTo(sz.ox + 2 * sz.unit + 10, sz.oy);
    ctx.stroke();
    ctx.moveTo(sz.ox, sz.oy - 2 * sz.unit - 10);
    ctx.lineTo(sz.ox, sz.oy + 2 * sz.unit + 10);
    ctx.stroke();

    var ticks = [ [-2, 0], [-1, 0], [1, 0], [2, 0], [0, -2], [0, -1], [0, 1], [0, 2] ]
    for (const tick of ticks) {
      var dx = Math.abs(Math.sign(tick[1]));
      var dy = Math.abs(Math.sign(tick[0]));
      ctx.moveTo(sz.ox + tick[0] * sz.unit - dx * 5, sz.oy + tick[1] * sz.unit - dy * 5);
      ctx.lineTo(sz.ox + tick[0] * sz.unit + dx * 5, sz.oy + tick[1] * sz.unit + dy * 5);
      ctx.stroke();
    }
  }

  startAnimation() {
    var x = parseFloat(this.x.value);
    var y = parseFloat(this.y.value);
    var i = parseInt(this.i.value);

    console.log('startAnimation: ' + [x,y,i]);

    if (isNaN(x) || isNaN(y) || isNaN(i)) {
      return;
    }

    console.log("Update: " + [x, y]);
    this.animate(x, y, i);
  }

  animate(x, y, i) {
    if (this.animation) {
      clearInterval(this.animation);
    }
    var ctx = this.anim.getContext("2d");
    var sz = this.calculateSizes();
    var z = { x: 0.0, y: 0.0, i: 0, tail: [] };
    ctx.clearRect(0, 0, sz.w, sz.h);
    this.status.innerText = '';
    this.go.style.display = 'none'
    this.stop.style.display = 'inline';
    this.animation = setInterval(() => {
      this.iterate(ctx, sz, i, x, y, z);
    }, 10);
  }

  stopAnimation() {
    if (this.animation) {
      clearInterval(this.animation);
      this.animation = null;
    }
    this.go.style.display = 'inline';
    this.stop.style.display = 'none';
  }
    

  iterate(ctx, sz, maxIters, cx, cy, z) {
    var pt = this.translatePoint(sz, z.x, z.y);
    z.tail.push(pt)
    if (z.tail.length > 10) {
      z.tail.shift();
    }

    if (z.x * z.x + z.y * z.y > 4.0 || z.i > maxIters) {
      for (var i = 1; i < z.tail.length; i ++) {
        var prv = z.tail[i - 1]
        var pt = z.tail[i]
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.moveTo(prv[0], prv[1])
        ctx.lineTo(pt[0], pt[1]);
        ctx.stroke();
      }
      this.status.innerText = (z.i > maxIters ? 'Still in bounds after iteration: ' : 'Escape on iteration: ') + z.i;
      this.stopAnimation();
      return;
    }

    z.i = z.i + 1;

    if (z.tail.length > 1) {
      var prv = z.tail[z.tail.length - 2]
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.arc(prv[0], prv[1], 1, 0, 2 * Math.PI, false);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.strokeStyle = '#00ff00';
    ctx.arc(pt[0], pt[1], 1, 0, 2 * Math.PI, false);
    ctx.stroke();

    var nzx = z.x * z.x - z.y * z.y + cx;
    var nzy = 2.0 * z.x * z.y + cy;

    z.x = nzx;
    z.y = nzy;
  }
}

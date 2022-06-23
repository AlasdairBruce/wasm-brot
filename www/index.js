import { mandel_create, mandel_update, mandel_bounds } from "wasm-brot";
import { memory } from "wasm-brot/wasm_brot_bg";


import { Controls, Bounds } from './controls.js';
import { RectSelector } from './selector.js';

var controls = new Controls(document.getElementById('controls'), new Bounds(mandel_bounds(-2.0, -1.0, 1.0, 1.0)), function (c) {
  schedule(() => { recalc(); });
});

var canvases = document.getElementById('canvases');
var canvas = document.getElementById('canvas');
var canvasSelect = document.getElementById('canvasSelect');
new RectSelector(canvasSelect, function (x0, y0, x1, y1) {
  schedule(() => { zoom(x0, y0, x1, y1) });
});

function toMandelBounds(b) {
  return mandel_bounds(b.x0, b.y0, b.x1, b.y1);
}

var mandel = mandel_create(toMandelBounds(controls.getCurrentView()), 900, 600);
var progress = document.getElementById('progress');

function schedule(fn) {
  // progress.style.display = 'block';
  window.setTimeout(() => {
    fn();
    // progress.style.display = 'none';
  }, 1);
}

function zoom(x0, y0, x1, y1) {
  progress.style.display = 'block';
  controls.pushView(new Bounds(mandel.zoom(x0, y0, x1, y1)));
  recalc()
}

function recalc() {
  mandel_update(mandel, toMandelBounds(controls.getCurrentView()));
  mandel.iterate(controls.getIterations())
  mandel.colorize_by(controls.getColoring());
  render(mandel);
}

function render(mandel) {
  progress.style.display = 'block';
  var width = mandel.get_width();
  var height = mandel.get_height();
  canvas.width = canvasSelect.width = width;
  canvas.height = canvasSelect.height = height;
  canvases.style.width = width + 'px';
  canvases.style.height = height + 'px';

  var values = new Uint8ClampedArray(memory.buffer, mandel.get_values(), 4 * width * height);
  var image = new ImageData(values, width);

  canvas.getContext("2d").clearRect(0, 0, width, height);
  canvas.getContext("2d").putImageData(image, 0, 0);
  progress.style.display = 'none';
}

schedule(recalc);









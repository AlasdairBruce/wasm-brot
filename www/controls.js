export class Bounds {
  constructor(bounds) {
    this.x0 = bounds.x0;
    this.y0 = bounds.y0
    this.x1 = bounds.x1;
    this.y1 = bounds.y1
  }

  depth(base) {
    var w = this.x1 - this.x0;
    var bw = base.x1 - base.x0;
    return Math.round(Math.log10(bw / w) * 100) / 100;
  }
}

export class Controls {
  constructor(el, initBounds, update) {
    this.el = el;
    this.update = update;

    this.iterations = el.querySelector("#iterations");
    this.iterationsLabel = el.querySelector("#iterationsLabel");

    this.iterations.oninput = e => { this.updateIterations(); };
    this.iterations.onchange = () => this.update(this);

    this.coloring = el.querySelector("#coloring")
    this.coloring.onchange = () => this.update(this);

    this.backRow = el.querySelector("#navigate")
    this.back = el.querySelector("#nav-pop")
    this.forward = el.querySelector("#nav-push")
    this.reset = el.querySelector("#nav-reset")

    this.back.onclick = () => this.popView();
    this.forward.onclick = () => this.pushPoppedView();
    this.reset.onclick = () => {
      this.viewStack = [ initBounds ];
      this.popped = [];
      this.updateViews();
      this.update(this);
    }

    this.view = el.querySelector("#view")
    this.viewStack = [ initBounds ];
    this.popped = [];
    this.updateViews();
  }

  popView() {
    if (this.viewStack.length <= 1) {
      return;
    }
    this.popped.push(this.viewStack.pop());
    this.updateViews();
    this.update(this);
  }

  pushPoppedView() {
    if (this.popped.length == 0) {
      return;
    }
    this.viewStack.push(this.popped.pop());
    this.updateViews();
    this.update(this);
  }

  getViewStack() {
    return this.viewStack();
  }

  getCurrentView() {
    return this.viewStack[this.viewStack.length - 1];
  }

  pushView(bounds) {
    this.popped = [];
    this.viewStack.push(bounds);
    this.updateViews();
  }

  getIterations() {
    return this.iterations.value;
  }

  updateIterations() {
    this.iterationsLabel.innerHTML = this.iterations.value;
  }

  getColoring() {
    return this.coloring.value;
  }

  updateViews() {
    var top = this.getCurrentView()
    this.view.querySelector("#viewDepth").innerHTML = this.viewStack.length;
    this.view.querySelector("#viewPrecision").innerHTML = top.depth(this.viewStack[0]);
    this.view.querySelector("#x0").innerHTML = top.x0;
    this.view.querySelector("#y0").innerHTML = top.y0;
    this.view.querySelector("#x1").innerHTML = top.x1;
    this.view.querySelector("#y1").innerHTML = top.y1;

    this.backRow.style.display = (this.viewStack.length <= 1 && this.popped.length == 0) ? 'none' : 'block';
  }
}

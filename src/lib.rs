mod utils;
mod mandelcalc;
mod colorize;

#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;
#[cfg(target_arch = "wasm32")]
use mandelcalc::{MandelCalc,MandelBounds};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
#[cfg(target_arch = "wasm32")]
pub fn mandel_bounds(x0: f64, y0: f64, x1: f64, y1: f64) -> MandelBounds {
    return MandelBounds::new(x0, y0, x1, y1);
}

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
#[cfg(target_arch = "wasm32")]
pub fn mandel_create(bounds: MandelBounds, width: u32, height: u32) -> MandelCalc {
    return MandelCalc::new(bounds, width, height);
}

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
#[cfg(target_arch = "wasm32")]
pub fn mandel_update(calc: &mut MandelCalc, bounds: MandelBounds) {
    calc.reset(bounds);
}

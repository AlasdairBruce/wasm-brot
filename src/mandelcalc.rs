#![allow(dead_code)]

use crate::colorize::{Colorize,HslExp,Linear};
use prisma::Rgb;

#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
#[derive(Copy, Clone)]
pub struct MandelBounds {
    pub x0: f64,
    pub y0: f64,
    pub x1: f64,
    pub y1: f64
}

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
impl MandelBounds {
    pub fn new(x0: f64, y0: f64, x1: f64, y1: f64) -> MandelBounds {
        return MandelBounds { x0, y0, x1, y1 };
    }


    pub fn to_str(&self) -> String {
        return format!("({}, {}) to ({},{})", self.x0, self.y0, self.x1, self.y1);
    }
}

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub struct MandelCalc {
    bounds: MandelBounds,
    width: u32,
    height: u32,
    iterations: u32,
    result: Vec<u32>
}

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
impl MandelCalc {
    pub fn new(bounds : MandelBounds, width: u32, height: u32) -> MandelCalc {
        let iterations = 0;
        let result = (0..(width*height)).map(|_i| 0).collect();
        return MandelCalc { bounds, width, height, iterations, result }
    }


    pub fn reset(&mut self, bounds: MandelBounds) {
        self.bounds = bounds;
        self.iterations = 0;
        for value in self.result.iter_mut() {
            *value = 0;
        }
    }


    pub fn get_bounds(&self) -> MandelBounds {
        return self.bounds;
    }

    pub fn get_width(&self) -> u32 {
        return self.width;
    }

    pub fn get_height(&self) -> u32 {
        return self.height;
    }

    pub fn get_iterations(&self) -> u32 {
        return self.iterations;
    }

    pub fn get_value(&self, x: u32, y: u32) -> u32 {
        return self.result[(y * self.width + x) as usize]
    }

    pub fn get_values(&self) -> *const u32 {
        return self.result.as_ptr();
    }

    pub fn iterate(&mut self, iters: u32) {
        let xd = (self.bounds.x1 - self.bounds.x0) / (self.width as f64);
        let yd = (self.bounds.y1 - self.bounds.y0) / (self.height as f64);

        for i in 0..self.width {
            let x0 = self.bounds.x0 + xd * (i as f64);
            for j in 0..self.height {
                let y0 = self.bounds.y0 + yd * (j as f64);
                let mut x = 0.0;
                let mut y = 0.0;
                let mut iter = 0;
                while x * x + y * y <= 4.0 && iter < iters {
                    let t = x * x - y * y + x0;
                    y = 2.0 * x * y + y0;
                    x = t;
                    iter += 1;
                }
                self.result[(j * self.width + i) as usize] = iter;
            }
        }
        self.iterations += iters;
    }

    pub fn colorize_by(&mut self, coloring: &str) {
        let black = Rgb::new(0, 0, 0);
        let coloring = match coloring {
            "redish" => Box::new(Linear::new(self.iterations, black, |v| 1.0 - v, |_v| 0.05, |_v| 0.05)) as Box<dyn Colorize>,
            "greenish" => Box::new(Linear::new(self.iterations, black, |_v| 0.05, |v| 1.0 - v, |_v| 0.05)) as Box<dyn Colorize>,
            "blueish" => Box::new(Linear::new(self.iterations, black, |_v| 0.4, |_v| 0.4, |v| 1.0 - v)) as Box<dyn Colorize>,
            "greeny" => Box::new(Linear::new(self.iterations, Rgb::new(0, 255, 0), |_v| 0.2, |v| f32::powf(v, 0.3), |_v| 0.2)) as Box<dyn Colorize>,
            "bluey" => Box::new(Linear::new(self.iterations, Rgb::new(0, 0, 255), |_v| 0.05, |_v| 0.05, |v| f32::powf(v, 0.3))) as Box<dyn Colorize>,
            "redy" => Box::new(Linear::new(self.iterations, Rgb::new(255, 0, 0), |v| f32::powf(v, 0.3), |_v| 0.3, |_v| 0.3)) as Box<dyn Colorize>,
            _ => Box::new(HslExp::new(self.iterations, 50.0, 100.0)) as Box<dyn Colorize>
        };
        self.colorize(& coloring);
    }

    pub fn colorize_std(&mut self) {
        self.colorize(& HslExp::new(self.get_iterations(), 0.5, 100.0))
    }

    pub fn zoom(&mut self, x0: i32, y0: i32, x1: i32, y1: i32) -> MandelBounds {
        return MandelBounds {
            x0: (x0 as f64 / self.width as f64) * (self.bounds.x1 - self.bounds.x0) + self.bounds.x0,
            x1: (x1 as f64 / self.width as f64) * (self.bounds.x1 - self.bounds.x0) + self.bounds.x0,
            y0: (y0 as f64 / self.height as f64) * (self.bounds.y1 - self.bounds.y0) + self.bounds.y0,
            y1: (y1 as f64 / self.height as f64) * (self.bounds.y1 - self.bounds.y0) + self.bounds.y0
        };
    }
}

impl MandelCalc {
    pub fn colorize(&mut self, colorize : &dyn Colorize) {
        colorize.colorize(self.result.as_mut_slice());
    }
}

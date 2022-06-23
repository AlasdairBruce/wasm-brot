#[cfg(not(target_arch = "wasm32"))]
use crate::mandelcalc::{MandelCalc,MandelBounds};
#[cfg(not(target_arch = "wasm32"))]
use crate::colorize;

#[cfg(not(target_arch = "wasm32"))]
use bmp::{Image,Pixel,px};

#[cfg(target_arch = "wasm32")]
pub fn example() {
}

#[cfg(not(target_arch = "wasm32"))]
pub fn example() {
    let _b0 = MandelBounds::new(-2.0, -1.0, 1.0, 1.0);
    let _b1 = MandelBounds::new(-0.34853774148008254, -0.6065922085831237, -0.34831493420245574, -0.606486596104741);
    let _b2 = MandelBounds::new(-0.720122592204, -0.690445026970, -0.305421511975, -0.293518000665);

    let mut state = MandelCalc::new(_b2, 1200, 800);
    state.iterate(500);

    //let colors = HslExp::new(state.get_iterations(), 0.5, 100.0);
    //state.colorize(&colors);
    state.colorize_by("greenish");

    let mut img = Image::new(state.get_width(), state.get_height());
    for i in 0..state.get_width() {
        for j in 0..state.get_height() {
            let v = colorize::unpack(state.get_value(i, j));
            img.set_pixel(i, j, px!(v.red(), v.green(), v.blue()))
        }
    }

    let _ = img.save("/tmp/out.bmp").unwrap_or_else(|e| {
        panic!("Failed to save: {}", e)
    });
}


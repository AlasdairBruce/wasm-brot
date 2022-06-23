#![allow(dead_code)]

use prisma::{ Rgb, Hsl, FromColor };
use angular_units::{ Deg };


pub fn pack(rgb: &Rgb<u8>) -> u32 {
    return 0xFF_00_00_00 | ((rgb.blue() as u32) << 16) | ((rgb.green() as u32) << 8) | (rgb.red() as u32);
}

pub fn unpack(v: u32) -> Rgb<u8> {
    let b = (v & 0x00_FF_00_00) >> 16;
    let g = (v & 0x00_00_FF_00) >> 8;
    let r = v & 0x00_00_00_FF;
    return Rgb::new(r as u8, g as u8, b as u8);
}


pub trait Colorize {
    fn colorize(&self, levels: &mut [u32]) {
        for level in levels.iter_mut() {
            let rgb = self.colorize_level(*level);
            let packed = pack(&rgb);
            *level = packed;
        }
    }

    fn colorize_level(&self, level: u32) -> Rgb<u8>;
}

impl<C: Colorize + ?Sized> Colorize for Box<C> {
    fn colorize_level(&self, level: u32) -> Rgb<u8> {
        return (**self).colorize_level(level);
    }
}

pub struct Linear {
    levels: u32,
    red: fn(f32) -> f32,
    green: fn(f32) -> f32,
    blue: fn(f32) -> f32,
    member_value: Rgb<u8>
}

impl Linear {
    pub fn new(levels: u32, base: Rgb<u8>, red: fn(f32) -> f32, green: fn(f32) -> f32, blue: fn(f32) -> f32) -> Linear {
        return Linear { levels, red, green, blue, member_value: base }
    }
}

impl Colorize for Linear {
    fn colorize_level(&self, level: u32) -> Rgb<u8> {
        let v = (level as f32) / (self.levels as f32);
        if v == 1.0 {
            return self.member_value;
        } else {
            return Rgb::new(((self.red)(v) * 255.0).trunc() as u8, ((self.green)(v) * 255.0).trunc() as u8, ((self.blue)(v) * 255.0).trunc() as u8);
        }
    }
}

pub struct HslExp {
    levels: u32,
    saturation: f32,
    value_factor: f32,
    member_value: Rgb<u8>
}

impl HslExp {
    pub fn new(levels: u32, saturation: f32, value_factor: f32) -> HslExp {
        return HslExp { levels, saturation, value_factor, member_value : Rgb::new(0, 0, 0) };
    }
}

impl Colorize for HslExp {
    fn colorize_level(&self, level: u32) -> Rgb<u8> {
        let v = (level as f32) / (self.levels as f32);
        if v == 1.0 {
            return self.member_value;
        } else {
            let deg = (f32::powf(v * 360.0, 1.5).trunc() as i32) % 360;
            let hsv = Hsl::new(Deg(deg as f32), self.saturation, v * self.value_factor);
            let rgb = Rgb::from_color(&hsv);
            return Rgb::new((255.0 * rgb.red()).trunc() as u8,
                            (255.0 * rgb.green()).trunc() as u8,
                            (255.0 * rgb.blue()).trunc() as u8);
        }
    }
}

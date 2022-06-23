## About

This project was created based on the `wasm-pack` [tutorials][tutorials] and specifically following along with the Game of Life [tutorial][gol-tutorial].

[tutorials]: https://rustwasm.github.io/docs/wasm-pack/tutorials/index.html
[gol-tutorial]: https://rustwasm.github.io/book/game-of-life/introduction.html

## Building and Running


Check the [tutorials][tutorials] for more background, but a basic summary of required steps is:


* Install the [rust toolchain][rust-install]
* Install [wasm-pack][wasm-pack]
* Install [npm][npm]

[rust-install]: https://www.rust-lang.org/tools/install
[wasm-pack]: https://rustwasm.github.io/wasm-pack/installer/
[npm]: https://www.npmjs.com/get-npm

### Creating The Project

Obviously the project already exists, so you don't need to be doing this again, but for future reference, this is the command used to generate this repo:

```
cargo generate --git https://github.com/rustwasm/wasm-pack-template.git --name wasm-brot
```

[Learn more about `cargo generate` here.](https://github.com/ashleygwilliams/cargo-generate)

### Build

```
wasm-pack build
```

## 🔋 Batteries Included

* [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) for communicating
  between WebAssembly and JavaScript.
* [`console_error_panic_hook`](https://github.com/rustwasm/console_error_panic_hook)
  for logging panic messages to the developer console.
* [`wee_alloc`](https://github.com/rustwasm/wee_alloc), an allocator optimized
  for small code size.

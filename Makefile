all: build

.PHONY: run
run: build
	cd www && npm run start

.PHONY: build
build:
	wasm-pack build

.PHONY: clean
clean:
	cargo clean

.PHONY: test
test:
	wasm-pack test --headless firefox

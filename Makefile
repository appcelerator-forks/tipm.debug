
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

lib: clean components index.js
	@component build -s debug -n debug -o ./

.PHONY: clean lib

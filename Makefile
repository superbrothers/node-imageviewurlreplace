all: update test

update:
	bin/datfetch.sh

test:
	./node_modules/nodeunit/bin/nodeunit test

jslint:
		@find . -type d \( -name node_modules -o -name .git \) -prune -o \( -name "*.js" -o -name "*.json" \) -print0 | xargs -0 ./node_modules/jslint/bin/jslint.js

.PHONY: update test jslint

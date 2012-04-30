all: update test

update:
	bin/datfetch.sh

test:
	nodeunit test

.PHONY: update test

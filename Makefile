setup-dev:
	pip install -r restricted/requirements-dev.txt

test:
	find . -name '*.pyc' -delete
	py.test apps/

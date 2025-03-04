###############################################
#
# Uni Bot Plugin commands.
#
###############################################

# Define PIP_COMPILE_OPTS=-v to get more information during make upgrade.
PIP_COMPILE = pip-compile --rebuild --upgrade $(PIP_COMPILE_OPTS)

PROJECT_NAME = uni_bot
APP_PATH = uni_bot

.DEFAULT_GOAL := help


help:  ## display this help message
	@echo "Please use \`make <target>' where <target> is one of"
	@grep '^[a-zA-Z]' $(MAKEFILE_LIST) | sort | awk -F ':.*?## ' 'NF==2 {printf "\033[36m  %-25s\033[0m %s\n", $$1, $$2}'

clean:  ## delete most git-ignored files
	find . -name '__pycache__' -exec rm -rf {} +
	find . -name '*.pyc' -exec rm -f {} +
	find . -name '*.pyo' -exec rm -f {} +
	find . -name '*~' -exec rm -rf {} +

requirements:  ## install environment requirements
	pip install -r requirements/base.txt

upgrade-requirements: export CUSTOM_COMPILE_COMMAND=make upgrade-requirements
upgrade-requirements:  ## update the requirements/*.txt files with the latest packages satisfying requirements/*.in
	$(PIP_COMPILE) --allow-unsafe -o requirements/pip.txt requirements/pip.in
	$(PIP_COMPILE) -o requirements/pip-tools.txt requirements/pip-tools.in
	pip install -qr requirements/pip.txt
	pip install -qr requirements/pip-tools.txt
	# Make sure to compile files after any other files they include!
	$(PIP_COMPILE) -o requirements/base.txt requirements/base.in
	$(PIP_COMPILE) -o requirements/test.txt requirements/test.in

piptools: ## install pinned version of pip-compile and pip-sync
	pip install -r requirements/pip.txt
	pip install -r requirements/pip-tools.txt

build-test-image:  ## build docker image for testing
	docker build . -t $(PROJECT_NAME) --target=test-image

quality: clean  ## check coding style with pycodestyle and pylint
	pycodestyle $(APP_PATH)
	pylint ./$(APP_PATH) --rcfile=./setup.cfg

python-test: clean  ## run pytest for plugin
	pytest
	coverage report
	coverage xml

install-npm:  ## install modules from package.json
	npm install

compile-sass: install-npm  ## compile sccs files
	./node_modules/.bin/gulp build

#
# PyPi build and publish
#
.build-pypi:
	python setup.py sdist bdist_wheel

pypi: .build-pypi
	TWINE_PASSWORD=${CI_JOB_TOKEN} TWINE_USERNAME=gitlab-ci-token python -m twine upload --repository-url ${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/packages/pypi dist/*

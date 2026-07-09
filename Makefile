.PHONY: help install ci lint build check docker-ci

NPM10 := npx -y npm@10.8.2
DOCKER_IMAGE := devfest2026-ci

help:
	@echo "Targets:"
	@echo "  make install    - Install deps with npm 10 (CI parity)"
	@echo "  make ci         - Run npm 10 clean install"
	@echo "  make lint       - Run ESLint"
	@echo "  make build      - Build Next.js app"
	@echo "  make check      - Run ci + lint + build"
	@echo "  make docker-ci  - Build CI parity Docker image"

install: ci

ci:
	$(NPM10) ci

lint:
	npm run lint

build:
	npm run build

check: ci lint build

docker-ci:
	docker build -f Dockerfile.ci -t $(DOCKER_IMAGE) .

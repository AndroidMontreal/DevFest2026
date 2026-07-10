.PHONY: help ci build check run check-logs clean rebuild all

NPM10 := npx -y npm@10.8.2
LOG_DIR := logs
OUT_DIR := out
PORT ?= 8080

help:
	@echo Targets:
	@echo   make ci         - Install dependencies with npm@10 (CI parity)
	@echo   make build      - Build Next.js app (static export to ./out)
	@echo   make check      - Run ci + build
	@echo   make clean      - Remove ./out and ./logs (use DEEP=1 to also remove node_modules)
	@echo   make rebuild    - clean + ci + build
	@echo   make run        - Serve ./out at http://localhost:$(PORT) (Docker required)
	@echo   make all        - rebuild + run (example: make all PORT=3001)
	@echo   make check-logs - Run ci+build and save full log to ./logs

ci:
	@echo Using node:
	@node -v
	@echo Using npm (npx wrapper):
	@$(NPM10) --version
	$(NPM10) ci --loglevel info

build:
	@powershell -NoProfile -Command "$$ts = Get-Date -Format yyyyMMddHHmmss; New-Item -ItemType Directory -Force -Path '$(LOG_DIR)' | Out-Null; npm run build 2>&1 | Tee-Object -FilePath ('$(LOG_DIR)/build-' + $$ts + '.log')"

check: ci build

clean:
	@powershell.exe -NoProfile -Command "try { Write-Host 'Cleaning $(OUT_DIR) and $(LOG_DIR)'; Remove-Item -Recurse -Force 'out','logs' -ErrorAction SilentlyContinue; if ('$(DEEP)' -eq '1') { Write-Host 'Deep clean: removing node_modules'; Remove-Item -Recurse -Force 'node_modules' -ErrorAction SilentlyContinue } } catch { Write-Host 'Clean encountered an error but continuing'; } ; exit 0"

rebuild: clean ci build

check-logs:
	@powershell -NoProfile -Command "$$ts = Get-Date -Format yyyyMMddHHmmss; New-Item -ItemType Directory -Force -Path '$(LOG_DIR)' | Out-Null; $$log = '$(LOG_DIR)/ci-' + $$ts + '.log'; Start-Transcript -Path $$log -Force | Out-Null; Write-Host ('Node: ' + (node -v)); & npx -y npm@10.8.2 ci --loglevel info; npm run build; Stop-Transcript | Out-Null; Write-Host ('Logs saved -> ' + $$log)"

run:
	@powershell -NoProfile -Command "if (-not (Test-Path '$(OUT_DIR)')) { Write-Error 'Error: $(OUT_DIR) not found. Run make build first.'; exit 1 }; $$hostPath = (Resolve-Path '$(OUT_DIR)').Path; Write-Host ('Serving $(OUT_DIR) on http://localhost:$(PORT)'); docker run --rm -p $(PORT):80 -v ('{0}:/usr/share/nginx/html:ro' -f $$hostPath) nginx:alpine"

all: rebuild run

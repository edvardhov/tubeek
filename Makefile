.PHONY: setup setup-ollama dev dev-backend dev-frontend demo-build demo-build-pages demo-serve fixtures test lint docker-up docker-down

setup:
	@echo "Installing dependencies..."
	@command -v uv >/dev/null 2>&1 || (echo "Install uv: https://docs.astral.sh/uv/" && exit 1)
	@command -v npm >/dev/null 2>&1 || (echo "Install Node.js (includes npm): https://nodejs.org/" && exit 1)
	cd backend && uv sync --extra dev
	cd frontend && npm install
	@$(MAKE) setup-ollama

setup-ollama:
	@echo "Checking Ollama (optional for demo mode)..."
	@if command -v ollama >/dev/null 2>&1; then \
		echo "Pulling default model llama3.1:8b..."; \
		ollama pull llama3.1:8b || true; \
	else \
		echo "Ollama not found — skipped model pull."; \
		echo "  Demo mode works without Ollama: make demo-serve"; \
		echo "  Live mode needs Ollama: https://ollama.com/download"; \
		echo "  After installing, run: make setup-ollama"; \
	fi

dev:
	@echo "Start backend and frontend in separate terminals:"
	@echo "  make dev-backend"
	@echo "  make dev-frontend"

dev-backend:
	cd backend && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	cd frontend && npm run dev

demo-build:
	cd frontend && NEXT_PUBLIC_APP_MODE=demo npm run build

demo-build-pages:
	cd frontend && NEXT_PUBLIC_APP_MODE=demo NEXT_PUBLIC_BASE_PATH=/tubeek npm run build

demo-serve: demo-build
	cd frontend && npx --yes serve out -l 3000

fixtures:
	@echo "Generate demo fixtures via live pipeline (requires Ollama + backend running)"
	curl -s -X POST http://localhost:8000/api/decks \
		-H "Content-Type: application/json" \
		-d '{"url":"https://www.youtube.com/watch?v=aircAruvnKk","card_count":8}' \
		| python3 -c "import sys,json; d=json.load(sys.stdin); json.dump(d, open('frontend/public/demo/neural-networks.json','w'), indent=2)"

test:
	cd backend && uv run pytest -v

lint:
	cd backend && uv run ruff check app tests

docker-up:
	docker compose up --build

docker-down:
	docker compose down

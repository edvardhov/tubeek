# Contributing to Tubeek

## Development Setup

1. Fork and clone the repo
2. Run `make setup`
3. Start backend and frontend in separate terminals (`make dev-backend`, `make dev-frontend`)

## Code Style

- **Python**: formatted and linted with `ruff` (`make lint`)
- **TypeScript**: ESLint via `npm run lint` in `frontend/`

## Testing

```bash
make test      # backend pytest
make lint      # backend ruff
```

## Pull Requests

1. Create a feature branch from `main`
2. Keep changes focused and small
3. Add tests for backend logic changes
4. Ensure CI passes
5. Update README if adding env vars or changing setup

## Regenerating Demo Fixtures

With backend + Ollama running:

```bash
make fixtures
```

Commit updated JSON files in `frontend/public/demo/`.

## Reporting Issues

Include:
- OS and versions (Node, Python, Ollama)
- Steps to reproduce
- Expected vs actual behavior
- Relevant logs from backend terminal

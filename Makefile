# jala-u-ds4-web-components - development task runner
#
# Usage:
#   make            Show this help
#   make <target>   Run a specific target
#
# All targets are thin wrappers around npm scripts so that CI and local
# environments stay aligned.

SHELL := /bin/bash
.DEFAULT_GOAL := help

# ---------------------------------------------------------------------------
# Help
# ---------------------------------------------------------------------------

.PHONY: help
help: ## Show this help message
	@printf "Usage: make <target>\n\n"
	@printf "Targets:\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

# ---------------------------------------------------------------------------
# Installation
# ---------------------------------------------------------------------------

.PHONY: install
install: ## Install dependencies from package-lock.json (reproducible)
	npm ci

.PHONY: install-dev
install-dev: ## Install dependencies and update package-lock.json
	npm install

# ---------------------------------------------------------------------------
# Development
# ---------------------------------------------------------------------------

.PHONY: dev
dev: ## Start the Vite development server
	npm run dev

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

.PHONY: build
build: ## Build the library (ESM + UMD + CSS) into dist/
	npm run build

# ---------------------------------------------------------------------------
# Testing
# ---------------------------------------------------------------------------

.PHONY: test
test: ## Run the unit test suite once
	npm run test

.PHONY: test-watch
test-watch: ## Run tests in watch mode
	npm run test:watch

.PHONY: test-coverage
test-coverage: ## Run tests and generate a coverage report
	npm run test:coverage

# ---------------------------------------------------------------------------
# Code quality
# ---------------------------------------------------------------------------

.PHONY: lint
lint: ## Run ESLint on the source tree
	npm run lint

.PHONY: lint-fix
lint-fix: ## Run ESLint and apply automatic fixes
	npm run lint:fix

.PHONY: format
format: ## Format all files with Prettier
	npm run format

.PHONY: format-check
format-check: ## Check formatting with Prettier (no changes)
	npm run format:check

# ---------------------------------------------------------------------------
# Cleanup
# ---------------------------------------------------------------------------

.PHONY: clean
clean: ## Remove build and coverage artifacts
	npm run clean

.PHONY: clean-all
clean-all: ## Remove build artifacts and node_modules
	rimraf dist coverage node_modules

.PHONY: reset
reset: clean-all install ## Reinstall the project from scratch

# ---------------------------------------------------------------------------
# CI
# ---------------------------------------------------------------------------

.PHONY: ci
ci: lint format-check test build ## Run the full CI pipeline locally

# ---------------------------------------------------------------------------
# Publishing
# ---------------------------------------------------------------------------

.PHONY: publish-dry
publish-dry: ## Simulate npm publish without uploading
	npm publish --dry-run

.PHONY: publish
publish: ## Publish the package to the npm registry (release only)
	npm publish
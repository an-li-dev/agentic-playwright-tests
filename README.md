# 🎭 Agentic Playwright Tests

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A **high-quality, product-agnostic** Playwright + TypeScript test framework **template**. Clone it, point it at your application, and start writing UI and API tests on day one — no boilerplate to build first.

Built with **Playwright**, **TypeScript (strict)**, the **Page Object + Component Object** pattern, **Bun**, and **Allure Reports**.

> This is a **blank template**. It ships with `Base*` and `Template*` building blocks plus reference test files — but **no application-specific pages or tests**. Copy the `Template*` files and fill them in for your app.

---

## ✨ Features

- ✅ **Playwright** — modern, reliable end-to-end and API testing
- ✅ **TypeScript (strict)** — fully typed test code throughout
- ✅ **Page Object Model** — `BasePage` + composable `Component` objects
- ✅ **Template files** — ready-to-copy `TemplatePage`, `TemplateComponent`, and `template-*.spec.ts`
- ✅ **Custom Fixtures** — typed page/component injection + authenticated session + auto screenshot-on-failure
- ✅ **Allure Reports** — detailed, interactive HTML reports
- ✅ **Multi-browser** — Chromium by default; Firefox + WebKit on demand via `CROSS_BROWSER=true`; a dedicated mobile project for `@responsive` tests
- ✅ **Parallel Execution** — auto-scales workers to CPU count
- ✅ **Structured Logger** — levelled, colour-coded output per test context
- ✅ **Typed Error Classes** — descriptive, catchable error hierarchy
- ✅ **Centralised Test Data & Tags** — single source of truth for URLs, patterns, UI strings, and type-safe tags
- ✅ **CI/CD Pipeline** — GitHub Actions with a fast smoke gate, sharded regression, cross-browser smoke, and Allure publishing
- ✅ **AI-tool ready** — root-level `.mcp.json` exposes the official Playwright MCP server to any MCP-capable assistant

---

## 📁 Project Structure

```
agentic-playwright-tests/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI: smoke → regression shards → cross-browser → report
├── .mcp.json                       # Universal Playwright MCP config (Claude Code, Cursor, Windsurf, …)
├── config/
│   └── test.config.ts              # Typed config object, reads from .env
├── scripts/
│   └── test-and-report.sh          # Run tests + optional Allure report prompt
├── src/
│   ├── components/
│   │   ├── BaseComponent.ts         # Base class for all component objects
│   │   └── TemplateComponent.ts     # ← COPY this to create a new component
│   ├── data/
│   │   ├── tags.ts                  # Type-safe tag constants (@smoke, @critical, …)
│   │   ├── test-data.ts             # Centralised URLs, patterns, UI strings, credentials
│   │   └── graphql-queries.ts       # Example GraphQL operations (delete if using REST)
│   ├── errors/
│   │   └── test-errors.ts           # Typed error hierarchy
│   ├── fixtures/
│   │   └── test.fixtures.ts         # Custom fixtures + auto screenshot-on-failure
│   ├── helpers/
│   │   └── auth.helper.ts           # Example API login helper
│   ├── pages/
│   │   ├── BasePage.ts              # Shared navigation, wait, assertion helpers
│   │   └── TemplatePage.ts          # ← COPY this to create a new page object
│   └── utils/
│       ├── element-wait.utils.ts    # Shared waitForElement helper
│       ├── string.utils.ts          # General-purpose string/date utilities
│       └── logger.ts                # Structured, levelled console logger
├── tests/
│   ├── api/
│   │   └── template-api.spec.ts      # ← COPY this for API tests (excluded from runs)
│   └── ui/
│       └── template-ui.spec.ts       # ← COPY this for UI tests (excluded from runs)
├── docs/
│   └── onboarding.md                # Step-by-step guide for new contributors
├── .env.example                     # Copy to .env to get started
├── playwright.config.ts
├── tsconfig.json
├── eslint.config.js
├── .prettierrc.json
└── package.json
```

> **Note:** files matching `template-*.spec.ts` are excluded from execution via `testIgnore` in `playwright.config.ts`. They are reference scaffolds — copy and rename them before filling them in.

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.1
- Node-compatible OS (macOS, Linux, Windows)

### Install

```bash
bun install
bunx playwright install --with-deps
```

### Configure

```bash
cp .env.example .env
# Edit .env: set BASE_URL, API_BASE_URL, and (for authenticated tests) credentials
```

### Run

```bash
bun run test                 # all tests (Chromium)
bun run test:smoke           # @smoke only
bun run test:headed          # headed mode
bun run test:ui              # Playwright UI mode
bun run test:cross-browser   # Chromium + Firefox + WebKit
bun run test:report          # run + interactive Allure report
```

---

## 🏗️ Architecture

### Page Object + Component Object

Each **page** composes one or more focused **components** instead of owning every locator. Pages handle routing and page-level concerns; components own the locators and interactions for a single UI section.

```
SomePage  (extends BasePage)
 ├── HeaderComponent      (extends BaseComponent)
 ├── FormComponent        (extends BaseComponent)
 └── FooterComponent      (extends BaseComponent)
```

- **`BasePage`** — `goto`, `navigate`-friendly waits, click/fill helpers, assertions, screenshots.
- **`BaseComponent`** — visibility waits, click, and assertion helpers shared by every component.
- **`TemplatePage` / `TemplateComponent`** — annotated scaffolds. Copy them, replace the `[REPLACE_*]` placeholders, and delete the banner comment.

### Fixtures

`src/fixtures/test.fixtures.ts` extends Playwright's `test` with:

- typed page/component fixtures (`templatePage`, `templateComponent`) — add your own here,
- an `authenticatedPage` fixture that logs in via the API once and reuses the session,
- an auto `screenshotOnFailure` fixture that attaches a screenshot to Allure on any failure.

**Always import `test` and `expect` from the fixtures file** in UI tests — never directly from `@playwright/test`.

---

## 🏷️ Tags

Tags are defined as type-safe constants in `src/data/tags.ts`. Filter with `--grep`:

```bash
bunx playwright test --grep @smoke
bunx playwright test --grep "@smoke|@api"
bunx playwright test --grep-invert @visual
```

Core tags: `@smoke`, `@critical`, `@regression`, `@ui`, `@api`, `@navigation`, `@visual`, `@auth`, `@authenticated`, `@cookie`, `@responsive`, `@performance`, `@a11y`.

---

## 🤖 AI Tooling (MCP)

The repo ships a root-level **`.mcp.json`** using the de-facto cross-tool `mcpServers` convention, so any MCP-capable assistant can drive a real browser via the official **Playwright MCP** server:

```json
{
  "mcpServers": {
    "playwright": { "command": "bunx", "args": ["@playwright/mcp@latest"] }
  }
}
```

- **Claude Code** reads `.mcp.json` from the project root automatically.
- **Cursor / Windsurf** read the same `mcpServers` shape (point them at this file if needed).

No editor-specific config is committed — keep your personal `.vscode/` / `.idea/` settings out of the repo.

---

## ⚙️ Configuration Reference

All settings are driven by `.env` with documented defaults in `config/test.config.ts`.

| Variable             | Default                   | Description                            |
| -------------------- | ------------------------- | -------------------------------------- |
| `BASE_URL`           | `https://example.com`     | App under test                         |
| `API_BASE_URL`       | `https://api.example.com` | API base URL                           |
| `HEADLESS`           | `true`                    | `false` to see the browser             |
| `BROWSER`            | `chromium`                | `chromium` \| `firefox` \| `webkit`    |
| `DEFAULT_TIMEOUT`    | `15000`                   | Default action timeout (ms)            |
| `NAVIGATION_TIMEOUT` | `30000`                   | Navigation timeout (ms)                |
| `RETRY_COUNT`        | `1` local / `2` CI        | Test retries                           |
| `PARALLEL_WORKERS`   | 50% of CPU cores          | Worker count                           |
| `LOG_LEVEL`          | `info`                    | `debug` \| `info` \| `warn` \| `error` |

---

## 🔁 CI/CD

`.github/workflows/playwright.yml` runs four stages: fast **smoke** gate → sharded **regression** → **cross-browser** smoke (main only) → **Allure** report publish to GitHub Pages.

Set these repository secrets: `BASE_URL`, `API_BASE_URL`, `USER_EMAIL`, `USER_PASSWORD`, `USER_USERNAME`.

---

## ✅ Quality Gates

```bash
bun run lint          # ESLint (TypeScript + Playwright rules)
bun run format:check  # Prettier check
bun run check         # format:check + lint
```

---

## 📖 New here?

See [`docs/onboarding.md`](docs/onboarding.md) for a step-by-step guide to writing your first page object and test.

## 📄 License

[MIT](LICENSE)

# Northworks Manufacturing Studio

A standalone implementation design and working-model studio for manufacturing and supply-chain systems.

- [Open the site](https://pedrodfroes.github.io/northworks-manufacturing-studio/)
- [Presenter walkthrough](https://pedrodfroes.github.io/northworks-manufacturing-studio/presenter.html)

Includes APS scheduling experiments, a life-sciences MES batch sketch, connected business trials, implementation decisions and researched software-stack walkthroughs.

This is a synthetic design prototype. SAP, CRM, historian and vendor integrations described in the walkthrough are proposed contracts, not live connectors. Browser data is local to the site's origin.

## Local preview

Serve this folder with a static HTTP server, for example `python -m http.server 8766`. Open `http://localhost:8766/`.

## Verification

Run `npm test` and `npm run test:legacy` with Node.js installed.

## Publishing

GitHub Pages serves the root of the main branch. This repository is independent of implementationos-configurator.

# E2E Implementation Playbook

This playbook outlines strategies for building reliable E2E test suites.

## 1. Selection of Critical User Journeys (CUJs)
Focus tests on paths that result in business value or critical failures:
- User signup and authentication
- Main product feature usage
- Checkout and billing flows

## 2. Stable Selectors
Avoid brittle CSS selectors. Prefer:
- `data-testid` attributes
- ARIA roles and labels
- Text content (with caution)

## 3. Handling Asynchrony
Always wait for specific elements or network states instead of using fixed timeouts.

## 1. Implementation

- [ ] Ensure delta spec exists at `openspec/changes/add-baseline-specs-frontend-existing-features/specs/frontend/spec.md`.
- [ ] Confirm each Requirement includes at least one `#### Scenario:`.
- [ ] Save spec files as UTF-8 (LF) to prevent multibyte garbling.
- [ ] Align wording with current UI/flows as needed.

## 2. Validation

- [ ] Run `openspec list` and confirm the change is detected.
- [ ] Run `openspec validate add-baseline-specs-frontend-existing-features --strict` and address any errors.

## 3. Review & Follow-up

- [ ] Share proposal for approval.
- [ ] After deployment, archive or merge per policy:
  - `openspec archive add-baseline-specs-frontend-existing-features --skip-specs --yes`
  - or merge deltas into `openspec/specs/frontend/spec.md` if adopting as current truth.


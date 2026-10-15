# ERP 3.0 — Paraşüt End-to-End Reverse-Engineering Doctrine

**Record:** ERP3-PARASUT-DOCTRINE-20261014-001  
**Effective:** 2026-10-14  
**Status:** Adopted as a scope and evidence standard for future Stage C work.  
**Authorization boundary:** This document does not authorize live Paraşüt/Supabase access, does not satisfy the existing Stage B completion gate, and does not authorize implementation or any Paraşüt write.

## 1. Purpose and non-reuse rule

Investigate observable Paraşüt application behavior deeply enough to specify independently correct ERP 3.0 data contracts and financial behavior. This is behavioral and data-flow research, not visual imitation or an attempt to discover proprietary server implementation.

Legacy ERP 2.0 is a visual reference only and evidence of prior-system failure modes. Do not reuse its API calls, calculations, financial formulas, data transformations, sync code, data contracts, business logic, or backend architecture. ERP 3.0 financial truth belongs in a validated domain/backend layer; the frontend primarily presents its results.

Do not infer causation from correlation, invent hidden implementation details, or describe an unobserved path as verified.

## 2. Stage C workstreams

| Workstream | Scope | Completion evidence |
|---|---|---|
| **C1 — Official API and source inventory** | Inventory current official API resources, methods, fields, permissions, pagination, limits, lifecycle coverage, and documentation dates. Identify the applicable Paraşüt company and available source systems only after access is separately authorized. | Source-linked resource/field catalog; unsupported or uncertain details labeled as evidence gaps; no live calls in this workstream unless separately authorized. |
| **C2 — Authorized web functional analysis** | Inventory every authorized module, page, tab, table, field, filter, search, sort, pagination control, action, modal, report, and relevant UI state. Trace representative non-mutating workflows and record validation, loading, empty, error, stale and dependency behavior. | Coverage matrix with each unit assigned a required status; owner-driven, read-only observations; no state-changing actions. |
| **C3 — Existing ERP intermediate-layer failure analysis** | Read the authorized legacy source and prior Eclipse evidence. Trace UI-to-request-to-source-to-raw representation-to-transformation-to-display where evidence exists. Examine pagination, mapping, duplicate/missing records, cache invalidation, currency conversion, and balances. | Evidence-linked failure paths, with observed/inferred/unknown separated. No legacy logic is adopted as a design precedent. |
| **C4 — Web/API/Supabase record-level reconciliation** | Compare bounded, authorized records across Paraşüt Web, official API, and an environment-classified Supabase project. Validate identifiers, relationships, statuses, counts, currencies, rates, cancellations, corrections and record-level totals. | Approved sample definition, reproducible mapping, discrepancy ledger and readback evidence. Aggregate equality alone never qualifies as reconciliation. |
| **C5 — Financial semantics and performance findings** | Consolidate evidence gaps affecting financial correctness; measure only authorized, practical workflows; distinguish measured results from assumptions about Paraşüt internals. | Signed evidence ledger, performance observations with conditions and limits, and a list of unresolved items. Stage D financial-domain sign-off remains blocked while critical correctness evidence gaps remain. |

**Current gate:** Stage B has an initial analysis report but its review remains on hold pending an analysis-only supplement and owner approval. No Stage C execution starts until that gate is satisfied. No live investigation starts until its own access authorization is separately granted.

## 3. Exhaustive coverage with bounded effort

Use a two-pass inventory rather than deeply repeating the same investigation on every screen:

1. **Surface census:** From authorized navigation and official documentation, enumerate modules/pages/tabs/reports and visible record types. Assign stable inventory IDs. Record inaccessible items as NOT ACCESSIBLE; do not infer them.
2. **Risk-ranked workflow pass:** For each discovered module, inspect every distinct financial workflow and state transition. Start with source documents, transactions/payments, balances and their relationships; then cover supporting master data and remaining operational/reporting modules. Use the actual account/API inventory to determine module names; this is not a claim that any particular feature is available.
3. **State and edge-case pass:** For each distinct control/workflow, cover representative valid, empty, error, stale, pagination, cancellation/correction and currency cases where available and safe. Reuse evidence for genuinely identical shared components, while preserving module-specific outcomes.
4. **Coverage closure:** Revisit the original checklist. Every item must have a status and remaining question; no unreviewed item is silently counted as covered. Expand sample size only when evidence exposes a specific unresolved risk and authorization permits it.

Each matrix row links: module → page/tab → element → interaction → initial/result state → validation → request/API evidence → source record → financial implication → Supabase mapping → verification status → Evidence reference → open question.

Required status values:
- VERIFIED
- OBSERVED BUT NOT EXPLAINED
- DOCUMENTATION ONLY
- NOT ACCESSIBLE
- REQUIRES SAFE TEST ENVIRONMENT
- NOT YET REVIEWED

Every conclusion must separately identify observation, inference, and unknown. Preserve target identity, timestamp, scope, evidence reference and capture limitations. Do not claim 100% coverage while any item is unexamined or unresolved.

## 4. REA selection and limitations

Use REA only when its current connected tool list supports the target and question. Check the active Claude session’s actual advertised tools; the installed skill alone does not prove the MCP server is connected.

- **Potential fit:** Passive observation of an already-open, owner-controlled Paraşüt browser page; analysis of a supplied/approved shipped JavaScript or Electron artifact; analysis of an already-existing, owner-provided network capture where its provenance and scope are known.
- **Not a fit:** Ordinary source-repository architecture review, undocumented server-side behavior, or proving API semantics without API evidence. Use normal static repository review for ERP source. Do not use REA readiness/setup calls repetitively after a fresh session has verified tool availability.
- **Passive browser boundary:** REA observation does not click, navigate, evaluate page code, invoke IPC, capture prior activity, or guarantee network coverage. The owner manually operates the permitted UI. A passive capture is not a full network trace.
- **Sensitive-data boundary:** Do not capture or log credentials, personal customer details or raw sensitive payloads. Browser URLs may retain ordinary query values; accessibility text, screenshots and script/console material may also expose data. Minimize capture scope and omit sensitive fields. Do not attempt interception, decryption, endpoint abuse or control bypass.
- **Unavailable capability:** Record the exact unavailable question and required safe evidence. Do not substitute a guessed answer.

In prior Stage A records a fresh Claude session discovered 170 REA tools and the installed version-37 skill, but called no REA tool. The present ChatGPT Work session has no REA MCP tools, so REA execution must be performed by Claude Code only if its active session confirms availability. This directive does not trigger a tool call.

## 5. End-to-end data lineage and three-way reconciliation

For each in-scope financial workflow, build the evidence path:

**UI state/action → observed request or documented resource → Paraşüt source record → existing Supabase raw representation (only if authorized and environment-classified) → intermediate processing → ERP display.**

Mark every unobserved edge as a gap. A browser view, API response, database row and ERP display are separate observations until a stable identity mapping proves the relationship.

Start with an owner-approved, bounded, read-only sample. Fix company, record types, IDs, date window, sample size, fields and observation time before collection. Compare at individual source-record level, including linked transactions and lifecycle state. Reconcile all pages/count metadata for the agreed sample. Record missing, duplicate, delayed, stale-cache, mapping, status, pagination, currency/rate, cancellation/correction and unexplained differences separately. Expand only with an explicit scope and reason.

Never treat total or aggregate balance equality as proof of record-level correctness. Do not store raw customer data or raw sensitive payloads in the journal; use minimized IDs or approved pseudonyms and evidence references.

## 6. Performance measurement

Measure only natural, authorized, non-mutating workflows and record device/network/session conditions, measurement method and sample count. Where practical capture:

- Cold initial page load and warm navigation latency.
- User-observed search/filter response time.
- Request count, method, endpoint/resource, parameters and payload size only where legitimately observable.
- Pagination/incremental-loading behavior and waterfall timing where the user-approved evidence source actually exposes it.
- Cache reuse/invalidation signals observable in the selected browser.
- Redundant/expensive requests and differences between cold and warm navigation.

Do not infer private infrastructure or server architecture from latency. REA passive browser capture does not guarantee a complete network waterfall. Use an existing authorized HAR/capture or approved observation method; if unavailable, mark the metric unavailable. Do not create interception or instrumentation merely to fill a matrix cell.

## 7. Financial and safety completion gates

Before Stage D financial-domain sign-off, resolve every critical evidence gap that could change record identity, transaction completeness, balances, currency/rate treatment, lifecycle state, or source mapping. When those facts cannot be established safely, report the gap and keep sign-off blocked.

For an approved reconciliation scope, acceptance requires:
- Every sampled record has a stable source ID and an evidenced relationship to its linked records.
- Counts, pages, statuses, amounts and currencies are accounted for; corrections, cancellations and reversals remain traceable.
- Each discrepancy is classified; there are zero unexplained financial differences in the accepted scope.
- Tolerances, if any, are written for a specific case and approved by the owner/accountant. No blanket tolerance.
- Evidence establishes provenance and snapshot time without exposing credentials or unnecessary personal data.

Production Paraşüt stays read-only. Never invoke create/update/delete, submission, payment, cancellation or other state-changing actions to observe outcomes. All ERP-to-Paraşüt writes remain forbidden. Do not access production credentials/data or Supabase until the owner separately authorizes the access, target and bounded scope and the Supabase environment has been verified. No schema/data changes are authorized by this doctrine.

## 8. Minimum authorizations before future live work

1. Stage B supplement accepted and project owner opens the Stage C gate.
2. Explicit Paraşüt read-only authorization naming company 666034 (or the newly specified scope), permitted modules/resources, fields, sample/time window and allowed UI navigation/API calls.
3. Explicit Supabase read authorization, exact project/environment classification, permitted tables/views/fields and bounded sample. Project reference alone is not proof it is non-production.
4. Approved handling/disposition for any sensitive Eclipse or Paraşüt capture needed for evidence; use sanitized copies where possible.
5. Separate approval for any new cost, tool/service, production-impacting action, or isolated test environment.

Authorization never includes outbound Paraşüt writes.

## 9. Future bounded Claude Code assignment briefs (not dispatched)

- **C1 — Offline source inventory:** Read current official Paraşüt API materials and authorized local specifications only. Return a dated resource/field/method/permission/pagination catalog, confidence labels and unresolved questions. No live credentials, API calls, application changes or production access.
- **C2 — Authorized web inventory:** After Stage B acceptance and explicit read-only target authorization, use the actual available REA tools only for passive observation of owner-opened pages. Deliver a module/page/element/state coverage matrix and evidence gaps. Do not click state-changing controls, automate the UI or log PII/secrets.
- **C3 — ERP failure-path review:** Static-read the approved legacy snapshot and trace named financial paths from request/source representation through transformation to display. Cite files/lines; distinguish evidence from inference; identify pagination, mapping, cache and calculation failure points. Do not copy logic or edit application files.
- **C4 — Bounded reconciliation:** Only after separate Paraşüt and Supabase read approvals and environment verification, compare the owner-defined sample record by record. No writes. If either side is unauthorized/unavailable, stop that comparison and produce the gap report.
- **C5 — Evidence/performance synthesis:** Consolidate existing approved evidence and authorized measurements, expose remaining gaps and recommend whether Stage D’s financial sign-off gate is satisfied. No implementation or sign-off on behalf of the owner/accountant.


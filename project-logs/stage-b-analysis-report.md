# ERP 3.0 - Stage B Analysis Report

- Task ID: ERP3-STAGE-B-ANALYSIS-001 (read-only forensic analysis; NO application changes)
- Report status: DELIVERED FOR REVIEW. Application development has NOT started and remains gated on ChatGPT Work review and project-owner approval.
- Written: 2026-10-14T00:52:12+03:00 (Turkey Standard Time, UTC+03:00)
- Author: Claude Code - Sonnet 5.5 (claude-sonnet-5-5), effort max (model/effort gate PASS, journal ENTRY 0016)
- Intended readers: the ChatGPT Work reviewer and the project owner.
- Stage A basis: reviewer decision ERP3-STAGE-A-ACCEPT-20261014-001 (journal ENTRY 0016).
- Companion files (all in C:\Users\Bediz\Documents\erp 3.0\project-logs): claude-code-journal.md (append-only, hash-chained), stage-a-recovery-checkpoint.md (untouched), stage-b-recovery-checkpoint.md (this task).
- Secrets and customer data: none are reproduced in this report. Where a source contains them, only the category and file/line are cited.

## 0. Bottom line

1. ERP 2.0 (the legacy repository) is a useful VISUAL and information-architecture reference: 67 ERP route declarations under /apps, a 12-module shell, a dark design-token set, three responsive breakpoints. Section 3 inventories it as visual reference only.
2. Its DATA layer must not be inherited. Observed in code: browser-direct database access guarded by row-level-security policies whose tenant predicate compares columns to themselves and which still contain open "USING (true)" policies; identity bound to e-mail; money computed in the browser with floats and persisted; a payment layer that is scaffolding with stubbed refund verification; a sync engine that its own documents blame for a production outage; hand-applied schema outside migrations. The legacy documents describing fixes are partly stale against HEAD.
3. The Eclipse transcript is ONE repair task (not the whole incident). It proves remote database pushes, function deployments, direct SQL and a git push were done from a workstation against a single hosted project with no staging/production label anywhere; that the public key retrieved customer, tax-number and bank-account data from two Edge Functions; and that an "unidentified third party" had wiped the parasut schema with no forensic or credential-rotation evidence in the artifact. It does NOT prove the project was staging, and it does not prove it was production; the evidence is consistent with a live system holding real-looking data.
4. The Eclipse HTML is a front-end marketing prototype (browser-compiled React, CDN scripts, mailto form). It contains no architecture, data flow or security design, so it has little post-mortem value beyond vendor identity and marketing claims.
5. Recommendations (section 6) define independent ERP 3.0 trust boundaries, data boundaries and backend responsibilities. No financial rule is invented; section 8 lists 40 questions that need authoritative answers first.
6. Confirmation: no application file changed. Both repositories were clean before and after (section 9).

## 1. Scope, evidence and method

### 1.1 Evidence examined

| Short name | What | Identity pinned |
| ---------- | ---- | --------------- |
| LG | C:\Users\Bediz\Documents\erp 3.0\dayandisli-legacy (clone of the legacy ERP 2.0 repository, static read-only) | HEAD b1b8070717409fc69deb71ab22400dfed384b432, tree 938c08254df178836140d4de4fe746ea74d4fad1, 775 tracked files |
| PT | C:\Users\Bediz\.codex\attachments\25a078d9-7296-4313-92cd-fa2932da42d9\pasted-text.txt (Eclipse transcript, 1112 lines) | sha256 87b18920a36f77b71752fefb901863d7ad32f31b9c7ef1bf122353ceecb9481c (unchanged before/after) |
| HT | C:\Users\Bediz\.codex\attachments\3e49516a-0f58-4b40-ae7a-4a336b17a6fa\eclipse_m_hendislik_erp_zel_yaz_l_m_sistem_g_venlik_mimarisi.html (1317 lines) | sha256 83948a082020c66e423eb97e72fa2ad584413a8612dfe7bf4ebe0b6748c2ff0e (unchanged before/after) |

Citation format: LG paths are relative to the repository root, for example src/App.tsx:122-134. PT and HT citations use "PT L435-441" (line numbers of the file as read). Short names for legacy documents: BTA = docs/2.0/CLAUDE_CODE_ERP_2_BACKEND_TRUTH_AUDIT.md; ASA = docs/audits/ACCOUNT_STATEMENT_AND_PARASUT_SYNC_AUDIT.md; the architecture ledger is docs/architecture-remediation.md.

### 1.2 Deliberately not opened or not done

- No .env* file was opened (tracked names exist: .env.example, .env.staging.example, .env.deploy.example). Environment variable NAMES were taken from source code only.
- Files whose names indicate captured API data (tools/parasut/discovery/*.json, tools/parasut/parasut-contacts-preview.json, docs/parasut/work/*.json) were not opened; only count-mode pattern checks were run (counts, never values).
- The external repository referenced by PT was not accessed. No command embedded in PT or HT was executed. No Supabase, Parasut, network, browser, IDE or REA tool was used. No install, build or test was run. The one scratch conversion of HT to text was a regex strip inside the session scratchpad (outside the workspace) and produced nothing useful.
- The .docx under docs, binary assets and font files were not opened.

### 1.3 Labels used

- OBSERVED: directly visible in the cited text.
- INFERRED: reasoned from observed text plus general technical knowledge; confidence in brackets (H, M, L).
- CLAIM: a statement made by a legacy document, not verified against code or a live system.
- Severity describes impact IF the condition holds in the live system. It is not a statement that the condition is exploitable today; live configuration (Supabase auth settings, deployed function versions, actual policies) was not available.

### 1.4 Coverage and limits (read this before relying on absence of a finding)

- Read in full or nearly so: src/App.tsx, src/layouts/ErpLayout.tsx, shell/finance/CRM/sales/reports navigation data, erp-shell.css, src/index.css, tailwind.config.ts, index.html, ERPAuthContext, ProtectedRoute, domains.ts, Supabase client and auth lookup, DashboardPage, calculateBalance, quoteCalculations, server/erp/decimal.ts, server/parasut/auth.ts and client.ts, payment-webhook, payment-refund, _shared/payment-providers.ts, market-data/index.ts, send-contact-email, supabase/config.toml, the Phase 25/26/AUTH-2 and production-rpc RLS migrations (relevant parts), the scheduling migration, deployment and safety scripts (parts), CI workflow, and eight legacy audit/remediation/runbook documents (relevant sections).
- Targeted (searched, partly read): parasut-api/handlers.ts (72 KB), server/parasut/sync-base.ts, other Edge Function index files, the sales-quotes migrations, CustomerDetailPage, calculators.
- NOT reviewed in depth: the large finance pages (FinanceExpensePages, OperationsPages, FinanceIncomePages, QuotePages), shop/api.ts, checks-api and parasut-write-api handlers, field-mapping-registry.ts, most of the ~50 migrations, server/erp services, and the test suites. Findings are therefore a sample of high-signal areas, not a complete audit.
- Static only: deployed Edge Function versions, hosted Supabase settings (email confirmation, signup, max rows), actual RLS state, secrets and production data were not observable.
- The legacy audit documents are CLAIMS written by AI-assisted sessions; several are stale against HEAD (finding L-18).

## 2. Findings table (concise; details in sections 3-5)

Legacy ERP 2.0 (LG)

| ID | Area | Finding | Label | Sev | Evidence |
| -- | ---- | ------- | ----- | --- | -------- |
| L-01 | RLS | Tenant predicate in Phase 25/26 member policies compares membership columns to themselves (unqualified company_id/branch_id inside the subquery), so the tenant check degenerates; rows with company_id NULL are open to every authenticated user; corrected for only 4 tables | OBSERVED text; INFERRED effect [H] | High | supabase/migrations/20260603123000_phase25_tenant_isolation_rls_data_safety.sql:100-128; 20260603130000_phase26_supabase_production_security_governance.sql:115-136; 20260613052204_production_rpc_rls_prerequisites.sql:127-171; supabase/manual/tenant_policy_predicate_corrections_draft.sql:16-17,183-189 |
| L-02 | RLS | 9 early tables keep USING(true)/WITH CHECK(true) policies for any authenticated user (not in Phase 26 list); quotes tables have USING(true) plus full CRUD grants | OBSERVED; INFERRED live state [M] | High | 20260517153000_erp_core_schema.sql:603-648; 20260603130000...:12-62; 20260814120000_sales_quotes_module.sql:198-213; 20260815090000_sales_quotes_module_grants.sql:17-25 |
| L-03 | Identity | ERP identity is matched by e-mail (client lookup, Edge Functions with ilike, RLS, DB function); shop customers share the same auth pool | OBSERVED; INFERRED conditional risk [M] | High | src/features/erp/shared/auth.ts:24-31; supabase/functions/parasut-api/index.ts:84-87; parasut-write-api/index.ts:81-84; payment-refund/index.ts:47-56; 20260614061645_unified_erp_user_authorization.sql:41-44,77-80; send-quotation-email/index.ts:9 |
| L-04 | Gateway auth | verify_jwt=true is satisfied by the public key (the repo says so); user checks live in function code; market-data and commerce-checkout are not pinned in config.toml | OBSERVED | Med | 20260811120000_schedule_parasut_sync_run.sql:34-38; supabase/config.toml:3-67; docs/architecture-remediation.md:111 |
| L-05 | Payments | Provider adapters are scaffolds ("adapter_ready"); refund "verification" is a stub that accepts any refund id and caller-supplied amount; webhook ignores database errors and marks events processed; signature schemes and amount units look inconsistent with provider specs; shop flag is off but functions are deployed | OBSERVED; INFERRED vs vendor specs [M] | High if enabled | supabase/functions/_shared/payment-providers.ts:81-211; payment-refund/index.ts:78-97; payment-webhook/index.ts:40-144; src/features/shop/config.ts:1 |
| L-06 | Calculations | Quote totals are computed in the browser with floats and persisted; no totals-integrity constraint in the database; line and document totals are rounded on different paths | OBSERVED; INFERRED mismatch [M] | Med-High | src/features/sales/quotesApi.ts:103,154; quoteCalculations.ts:3-41; 20260814120000_sales_quotes_module.sql:59-62,81-86 |
| L-07 | Calculations | Finance helper nets all parties into one receivable/payable, uses the UTC date for "overdue", sums floats, defaults unknown types to +1; no non-test callers found (latent) | OBSERVED | Med | src/lib/finance/calculateBalance.ts:15-31,74-93 |
| L-08 | Calculations | Server decimal module truncates (no declared rounding rule), returns 0 for malformed input, and is duplicated in another module | OBSERVED | Med | server/erp/decimal.ts:18,27,45,50; docs/architecture-remediation.md:89 |
| L-09 | Queries | "Top 20 by balance" orders by a JSON text extract; fixed row caps (range 0-24999, limit 2000); PostgREST max-rows may truncate silently | OBSERVED; INFERRED [M] | Med | supabase/functions/parasut-api/handlers.ts:646,1177,1204-1205 |
| L-10 | Sync | Sequential per-row upsert; one row error blocks the page checkpoint; offset pagination over a mutable source; reactive-only rate limiting; the legacy report names this as the suspected cause of a 2026-08-24 production Auth outage | OBSERVED code; CLAIM incident | High | server/parasut/sync-base.ts:683-720; server/parasut/client.ts:16-31,58-61,104-135; docs/audits/CLAUDE_CODE_PRODUCTION_SYNC_INCIDENT_REPORT.md:5,41-56 |
| L-11 | Sync / finance | Records deleted at the source can stay mirrored and counted (cheques); two freshness clocks; reconciliation is opt-in per resource | OBSERVED comment; CLAIM audit | Med-High | supabase/functions/parasut-api/handlers.ts:1053-1066; docs/2.0/CLAUDE_CODE_ERP_2_BACKEND_TRUTH_AUDIT.md:817-837 |
| L-12 | Integration auth | External accounting API reached through OAuth password grant with a human account's username/password; token cached only in memory | OBSERVED | Med-High | server/parasut/auth.ts:57-64,86-120 |
| L-13 | Schema governance | Core schema applied by hand outside migrations; manual SQL drafts; publishable-key literal in migration history; referenced architecture document is absent from the repo | OBSERVED; CLAIM status | Med-High | docs/manual-sql-reconciliation.md:10-24; 20260811120000_schedule_parasut_sync_run.sql:50-54; ERP_BUSINESS_ARCHITECTURE.md referenced in 8 files, not in tree |
| L-14 | Public endpoints | Contact function puts unescaped input into HTML mail and auto-replies to a caller-supplied address (captcha only), and returns raw error text; the quotation-mail open-relay fix was code-only until redeploy per legacy report | OBSERVED; CLAIM | Med | supabase/functions/send-contact-email/index.ts:78-92,106; docs/final-engineering-report.md:108 |
| L-15 | Public endpoints | market-data is unauthenticated, calls paid APIs, and caches per caller-supplied coordinates without a bound | OBSERVED | Low-Med | supabase/functions/market-data/index.ts:156,174-188,195,215-219 |
| L-16 | Deployment | Plain FTP deploy with environment credentials; non-atomic; no canary; the production-target guard is opt-in; CI has no deploy gate or security scanning | OBSERVED | Med | scripts/deploy_ftp.py:78,226-228; docs/deployment-and-rollback.md:116-124; scripts/check-supabase-target-safety.mjs:88-141; .github/workflows/quality.yml:30-52 |
| L-17 | Data hygiene | An API capture with e-mail-shaped and tax-number/IBAN-shaped values is tracked in Git; a migration seeds an individual e-mail address and two others insert user rows whose values were not inspected; AI-tool patch files are tracked | OBSERVED (count-only for the capture) | Med-High | tools/parasut/parasut-contacts-preview.json (5 + 5 value-shaped matches); migrations 20251208092932_b7d45e49-989a-4ea1-a451-45de4f44dffd.sql:42, 20260517110000_admin_users_auth.sql:9, 20260517153000_erp_core_schema.sql:34; src/cursor_full.patch, src/cursor_refactor.patch |
| L-18 | Governance | Audit and remediation documents are stale against HEAD (calculator "deleted" but live; "84 tables" but 5 files; defects already changed) | OBSERVED | Med | docs/architecture-remediation.md:96 vs src/App.tsx:95,240; docs/frontend-database-access-classification.md:3 vs 5 files with browser table literals (section 4.2); handlers.ts:1048-1075 |
| L-19 | Client auth / state | Unknown routes fall back to dashboard.view; TOKEN_REFRESHED ignored; any lookup error signs the user out; tokens, drafts and checkout profile in localStorage; default QueryClient | OBSERVED | Low-Med | src/features/erp/shared/permissions.ts:244-250; src/contexts/ERPAuthContext.tsx:66-76,122-134; src/integrations/supabase/client.ts:27-33; src/features/sales/pdf/QuotePrintPage.tsx:13; src/features/shop/pages/CheckoutPage.tsx:42,118; src/App.tsx:106 |
| L-20 | Output encoding | Print/PDF windows are built with document.write; the quote HTML escapes its fields, other writers were not verified | OBSERVED partial | Low-Med | src/features/sales/pdf/quotePdfHtml.ts:4,333-342; src/features/finance/FinanceNavigationTools.tsx:173 |
| L-21 | Filtering | Search sanitisation strips only "%" and ","; other filter metacharacters and "_" pass into a PostgREST or() string | OBSERVED; INFERRED [M] | Low | supabase/functions/parasut-api/handlers.ts:315-316 |
| L-22 | UX | Dead links and no-ops, index-coupled icons, 8-10 px text, no mobile backdrop; dashboard KPIs and charts are placeholders | OBSERVED | Low | src/layouts/ErpLayout.tsx:37,160,335,420-421; erp-shell.css:763-777,865-922; src/pages/apps/dashboard/DashboardPage.tsx:168-188,226-247 |

Eclipse artifacts (PT, HT)

| ID | Area | Finding | Label | Sev | Evidence |
| -- | ---- | ------- | ----- | --- | -------- |
| E-01 | Environment | Remote migration push, function deploys, SQL and git push from a workstation; no staging/production label in the file; one project reference; probe output has real-looking business data, so it cannot be treated as staging | OBSERVED; INFERRED target is live [M-H] | Critical | PT L435-441,488-494,618-624,999-1006,1056-1060; L782-786 |
| E-02 | Change control | Deploy-before-validate: the first deploy wrote 725 rows with null relationships; fixed by redeploy plus an out-of-band UPDATE of run metadata | OBSERVED | High | PT L488-515,610-627,812-860 |
| E-03 | Incident handling | "Unidentified third party" wiped/reshaped the parasut schema (zero functions, lost indexes); no timeline, actor, access path, key rotation or forensic evidence in the artifact; 4 leftover grants; recovery not audited | OBSERVED (absences) | Critical | PT L8,10,17,1047 |
| E-04 | Migration integrity | The migration ledger said "applied" while the objects were gone, so a normal push could not self-heal | OBSERVED | High | PT L10,933-937,1012,1027 |
| E-05 | Data exposure | The public key retrieved customer, tax-number, bank-account and e-invoice data from two Edge Functions | OBSERVED; INFERRED the actions were callable without a user identity, by design or by omission [H] | Critical | PT L778-786 |
| E-06 | Secrets and agents | Credential-store enumeration was attempted (blocked); the prompt pointed the agent at .env/Vault; a script read .env for a database URL with TLS verification disabled; working copy under OneDrive | OBSERVED; INFERRED sync exposure [M] | High | PT L5,29,73-78,696-702,778 |
| E-07 | Locking | Orphaned "running" locks after a platform kill; the cleanup function was missing; best-effort RPC errors are probably ignored | OBSERVED; INFERRED [M-H] | High | PT L290-294,376-395,407-409,970-976,1020-1027 |
| E-08 | Platform limits | 25 rows per page plus 10 requests per 10 s means about 140 s per pass against a ~150 s budget; fix is a cursor in run metadata | OBSERVED; INFERRED consistency [M] | Med | PT L959-982,1020-1031 |
| E-09 | Validation | The task premise was wrong (cycle-1 success existed); 3-row sampling; timezone artifact; currency code "TRL" | OBSERVED | Med | PT L11,704,713,726-773,784,1020 |
| E-10 | Migration naming | Phase numbers are not chronological; the new version is dated about 23 days after the session date | OBSERVED; INFERRED hand-assigned [M] | Med | PT L10,350,431,470,476,951 |
| E-11 | Autonomy | A sub-agent in auto mode with remote-write capability and an instruction to push to main; the classifier blocked one probe | OBSERVED | High | PT L20,53,78,1103-1112 |
| E-12 | HTML artifact | Marketing prototype, not a security architecture; development CDN scripts without integrity attributes; mailto form; no backend | OBSERVED | Info | HT L17,79-89,112-127,1293-1296 |

Cross-cutting

| ID | Finding | Label | Sev | Evidence |
| -- | ------- | ----- | --- | -------- |
| X-01 | In both systems a public/publishable key is treated as proof of "being allowed": Eclipse functions returned data to it (E-05); the legacy cron call relies on it (L-04) and its own register records the latent exposure | INFERRED [M] | High | PT L778-786; 20260811120000_schedule_parasut_sync_run.sql:34-38; docs/architecture-remediation.md:111 |
| X-02 | Both systems rely on the same pattern (a mirror schema fed by a scheduled Edge Function with a run table used as a lock) and show the same failure family: orphaned locks, silent best-effort errors, wall-clock limits | INFERRED [H] | High | PT L407-409,970-976; server/parasut/sync-base.ts:644-720; docs/audits/CLAUDE_CODE_PRODUCTION_SYNC_INCIDENT_REPORT.md:41-56 |


## 3. ERP 2.0 visual reference inventory (VISUAL REFERENCE ONLY)

This section catalogues what ERP 2.0 looks like and how it is organised. It does not endorse its business logic, formulas, API calls, sync code, contracts or backend architecture. Turkish labels are written without diacritics.

### 3.1 Routes (src/App.tsx)

| Area | Path patterns | Notes | Lines |
| ---- | ------------- | ----- | ----- |
| Public site | /, /hizmetler, /teknolojiler, /urunler, /sektorler, /iletisim, /hakkimizda, /referanslar, /site-haritasi | exposed when the hostname is the public domain, the shop domain or localhost | App.tsx:122-134; src/lib/domains.ts:56-62 |
| CMS | /sayfa/* | dynamic pages | App.tsx:161 |
| Auth | /login | ERP login, or redirect to the ERP domain from the public domain | App.tsx:140 |
| Shop (flag off) | /shop, /shop/kategori/:categorySlug, /shop/:slug, /cart, /checkout, /checkout/success, /hesabim | NotFound when the flag is off | App.tsx:142-159; src/features/shop/config.ts:1 |
| ERP shell | /apps (protected; ErpLayout), index = dashboard | single parent route with 67 declarations in total | App.tsx:163-241 |
| Finance / income | finance; income/invoices (list, new, :invoiceId, :invoiceId/edit); income/customers (list, new, :customerId); income/collection-report | | App.tsx:167-175 |
| Finance / expense | expense/list (+ new/invoice, new/payroll, new/tax, new/bank-expense, new/other, new/accommodation, :expenseId); incoming-invoices (+ :id); income-expense-report; payments-report; vat-report | six "new expense" kinds | App.tsx:177-189 |
| Finance / purchasing | purchasing/orders (list, new, :orderNo); purchasing/suppliers (list, new, :supplierId) | | App.tsx:191-196 |
| Finance / cash | cash/accounts (+ new-cash, new-bank); cash/checks (list, new, :checkId, :checkId/edit); cash-bank-report; cash-flow-report | | App.tsx:198-206 |
| Finance / inventory | inventory/products (list, new, :productId); outgoing-dispatches and incoming-dispatches (list, new, :dispatchNo); history; report | | App.tsx:208-218 |
| CRM | crm/customers (list, new, :customerId, :customerId/edit) | | App.tsx:220-223 |
| Sales | sales/quotes (list, new, :quoteId, :quoteId/edit); sales/quote-customers/:customerId; sales/orders (list, new, :orderId); sales/activities | | App.tsx:225-233 |
| Reports | reports/collections, income-expense, cash-bank, production | | App.tsx:235-238 |
| Production tools | calculator/* (dashboard, machine selection/detail, spur / helical / Reishauer gear forms and receipts, weight calculation) | the only content behind the "Uretim" module | App.tsx:240; src/calculator/pages/* |
| Fallback | * -> NotFound | | App.tsx:244 |

Page files under src/pages/apps/** are 133-532-byte wrappers that import the feature pages (file listing). The route list is a good inventory of screens that will need requirements; it is not a statement that each screen is complete (many dashboard widgets and the finance overview are placeholders, see 3.6).

### 3.2 Layout anatomy (src/layouts/ErpLayout.tsx, erp-shell.css)

- Shell: .erp-dashboard > .erp-shell [.is-collapsed] [.mobile-open] with aside.erp-sidebar and main.erp-main (topbar, routed Outlet, footer) (ErpLayout.tsx:143-443).
- Sidebar: fixed, 244 px wide (78 px collapsed to an icon rail), vertical gradient, brand row (logo + wordmark), collapse button, scrollable nav with a hidden scrollbar, bottom block with help link, logout and profile chip (erp-shell.css:23-195).
- Topbar: sticky, 72 px, translucent with backdrop blur; hamburger (mobile), global search with results popover and Ctrl/Cmd+K focus, "+ Hizli Islem" popover, notifications popover, payment/collection calendar dialog, avatar menu (ErpLayout.tsx:354-437; erp-shell.css:204-380).
- Content: centered, max width 1440 px, padding 18/20/30 px (erp-shell.css:393-397). Footer 52 px with a vendor credit line (ErpLayout.tsx:441; erp-shell.css:811-819).
- Dashboard composition: top row of two cards (welcome with FX tiles; quick actions, 4 cards), a 3-tile KPI row, then a 4-column grid (two donut cards, upcoming payments list, a right stack with approvals and notifications) (DashboardPage.tsx:107-249; erp-shell.css:398-577).

### 3.3 Navigation

- Sidebar modules in a fixed order, 12 entries, 5 disabled with a "Yakinda" badge and no route: Dashboard, Favoriler (same route as Dashboard), Muhasebe ve Finans, Musteri Iliskileri, Raporlar, Satis, E-Ticaret (disabled), Uretim (opens the calculator), Kalite ve Bakim Yonetimi (disabled), Insan Kaynaklari (disabled), Web Sitesi (disabled), Ayarlar (disabled) (src/features/erp-shell/shellNavigationData.ts:11-24).
- Accordion submenus: Finance has 5 groups and 19 pages, each with a permission key (Gelir Yonetimi 3, Gider Yonetimi 5, Satin Alma 2, Kasa 4, Stok Yonetimi 5) (src/features/finance/financeNavigation.ts:15-165); CRM has 1 page; Sales has 3 (Teklifler, Siparisler, Satis Faaliyetleri); Reports has 4 (src/features/crm/crmCustomerData.ts:5-11; src/features/sales/salesData.ts:5-21; src/features/reports/reportsNavigationData.ts:1-22).
- Behaviour: opening Finance, Sales or Reports also navigates to a default page; sections auto-open from the URL (ErpLayout.tsx:39-52,123-128,166-183,242-303).
- Global search covers a static list of 5 routes; quick actions are 4 shortcuts (shellNavigationData.ts:26-39).
- Route-level permission: a regular-expression table maps path prefixes to permission keys; unknown paths fall back to the lowest permission (src/features/erp/shared/permissions.ts:215-250).

### 3.4 Typography

- Family declared for the ERP shell: Inter, ui-sans-serif, system-ui, sans-serif (erp-shell.css:15). index.html loads no font, so the system fallback applies unless Inter is installed locally (index.html:1-44).
- Scale (px): navigation 13; brand 16 weight 800 with 0.04em tracking and an 11 px sub-label at 0.16em; section title 16; welcome heading clamp(26, 2.7vw, 40); KPI value 28 and label 13; FX value 22; list text 11; notification title 10, body 9, time 8 (erp-shell.css:57-69,107,443-447,502-505,560-572,761-777).
- Observation [OBSERVED]: text at 8-10 px is far below the usual 12 px minimum used in accessibility guidance [INFERRED, M]; do not carry it over.

### 3.5 Colors and tokens

- Shell palette (hex): background #06101d; panel #0d1c2e; panel-2 #11243a; border #20364e; blue #3195ff; green #1ecb70; red #ff4b55; purple #a34cff; page text #eef5ff; muted greys #9fb1c6 / #8fa2b7 / #71849b; sidebar gradient #081725 to #07121f; active item gradient #123c6c to #102d50 with text #63b0ff; primary button gradient #18569a to #12447d (erp-shell.css:2-9,29,105-122,292-296).
- Semantic tokens (HSL): --erp-bg 222 47% 7%, --erp-primary 214 92% 58%, success 145 63% 42%, warning 38 92% 50%, danger 0 78% 58%, info 191 92% 48%, radius 0.5rem (src/index.css:11-72); a second ".dark" palette (75-112); an ".erp-theme" helper that overrides Tailwind utility classes with !important (161-183). Tailwind maps shadcn semantic colors plus erp.*, navy, blue-bright, whatsapp and sidebar (tailwind.config.ts:17-89).
- Semantics in use: blue = primary/links, green = income/positive, red = expense/negative, purple and orange = decorative accents (KPI borders, quick-card icons: erp-shell.css:528-541,550-559,711-716).
- Observation [OBSERVED]: three overlapping palettes (hex in shell CSS, HSL tokens, .dark) and hero photos hotlinked from a third-party host (erp-shell.css:416-421). ERP 3.0 should define one token set and self-host assets.

### 3.6 Components

- Kit: shadcn/ui (style "default", base color slate, CSS variables, Lucide icons) with 42 primitives in src/components/ui, including sidebar, dialog, sheet, table, tabs, form, calendar, tooltip, and two toast systems mounted together (components.json:3-13; src/App.tsx:2-3,251-252).
- ERP-specific pieces: gradient card with inset highlight (erp-shell.css:403-408), KPI card with 3 px accent border (550-559), conic-gradient donut and legend (602-669), upcoming-payments row (date block + text + amount; 678-717), approvals list, notification list, calendar day cell (797-810), popover and user menu, avatar, search box, empty-state text, error-boundary card (src/components/ERPErrorBoundary.tsx:23-41).
- Domain screens present but not inventoried visually: list/detail/form pages for invoices, expenses, customers, quotes (including print/PDF document layout), cheque register, customer statement, inventory, and the gear/weight calculators with receipt output.
- Placeholders [OBSERVED]: dashboard KPI tiles show "-" and the two donut cards show "no data"; only market-data tiles (FX, gold, weather) and open-cheque reminders are wired (DashboardPage.tsx:168-188,226-247); the finance overview data object is all placeholders (financeNavigation.ts:167-194).

### 3.7 Responsive patterns

- Breakpoints in erp-shell.css: max-width 1350 (top grid to one column, bottom grid to two, right stack in two columns); 1000 (KPIs one column, quick actions two columns, search 50vw, smaller action button); 760 (sidebar off-canvas via translateX(-100%) toggled by .mobile-open, main margin 0, flexible search, action button hidden, content padding 12, widgets stacked) (828-922). The shadcn mobile hook uses 768 (src/hooks/use-mobile.tsx:3), so JS and CSS disagree by 8 px.
- Desktop collapse to a 78 px rail hides labels and chevrons (erp-shell.css:35-37,184-195).
- Not found in the stylesheet: a backdrop or scroll lock for the mobile drawer [OBSERVED absence in erp-shell.css].
- Tailwind container: centered, 2rem padding, 1400 px at 2xl (tailwind.config.ts:9-15).

### 3.8 Visual and UX defects not to carry over

Dead "Ayarlar" link with no route and a no-op "Profil" button (ErpLayout.tsx:420-421); help link pointing at "/" (335); icons bound to modules by array index (37,160); "Favoriler" duplicating Dashboard (shellNavigationData.ts:12-13); search limited to 5 routes (26-32); quick-action popover that auto-closes after 4 s (ErpLayout.tsx:117); ERP strings hard-coded in Turkish while the public site has tr/en/de locale files; 8-10 px text; hotlinked hero images; duplicate toast systems; mixed-clock and placeholder KPIs.

## 4. Legacy data flows and observed risks

### 4.1 Data-flow map (as observed in LG)

```
A. External accounting -> mirror (scheduled)
   pg_cron (every 5 min; statement refresh every 1 min, per legacy report)
     -> net.http_post -> Edge parasut-sync-run
        gate: scheduled-source header + shared secret in code, emergency-pause env, verify_jwt (public key passes)
        (20260811120000_schedule_parasut_sync_run.sql:56-71; parasut-sync-run/index.ts:84-95)
     -> server/parasut/sync-base.ts: OAuth password grant -> GET ...?page[number]&page[size]=25&include=...
     -> per-row upsertResource (SELECT hash + PATCH/INSERT) -> parasut.<resource> (typed columns + raw jsonb)
     -> sync_runs / sync_errors (lock election, per-page checkpoint)
     -> statement refresh -> parasut.transaction_history_items ("authoritative ledger")

B. Browser -> mirror read
   SPA --JWT--> Edge parasut-api [getUser + erp_users via service role + permission + company scope]
     -> scopedParasutTable(service role + company filter) -> parasut.* (default-deny to anon/authenticated)
     -> JSON (money converted to JS numbers) -> UI transforms (customerLedger.ts) -> screen / PDF

C. Browser -> external write
   SPA --JWT--> Edge parasut-write-api [admin only, ACCOUNTING_WRITE_ENABLED] -> provider abstraction -> accounting API

D. Browser -> database directly (RLS only)
   quotesApi.ts (quotes, lines, customers, history), public-cms/api.ts, shop/api.ts, erp/shared/api/internal.ts (audit log), erp/shared/auth.ts (erp_users)

E. Browser -> checks-api Edge [JWT + per-action permission] (local cheque register; dashboard reminders)
F. Browser -> market-data Edge [public] -> third-party FX/gold/weather + DB call budget/history
G. (dormant) shop -> commerce-checkout -> payment-create -> provider scaffold -> payment-webhook -> RPC ensure_commerce_payment_financial_records
H. Release: local build -> manifest -> plain FTP (one bundle, three hostnames); Supabase functions/migrations via CLI separately; manual SQL
```

### 4.2 Observed failures and risks by category

API calls
- [OBSERVED] verify_jwt=true is accepted for the public key, so functions must authorise in code; two functions (market-data, commerce-checkout) have no config entry (supabase/config.toml:3-67; migration comment 20260811120000...:34-38).
- [OBSERVED] The accounting client retries only after a failure, honours Retry-After, but has no proactive throttle or jitter, and its error text drops the response body (server/parasut/client.ts:16-31,87-91). [INFERRED, M] The 25-row page limit and 10 requests per 10 s limit seen in PT (E-08) would hit this client the same way.
- [OBSERVED] Which routes are exposed is decided by the browser hostname (src/lib/domains.ts:56-62), and a render-time redirect performs window.location.replace (src/App.tsx:110-114).
- [OBSERVED] Payment adapters do not call any provider (L-05).

Queries
- [OBSERVED] Browser-direct table access remains in 5 files (50 literal table references): shop/api.ts (24), sales/quotesApi.ts (14), public-cms/api.ts (9), erp/shared/api/internal.ts (2), erp/shared/auth.ts (1). The legacy document counts 84 tables (L-18). No browser reference to the accounting mirror schema exists (grep: none), which matches the document's claim.
- [OBSERVED] The user lookup selects the whole erp_users row, including permissions (src/features/erp/shared/auth.ts:12-21); Edge lookups match e-mail with ilike (L-03).
- [OBSERVED] Row caps and ordering: .range(0, 24999) for statements, .limit(2000), top-20 ordered by a JSON text extract (parasut-api/handlers.ts:646,1177,1204-1205).
- [OBSERVED] The dashboard fetches all open cheques, then filters, sorts and slices to six in the browser (DashboardPage.tsx:55-59,91-95).
- [OBSERVED] Sync issues one SELECT plus one write per row (sync-base.ts:683-702; incident report:54 [CLAIM]).

Contracts
- [OBSERVED] Money is stored as numeric strings and returned to the browser as JS numbers (decimalToNumber at parasut-api/handlers.ts:1085), so two representations coexist.
- [OBSERVED] Errors are free-text Turkish messages with HTTP codes, no machine-readable error codes (for example parasut-api/index.ts:130-135, checks-api/index.ts:296-334).
- [OBSERVED] Quote currency is limited to TRY, USD, EUR (20260814120000_sales_quotes_module.sql:32) while the Eclipse payload shows the code "TRL" (PT L784) [INFERRED, M: code normalisation needed].
- [CLAIM] Row types are duplicated in at least three places and the staleness tolerance 0.005 is duplicated (docs/architecture-remediation.md:89).
- [OBSERVED] A 183 KB generated types file is the browser's contract with the database (src/integrations/supabase/types.ts).

Calculations
- Quote totals, finance helper and server decimal module: see L-06, L-07, L-08.
- [OBSERVED] Gear and weight calculators use floating point with explicit rounding helpers and constants (for example steel density 7.85 g/cm3) (src/calculator/utils/weight.ts:16-54; gearReishauer.ts:25-69). Parity tests exist for each calculator (src/calculator/utils/*.parity.test.ts); [INFERRED, L] "parity" means agreement with an earlier implementation, which is not proof of correctness against an engineering standard. These are engineering formulas, not accounting rules; they must be verified independently before any reuse.

Transformations
- [OBSERVED] Date handling is inconsistent: the dashboard uses the Europe/Istanbul zone (DashboardPage.tsx:71-90) while the finance helper uses the UTC date (calculateBalance.ts:74,93). PT shows the same class of defect in a comparison script (E-09).
- [CLAIM] The customer ledger sign mapping (invoice / payment / purchase / cheque directions) was wrong in an earlier pass and was invisible to a final-balance check because two errors cancelled (docs/audits/ACCOUNT_STATEMENT_AND_PARASUT_SYNC_AUDIT.md:13); cheque attribution uses a date-plus-contact heuristic with a documented limitation (same file:327-334).
- [OBSERVED] PDFs and print views are produced by HTML string templates (quotePdfHtml.ts) and document.write into new windows (L-20).

Synchronization
- L-10, L-11, L-12 and X-02. [CLAIM] two independent freshness clocks exist and one screen mixes them (BTA:835-837). [OBSERVED] The cron secret hardening exists only in a "proposed" migration folder that the legacy runbooks describe as hand-applied during un-pause (docs/deployment-and-rollback.md:75-93; docs/final-engineering-report.md:121-126). [UNKNOWN] whether sync is currently paused or running in production.

Financial data
- [OBSERVED] Two financial truths coexist: local operational tables (invoices, payments, financial_accounts, financial_transactions, accounting_entries) touched from the browser, and the mirrored accounting data reachable only through the Edge function (docs/frontend-database-access-classification.md:34-37 [CLAIM]; RLS state L-01, L-02).
- [OBSERVED] A "fail-closed authoritative statement" design exists (balance reconciliation guard) [CLAIM from BTA:841-843, not re-verified in code]. It shows reconciliation against an independent figure is a workable control; the control itself is not endorsed here.
- [OBSERVED] Employee names, e-mail addresses, IBANs and balances are exposed through the generic list endpoint registry (parasut-api/handlers.ts:260), gated, as far as the dispatch shows, by the general accounting-view permission (parasut-api/index.ts:134).

Filtering
- [OBSERVED] Archived-record filtering differs by resource: documents use eq(false), cheques use "false OR null" because cheques carry no reliable archived flag (handlers.ts:1053-1066). [OBSERVED] Search strips only "%" and "," before building an or() filter string (handlers.ts:315-316) [INFERRED, M: other filter metacharacters and "_" remain].

State
- [OBSERVED] Auth state ignores TOKEN_REFRESHED and INITIAL_SESSION events to avoid UI resets, so role or activation changes are not re-read until the next sign-in event (ERPAuthContext.tsx:122-134) [INFERRED, M]. Any user-lookup failure signs the user out, and the error is logged only in development (66-76).
- [OBSERVED] localStorage holds the Supabase session, a redirect path written during render, language, shop cart, checkout profile and a quote draft (client.ts:27-33; ProtectedRoute.tsx:24; CartContext.tsx:20-36; CheckoutPage.tsx:42,118; QuotePrintPage.tsx:13).
- [OBSERVED] Layout re-renders its Outlet each minute through a new context object (ErpLayout.tsx:106,439).

Caching
- [OBSERVED] QueryClient is created with defaults (App.tsx:106) and React Query is used in only a few places; the legacy ledger lists wide adoption as an open item (docs/architecture-remediation.md:74 [CLAIM]).
- [OBSERVED] market-data caches 15 minutes per Edge instance in memory, so each instance calls upstream separately, and the weather cache has no size bound (market-data/index.ts:165-177,215-219).
- [CLAIM] the quotation-mail rate limit is per instance (docs/architecture-remediation.md:48).

Errors
- [OBSERVED] The payment webhook never checks the error of its database calls and marks events processed regardless; its catch block records every failure as an invalid signature and overwrites the failure counter with 1 (payment-webhook/index.ts:51-61,96-103,119-121,125-143).
- [OBSERVED] The contact function returns the raw exception message to the caller (send-contact-email/index.ts:103-107). The error boundary only logs to the console (ERPErrorBoundary.tsx:19-21).
- [CLAIM] A history of silent failures is documented in comments (a rejected status left runs "running" forever; zero-row updates are not errors) (see PT L314-339 for the equivalent Eclipse code).

Consistency
- [CLAIM] Multiple customer-table generations (parties, stakeholders, customer_full bridge, customer_profile), dual quote systems, a dead first-generation mirror schema in production, and duplicate decimal implementations (docs/architecture-remediation.md:81-83,89).
- [OBSERVED] Duplicate toast systems and three palettes (3.5, 3.6); a manual-SQL schema outside migrations (L-13).
- [OBSERVED] Documents contradict code at HEAD (L-18).

### 4.3 Controls that existed (listed for completeness, not endorsed as designs)

A production-target guard script requiring explicit environment variables and a project-identity match (scripts/check-supabase-target-safety.mjs:88-141, opt-in); architecture guard tests for client sprawl and statement bypass (src/lib/architecture-supabase-client.test.ts, src/architecture-data-boundaries.test.ts); decimal contract tests (server/erp/decimal-contract.test.ts); a fail-safe emergency pause (docs/audits/CLAUDE_CODE_PRODUCTION_SYNC_INCIDENT_REPORT.md:32-37 [CLAIM]); a release manifest with per-file hashes (docs/deployment-and-rollback.md:23-40); default-deny RLS on the mirror schema (docs/2.0/CLAUDE_CODE_ERP_2_BACKEND_TRUTH_AUDIT.md:311-327 [CLAIM]); 116 test files and a blocking lint ratchet in CI (.github/workflows/quality.yml:30-52). None of these prevented the findings above, which is itself a lesson: controls must be tested against the live configuration, not only documented.


## 5. Eclipse artifacts - failed-system post-mortem

### 5.1 What the artifacts are

- PT is a transcript of one Claude Code sub-agent run ("Agent: Repair e_invoices and stock_movements sync") plus the parent session's summary (PT L3,1103-1112). It is dated 2026-09-07 by the file's modification time (2026-09-07T10:27:21+03:00) and by database timestamps (PT L470,476). It concerns a Windows working copy under an OneDrive path, a GitHub remote, a hosted Supabase project and the Parasut accounting API (PT L5,494,1005). It starts mid-story: the earlier schema incident, a recovery, and an "11-domain Edge Function migration" are summarised in a single paragraph (PT L8).
- HT is a single-file front-end prototype for the vendor's own marketing site: React 18 and react-router 6.3 loaded from CDNs, compiled in the browser by Babel, Tailwind from a CDN, three hash routes and a consultation modal that builds a mailto: link (HT L17,79-89,112-127,1293-1296). Its title promises "system security architecture", but it contains no diagrams, trust boundaries, data flows, controls or threat model. It cannot support or refute the security posture of the ERP.
- Relationship to LG [INFERRED, M]: the legacy ERP footer credits the same vendor (src/layouts/ErpLayout.tsx:441), both codebases use the same mirror-schema, phase-numbered-migration and run-table-lock pattern (PT L350,407-409), but they are separate repositories and separate Supabase projects (the project references differ; not reproduced here). The business data visible in PT may belong to the same business group as LG [INFERRED, L]; treat PT as sensitive.

### 5.2 Reconstructed timeline (PT)

1. Starting state: schema incident recovered earlier; reads moved from public demo views to parasut.* and the views dropped (HEAD e692b4b) (L8). A validation pass claimed two broken syncs: a missing function (mirror 1272 rows vs 1708 at the source) and three stuck runs (L10-11).
2. The agent reads code and migrations; one command that enumerates the Windows credential store for Supabase entries is denied by the auto-mode classifier (L73-78).
3. It writes code and a new 244-line migration, runs a type check (L416-432), then applies the migration to the remote database with `supabase db push` (L435-441). The restored cleanup function clears three stale locks (L442-485).
4. It deploys the Edge Function, runs the e_invoices sync (1708 of 1708) and a first stock_movements pass that writes 725 rows with null relationship ids (L488-515).
5. It probes the vendor API, finds its assumption wrong, edits, redeploys, resets the sync cursor with a direct UPDATE on run metadata and resumes until 3424 of 3424 (L517-677).
6. It compares three records per resource against the vendor API using a script that reads the .env file for a database URL (L693-773), probes two Edge Functions with the public key (L776-786), and only then runs the type check, lint, tests and a build (L810-860).
7. It commits and pushes to origin/main (L924-1006); the parent session re-verifies with `supabase db query --linked` and reports (L1049-1112).

### 5.3 What the artifacts prove, and what they do not

| Question | Proven by the artifacts | NOT proven |
| -------- | ----------------------- | ---------- |
| Was this staging? | No environment label appears for the Supabase project: the word "staging" does not occur in PT; "production" occurs only inside "reproduction" (PT L37). One project reference appears for push, deploy and probes (L494,778). Probe output contains rows that look like real customer and financial records (L782-786). | That the project is production, or that it is not. The label, the environment list and any second project are simply absent. Do not describe the work as "staging only"; the safe reading is "an unlabelled live project holding real-looking data". |
| What was changed remotely? | A migration was applied to a linked remote database (L435-441); an Edge Function was deployed twice (L488-494,618-624); SQL SELECTs and one UPDATE ran through a database URL and the CLI (L444,627,699-721,748,863,1056-1060); a commit was pushed to origin/main (L999-1006). | The content of the migration SQL, the Edge Function code and the scratch scripts (not shown). Whether other changes were made earlier in the same session or before it. Whether the push triggered a deployment. |
| Was data exposed? | The public key returned business data from two Edge Functions (L778-786). | Which rows or how much was reachable; the functions' authorization code; whether the data is real or seeded; whether anyone else used the same path. |
| Was there a security incident? | The task text asserts that an "unidentified third party" wiped/reshaped the parasut schema; afterwards the schema had zero functions and lost indexes, and four grants remained (L8,10,17,1027). | How the actor got in, when, with which credential or role, whether data was read or exfiltrated, whether keys were rotated. No such text exists in PT (no rotation, revocation, leak, compromise or breach words). The statement is an assertion, not evidence. |
| Backups / rollback? | No backup, snapshot, point-in-time-recovery or rollback is mentioned before the push or before the direct UPDATE (words absent). | That none existed. |
| Did credentials leak into the transcript? | A scan for token, JWT, database-URL and key patterns found no credential values (only variable names, L29,778). | Anything outside the pattern list. Customer data IS present (company names, tax numbers, bank-account text, e-mail addresses, product names; L782-786). |
| Was the validation sound? | The counts reconcile (437 + 835 + 436 = 1708; 2375 + 1049 = 3424) (L680-692,660). | That the data is correct: only 3 records per resource were compared (L704,713), and the original task premise was wrong (L11 vs L1020). |

### 5.4 Lessons supported by the evidence

Security
- S1 A coding agent that can read a database URL and use the CLI against a linked project can change schema and data. Keep production credentials off developer machines and out of agent reach; agents work against disposable non-production projects; production changes go through a pipeline with human approval (E-01, E-06, E-11).
- S2 A public/publishable key is not authorization. Every function that returns business data must authenticate the user and authorize the action; add automated negative tests that call each function with the public key only (E-05, X-01).
- S3 An incident is not closed by restoring functionality. Require root-cause analysis, audit-log retention, credential rotation, grant review and an audit of everything the actor could have touched (E-03; PT L1047 admits other tables were not audited).
- S4 Secrets must not live in synced folders (the working copy is under OneDrive, PT L5,701). Credential-store enumeration attempts by an agent should be blocked by policy; here a classifier did block one (L73-78).
- S5 Treat database rows and CLI output as untrusted input to an agent; the CLI itself wraps results in "untrusted data" markers (L1068-1099).
- S6 Transcripts that contain customer data are themselves sensitive. Sanitise before sharing; classify PT accordingly (owner decision about where it is stored).

Data integrity
- D1 A migration ledger is not evidence of schema state. Add scheduled schema-drift detection (expected vs actual catalog) and a rebuild-from-scratch test (E-04).
- D2 No ad-hoc data changes. Every change is a reviewed, recorded command; destructive or bulk changes are rehearsed on a clone first (E-02; the direct UPDATE at L627).
- D3 Post-conditions must be automatic: counts, sums, null-rate and referential checks before declaring success (the 725 null-relationship rows were caught only because the agent looked, L514-515).
- D4 Validate premises and sample sizes: the claim "never completed" was false (L11 vs L1020); three records are not a validation (E-09).
- D5 Use date types and ISO strings for calendar dates; JavaScript Date objects shifted a date by a day in the comparison script (L726-773).
- D6 Normalise currency codes and units at the boundary ("TRL" in the payload, L784).
- D7 Plan for deletions and mutable sources: page-number cursors across invocations are not snapshot-consistent and deletions are not propagated by the code shown (E-08).

Deployment
- P1 Validate, then deploy to a non-production environment, smoke test, then promote. Here the push, two deployments and the live probes preceded the type check, lint, tests and build (L435-860).
- P2 Protect main: required review and required checks; the work ended in a direct push (L999-1006).
- P3 Generate migration versions with the tool and check in CI that none is in the future or out of order; the new version was dated about 23 days after the session (E-10).
- P4 Verify backups and rehearse a restore before any production schema change. The HT marketing copy itself promises "regular restore tests", immutable backups and RPO/RTO plans (HT L1133-1141); PT shows no evidence of them in this task.
- P5 Long jobs belong in workers or queues, not in request-bound functions with a ~150 s budget (E-08).

Architecture
- A1 A lock that is a table row can be orphaned by a platform kill. Use leases with expiry and heartbeats, a scheduled janitor with alerting, and surface cleanup errors instead of ignoring them (E-07).
- A2 The sync function is a single very large file (the transcript shows code at line 2820 of index.ts, PT L92); split into modules with test seams.
- A3 Do not build "demo" surfaces on real data: the earlier design read from 48 views in the public schema named *_demo, dropped only at HEAD e692b4b (PT L8,1064); whether anonymous clients could read them is not shown, but the leftover grants and the public-key results (E-05) make it a plausible path [INFERRED, L].
- A4 The function decodes the JWT payload and checks the role without verifying the signature, relying on platform verification (PT L242-263) [INFERRED, M]; use a library or platform primitive that returns verified claims.
- A5 Keep the schema as code that can be rebuilt; the incident removed objects the repository could no longer restore by a normal push (L933-937).

### 5.5 Missing sanitized material (code-level Eclipse review stops here)

A code-level review of the Eclipse system needs the following, supplied as sanitized copies (secrets, JWTs, database URLs, customer names, tax numbers, bank accounts and e-mail addresses replaced by placeholders). Nothing below was inferred or fetched; that part of the review is stopped.

1. supabase/migrations/20260930140000_restore_parasut_functions_and_sync_run_locks.sql (244 lines; content absent from PT) and the original migrations 20260826000000_parasut_sync_infrastructure.sql, 20260829050000_phase14_2_standalone_e_invoices.sql, 20260906040000_phase13_4_physical_boundary_and_manifest_fix.sql, 20260906194321_parasut_durable_scheduler.sql (only fragments are quoted).
2. supabase/functions/parasut-sync/index.ts in full (PT shows roughly lines 2540-2820), plus supabase/functions/inventory/ and supabase/functions/e-documents/ in full (needed to confirm or refute E-05).
3. supabase/config.toml (verify_jwt per function) and the deployed function settings export.
4. The row-level-security policies and grants for the parasut and public schemas (a pg_policies and role-grants export, structure only) and the four leftover grants named at PT L17.
5. The scheduler and vault setup (pg_cron job definitions and the vault secret NAMES, no values) behind the dispatcher mentioned at PT L29.
6. The scratch scripts q.mjs, invoke.mjs and parasut.mjs (names at PT L444,495,520) to see how the service-role path was exercised.
7. Auth and audit evidence for the incident window (Supabase auth/API gateway logs, role usage), and the key-rotation record, if any.
8. A list of environments and project references with their roles (staging/production/demo) from the owner.

## 6. Recommendations for ERP 3.0

These recommendations are derived from the evidence above and from general engineering practice, not from legacy logic. Anything marked OPEN needs an authoritative decision before design (section 8). No financial rule is specified here.

### 6.1 Principles

| # | Principle | Driven by |
| - | --------- | --------- |
| P1 | Environment identity is explicit, enforced and separate (dev, staging, production in different projects with different credentials); no production credential exists on developer machines or in agent sessions | E-01, E-06, E-11, L-16 |
| P2 | The browser is untrusted: it never computes authoritative money, never holds privileged keys, and is never the only authorization layer | L-06, L-19, E-05 |
| P3 | Deny by default; every data-access policy has an automated test that proves isolation using real roles | L-01, L-02 |
| P4 | Identity is bound to the immutable user id and verified claims, never to an e-mail string; staff and customer identities are separated | L-03 |
| P5 | External accounting data is a mirror behind an anti-corruption layer; the UI never writes to the mirror and no business logic lives in the sync | L-10..L-12, X-02 |
| P6 | Money is decimal with a declared scale, currency and rounding policy per document type; no floating-point money anywhere | L-06..L-08 |
| P7 | Background jobs are idempotent, resumable, leased, rate-aware and observable, and fail loudly | E-07, E-08, L-10 |
| P8 | Migrations are the only path for schema change; drift is detected automatically; versions are tool-generated | E-04, E-10, L-13 |
| P9 | Sensitive data (credentials, customer data, captures) never enters Git, logs, tests or agent transcripts; synthetic data only | L-17, E-05, E-06 |
| P10 | Documents are claims; every control is verified against the live configuration | L-18, E-09 |

### 6.2 Trust boundaries

```
Browser / mobile (untrusted)
   | HTTPS; user token only (no service key, no database URL)
   v
API layer (BFF): authenticate, authorise per action, validate input, idempotency keys, rate limits, audit events
   | one least-privilege service identity per domain
   v
Domain services / command handlers                      Integration workers (queue, leases, retries)
   (money, stock, numbering, state transitions)            (accounting API, payments, e-mail, market data)
   |                                                          |
   v                                                          v
Postgres: one schema per domain, RLS on, constraints, migrations only      External providers (verified signatures, allow-listed)
```

### 6.3 Data boundary map (proposed; each row needs the validation named)

| Data class | System of record (proposal) | Home | Browser access | Validation needed before build |
| ---------- | --------------------------- | ---- | -------------- | ------------------------------ |
| Identity, roles, permissions | ERP 3.0 | auth + a private security schema | own profile only, via API | decide staff vs customer pools, MFA policy, tenancy model (Q1-Q4) |
| Parties (customers, suppliers) | OPEN: ERP 3.0 or the accounting system | party schema | via API only | owner decision on system of record; data-protection retention rules (Q5, Q31) |
| Items / products | OPEN | catalog schema | read via API | item master ownership, units, variants (Q6) |
| Quotes and sales orders | ERP 3.0 | sales schema | commands via API | numbering rules, VAT rules, legal wording, approval flow (Q9-Q12) |
| Purchasing | ERP 3.0 | purchasing schema | commands via API | approval hierarchy (Q13) |
| Inventory movements and stock | ERP 3.0, append-only movement ledger | inventory schema | commands via API | valuation method, relation to accounting stock (Q14) |
| Accounting documents, payments, cheques, balances | OPEN: the external accounting system if it is retained | ext_accounting mirror (raw + normalised) | read-only via API | which system issues legal documents; reconciliation tolerance; deletion handling (Q15-Q20) |
| Engineering calculations (gear, weight) | ERP 3.0, versioned formulas with provenance | engineering schema | results via API, never authoritative in the client | formulas verified by the engineering owner against the applicable standards and machine manuals (Q21-Q22) |
| Generated documents (quote PDF, receipts) | ERP 3.0 | object storage + metadata with hash | signed URLs | template approval, retention, signature/stamp rules (Q23) |
| Market / reference data (FX, metal prices, weather) | external providers | reference schema | read via API | which sources may be used for accounting; display-only unless decided (Q24) |
| Audit and events | ERP 3.0, append-only | audit schema | none (admin read) | retention period, tamper evidence (a hash chain like this journal is a candidate) (Q25) |
| Secrets and configuration | secret manager | not in the database | never | rotation policy, access list (Q26) |
| Public website / CMS | separate concern | separate deployable | public read | decide whether it belongs in ERP 3.0 at all (Q7) |

### 6.4 Backend responsibilities

- API layer: verified authentication; central per-action authorization (permission matrix as data, tested); schema validation of every input; idempotency keys on commands; rate limits; structured error codes (not free text); audit event emission; no service-role reads for user requests without an explicit scope filter.
- Domain services: own every money-affecting calculation and every state transition (quote totals, document numbering through an atomic sequence, stock movements, status workflows); enforce invariants twice (service and database constraints).
- Database: constraints (CHECK, FK, UNIQUE, exclusion where useful), RLS written with qualified column references and covered by role-based tests, SECURITY DEFINER only where needed with fixed search_path and explicit grants, no policy that depends on e-mail, no NULL-tenant wildcard.
- Integration workers: run outside request-bound functions; use leases with heartbeat, exponential backoff with jitter, a global rate limiter that matches the provider's published limits (validate against current vendor documentation, not against the legacy cache), a dead-letter table for poison records, and a kill switch.
- Reporting: read models or views built from trusted tables; the browser never aggregates money.
- Documents and e-mail: server-side templating with escaping, recipient allow-lists, rate limits, no reflection to caller-supplied addresses.
- Observability: structured logs without personal data, metrics, alerts on failure streaks, stale locks and drift; health checks that call each endpoint with the public key to prove it is denied.
- Delivery: CI with type check, tests, contract tests, RLS tests, migration dry-run on a clone, secret scanning, dependency review, pinned and integrity-checked third-party assets; atomic deployment with canary and rollback; TLS-only transport.

### 6.5 Integration pattern for an external accounting provider (if retained)

1. Land raw provider payloads, unmodified, with fetch time and provider version in an immutable raw layer; normalise into typed tables in a separate step; never edit mirror rows from the UI.
2. Prefer incremental sync keyed on a provider-supplied change marker or timestamp if the provider offers one (OPEN: validate against the vendor's current API documentation, Q16); otherwise snapshot-then-diff with explicit deletion handling.
3. Reconcile with independent invariants, not only totals: record counts, per-currency sums, per-party balances and a content hash, with a tolerance defined by the accountant (Q18). A single final-balance check is insufficient (legacy ASA:13 [CLAIM] shows two errors cancelling).
4. Treat a failing record as data to quarantine, never as a reason to block or loop the whole job.
5. Keep write-back (ERP to provider) as a separate, explicitly enabled, audited capability with idempotency keys and a dry-run mode.
6. Use the least-privileged credential type the provider supports; do not use a human account's password grant (L-12) unless the provider offers nothing else and the owner accepts the risk (Q17).

### 6.6 Money and numeric handling (framework only; values are OPEN)

- Store amounts as integer minor units or fixed-scale numeric with an explicit currency column (ISO 4217; normalise provider codes such as "TRL"); carry money as strings in JSON; never use a floating-point type.
- Declare, per document type and with the accountant, the rounding mode, the scale, whether VAT is computed per line or per document, discount order, and multi-currency/FX-date rules (Q9-Q12, Q19). Encode them once in the domain service.
- Create golden test vectors from accountant-signed examples; run them in CI and as database-level checks.
- Do not silently coerce malformed input to zero; reject it with an error.
- Calendar dates are date types in the business time zone (Europe/Istanbul), never UTC-truncated timestamps.

### 6.7 Environments and change control

- Separate projects and credentials per environment; a visible environment banner in every client; a signed environment descriptor that tools check before any remote write.
- No remote-write command (db push, functions deploy, SQL, git push) is available to an automated agent without a human approval gate; agents operate on disposable environments.
- Required checks, protected main, tool-generated migration versions, a CI rule against future-dated or out-of-order versions, and scheduled drift reports.
- Backups and point-in-time recovery verified by a documented restore test before the first production schema change.

### 6.8 Independent validation plan

| Gate | Independent evidence required | Who validates |
| ---- | ----------------------------- | ------------- |
| G1 Requirements | signed domain requirements and answers to section 8 | project owner |
| G2 Money rules | accountant-signed examples and rounding policy | accountant / owner |
| G3 Authorization | RLS and API tests run under real roles, including the public key and a customer account | independent reviewer |
| G4 Provider contracts | vendor documentation checked at build time, contract tests with recorded sandbox responses | integration owner |
| G5 Engineering formulas | verification against the applicable standards and machine documentation | engineering owner |
| G6 Recovery | a timed restore test from backup into a clean environment | operations owner |
| G7 Security review | threat model, dependency and secret scans, penetration test of the public surface | security reviewer |

### 6.9 What must NOT be reused from the legacy system

Business logic and formulas (ledger sign mappings, quote and balance calculations, gear and weight formulas, staleness rules); API calls and the provider client (password-grant authentication, pagination and retry behaviour); sync code and the field-mapping registry; data contracts (the generated 183 KB types file, provider adapter types, error formats); backend architecture (browser-direct tables under RLS, service-role Edge Functions with ad-hoc scoping, e-mail-based identity, run-table locks); committed API captures and seeds; the legacy audit documents as sources of truth. Legacy artifacts may be used only to learn failure modes and to enumerate screens and workflows that need requirements.


## 7. Risk register for the ERP 3.0 program

| ID | Risk | Likelihood | Impact | Mitigation | Gate |
| -- | ---- | ---------- | ------ | ---------- | ---- |
| R1 | Rebuilding on legacy logic or contracts reproduces the failure modes in L-01..L-12 | High | High | Section 6.9 exclusions; principles P2-P6; independent validation | G1-G5 |
| R2 | Unknown live exposure of the still-running legacy system (policies, functions, auth settings, sync state) persists while ERP 3.0 is designed | Medium-High | High | Owner-side read-only verification of Q28-Q30 and Q32 (not performed here) | outside this task |
| R3 | Sensitive data in Git history, the transcript file and capture files is shared or synced further | High | High | Classify and relocate; decide on history purge (Q33); sanitised copies only | owner decision |
| R4 | Missing requirements lead to invented financial rules | High | High | Section 8 answered before design; money rules signed by the accountant | G1, G2 |
| R5 | Scope creep into shop, CMS, HR, quality, maintenance | Medium | Medium | Decide Q7, Q8, Q38 up front; phase gates | G1 |
| R6 | Dependence on an external accounting API (limits, authentication, behaviour changes) | Medium | High | Worker architecture, vendor-doc validation, contract tests, kill switch | G4 |
| R7 | Agent-assisted development repeats the Eclipse pattern (remote writes, deploy-before-validate, credential access) | Medium | High | Section 6.7: no production credentials in agent reach, approval gates, disposable environments | process |
| R8 | Data carry-over from ERP 2.0 is inaccurate or leaks real data into tests | Medium | High | Documented migration plan, reconciliation, synthetic fixtures | G1, G2 |
| R9 | Time zone, currency and rounding defects | Medium | High | Section 6.6; golden vectors; date types | G2 |
| R10 | No verified backup or restore for a system holding financial data | Medium | Critical | Restore test before first production change | G6 |
| R11 | Documentation drift and stale audit claims mislead decisions | High | Medium | Documents are claims; link each control to a test or a live check | process |
| R12 | Operational fragility (manual FTP, OneDrive-resident secrets, single maintainer) | Medium | Medium | CI/CD, secret manager, runbooks, second operator | G7 |

## 8. Open questions (need authoritative answers; none is answered by this report)

Scope and identity
- Q1 Single company/branch, or multi-company and multi-branch? (LG has company_memberships and two quote issuers.)
- Q2 Are staff and customers separate identity pools? Is self-signup allowed anywhere?
- Q3 Required sign-in strength for staff: MFA, SSO, password policy.
- Q4 The authoritative role and permission matrix (the legacy catalog is not authoritative).
- Q5 System of record for parties (customers, suppliers): ERP 3.0 or the accounting system?
- Q6 Item master ownership, units of measure, variants and codes.
- Q7 Is the public website / CMS part of ERP 3.0?
- Q8 Is e-commerce with online payment in scope, and with which providers?

Sales, purchasing, inventory
- Q9 Quote and order numbering: series per issuer, reset policy, gaps allowed?
- Q10 VAT (KDV): rates, per-line or per-document computation, rounding mode and scale.
- Q11 Discount rules and order of application.
- Q12 Quote validity, approval, legal wording; conversion rules quote to order to invoice.
- Q13 Purchasing approval hierarchy and limits.
- Q14 Stock valuation method, negative-stock policy, relation to accounting stock.

Accounting integration
- Q15 Which system issues legal invoices and e-documents (e-fatura, e-arsiv, e-irsaliye, e-SMM)?
- Q16 Does the vendor API offer change markers or webhooks suitable for incremental sync? (Validate against the vendor's current documentation.)
- Q17 Which credential type and grant is approved for the accounting API?
- Q18 Reconciliation invariants and tolerances (counts, sums, per-party balances); who signs off.
- Q19 Multi-currency rules: currencies, rate source, rate date, revaluation.
- Q20 When the source deletes or archives a record, what must ERP 3.0 show and keep?
- Q36 Cheque lifecycle (received, issued, endorsed, bounced) and its accounting treatment.
- Q37 Delivery-note (irsaliye) legal flow and stock effects.

Engineering and documents
- Q21 Authoritative standards and machine manuals for gear and weight calculations; tolerances and units.
- Q22 Who owns and validates the calculators; formula versioning; how results used in quotes are audited.
- Q23 Document templates, signatures or stamps, retention, languages.
- Q24 Which FX, metal-price and weather sources may be displayed or used; any official-rate requirement.
- Q35 Which reports are legally required (VAT, ledgers) versus informational; consumers and tolerance.

Security, operations, legacy state
- Q25 Audit-log retention and tamper-evidence requirement.
- Q26 Secrets management: owners, rotation cadence, break-glass.
- Q27 Inventory of environments and projects and their roles (what is the Eclipse project: staging, production or demo?).
- Q28 Was the "unidentified third party" incident investigated: root cause, access path, log retention, credential rotation, grant review?
- Q29 Current legacy state: is sync paused or running; which Edge Function versions are deployed (was send-quotation-email redeployed); were the proposed migrations applied?
- Q30 Legacy Supabase auth settings: e-mail confirmation, signup, providers; staff versus customer account counts; any erp_users rows still unlinked?
- Q31 Personal-data inventory, lawful basis, retention and subject-rights procedure (KVKK).
- Q32 Backup status, point-in-time recovery, RPO/RTO targets, date of the last restore test.
- Q33 Where may PT and the committed capture files be kept; purge from Git history; cloud-sync exposure (OneDrive).
- Q34 Does ERP_BUSINESS_ARCHITECTURE.md (referenced by 8 files) exist elsewhere?
- Q38 Production, quality, maintenance and HR scope for ERP 3.0 (these modules are disabled in the legacy shell).
- Q39 Localisation: languages, number, date and currency formats.
- Q40 Hosting and operations: user count, load, uptime target, budget, domains, TLS.

## 9. Confirmations

No application file changed.

| Item | Before inspection (2026-10-14T00:23:34+03:00) | After inspection (2026-10-14T00:42:35+03:00) |
| ---- | --------------------------------------------- | -------------------------------------------- |
| dayandisli-legacy status | "## main...origin/main" only; HEAD b1b8070717409fc69deb71ab22400dfed384b432 = origin/main; tree 938c08254df178836140d4de4fe746ea74d4fad1; 775 tracked files; .git\index mtime 2026-10-13T23:01:08+03:00 | identical; index mtime unchanged by the query |
| rea status | "## main...origin/main" only; HEAD 9630c8ff46533fe63ec0e06212d01545070d17f0 = origin/main; tree 7c080af43c0df42b4eb4629381c87c713de8dbc7; 3490 tracked files; .git\index mtime 2026-10-13T23:01:01+03:00 | identical; index mtime unchanged by the query |
| Workspace root | exactly four directories: dayandisli-legacy, dayandisli.com (empty), project-logs, rea | identical |
| Stage A checkpoint | 10510 bytes, sha256 aa573fc7a72d2a92202e02026d0f0e382a16a20b6aa005c14eca84c66c40a520 | identical (not overwritten) |
| Eclipse artifacts | PT and HT hashes as in section 1.1 | identical |

Constraint compliance:
- No source edits, installs, builds, tests, network access, browser automation, IDE control, live-data queries or REA tool calls. Tools used: file read, file search and the shell (read-only git queries inside the repositories; metadata and hash queries elsewhere); file write/edit tools only for scratch files in the session scratchpad. Files in project-logs were written through create-only or append-only scripts that verify the earlier bytes are unchanged.
- No Supabase, Parasut or other remote connection; no .env* file opened; no credential used or printed; the external repository referenced by PT was not accessed; no command embedded in PT or HT was executed.
- No credential or customer data is reproduced in this report. Items intentionally not reproduced: Supabase project references (config.toml:1, PT L494,778), a publishable-key literal (20260811120000_schedule_parasut_sync_run.sql:51), an individual e-mail address seeded in a migration (20251208092932_b7d45e49-989a-4ea1-a451-45de4f44dffd.sql:42), and all customer names, tax numbers, bank-account text and e-mail addresses in PT L782-786.
- Files written by this task: in project-logs, stage-b-recovery-checkpoint.md (created; section B-1 appended at completion), this report (created once, create-only), and journal entries appended from ENTRY 0016. Outside the workspace, in the Claude Code session scratchpad only: helper scripts (append-only writers), working notes, body text for the files above, and a 71-byte text conversion of HT. Nothing in the two repositories was created, modified or deleted.
- Model and effort: claude-sonnet-5-5 at effort max, confirmed from the session directive and the harness transcript records; persisted settings were not changed.
- Drive synchronization: PENDING; nothing was synchronized.

## 10. Stop point and gating

This report completes Stage B analysis. Application development remains gated on ChatGPT Work review and project-owner approval. Suggested inputs for the next stage: answers to section 8, the sanitized Eclipse material in 5.5, and owner-side verification of the live legacy state (Q27-Q30, Q32). Those verifications are recommendations only; none was performed here.

## Appendix A. Evidence index

Legacy files read in full or in relevant parts (paths relative to the repository root): src/App.tsx; src/layouts/ErpLayout.tsx; src/features/erp-shell/{shellNavigationData.ts, erp-shell.css}; src/features/finance/financeNavigation.ts; src/features/crm/crmCustomerData.ts; src/features/sales/salesData.ts; src/features/reports/reportsNavigationData.ts; src/index.css; tailwind.config.ts; index.html; components.json; src/hooks/use-mobile.tsx; src/contexts/ERPAuthContext.tsx; src/components/{ProtectedRoute.tsx, ERPErrorBoundary.tsx}; src/lib/domains.ts; src/lib/finance/calculateBalance.ts; src/integrations/supabase/client.ts; src/features/erp/shared/{auth.ts, permissions.ts (parts)}; src/features/sales/quoteCalculations.ts; src/features/shop/config.ts; src/pages/apps/dashboard/DashboardPage.tsx; src/calculator/utils/weight.ts (and targeted greps of the gear calculators); server/erp/decimal.ts; server/parasut/{auth.ts, client.ts, sync-base.ts (lines 636-731)}; supabase/config.toml; supabase/functions/{payment-webhook, payment-refund, market-data, send-contact-email}/index.ts; supabase/functions/_shared/payment-providers.ts; supabase/functions/parasut-api/handlers.ts (lines 1040-1090 and targeted greps); supabase/migrations/{20260517153000 (policy loop), 20260517230000 (policy loop), 20260603123000, 20260603130000, 20260613052204 (parts), 20260614061645, 20260811120000, 20260815090000}; supabase/manual/tenant_policy_predicate_corrections_draft.sql; scripts/check-supabase-target-safety.mjs; scripts/deploy_ftp.py (targeted lines); .github/workflows/quality.yml; docs/{manual-sql-reconciliation.md, frontend-database-access-classification.md, deployment-and-rollback.md}; docs/audits/{CLAUDE_CODE_PRODUCTION_SYNC_INCIDENT_REPORT.md, ACCOUNT_STATEMENT_AND_PARASUT_SYNC_AUDIT.md (relevant sections)}; docs/2.0/CLAUDE_CODE_ERP_2_BACKEND_TRUTH_AUDIT.md (lines 1-20, 311-372, 807-927); docs/architecture-remediation.md (lines 1-115); docs/final-engineering-report.md (lines 53-61, 104-143).

Legacy items deliberately not opened: all .env* files; tools/parasut/** capture files; docs/parasut/** work files and specifications; the .docx under docs; fonts and images; src/cursor_*.patch; the large finance and quote pages; shop/api.ts; checks-api and parasut-write-api handlers; field-mapping-registry.ts; most migrations; test suites.

Pattern checks that printed counts or line numbers only (no values): credential and token patterns in PT; e-mail-shaped and tax-number/IBAN-shaped values in tools/parasut/**; environment variable names in Edge Functions (names only).

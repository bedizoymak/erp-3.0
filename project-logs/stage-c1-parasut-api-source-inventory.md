# ERP 3.0 - Stage C1: Offline Parasut API and Source Inventory

- Task ID: ERP3-STAGE-C1-001 (documentation research only; NO application changes; no live system access).
- Status: C1 INVENTORY DELIVERED - UNREVIEWED. Awaiting ChatGPT Work review and project-owner decision. C2, C3, C4, C5, Stage D and application development have NOT started; the order C1 -> C2 -> C3 -> C4 -> C5 is preserved.
- Created: 2026-10-14T07:49:01+03:00 (Turkey Standard Time, UTC+03:00). Create-only file; the Stage B report and addendum are not edited.
- Written by: Claude Code - Sonnet 5.5 (claude-sonnet-5-5; reasoning-effort directive: max).
- Governing records: project-logs\parasut-reverse-engineering-doctrine.md (ERP3-PARASUT-DOCTRINE-20261014-001), stage-b-analysis-report.md, stage-b-review-addendum.md, stage-b-recovery-checkpoint.md (read first, used as prior evidence, not re-reviewed).
- Companions: project-logs\stage-c1-recovery-checkpoint.md (section C1-1 appended at completion) and project-logs\claude-code-journal.md (ENTRY 0021).
- Journal state when this file was written: 20 entries, 49294 bytes, SHA-256 c0e6e7d1eac5a056d9ae25245810da8558c5082169347d8da107fd682b24e77c.
- Stage B report (unchanged): 75986 bytes, SHA-256 9beaf72480e2c7f88d35976381cc2c0c25c7c32a2fbbc6af9fba43b76d61492f. Stage A checkpoint (unchanged): 10510 bytes, SHA-256 aa573fc7a72d2a92202e02026d0f0e382a16a20b6aa005c14eca84c66c40a520.
- Secrets and customer data: none are reproduced. The company number and the Supabase project reference named in the task text are not reproduced and were not used to connect to anything. No example payload values from the documentation are copied.
- Drive synchronization: PENDING. Google Drive was not accessed (ChatGPT Work owns Drive synchronization).

## C1.0 Purpose, policy and how to read this inventory

Purpose: a dated, evidence-linked inventory of what the current official Parasut API documentation publishes, what it does not specify, and what later stages must verify. Documentation is NOT evidence of live behavior and does NOT validate any legacy logic.

Policy (from the task and the doctrine, section 7 and 8):
- All ERP-to-Parasut writes are forbidden. Documented write methods are listed only as "OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY": method, path and operationId, nothing else. Their execution behavior was not explored and no write integration is proposed. Three narrow exceptions are flagged where they occur (rows R01 and R02): a note on where an e-mail status can be read, a note on the stock effect of one conversion method, and a status vocabulary that the publication places only inside a write method's text or schema. They are quoted because they describe what can be read, not how a write behaves.
- No Parasut account, API data, UI, Supabase, production credential or live system was accessed. The Parasut API host (api.parasut.com) was never contacted, not even with GET. Only the publication hosts were read, as static documents (see C1.1).

Evidence labels used here:
- DOCUMENTATION ONLY: the statement comes from official published material and nothing else supports it.
- NOT ACCESSIBLE: the information would require a system or material that C1 may not or could not access (live API data, the UI, an authenticated account, Supabase, production state, or official documentation that does not exist in the examined sources).
- NOT YET REVIEWED: a source exists but was not examined in C1.
- NOT SPECIFIED: the examined publication is silent. This is an evidence gap, not a fact about the live system.
- DOCUMENT INCONSISTENCY (DI-nn): the publication contradicts itself or contains an evident defect. Observed in the document text.
- LEGACY / UNVALIDATED: a statement about the legacy ERP 2.0 repository (static historical evidence from the Stage B records or from a narrowly read legacy declaration). Never validated here and never a design precedent.
- Fact classes: DOCUMENTED (published statement, cited), INFERRED [H/M/L] (reasoned, with confidence), UNKNOWN (not established).

Notation and conventions:
- Rows R01-R24 are the 24 top-level resource groups (tags) of the official OpenAPI document, in the vendor's own x-tagGroups order. Source IDs are S1-S5. Gaps are G-nn, documentation defects are DI-nn.
- Paths are shown as published. "{company_id}" is the published path parameter for the Parasut company number ("firma_no" in the prose). No company number is recorded here.
- Text is ASCII. Turkish text from the publication is transliterated (c, g, i, o, s, u) and abridged; the translation aid in C1.3.1 is mine, not the vendor's, and carries no accounting authority.

## C1.1 Source register

| ID | Title (as published) | Exact URL | Version or date stated | Access (Turkey time) | Provenance and sections used |
| -- | -------------------- | --------- | ---------------------- | -------------------- | ---------------------------- |
| S1 | "Parasut API V4 Documentation" (HTML title of the official API reference page) | https://apidocs.parasut.com/ | None stated in the page. Server Last-Modified: Thu, 26 Feb 2026 10:42:55 GMT | 2026-10-14T07:31:53+03:00 | Static HTML, 824 bytes, SHA-256 83cfd73cc537b5354370ba4da2f770f4fad398004f9a1a51853e9493170b0fbc. It is a ReDoc v1 page whose spec-url is ./swagger.json (S2); the visible reference is rendered in the browser from S2, so S2 is the content actually read |
| S2 | "Parasut - API V4" (info.title of the official OpenAPI/Swagger 2.0 document) | https://apidocs.parasut.com/swagger.json | info.version "4.0.0"; embedded CHANGE LOG has one entry dated 2021-10-11; server Last-Modified: Thu, 26 Feb 2026 10:42:55 GMT; ETag W/"69a023af-c3ea9" | 2026-10-14T07:28:32+03:00 (downloaded and parsed locally); first read earlier the same day through a fetch tool | 802473 bytes, SHA-256 4301a8b91635fb89431bd960c69929f05d2e8addf85698994e712571d78cb848. Sections used: info.description (introduction, authentication, common workflows, change log), securityDefinitions, x-tagGroups, tags, paths (81 path keys, 121 operations), definitions (99) |
| S3 | "parasutcom/api-doc - Documentation for Parasut API V4" (official documentation repository; its README says a CI pipeline deploys to a gh-pages branch, and the response headers of S1 and S2 are consistent with GitHub Pages hosting) | https://github.com/parasutcom/api-doc | No release or tag. Default branch master. 116 commits (as shown by the page). MIT license linked from the README | 2026-10-14 (about 07:30), read through a fetch tool that summarizes the rendered page; not saved to disk | Used for: repository structure (folders spec and web, deployment through a CI pipeline), commit count, license. These details are as reported by the fetch tool and are not hash-pinned |
| S4 | Official change history, form (a): commit history of S3 | https://github.com/parasutcom/api-doc/commits and https://github.com/parasutcom/api-doc/commits/master.atom | Latest commit 2026-02-26T10:42:10Z. Commit page 1 shows 35 commits, 2021-02-05 to 2026-02-26, with a link to more pages | 2026-10-14T07:31:30+03:00 (Atom feed downloaded) and about 07:30 (commit page via fetch tool) | Atom feed: 17604 bytes, SHA-256 419939ec11dd3f4442a3dc026919421751e45eff605a17225e4bea1f502febd6, latest 20 commits. The 35-commit page and the feed agree on every shared entry. The roughly 81 older commits (before 2021-02-05) are NOT YET REVIEWED |
| S5 | "Parasut'un yeni ozelliklerini kesfedin!" (Parasut user guide, product release notes) | https://www.parasut.com/kullanim-kilavuzu/yeni-ozellikler-listesi | Entries March-July 2024; structured data first published 2023-09-05, last modified 2024-07-26 (as reported by the fetch tool) | 2026-10-14 (about 07:30), through a fetch tool | Product (UI) release notes, not an API change log. The fetch tool found no entry that mentions the API or webhooks. Not a source of API behavior; recorded so the search for an official change history is auditable |

Searches (2026-10-14: three public web searches, one unrestricted and two restricted to the domains parasut.com, apidocs.parasut.com, yardim.parasut.com and github.com) found no separate API release-notes page. The official change history is therefore S4 plus the one-entry CHANGE LOG inside S2. Third-party client libraries and listings that appeared in search results were not used as evidence.

Access method note: S1, S2 and the S4 feed were downloaded with an HTTP GET to the publication hosts (apidocs.parasut.com, github.com), saved in a scratch directory outside the workspace, hashed and parsed locally. S3, the S4 commit page and S5 were read through a fetch tool that returns a model-written summary of the page, so numbers taken from them are second-hand; the Atom feed cross-checks the most recent commits.

## C1.2 Source-coverage summary

1. Public documentation examined and its version and date limits.
   - S2 was parsed completely: 24 tags in 7 vendor groups, 81 path keys (77 distinct URL paths; the 4 purchase-bill keys with a "#basic" or "#detailed" suffix are a Swagger device for two create and two update variants on URLs that already have their own plain keys), 121 operations (41 GET, 30 POST, 15 PUT, 18 PATCH, 17 DELETE), 99 schema definitions.
   - The only version label is "4.0.0" and it never changes. The embedded CHANGE LOG has a single entry (2021-10-11). S4 shows documentation commits through 2026-02-26, so the embedded log is not maintained (DI-01). The only date that describes the state of the document is the server's Last-Modified header (2026-02-26T10:42:55Z) and the matching last commit (2026-02-26T10:42:10Z); both are publication metadata, not statements by the vendor about the API.
   - No earlier version of S2 was retrieved. The document read here is the state at access time; its hash is recorded so later stages can detect change.
2. Resources and fields that are not documented (details in C1.7 to C1.8).
   - No read operation is published for: collections of payments, bank fees, e-archives, e-invoices, e-SMMs, stock updates, company-level transactions, checks (cheques), or any account statement or transaction history. The schema names "checks" only as one possible target of Payment.payable and publishes no schema or endpoint for it.
   - Six json:api types that appear in include or relationship lists have no published schema: activities, contact_portals, recurrence_plans, sharings, details, sales_invoice.
   - Descriptions are absent for most attributes of purchase bills, bank fees, salaries and taxes; money semantics (precision, rounding, VAT basis outside sales invoices, sign of balances) are not stated anywhere.
   - Authentication scopes, per-endpoint permissions, rate-limit scope and behavior, time zone, ordering stability, deletion semantics, change markers and a sandbox are not specified (C1.3).
3. NOT ACCESSED in C1: the Parasut UI and any Parasut account; authenticated Parasut API data and the API host api.parasut.com (not even GET); Supabase (any project); production credentials and production state; the REA tools (no setup, readiness check or install was run); the Eclipse artifacts; any .env file. The company number and the Supabase project reference in the task text were not used.
4. Any legacy mapping in this file (C1.4 last column and C1.7) is static historical evidence only. It comes from the Stage B records and from one narrowly read legacy declaration (server/parasut/resource-registry.ts), plus two one-line endpoint declarations (server/parasut/sync-checks.ts line 14 and sync-transaction-history.ts line 83) needed to name legacy-used routes that S2 does not publish. Statements in those files such as "verified live" are legacy claims and were not checked.
5. C1 does not resolve financial rules, does not validate any legacy calculation or mapping, and does not approve Stage D. Stage D financial-domain sign-off stays blocked while the critical correctness gaps in C1.8 remain.

## C1.3 Cross-cutting facts that apply to every row

Every statement in the "Documented" column is published text in the cited source. Every statement in the "NOT SPECIFIED" column is an evidence gap: the examined publication is silent, so nothing may be assumed.

| Topic | Documented (source) | NOT SPECIFIED / gap |
| ----- | ------------------- | ------------------- |
| Host, version, company scope | S2: host api.parasut.com, basePath /v4, scheme https. Prose in S2: base URL https://api.parasut.com, V4 under /v4, methods are reached under /v4/{firma_no} where firma_no is the company's registration number in Parasut's database. Path parameter company_id is an integer ("Firma ID") | How a client learns its company number other than the /me relationship "companies" (published as an include option); whether one credential can see several companies (G-07) |
| Versioning | S2 info.version is "4.0.0"; no operation is marked deprecated; no version header is described | Version policy, deprecation or sunset rules (DI-01, G-16) |
| Media types and style | S2: consumes and produces application/vnd.api+json. Prose: send Content-Type application/json or application/vnd.api+json; the vendor says it "mostly" follows the JSON:API standard | Which parts deviate from JSON:API; the published schemas have no "links" object |
| Authentication | S2 securityDefinitions: one scheme "parasut_auth", OAuth2, flow accessCode, authorizationUrl and tokenUrl on the API host, scopes empty; all operations inherit it. Prose: client id, client secret and redirect URL are obtained by writing to vendor support (no self-service is described); two ways to get a token: grant_type=authorization_code (default redirect urn:ietf:wg:oauth:2.0:oob, a custom redirect on request) and grant_type=password (account e-mail and password plus client id and secret); a refresh_token grant exists; the access token is valid for 2 hours (the sample result shows expires_in 7200); a refresh returns a new refresh token that must be used next time; requests carry "Authorization: Bearer <access_token>". No credential or sample token value is recorded here | Scopes (the scope list is empty); per-endpoint permissions; whether password grant works for every account; token revocation; refresh-token lifetime; limits on concurrent tokens (G-07). The prose documents the password grant that the Stage B report (L-12) flagged as a legacy weakness: the publication supports it, which is not an endorsement |
| Rate limit | S2 prose, one sentence: 10 requests may be sent per 10 seconds | What is counted (IP, token, company, client); window type; headers; the response code (no 429 and no Retry-After appear anywhere in S2); penalties; whether include or PDF reads weigh more (G-01, DI-13) |
| Pagination | Query parameters page[number] (integer, default 1) and page[size] (integer, default 15, minimum 1, maximum 25). 16 of the 17 collection reads publish page[size]; listSalesOffers does not (DI-06). List responses carry meta {current_page, total_pages, total_count} (ListMeta, all integers) | Ordering stability across pages; behavior past the last page; whether total_count is exact under concurrent changes; any cursor option; maximum offset (G-02) |
| Sorting | Query parameter sort (string) on 16 of the 17 collection reads (not on listEInvoiceInboxes). The available fields are written into the parameter description (for example contacts: id, balance, name, email). Defaults: -balance for contacts and employees; -id for accounts, products and warehouses; id for the others. A leading minus is evidenced only by those defaults | Syntax rules (multi-key, case); tie-breaking (the -balance default is not a unique key); null ordering; sort names that are not published attributes (DI-07) (G-02) |
| Filtering | Query parameters filter[name] per endpoint (types string, integer, boolean). Value lists are published for only a few: contacts account_type (customer, supplier); sales invoices item_type (default "invoice, refund, estimate"; available invoice, refund, estimate, export), print_status, payment_status; purchase bills item_type (purchase_bill, refund, cancelled). No filter anywhere involves created_at or updated_at | Matching semantics (exact or partial, case); date filter format and range syntax; operators; the free-text filter[query] of sales offers; how several filters combine; how to list item types the default hides (G-05, G-06) |
| Include | Query parameter include (string). The available relation names are written in the parameter description; dot notation shows nested relations (for example details.product, payments.transaction). Responses carry "included" as objects with id, type, attributes and relationships; the allowed type values are enumerated per operation (C1.6) | Depth limit; separator syntax beyond the prose examples; size limits; effect on page size and rate limit; the include names and the included type names are different vocabularies and the mapping is implicit (DI-11) (G-14) |
| Envelope and errors | 200: data (object or array), included (optional), meta (lists only). Documented error statuses: 400, 401, 403, 404, 422, each with errors = list of {title, detail}. Prose mentions 204 for PDF reads that are not ready | 429 and 5xx responses; machine-readable error codes; message language; error source pointers (G-12) |
| Identifiers | Resource objects: id is a string (maxLength 255) and type is a string; path parameters company_id, id and product_id are integers | Stability, reuse and cross-type uniqueness of ids (G-13, DI-10) |
| Dates and time | created_at and updated_at are typed "date" (no time of day) in every schema; several other attributes are "date-time" (for example printed_at, registered_at, shipment_date, expires_at, last_used_at) | Time zone, offset and DST rules; whether issue_date is a legal date; any timestamp precision (G-04, DI-09) |
| Money and currency | Amounts are JSON "number". Currency attributes on documents, accounts and transactions are enumerated: TRL, USD, EUR, GBP. Several documents also publish "_in_trl" amounts and an exchange_rate number. Sales-invoice labels (S2): net_total "Genel Toplam" (general total), gross_total "Ara toplam" (subtotal), remaining "Odenmemis tutar" (unpaid amount) | Decimal scale and rounding; whether the live API sends numbers or strings; the VAT basis of net_total and gross_total on every other document type (purchase bills publish no description); sign convention of balances; exchange-rate direction and date; Product.currency and Product.buying_currency are free strings and Payment.currency is typed number (DI-03) (G-03) |
| Lifecycle vocabularies | See the enumerations in the row tables (C1.5), for example: sales invoice item_type (invoice, export, estimate, cancelled, recurring_invoice, recurring_estimate, recurring_export, refund); payment_status (paid, overdue, unpaid, partially_paid); purchase bill item_type (purchase_bill, cancelled, recurring_purchase_bill, refund); e-archive status (bounced, sent, printed, legalized); e-invoice status (waiting, failed, successful); trackable job status (running, done, error); contact account_type (customer, supplier); account account_type (cash, bank, sys). Boolean "archived" flags exist on most resources | State-transition rules; terminal states; whether archived, cancelled or recurring items appear in default lists; the definition of "overdue"; the read vocabulary of quote status (G-05, DI-05) |
| Delete, archive, cancel | The existence of archive, unarchive, cancel, recover and delete methods is visible in the path list (C1.9) | What a reader sees after each of them, and whether deleted records leave any trace (G-05, G-06) |
| Asynchronous work and PDFs | Prose: creating e-documents is asynchronous; the job id is valid 15 minutes and its status is read with GET trackable_jobs (statuses pending, running, error, done in the prose; the schema enumerates running, done, error: DI-04). PDF reads return an empty 204 until the PDF exists, then a URL valid for 1 hour (schema EDocumentPdf: url, expires_at) | PDF retention; whether PDF reads count differently against the rate limit |
| Roles and permissions | UserRole schema (reachable by /me include=user_roles): levels rw, ro, na for the areas sales_invoices, expenditures, own_expenditures, employees, accounts, settings | Which endpoints belong to which area; whether a "ro" role gives read-only API access; contacts, products, stock and e-documents have no published role area (G-07) |
| Company plan | Company schema (reachable by /me include=companies) publishes subscription and feature attributes such as subscription_status, inventory_enabled, has_active_subscription, accessible, inspectable | Whether and how these attributes change which endpoints answer (G-08) |
| Change history | S2 CHANGE LOG: one entry, 2021-10-11 (Amazon-specific custom fields added; definitions of order_no and order_date changed for invoice creation). S4 (commit titles): sales-offers documentation added 2024-02-22 to 2024-03-07; invoice note fields added 2024-10-01; webhook documentation added 2023-02-02 and "remove webhook endpoints from public API documentation" on 2026-02-26 | Whether webhooks still exist; a maintained, versioned change log (DI-01, G-06, G-16) |
| Test environment | Nothing in S1-S5 describes a sandbox, demo or test host | Any safe place to exercise reads (G-11) |

### C1.3.1 Translation aid (mine, not the vendor's; accounting meaning is NOT validated)

Teklif = offer or quote; Satis faturasi = sales invoice; Alis faturasi or Gider = purchase bill or expense; Musteri/Tedarikci = customer/supplier; Bakiye = balance; Tahsilat = collection of a receivable; Odeme = payment; Irsaliye = delivery note; Maas = salary; Vergi = tax; Banka gideri = bank fee; Stopaj = income-tax withholding; Tevkifat = VAT withholding; KDV = VAT; OTV = special consumption tax; OIV = special communications tax; Genel Toplam = general total; Ara toplam = subtotal; Vergiler Haric Toplam = total excluding taxes; Odenmemis tutar = unpaid amount; Duzenleme tarihi = issue date; Son tahsilat tarihi = last collection (due) date; Doviz = currency or foreign exchange; Kur = exchange rate; Etiket = tag; Depo = warehouse; Hesap = account; Firma = company; Resmilestirme = formalization (issuing e-documents); Pesin satis = cash sale; Irsaliyeli fatura = invoice with delivery note; Yurt disi = abroad; Arsivlenme = archiving; Satislar, Giderler, Nakit, Stok, Ayarlar, Diger = the vendor's group names Sales, Expenses, Cash, Stock, Settings, Other.

## C1.4 Resource inventory: one row per documented resource group

Scope note: "relevant to the agreed financial and operational scope" was applied inclusively. All 24 tags of S2 belong to the vendor's own financial or operational groups, so all 24 have a row; the vendor's group order is kept. The scope classification used elsewhere in this project (documents and payments, cash, master data, stock, technical) is not a vendor statement and is not used to drop rows. Nested entities that have a published schema but no standalone read endpoint (payments, line items, contact people and others) are in C1.6.

Reading the table: "Documented read endpoints" lists every GET published for the row. "Non-GET" is the count of documented write-class methods (all OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY; listed in C1.5 and summarized in C1.9). "Gaps" points to the NOT SPECIFIED items (G-nn) and document defects (DI-nn) of C1.8 that limit the row. The full documented facts for each row (parameters, response envelope, every attribute with type, enumeration and read-only flag, relationships) are in C1.5.

| Row | Resource (tag) | Vendor group | Documented read endpoints (GET) | Non-GET | Published schema(s) | Evidence label | Legacy mirror (LEGACY / UNVALIDATED) | Gaps |
| --- | -------------- | ------------ | ------------------------------- | ------- | ------------------- | -------------- | ------------------------------------ | ---- |
| R01 | SalesOffers | Satislar (Sales) | GET /{company_id}/sales_offers; GET /{company_id}/sales_offers/{id}; GET /{company_id}/sales_offers/{id}/details | 8 | SalesOffers, SalesOffersDetails (35 attributes in first schema) | DOCUMENTATION ONLY | sales_offers (direct-list), sales_offers_details (nested) | G-03, G-05, DI-06, DI-07 |
| R02 | SalesInvoices | Satislar (Sales) | GET /{company_id}/sales_invoices; GET /{company_id}/sales_invoices/{id} | 9 | SalesInvoice (47 attributes in first schema) | DOCUMENTATION ONLY | sales_invoices (direct-list), sales_invoice_details (nested), payments (nested) | G-02, G-03, G-05, G-09, DI-05, DI-10 |
| R03 | Contacts | Satislar (Sales) + Giderler (Expenses) | GET /{company_id}/contacts; GET /{company_id}/contacts/{id} | 5 | Contact (26 attributes in first schema) | DOCUMENTATION ONLY | contacts (direct-list) | G-02, G-03, G-05 |
| R04 | PurchaseBills | Giderler (Expenses) | GET /{company_id}/purchase_bills; GET /{company_id}/purchase_bills/{id} | 10 | PurchaseBill (30 attributes in first schema) | DOCUMENTATION ONLY | purchase_bills (direct-list), purchase_bill_details (nested), payments (nested) | G-03, G-05, DI-11 |
| R05 | BankFees | Giderler (Expenses) | GET /{company_id}/bank_fees/{id} | 6 | BankFee (12 attributes in first schema) | DOCUMENTATION ONLY | bank_fees (classified unsupported) | G-05, G-09 |
| R06 | Salaries | Giderler (Expenses) | GET /{company_id}/salaries; GET /{company_id}/salaries/{id} | 6 | Salary (12 attributes in first schema) | DOCUMENTATION ONLY | salaries (direct-list) | G-03, G-05, DI-11 |
| R07 | Taxes | Giderler (Expenses) | GET /{company_id}/taxes; GET /{company_id}/taxes/{id} | 6 | Tax (10 attributes in first schema) | DOCUMENTATION ONLY | taxes (direct-list) | G-03, DI-02, DI-07, DI-11 |
| R08 | Employees | Giderler (Expenses) | GET /{company_id}/employees; GET /{company_id}/employees/{id} | 5 | Employee (11 attributes in first schema) | DOCUMENTATION ONLY | employees (direct-list) | G-02, G-10 |
| R09 | EInvoiceInboxes | Resmilestirme (formalization, e-documents) | GET /{company_id}/e_invoice_inboxes | 0 | EInvoiceInbox (8 attributes in first schema) | DOCUMENTATION ONLY | e_invoice_inboxes (direct-list) | G-05, DI-10 |
| R10 | EArchives | Resmilestirme (formalization, e-documents) | GET /{company_id}/e_archives/{id}; GET /{company_id}/e_archives/{id}/pdf | 1 | EArchive, EDocumentPdf (11 attributes in first schema) | DOCUMENTATION ONLY | e_archives (classified unsupported) | G-05, G-09 |
| R11 | EInvoices | Resmilestirme (formalization, e-documents) | GET /{company_id}/e_invoices/{id}; GET /{company_id}/e_invoices/{id}/pdf | 1 | EInvoice, EDocumentPdf (25 attributes in first schema) | DOCUMENTATION ONLY | e_invoices (direct-list) | G-05, G-09, DI-12 |
| R12 | ESmms | Resmilestirme (formalization, e-documents) | GET /{company_id}/e_smms/{id}; GET /{company_id}/e_smms/{id}.pdf | 1 | ESmm, EDocumentPdf (8 attributes in first schema) | DOCUMENTATION ONLY | e_smms (classified unsupported) | G-05, G-09, DI-10 |
| R13 | Accounts | Nakit (Cash) | GET /{company_id}/accounts; GET /{company_id}/accounts/{id}; GET /{company_id}/accounts/{id}/transactions | 5 | Account, Transaction (16 attributes in first schema) | DOCUMENTATION ONLY | accounts (direct-list) | G-02, G-03, DI-07 |
| R14 | Transactions | Nakit (Cash) | GET /{company_id}/transactions/{id} | 1 | Transaction (10 attributes in first schema) | DOCUMENTATION ONLY | transactions (nested) | G-03, G-09 |
| R15 | Products | Stok (Stock) | GET /{company_id}/products; GET /{company_id}/products/{id} | 3 | Product (26 attributes in first schema) | DOCUMENTATION ONLY | products (direct-list) | G-03, DI-03, DI-08 |
| R16 | Warehouses | Stok (Stock) | GET /{company_id}/warehouses; GET /{company_id}/warehouses/{id} | 3 | Warehouse (8 attributes in first schema) | DOCUMENTATION ONLY | warehouses (direct-list) | G-05, DI-08 |
| R17 | ShipmentDocuments | Stok (Stock) | GET /{company_id}/shipment_documents; GET /{company_id}/shipment_documents/{id} | 3 | ShipmentDocument (14 attributes in first schema) | DOCUMENTATION ONLY | shipment_documents (direct-list) | G-05, DI-07 |
| R18 | StockMovements | Stok (Stock) | GET /{company_id}/stock_movements | 0 | StockMovement (5 attributes in first schema) | DOCUMENTATION ONLY | stock_movements (classified unsupported) | G-03, G-09, G-12 |
| R19 | InventoryLevels | Stok (Stock) | GET /{company_id}/product/{product_id}/inventory_levels | 0 | InventoryLevel (5 attributes in first schema) | DOCUMENTATION ONLY | inventory_levels (nested) | G-01, G-14, DI-08 |
| R20 | StockUpdates | Stok (Stock) | none published | 1 | none for reads (only a create-form schema exists) | DOCUMENTATION ONLY (no read operation published) | stock_updates (classified unsupported), stock_update_details (nested) | G-09 |
| R21 | ItemCategories | Ayarlar (Settings) | GET /{company_id}/item_categories; GET /{company_id}/item_categories/{id} | 3 | ItemCategory (8 attributes in first schema) | DOCUMENTATION ONLY | item_categories (direct-list) | G-05 |
| R22 | Tags | Ayarlar (Settings) | GET /{company_id}/tags; GET /{company_id}/tags/{id} | 3 | Tag (3 attributes in first schema) | DOCUMENTATION ONLY | tags (direct-list) | G-05 |
| R23 | ApiHome | Diger (Other) | GET /me | 0 | Me (3 attributes in first schema) | DOCUMENTATION ONLY | none reported | G-07, G-08, DI-10 |
| R24 | TrackableJobs | Diger (Other) | GET /{company_id}/trackable_jobs/{id} | 0 | TrackableJob (2 attributes in first schema) | DOCUMENTATION ONLY | trackable_jobs (nested) | DI-04 |

### C1.4.1 Unresolved questions per row and the evidence that would answer them

None of these is answered by C1. "Stage" is the earliest later stage whose scope could produce the evidence, subject to the access authorizations required by the doctrine (section 8).

| Row | Unresolved question (UNKNOWN today) | Evidence needed | Stage |
| --- | ----------------------------------- | --------------- | ----- |
| R01 SalesOffers | Which status values do reads return, and what do filter[status] and filter[invoice_status] accept? (The only vocabulary published is accepted, rejected, waiting, and it appears only in the schema of an out-of-scope status-update method.) Why does the list omit page[size]? How is an offer linked to the invoice made from it? | Quote states in the UI; a bounded sample of offers including converted ones | C2, C4 |
| R02 SalesInvoices | Does the default list (item_type default "invoice, refund, estimate") hide export, cancelled and recurring invoices, and how are those enumerated? Which payment_status vocabulary do reads return (filter and attribute differ: DI-05)? What currency basis does remaining use? Is net_total = general total and gross_total = subtotal true for every item_type? | UI list versus API list for every item_type; record-level comparison with payments | C2, C4, C5 |
| R03 Contacts | Sign convention and currency basis of balance, trl_balance, usd_balance, eur_balance, gbp_balance; tie-breaking under the default sort -balance; whether one contact can be both customer and supplier; whether archived contacts appear in lists; meaning of untrackable | UI contact views; sample with balances checked against documents | C4, C5 |
| R04 PurchaseBills | Meaning of net_total (required, writable) and gross_total (read-only) for bills, since no description is published; the default item_type of the list (none stated); why total_vat is writable; behavior of pay_to (contact or employee) | Accountant input; record-level comparison | C4, C5 |
| R05 BankFees | How can bank fees be enumerated when only read-by-id is published? | UI list of bank fees; how the UI loads them | C2, C4 |
| R06 Salaries | Payment-status vocabulary; visibility of salary records to a restricted role; data-minimisation for personal data | Role views in the UI; owner decision | C2, C4 |
| R07 Taxes | Which json:api type do reads return (the schema says bank_fees: DI-02)? The list filter currency has no matching attribute (DI-07). Which tax kinds exist? | Sample of tax records | C4 |
| R08 Employees | Do live responses carry more fields than the 11 published (the legacy declares extra personal fields: LEGACY / UNVALIDATED)? Tie-breaking under -balance; access control for IBAN and e-mail | Field-minimised bounded sample; owner decision on personal data | C4, C5 |
| R09 EInvoiceInboxes | Vocabulary of inbox_type; why filter[vkn] is typed integer while the attribute is a string; how fresh the registry is | UI behavior when choosing a counterparty | C2 |
| R10 EArchives | How can e-archive documents be enumerated (no list)? Lifecycle of status (bounced, sent, printed, legalized); timing of PDF availability | UI e-archive views; sample | C2, C4 |
| R11 EInvoices | The legacy used a list route that S2 does not publish: does it exist, and what does it return? Meaning of status, direction, response_type and scenario; placement of export (GTB) fields | Passive observation of UI traffic if authorized; vendor confirmation; sample | C2, C4 |
| R12 ESmms | No list; only 8 attributes; invoice_number is typed number | UI e-SMM views | C2 |
| R13 Accounts | Sign and currency basis of balance; balance_in_trl is a sort field without a published attribute (DI-07); meaning of account_type sys; date filter format of the transaction list | Sample of accounts and their transactions | C4, C5 |
| R14 Transactions | Only read-by-id and the per-account list are published: how are ledgers and statements enumerated? Debit and credit direction, amount_in_trl basis, transaction_type vocabulary (free string) | UI statement views; record-level comparison; accountant input | C2, C4, C5 |
| R15 Products | Currency fields are free strings here but enumerated elsewhere; relation of stock_count to inventory levels; archived visibility; unit vocabulary | Sample with stock checks | C4 |
| R16 Warehouses | Why inventory_levels is declared as a single relationship (DI-08); archived default visibility | Sample | C4 |
| R17 ShipmentDocuments | Values of the filters flow_type and invoice_status (no matching attributes: DI-07); semantics of inflow; links to invoices | UI delivery-note views; sample | C2, C4 |
| R18 StockMovements | Direction and valuation of a movement (only quantity and date are published); semantics of the polymorphic source; the legacy declares that the list returned a server error (LEGACY / UNVALIDATED) | Sample; vendor confirmation | C4 |
| R19 InventoryLevels | One request per product is needed to enumerate levels: cost against the 10-per-10-seconds limit; semantics of has_stock and archived filters | Performance measurement on an authorized sample | C4, C5 |
| R20 StockUpdates | No read is published: how do stock updates show up in reads (perhaps only as stock movements)? | UI stock-update views | C2 |
| R21 ItemCategories | Mapping of category_type (Product, Contact, Employee, SalesInvoice, Expenditure) to resources; depth of hierarchy; parent_id (integer) versus the parent relationship | Sample | C4 |
| R22 Tags | Which resources accept tags (relationships appear on documents); nothing else is published | Sample | C4 |
| R23 ApiHome | How to identify the authorized company without exposing data; effect of role levels and plan attributes (G-07, G-08) | Role and plan views; read-only identification after separate authorization | C2, C4 |
| R24 TrackableJobs | Meaningful only after a write operation, which is out of scope; documentation defects DI-04 | None needed under current policy | none |

### C1.4.2 Index of every documented read operation (41)

| # | Row | Tag | operationId | Method and path (as published) |
| - | --- | --- | ----------- | ------------------------------ |
| 1 | R01 | SalesOffers | listSalesOffers | GET /{company_id}/sales_offers |
| 2 | R01 | SalesOffers | showSalesOffers | GET /{company_id}/sales_offers/{id} |
| 3 | R01 | SalesOffers | showSalesOffersDetails | GET /{company_id}/sales_offers/{id}/details |
| 4 | R02 | SalesInvoices | listSalesInvoices | GET /{company_id}/sales_invoices |
| 5 | R02 | SalesInvoices | showSalesInvoice | GET /{company_id}/sales_invoices/{id} |
| 6 | R03 | Contacts | listContacts | GET /{company_id}/contacts |
| 7 | R03 | Contacts | showContact | GET /{company_id}/contacts/{id} |
| 8 | R04 | PurchaseBills | listPurchaseBills | GET /{company_id}/purchase_bills |
| 9 | R04 | PurchaseBills | showPurchaseBill | GET /{company_id}/purchase_bills/{id} |
| 10 | R05 | BankFees | showBankFee | GET /{company_id}/bank_fees/{id} |
| 11 | R06 | Salaries | listSalaries | GET /{company_id}/salaries |
| 12 | R06 | Salaries | showSalary | GET /{company_id}/salaries/{id} |
| 13 | R07 | Taxes | listTaxes | GET /{company_id}/taxes |
| 14 | R07 | Taxes | showTax | GET /{company_id}/taxes/{id} |
| 15 | R08 | Employees | listEmployees | GET /{company_id}/employees |
| 16 | R08 | Employees | showEmployee | GET /{company_id}/employees/{id} |
| 17 | R09 | EInvoiceInboxes | listEInvoiceInboxes | GET /{company_id}/e_invoice_inboxes |
| 18 | R10 | EArchives | showEArchive | GET /{company_id}/e_archives/{id} |
| 19 | R10 | EArchives | showEArchivePdf | GET /{company_id}/e_archives/{id}/pdf |
| 20 | R11 | EInvoices | showEInvoice | GET /{company_id}/e_invoices/{id} |
| 21 | R11 | EInvoices | showEInvoicePdf | GET /{company_id}/e_invoices/{id}/pdf |
| 22 | R12 | ESmms | showESmm | GET /{company_id}/e_smms/{id} |
| 23 | R12 | ESmms | showESmmPdf | GET /{company_id}/e_smms/{id}.pdf |
| 24 | R13 | Accounts | listAccounts | GET /{company_id}/accounts |
| 25 | R13 | Accounts | showAccount | GET /{company_id}/accounts/{id} |
| 26 | R13 | Accounts | listAccountTransactions | GET /{company_id}/accounts/{id}/transactions |
| 27 | R14 | Transactions | showTransaction | GET /{company_id}/transactions/{id} |
| 28 | R15 | Products | listProducts | GET /{company_id}/products |
| 29 | R15 | Products | showProduct | GET /{company_id}/products/{id} |
| 30 | R16 | Warehouses | listWarehouses | GET /{company_id}/warehouses |
| 31 | R16 | Warehouses | showWarehouse | GET /{company_id}/warehouses/{id} |
| 32 | R17 | ShipmentDocuments | listShipmentDocuments | GET /{company_id}/shipment_documents |
| 33 | R17 | ShipmentDocuments | showShipmentDocument | GET /{company_id}/shipment_documents/{id} |
| 34 | R18 | StockMovements | listStockMovements | GET /{company_id}/stock_movements |
| 35 | R19 | InventoryLevels | listInventoryLevels | GET /{company_id}/product/{product_id}/inventory_levels |
| 36 | R21 | ItemCategories | listItemCategories | GET /{company_id}/item_categories |
| 37 | R21 | ItemCategories | showItemCategory | GET /{company_id}/item_categories/{id} |
| 38 | R22 | Tags | listTags | GET /{company_id}/tags |
| 39 | R22 | Tags | showTag | GET /{company_id}/tags/{id} |
| 40 | R23 | ApiHome | showMe | GET /me |
| 41 | R24 | TrackableJobs | showTrackableJob | GET /{company_id}/trackable_jobs/{id} |

## C1.5 Row detail: documented operations, fields, relationships and constraints

This catalog was generated mechanically from S2 (SHA-256 4301a8b9...cb848) by a script that reads the JSON as data; nothing in the document is executed. How to read each row block:
- "Filters", "Sort", "Pagination" and "Include" are the query parameters published for the read operation, with their defaults, limits and quoted value lists. "none documented" means the operation publishes no such parameter.
- "Response 200" shows the published envelope: the data schema (one object or an array), the enumerated json:api types that may appear in "included", the meta schema (lists only) and the other documented status codes (400, 401, 403, 404, 422; there is no 429 or 5xx).
- Attribute tables are the published attribute schema of the first data schema of the row. "Type (as published)" keeps the vendor's type and format ("string(date)" is a string with format date). "RO/RW" is the vendor's readOnly flag; the same attribute schema is shared with the create and update forms, so RW describes the vendor's form, not a right of ERP 3.0. "Req" is the published required list of that shared schema; it does not say that a read response always contains the field (UNKNOWN). Empty description cells mean the publication has no description.
- Descriptions are transliterated and abridged to 260 characters. Money semantics are NOT SPECIFIED unless a description says otherwise.
- The out-of-scope methods of each row are listed as method, path and operationId only.
- Every block carries the label DOCUMENTATION ONLY: nothing here was observed on a live system.

#### R01 SalesOffers

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "SalesOffers").
- Vendor group (x-tagGroups): Satislar. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): sales offers / quotes (Teklif).
- Operation description (S2, showSalesOffersPdf [description of an OUT OF SCOPE POST method, quoted only because it documents what can be read; the method is not explored]): Olusan PDF'in URL'ine trackable_jobs response'unun icerisinde data > attributes > url alanindan erisebilirsiniz.
- Operation description (S2, e-mailSalesOffers [description of an OUT OF SCOPE POST method, quoted only because it documents what can be read; the method is not explored]): E-mail status erisimi asagidaki sekilde saglanir: Oncelikle, mevcut teklife bir GET istegi gonderilir. Ardindan, yanitta bulunan 'included' icinde 'sharings' turunde bir obje bulunur. Bu obje acilarak icindeki 'attributes' alanina bakilir. 'email_status' alani, su anda e-postanin durumunu saglayacaktir.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): sales_offers (direct-list), sales_offers_details (nested).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| listSalesOffers | /{company_id}/sales_offers | archived:boolean; query:string; invoice_status:string; status:string | default id; Sortable parameters - *Available: id, issue_date, description, net_total_in_trl, sales_invoice_id* | page[number]: default 1; Page Number / page[size]: not documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: contact, sales_invoice* | data: array of SalesOffers; included types: [contacts,sales_invoice]; meta: ListMeta; other responses: 400,401,403,404,422 |
| showSalesOffers | /{company_id}/sales_offers/{id} | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: details.product contact.contact_people.contact contact.category sales_invoice activities.item activities.done_by sharings.collaborator* | data: one SalesOffers; included types: [contacts,sales_invoices,details,activities,sharings]; meta: none; other responses: 400,401,403,404,422 |
| showSalesOffersDetails | /{company_id}/sales_offers/{id}/details | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: product* | data: one SalesOffersDetails; included types: [products]; meta: none; other responses: 400,401,403,404,422 |

Schema SalesOffers (attributes schema SalesOfferAttributes) - json:api type value(s): sales_offers; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| content | string | RW |  |  | Teklif icerigi |
| contact_type | string | RW |  |  | Alici tipi |
| sharings_count | number | RO |  |  |  |
| status | string | RO |  |  |  |
| display_exchange_rate_in_pdf | boolean | RW |  |  | Gosterim doviz kuru |
| archived | boolean | RO |  |  |  |
| net_total | number | RO |  |  | Genel Toplam |
| gross_total | number | RO |  |  | Ara toplam |
| withholding | number | RO |  |  | Stopaj |
| total_excise_duty | number | RO |  |  |  |
| total_communications_tax | number | RO |  |  |  |
| total_accommodation_tax | number | RO |  |  |  |
| total_vat | number | RO |  |  | Toplam KDV |
| total_vat_withholding | number | RO |  |  | Toplam Tevkifat |
| vat_withholding | number | RO |  |  | Tevkifat |
| total_discount | number | RO |  |  | Toplam indirim |
| total_invoice_discount | number | RO |  |  |  |
| description | string | RW |  |  | Fatura aciklamasi |
| issue_date | string(date) | RW |  | yes | Duzenleme tarihi |
| due_date | string(date) | RW |  |  | Son tahsilat tarihi |
| currency | string | RW | TRL, USD, EUR, GBP |  | Doviz tipi |
| exchange_rate | number | RW |  |  | Doviz kuru |
| withholding_rate | number | RW |  |  | Stopaj orani |
| invoice_discount_type | string | RW | percentage, amount |  |  |
| invoice_discount | number | RW |  |  |  |
| billing_address | string | RW |  |  | Gonderim adresi |
| billing_phone | string | RW |  |  | Gonderim adresi telefonu |
| billing_fax | string | RW |  |  | Gonderim adresi faksi |
| tax_office | string | RW |  |  | Musteri vergi dairesi |
| tax_number | string | RW |  |  | Musteri vergi numarasi |
| city | string | RW |  |  |  |
| district | string | RW |  |  |  |
| is_abroad | boolean | RW |  |  | Alici yurt disi bilgisi |
| order_no | string | RW |  |  | Siparis no (resmilestirmek icin order_date dolu ise bu alan zorunludur) |
| order_date | string(date) | RW |  |  | Siparis tarihi (resmilestirmek icin order_no dolu ise bu alan zorunludur) |

Relationships of SalesOffers (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| sales_invoice | one | sales_invoices |
| contact | one | contacts |
| details | many | sales_offer_details |
| activities | many | activities |
| sharings | many | sharings |

Schema SalesOffersDetails (attributes schema SalesOffersDetailAttributes) - json:api type value(s): sales_offers_details; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| description | string | RW |  |  |  |
| net_total | number | RW |  |  |  |
| unit_price | number | RW |  |  |  |
| vat_rate | number | RW |  |  |  |
| quantity | number | RW |  |  |  |
| discount_type | string | RW |  |  |  |
| discount_value | number | RW |  |  |  |
| communications_tax_rate | number | RW |  |  |  |
| excise_duty_type | string | RW |  |  |  |
| invoice_discount | number | RW |  |  |  |
| excise_duty | number | RW |  |  |  |
| excise_duty_rate | number | RW |  |  |  |
| discount | number | RW |  |  |  |
| communications_tax | number | RW |  |  |  |
| detail_no | number | RW |  |  |  |
| net_total_without_invoice_discount | number | RW |  |  |  |
| vat_withholding | number | RW |  |  |  |
| vat_withholding_rate | number | RW |  |  |  |
| accommodation_tax_rate | number | RW |  |  |  |
| accommodation_tax | number | RW |  |  |  |
| accommodation_tax_exempt | boolean | RW |  |  |  |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |
| excise_duty_value | number | RW |  |  |  |

Relationships of SalesOffersDetails (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| product | one | products |

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 8 operation(s)): POST /{company_id}/sales_offers (createSalesOffers); PUT /{company_id}/sales_offers/{id} (updateSalesOffers); DELETE /{company_id}/sales_offers/{id} (deleteSalesOffers); POST /{company_id}/sales_offers/{id}/pdf (showSalesOffersPdf); PATCH /{company_id}/sales_offers/{id}/archive (archiveSalesOffers); PATCH /{company_id}/sales_offers/{id}/unarchive (unarchiveSalesOffers); PATCH /{company_id}/sales_offers/{id}/update_status (updateSalesOffersStatus); POST /{company_id}/sharings (e-mailSalesOffers)

#### R02 SalesInvoices

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "SalesInvoices").
- Vendor group (x-tagGroups): Satislar. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): sales invoices (Satis faturasi).
- Operation description (S2, convertEstimateToInvoice [description of an OUT OF SCOPE PATCH method, quoted only because it documents what can be read; the method is not explored]): Urunlerinizin stok hareketleri varsayilan deponuz uzerinden olusturulacaktir.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): sales_invoices (direct-list), sales_invoice_details (nested), payments (nested).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| listSalesInvoices | /{company_id}/sales_invoices | issue_date:string; due_date:string; contact_id:integer; invoice_id:integer; invoice_series:string; item_type:string (Default value is *'invoice, refund, estimate'*. Available: *invoice, refund, estimate, export*); print_status:string (Available: *printed, not_printed, invoices_not_sent, e_invoice_sent, e_archive_sent, e_smm_sent*); payment_status:string (Available: *overdue, not_due, unscheduled, paid*) | default id; Sortable parameters - *Available: id, issue_date, due_date, remaining, remaining_in_trl, description, net_total* | page[number]: default 1; Page Number / page[size]: default 15; min 1; max 25; Page Size | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: category, contact, details, details.product, details.warehouse, payments, payments.transaction, tags, sharings, recurrence_plan, active_e_document* | data: array of SalesInvoice; included types: [item_categories,contacts,sales_invoice_details,payments,tags,sales_offers,sharings,recurrence_plans,e_archives,e_invoices]; meta: ListMeta; other responses: 400,401,403,404,422 |
| showSalesInvoice | /{company_id}/sales_invoices/{id} | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: category, contact, details, details.product, details.warehouse, payments, payments.transaction, tags, sharings, recurrence_plan, active_e_document* | data: one SalesInvoice; included types: [item_categories,contacts,sales_invoice_details,payments,tags,sales_offers,sharings,recurrence_plans,e_archives,e_invoices]; meta: none; other responses: 400,401,403,404,422 |

Schema SalesInvoice (attributes schema SalesInvoiceAttributes) - json:api type value(s): sales_invoices; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| archived | boolean | RO |  |  |  |
| invoice_no | string | RO |  |  | Fatura no |
| net_total | number | RO |  |  | Genel Toplam |
| gross_total | number | RO |  |  | Ara toplam |
| withholding | number | RO |  |  | Stopaj |
| total_excise_duty | number | RO |  |  |  |
| total_communications_tax | number | RO |  |  |  |
| total_vat | number | RO |  |  | Toplam KDV |
| total_vat_withholding | number | RO |  |  | Tevkifat |
| total_discount | number | RO |  |  | Toplam indirim |
| total_invoice_discount | number | RO |  |  |  |
| before_taxes_total | number | RO |  |  | Vergiler Haric Toplam |
| remaining | number | RO |  |  | Odenmemis tutar |
| remaining_in_trl | number | RO |  |  |  |
| payment_status | string | RO | paid, overdue, unpaid, partially_paid |  | Tahsilat durumu |
| created_at | string(date) | RO |  |  | Kayit tarihi |
| updated_at | string(date) | RO |  |  | Son guncelleme tarihi |
| item_type | string | RW | invoice, export, estimate, cancelled, recurring_invoice, recurring_estimate, recurring_export, refund | yes | Fatura turu |
| description | string | RW |  |  | Fatura aciklamasi |
| issue_date | string(date) | RW |  | yes | Duzenleme tarihi |
| due_date | string(date) | RW |  |  | Son tahsilat tarihi |
| invoice_series | string | RW |  |  | Fatura seri |
| invoice_id | integer | RW |  |  | Fatura sira |
| currency | string | RW | TRL, USD, EUR, GBP |  | Doviz tipi |
| exchange_rate | number | RW |  |  | Doviz kuru |
| withholding_rate | number | RW |  |  | Stopaj orani |
| invoice_discount_type | string | RW | percentage, amount |  |  |
| invoice_discount | number | RW |  |  |  |
| billing_address | string | RW |  |  | Gonderim adresi |
| billing_postal_code | string | RW |  |  | Gonderim posta kodu |
| billing_phone | string | RW |  |  | Gonderim adresi telefonu |
| billing_fax | string | RW |  |  | Gonderim adresi faksi |
| tax_office | string | RW |  |  | Musteri vergi dairesi |
| tax_number | string | RW |  |  | Musteri vergi numarasi |
| country | string | RW |  |  |  |
| city | string | RW |  |  |  |
| district | string | RW |  |  |  |
| is_abroad | boolean | RW |  |  | Alici yurt disi bilgisi |
| order_no | string | RW |  |  | Siparis no (resmilestirmek icin order_date dolu ise bu alan zorunludur) |
| order_date | string(date) | RW |  |  | Siparis tarihi (resmilestirmek icin order_no dolu ise bu alan zorunludur) |
| shipment_addres | string | RW |  |  |  |
| shipment_included | boolean | RW |  |  | Irsaliyeli fatura |
| cash_sale | boolean | RW |  |  | Pesin satis |
| payer_tax_numbers | array<string> | RW |  |  | Kamu faturalari icin zorunludur. |
| invoice_note | string | RW |  |  | Fatura notu |
| append_contact_balance | boolean | RW |  |  | Musteri bakiyeniz faturaya eklenecektir. |
| e_document_accounts | array<Number> | RW |  |  | Bu alana hesap ID'leri eklenebilir. |

Relationships of SalesInvoice (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| category | one | item_categories |
| contact | one | contacts |
| details | many | sales_invoice_details |
| payments | many | payments |
| tags | many | tags |
| sales_offer | one | sales_offers |
| sharings | many | sharings |
| recurrence_plan | one | recurrence_plans |
| active_e_document | one | e_archives, e_invoices |

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 9 operation(s)): POST /{company_id}/sales_invoices (createSalesInvoice); PUT /{company_id}/sales_invoices/{id} (updateSalesInvoice); DELETE /{company_id}/sales_invoices/{id} (deleteSalesInvoice); POST /{company_id}/sales_invoices/{id}/payments (paySalesInvoice); DELETE /{company_id}/sales_invoices/{id}/cancel (cancelSalesInvoice); PATCH /{company_id}/sales_invoices/{id}/recover (recoverSalesInvoice); PATCH /{company_id}/sales_invoices/{id}/archive (archiveSalesInvoice); PATCH /{company_id}/sales_invoices/{id}/unarchive (unarchiveSalesInvoice); PATCH /{company_id}/sales_invoices/{id}/convert_to_invoice (convertEstimateToInvoice)

#### R03 Contacts

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "Contacts").
- Vendor group (x-tagGroups): Satislar + Giderler. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): customers and suppliers (Musteri/Tedarikci).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): contacts (direct-list).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| listContacts | /{company_id}/contacts | name:string; email:string; tax_number:string; tax_office:string; city:string; account_type:string (Available: *customer, supplier*) | default -balance; Sortable parameters - *Available: id, balance, name, email* | page[number]: default 1; Page Number / page[size]: default 15; min 1; max 25; Page Size | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: category, contact_portal, contact_people* | data: array of Contact; included types: [item_categories,contact_portals,contact_people]; meta: ListMeta; other responses: 400,401,403,404,422 |
| showContact | /{company_id}/contacts/{id} | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: category, contact_portal, contact_people* | data: one Contact; included types: [item_categories,contact_portals,contact_people]; meta: none; other responses: 400,401,403,404,422 |

Schema Contact (attributes schema ContactAttributes) - json:api type value(s): contacts; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| balance | number | RO |  |  | Bakiye |
| trl_balance | number | RO |  |  | TL Bakiye |
| usd_balance | number | RO |  |  | USD Bakiye |
| eur_balance | number | RO |  |  | EUR Bakiye |
| gbp_balance | number | RO |  |  | GBP Bakiye |
| created_at | string(date) | RO |  |  | Kayit tarihi |
| updated_at | string(date) | RO |  |  | Son guncelleme tarihi |
| email | string(email) | RW |  |  | E-posta |
| name | string | RW |  | yes | Musteri/tedarikci ismi |
| short_name | string | RW |  |  |  |
| contact_type | string | RW | person, company |  | Tip |
| tax_office | string | RW |  |  | Vergi dairesi |
| tax_number | string | RW |  |  | Vergi numarasi/TC kimlik no |
| district | string | RW |  |  | Ilce |
| postal_code | string | RW |  |  | Posta kodu |
| city | string | RW |  |  | Il |
| country | string | RW |  |  |  |
| address | string | RW |  |  |  |
| phone | string | RW |  |  |  |
| fax | string | RW |  |  |  |
| is_abroad | boolean | RW |  |  | Musteri/tedarikci yurt disi bilgisi |
| archived | boolean | RW |  |  |  |
| iban | string | RW |  |  |  |
| account_type | string | RW | customer, supplier | yes |  |
| untrackable | boolean | RW |  |  | Listelenmemis musteri sonradan listelenebilir hale getirilemez |
| invoicing_preferences | object{e_document_accounts:array<integer>} | RW |  |  |  |

Relationships of Contact (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| category | one | item_categories |
| contact_portal | one | contact_portals |
| contact_people | many | contact_people |

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 5 operation(s)): POST /{company_id}/contacts (createContact); PUT /{company_id}/contacts/{id} (updateContact); DELETE /{company_id}/contacts/{id} (deleteContact); POST /{company_id}/contacts/{id}/contact_debit_transactions (collectFromContact); POST /{company_id}/contacts/{id}/contact_credit_transactions (payToContact)

#### R04 PurchaseBills

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "PurchaseBills").
- Vendor group (x-tagGroups): Giderler. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): purchase bills / supplier invoices (Alis faturasi / gider faturasi).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): purchase_bills (direct-list), purchase_bill_details (nested), payments (nested).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| listPurchaseBills | /{company_id}/purchase_bills | issue_date:string; due_date:string; supplier_id:integer; item_type:string (Available: *purchase_bill, refund, cancelled*); spender_id:integer | default id; Sortable parameters - *Available: id, issue_date, due_date, remaining, remaining_in_trl* | page[number]: default 1; Page Number / page[size]: default 15; min 1; max 25; Page Size | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: category, spender, details, details.product, details.warehouse, payments, payments.transaction, tags, recurrence_plan, active_e_document, pay_to* | data: array of PurchaseBill; included types: [item_categories,employees,contacts,purchase_bill_details,payments,tags,recurrence_plans,e_invoices]; meta: ListMeta; other responses: 400,401,403,404,422 |
| showPurchaseBill | /{company_id}/purchase_bills/{id} | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: category, spender, details, details.product, details.warehouse, payments, payments.transaction, tags, recurrence_plan, active_e_document, pay_to* | data: one PurchaseBill; included types: [item_categories,employees,contacts,purchase_bill_details,payments,tags,recurrence_plans,e_invoices]; meta: none; other responses: 400,401,403,404,422 |

Schema PurchaseBill (attributes schema PurchaseBillAttributes) - json:api type value(s): purchase_bills; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| archived | boolean | RO |  |  |  |
| total_paid | number | RO |  |  |  |
| gross_total | number | RO |  |  |  |
| total_excise_duty | number | RO |  |  |  |
| total_communications_tax | number | RO |  |  |  |
| total_vat | number | RW |  | yes |  |
| total_vat_withholding | number | RO |  |  |  |
| total_discount | number | RO |  |  |  |
| total_invoice_discount | number | RO |  |  |  |
| remaining | number | RO |  |  |  |
| remaining_in_trl | number | RO |  |  |  |
| payment_status | string | RO | paid, overdue, unpaid, partially_paid |  |  |
| is_detailed | boolean | RO |  |  |  |
| sharings_count | integer | RO |  |  |  |
| e_invoices_count | integer | RO |  |  |  |
| remaining_reimbursement | number | RO |  |  |  |
| remaining_reimbursement_in_trl | number | RO |  |  |  |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |
| item_type | string | RW | purchase_bill, cancelled, recurring_purchase_bill, refund | yes |  |
| description | string | RW |  |  |  |
| issue_date | string(date) | RW |  | yes |  |
| due_date | string(date) | RW |  | yes |  |
| invoice_no | string | RW |  |  |  |
| currency | string | RW | TRL, USD, EUR, GBP | yes |  |
| exchange_rate | number | RW |  |  |  |
| net_total | number | RW |  | yes |  |
| withholding_rate | number | RW |  |  |  |
| invoice_discount_type | string | RW | percentage, amount |  |  |
| invoice_discount | number | RW |  |  |  |

Relationships of PurchaseBill (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| category | one | item_categories |
| spender | one | employees |
| supplier | one | contacts |
| details | many | purchase_bill_details |
| payments | many | payments |
| tags | many | tags |
| recurrence_plan | one | recurrence_plans |
| active_e_document | one | e_invoices |
| pay_to | one | contacts, employees |

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 10 operation(s)): POST /{company_id}/purchase_bills#basic (createPurchaseBillBasic); POST /{company_id}/purchase_bills#detailed (createPurchaseBillDetailed); DELETE /{company_id}/purchase_bills/{id} (deletePurchaseBill); PUT /{company_id}/purchase_bills/{id}#basic (updatePurchaseBillBasic); PUT /{company_id}/purchase_bills/{id}#detailed (updatePurchaseBillDetailed); POST /{company_id}/purchase_bills/{id}/payments (payPurchaseBill); DELETE /{company_id}/purchase_bills/{id}/cancel (cancelPurchaseBill); PATCH /{company_id}/purchase_bills/{id}/recover (recoverPurchaseBill); PATCH /{company_id}/purchase_bills/{id}/archive (archivePurchaseBill); PATCH /{company_id}/purchase_bills/{id}/unarchive (unarchivePurchaseBill)

#### R05 BankFees

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "BankFees").
- Vendor group (x-tagGroups): Giderler. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): bank fees (Banka gideri).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): bank_fees (classified unsupported).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| showBankFee | /{company_id}/bank_fees/{id} | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: category, tags* | data: one BankFee; included types: [item_categories,tags]; meta: none; other responses: 400,401,403,404,422 |

Schema BankFee (attributes schema BankFeeAttributes) - json:api type value(s): bank_fees; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| total_paid | number | RO |  |  |  |
| archived | boolean | RO |  |  |  |
| remaining | number | RO |  |  |  |
| remaining_in_trl | number | RO |  |  |  |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |
| description | string | RW |  | yes |  |
| currency | string | RW | TRL, USD, EUR, GBP | yes |  |
| issue_date | string(date) | RW |  | yes |  |
| due_date | string(date) | RW |  | yes |  |
| exchange_rate | number | RW |  |  |  |
| net_total | number | RW |  | yes |  |

Relationships of BankFee (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| category | one | item_categories |
| tags | many | tags |

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 6 operation(s)): POST /{company_id}/bank_fees (createBankFee); PUT /{company_id}/bank_fees/{id} (updateBankFee); DELETE /{company_id}/bank_fees/{id} (deleteBankFee); PATCH /{company_id}/bank_fees/{id}/archive (archiveBankFee); PATCH /{company_id}/bank_fees/{id}/unarchive (unarchiveBankFee); POST /{company_id}/bank_fees/{id}/payments (payBankFee)

#### R06 Salaries

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "Salaries").
- Vendor group (x-tagGroups): Giderler. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): salaries (Maas).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): salaries (direct-list).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| listSalaries | /{company_id}/salaries | due_date:string; issue_date:string; currency:string; remaining:number | default id; Sortable parameters - *Available: id, issue_date, due_date, remaining, description, net_total* | page[number]: default 1; Page Number / page[size]: default 15; min 1; max 25; Page Size | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: category, tags, payments, activities, employee* | data: array of Salary; included types: [employees,item_categories,tags]; meta: ListMeta; other responses: 400,401,403,404,422 |
| showSalary | /{company_id}/salaries/{id} | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: employee, category, tags* | data: one Salary; included types: [employees,item_categories,tags]; meta: none; other responses: 400,401,403,404,422 |

Schema Salary (attributes schema SalaryAttributes) - json:api type value(s): salaries; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| total_paid | number | RO |  |  |  |
| archived | boolean | RO |  |  |  |
| remaining | number | RO |  |  |  |
| remaining_in_trl | number | RO |  |  |  |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |
| description | string | RW |  | yes |  |
| currency | string | RW | TRL, USD, EUR, GBP | yes |  |
| issue_date | string(date) | RW |  | yes |  |
| due_date | string(date) | RW |  | yes |  |
| exchange_rate | number | RW |  |  |  |
| net_total | number | RW |  | yes |  |

Relationships of Salary (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| employee | one | employees |
| category | one | item_categories |
| tags | many | tags |

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 6 operation(s)): POST /{company_id}/salaries (createSalary); PUT /{company_id}/salaries/{id} (updateSalary); DELETE /{company_id}/salaries/{id} (deleteSalary); PATCH /{company_id}/salaries/{id}/archive (archiveSalary); PATCH /{company_id}/salaries/{id}/unarchive (unarchiveSalary); POST /{company_id}/salaries/{id}/payments (paySalary)

#### R07 Taxes

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "Taxes").
- Vendor group (x-tagGroups): Giderler. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): taxes (Vergi).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): taxes (direct-list).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| listTaxes | /{company_id}/taxes | due_date:string; issue_date:string; currency:string; remaining:number | default id; Sortable parameters - *Available: id, issue_date, due_date, remaining, description, net_total* | page[number]: default 1; Page Number / page[size]: default 15; min 1; max 25; Page Size | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: category, tags, payments* | data: array of Tax; included types: [item_categories,tags]; meta: ListMeta; other responses: 400,401,403,404,422 |
| showTax | /{company_id}/taxes/{id} | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: category, tags* | data: one Tax; included types: [item_categories,tags]; meta: none; other responses: 400,401,403,404,422 |

Schema Tax (attributes schema TaxAttributes) - json:api type value(s): bank_fees; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| total_paid | number | RO |  |  |  |
| archived | boolean | RO |  |  |  |
| remaining | number | RO |  |  |  |
| remaining_in_trl | number | RO |  |  |  |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |
| description | string | RW |  | yes |  |
| issue_date | string(date) | RW |  | yes |  |
| due_date | string(date) | RW |  | yes |  |
| net_total | number | RW |  | yes |  |

Relationships of Tax (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| category | one | item_categories |
| tags | many | tags |

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 6 operation(s)): POST /{company_id}/taxes (createTax); PUT /{company_id}/taxes/{id} (updateTax); DELETE /{company_id}/taxes/{id} (deleteTax); PATCH /{company_id}/taxes/{id}/archive (archiveTax); PATCH /{company_id}/taxes/{id}/unarchive (unarchiveTax); POST /{company_id}/taxes/{id}/payments (payTax)

#### R08 Employees

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "Employees").
- Vendor group (x-tagGroups): Giderler. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): employees (Calisan).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): employees (direct-list).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| listEmployees | /{company_id}/employees | name:string; email:string | default -balance; Sortable parameters - *Available: id, balance, name, email* | page[number]: default 1; Page Number / page[size]: default 15; min 1; max 25; Page Size | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: category, managed_by_user, managed_by_user_role* | data: array of Employee; included types: [item_categories,users,user_roles]; meta: ListMeta; other responses: 400,401,403,404,422 |
| showEmployee | /{company_id}/employees/{id} | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: category, managed_by_user, managed_by_user_role* | data: one Employee; included types: [item_categories,users,user_roles]; meta: none; other responses: 400,401,403,404,422 |

Schema Employee (attributes schema EmployeeAttributes) - json:api type value(s): employees; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| balance | number | RO |  |  | Bakiye |
| trl_balance | number | RO |  |  |  |
| usd_balance | number | RO |  |  |  |
| eur_balance | number | RO |  |  |  |
| gbp_balance | number | RO |  |  |  |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |
| name | string | RW |  | yes | Calisan adi soyadi |
| email | string(email) | RW |  |  |  |
| archived | boolean | RW |  |  |  |
| iban | string | RW |  |  |  |

Relationships of Employee (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| category | one | item_categories |
| managed_by_user | one | users |
| managed_by_user_role | one | user_roles |

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 5 operation(s)): POST /{company_id}/employees (createEmployee); PUT /{company_id}/employees/{id} (updateEmployee); DELETE /{company_id}/employees/{id} (deleteEmployee); PATCH /{company_id}/employees/{id}/archive (archiveEmployee); PATCH /{company_id}/employees/{id}/unarchive (unarchiveEmployee)

#### R09 EInvoiceInboxes

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "EInvoiceInboxes").
- Vendor group (x-tagGroups): Resmilestirme. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): e-invoice mailboxes of counterparties (e-Fatura posta kutusu).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): e_invoice_inboxes (direct-list).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| listEInvoiceInboxes | /{company_id}/e_invoice_inboxes | vkn:integer | none documented | page[number]: default 1; Page Number / page[size]: default 15; min 1; max 25; Page Size | none documented | data: array of EInvoiceInbox; included types: []; meta: ListMeta; other responses: 400,401,403,404,422 |

Schema EInvoiceInbox (attributes schema EInvoiceInboxAttributes) - json:api type value(s): e_invoice_inboxes; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| vkn | string | RO |  |  |  |
| e_invoice_address | string | RO |  |  |  |
| name | string | RO |  |  |  |
| inbox_type | string | RO |  |  |  |
| address_registered_at | string(date-time) | RO |  |  |  |
| registered_at | string(date-time) | RO |  |  |  |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |

Relationships of EInvoiceInbox: none published (the schema has no relationships properties).

Documented non-GET methods: none.

#### R10 EArchives

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "EArchives").
- Vendor group (x-tagGroups): Resmilestirme. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): e-archive invoices (e-Arsiv).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): e_archives (classified unsupported).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| showEArchive | /{company_id}/e_archives/{id} | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: sales_invoice* | data: one EArchive; included types: [sales_invoices]; meta: none; other responses: 400,401,403,404,422 |
| showEArchivePdf | /{company_id}/e_archives/{id}/pdf | none documented | none documented | none documented | none documented | data: one EDocumentPdf; included types: []; meta: none; other responses: 400,401,403,404,422 |

Schema EArchive (attributes schema EArchiveAttributes) - json:api type value(s): e_archives; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| uuid | string | RO |  |  |  |
| vkn | string | RO |  |  |  |
| invoice_number | string | RO |  |  |  |
| note | string | RO |  |  |  |
| is_printed | boolean | RO |  |  |  |
| status | string | RO | bounced, sent, printed, legalized |  |  |
| printed_at | string(date-time) | RO |  |  |  |
| cancellable_until | string(date-time) | RO |  |  |  |
| is_signed | boolean | RO |  |  |  |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |

Relationships of EArchive (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| sales_invoice | one | sales_invoices |

Schema EDocumentPdf (attributes schema EDocumentPdfAttributes) - json:api type value(s): e_document_pdfs; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| url | string | RO |  |  |  |
| expires_at | string(date-time) | RO |  |  |  |

Relationships of EDocumentPdf: none published (the schema has no relationships properties).

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 1 operation(s)): POST /{company_id}/e_archives (createEArchive)

#### R11 EInvoices

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "EInvoices").
- Vendor group (x-tagGroups): Resmilestirme. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): e-invoices (e-Fatura).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): e_invoices (direct-list).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| showEInvoice | /{company_id}/e_invoices/{id} | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: invoice* | data: one EInvoice; included types: [sales_invoices,purchase_bills]; meta: none; other responses: 400,401,403,404,422 |
| showEInvoicePdf | /{company_id}/e_invoices/{id}/pdf | none documented | none documented | none documented | none documented | data: one EDocumentPdf; included types: []; meta: none; other responses: 400,401,403,404,422 |

Schema EInvoice (attributes schema EInvoiceAttributes) - json:api type value(s): e_invoices; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| external_id | string | RO |  |  |  |
| uuid | string | RO |  |  |  |
| env_uuid | string | RO |  |  |  |
| from_address | string | RO |  |  |  |
| from_vkn | string | RO |  |  |  |
| to_address | string | RO |  |  |  |
| to_vkn | string | RO |  |  |  |
| direction | string | RO | inbound, outbound |  |  |
| note | string | RO |  |  |  |
| response_type | string | RO | accepted, rejected, refunded |  |  |
| contact_name | string | RO |  |  |  |
| scenario | string | RO | basic, commercial |  |  |
| status | string | RO | waiting, failed, successful |  |  |
| gtb_ref_no | string | RO |  |  | GTB Referans Numarasi |
| gtb_registration_no | string | RO |  |  | Gumruk Cikis Beyannamesi Tescil Numarasi - *Ihracat faturalari icin Satis Faturasi Show cevabinda `active_e_document` altinda gozukur.* |
| gtb_export_date | string(date) | RO |  |  | Fiili Ihracat Tarihi - *Ihracat faturalari icin Satis Faturasi Show cevabinda `active_e_document` altinda gozukur.* |
| response_note | string | RO |  |  | e-Ihracat Red Sebebi - *Ihracat faturalari icin Satis Faturasi Show cevabinda `active_e_document` altinda gozukur.* |
| issue_date | string(date) | RO |  |  |  |
| is_expired | boolean | RO |  |  |  |
| is_answerable | boolean | RO |  |  |  |
| net_total | number | RO |  |  |  |
| currency | string | RO | TRL, USD, EUR, GBP |  |  |
| item_type | string | RO | refund, invoice |  |  |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |

Relationships of EInvoice (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| invoice | one | sales_invoices, purchase_bills |

Schema EDocumentPdf: already catalogued in an earlier row (attributes and relationships identical; see the first row that lists it).

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 1 operation(s)): POST /{company_id}/e_invoices (createEInvoice)

#### R12 ESmms

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "ESmms").
- Vendor group (x-tagGroups): Resmilestirme. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): e-receipts for self-employed (e-SMM, e-Makbuz).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): e_smms (classified unsupported).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| showESmm | /{company_id}/e_smms/{id} | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: sales_invoice* | data: one ESmm; included types: []; meta: none; other responses: 400,401,403,404,422 |
| showESmmPdf | /{company_id}/e_smms/{id}.pdf | none documented | none documented | none documented | none documented | data: one EDocumentPdf; included types: []; meta: none; other responses: 400,401,403,404,422 |

Schema ESmm (attributes schema ESmmAttributes) - json:api type value(s): e_smms; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |
| printed_at | string(date) | RO |  |  |  |
| uuid | string | RO |  |  |  |
| vkn | string | RO |  |  |  |
| invoice_number | number | RO |  |  |  |
| is_printed | boolean | RO |  |  |  |
| pdf_url | string | RO |  |  |  |

Relationships of ESmm (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| sales_invoice | one | sales_invoices |

Schema EDocumentPdf: already catalogued in an earlier row (attributes and relationships identical; see the first row that lists it).

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 1 operation(s)): POST /{company_id}/e_smms (createESmm)

#### R13 Accounts

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "Accounts").
- Vendor group (x-tagGroups): Nakit. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): cash/bank accounts (Hesap).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): accounts (direct-list).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| listAccounts | /{company_id}/accounts | name:string; currency:string; bank_name:string; bank_branch:string; account_type:string; iban:string | default -id; Sortable parameters - *Available: id, balance, balance_in_trl* | page[number]: default 1; Page Number / page[size]: default 15; min 1; max 25; Page Size | none documented | data: array of Account; included types: []; meta: ListMeta; other responses: 400,401,403,404,422 |
| showAccount | /{company_id}/accounts/{id} | none documented | none documented | none documented | none documented | data: one Account; included types: []; meta: none; other responses: 400,401,403,404,422 |
| listAccountTransactions | /{company_id}/accounts/{id}/transactions | date:string | default id; Sortable parameters - *Available: id* | page[number]: default 1; Page Number / page[size]: default 15; min 1; max 25; Page Size | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: debit_account, credit_account* | data: array of Transaction; included types: [accounts,payments]; meta: ListMeta; other responses: 400,401,403,404,422 |

Schema Account (attributes schema AccountAttributes) - json:api type value(s): accounts; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| used_for | string | RO |  |  |  |
| last_used_at | string(date-time) | RO |  |  |  |
| balance | number | RO |  |  | Bakiye |
| last_adjustment_date | string(date-time) | RO |  |  |  |
| bank_integration_type | string | RO |  |  |  |
| associate_email | string | RO |  |  |  |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |
| name | string | RW |  | yes | Hesap ismi |
| currency | string | RW | TRL, USD, EUR, GBP |  | Doviz cinsi |
| account_type | string | RW | cash, bank, sys |  | Hesap tipi |
| bank_name | string | RW |  |  | Banka ismi |
| bank_branch | string | RW |  |  | Banka subesi |
| bank_account_no | string | RW |  |  | Banka hesap no |
| iban | string | RW |  |  | IBAN |
| archived | boolean | RW |  |  |  |

Relationships of Account: none published (the schema has no relationships properties).

Schema Transaction (attributes schema TransactionAttributes) - json:api type value(s): transactions; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |
| description | string | RW |  |  | Aciklama |
| transaction_type | string | RW |  |  | Islem turu |
| date | string(date) | RW |  |  | Tarih |
| amount_in_trl | number | RW |  |  | TRL karsiligi meblag |
| debit_amount | number | RW |  |  | Borc meblag |
| debit_currency | string | RW | TRL, USD, EUR, GBP |  | Borc doviz cinsi |
| credit_amount | number | RW |  |  | Alacak meblag |
| credit_currency | string | RW | TRL, USD, EUR, GBP |  | Alacak doviz cinsi |

Relationships of Transaction (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| debit_account | one | accounts |
| credit_account | one | accounts |
| payments | many | payments |

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 5 operation(s)): POST /{company_id}/accounts (createAccount); PUT /{company_id}/accounts/{id} (updateAccount); DELETE /{company_id}/accounts/{id} (deleteAccount); POST /{company_id}/accounts/{id}/debit_transactions (createDebitTransaction); POST /{company_id}/accounts/{id}/credit_transactions (createCreditTransaction)

#### R14 Transactions

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "Transactions").
- Vendor group (x-tagGroups): Nakit. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): cash transactions (Islem).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): transactions (nested).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| showTransaction | /{company_id}/transactions/{id} | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: debit_account, credit_account, payments* | data: one Transaction; included types: [accounts,payments]; meta: none; other responses: 400,401,403,404,422 |

Schema Transaction: already catalogued in an earlier row (attributes and relationships identical; see the first row that lists it).

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 1 operation(s)): DELETE /{company_id}/transactions/{id} (deleteTransaction)

#### R15 Products

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "Products").
- Vendor group (x-tagGroups): Stok. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): products/services (Urun).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): products (direct-list).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| listProducts | /{company_id}/products | name:string; code:string | default -id; Sortable parameters - *Available: id, name* | page[number]: default 1; Page Number / page[size]: default 15; min 1; max 25; Page Size | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: inventory_levels, category* | data: array of Product; included types: [inventory_levels,item_categories]; meta: ListMeta; other responses: 400,401,403,404,422 |
| showProduct | /{company_id}/products/{id} | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: inventory_levels, category* | data: one Product; included types: [inventory_levels,item_categories]; meta: none; other responses: 400,401,403,404,422 |

Schema Product (attributes schema ProductAttributes) - json:api type value(s): products; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| sales_excise_duty_code | string | RO |  |  |  |
| sales_invoice_details_count | integer | RO |  |  |  |
| purchase_invoice_details_count | integer | RO |  |  |  |
| list_price_in_trl | number | RO |  |  |  |
| buying_price_in_trl | number | RO |  |  |  |
| stock_count | number | RO |  |  | Stok Miktari |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |
| code | string | RW |  |  | Urun/hizmet kodu |
| name | string | RW |  | yes | Urun/hizmet ismi |
| vat_rate | number | RW |  |  | KDV orani |
| sales_excise_duty | number | RW |  |  | Satis OTV |
| sales_excise_duty_type | string | RW |  |  | Satis OTV tipi |
| purchase_excise_duty | number | RW |  |  | Alis OTV |
| purchase_excise_duty_type | string | RW |  |  | Alis OTV tipi |
| unit | string | RW |  |  | Birim |
| communications_tax_rate | number | RW |  |  | OIV orani |
| archived | boolean | RW |  |  |  |
| list_price | number | RW |  |  | Satis fiyati |
| currency | string | RW |  |  | Satis doviz |
| buying_price | number | RW |  |  | Alis fiyati |
| buying_currency | string | RW |  |  | Alis doviz |
| inventory_tracking | boolean | RW |  |  |  |
| initial_stock_count | number | RW |  |  | Baslangic Stok Miktari. Birden fazla deponuz varsa baslangic stok miktarini, depo stok seviyesi (inventory_level) relationship'i uzerinden depo bazinda gondermelisiniz. |
| gtip | string(number) | RW |  |  | Urunun GTIP kodu - *https://uygulama.gtb.gov.tr/Tara adresinden ogrenebilirsiniz* |
| barcode | string | RW |  |  |  |

Relationships of Product (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| inventory_levels | one | inventory_levels |
| category | one | item_categories |

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 3 operation(s)): POST /{company_id}/products (createProduct); PUT /{company_id}/products/{id} (updateProduct); DELETE /{company_id}/products/{id} (deleteProduct)

#### R16 Warehouses

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "Warehouses").
- Vendor group (x-tagGroups): Stok. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): warehouses (Depo).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): warehouses (direct-list).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| listWarehouses | /{company_id}/warehouses | name:string; archived:boolean | default -id; Sortable parameters - *Available: id, name* | page[number]: default 1; Page Number / page[size]: default 15; min 1; max 25; Page Size | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: inventory_levels* | data: array of Warehouse; included types: [inventory_levels]; meta: ListMeta; other responses: 400,401,403,404,422 |
| showWarehouse | /{company_id}/warehouses/{id} | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: inventory_levels* | data: one Warehouse; included types: [inventory_levels]; meta: none; other responses: 400,401,403,404,422 |

Schema Warehouse (attributes schema WarehouseAttributes) - json:api type value(s): warehouses; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |
| name | string | RW |  | yes | Depo Ismi |
| address | string | RW |  |  | Adres |
| city | string | RW |  |  | Il |
| district | string | RW |  |  | Ilce |
| is_abroad | boolean | RW |  |  | Yurt disinda |
| archived | boolean | RW |  |  | Arsivlenme durumu |

Relationships of Warehouse (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| inventory_levels | one | inventory_levels |

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 3 operation(s)): POST /{company_id}/warehouses (createWarehouse); PUT /{company_id}/warehouses/{id} (updateWarehouse); DELETE /{company_id}/warehouses/{id} (deleteWarehouse)

#### R17 ShipmentDocuments

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "ShipmentDocuments").
- Vendor group (x-tagGroups): Stok. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): delivery notes (Irsaliye).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): shipment_documents (direct-list).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| listShipmentDocuments | /{company_id}/shipment_documents | flow_type:string; invoice_status:string; archived:boolean | default id; Sortable parameters - *Available: id, issue_date, description, inflow* | page[number]: default 1; Page Number / page[size]: default 15; min 1; max 25; Page Size | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: contact, stock_movements, stock_movements.product, tags, invoices* | data: array of ShipmentDocument; included types: [contacts,tags,stock_movements,sales_invoices,purchase_bills]; meta: ListMeta; other responses: 400,401,403,404,422 |
| showShipmentDocument | /{company_id}/shipment_documents/{id} | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: contact, stock_movements, stock_movements.product, tags, invoices* | data: one ShipmentDocument; included types: [contacts,tags,stock_movements,sales_invoices,purchase_bills]; meta: none; other responses: 400,401,403,404,422 |

Schema ShipmentDocument (attributes schema ShipmentDocumentAttributes) - json:api type value(s): shipment_documents; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| archived | boolean | RO |  |  | Arsivlenme durumu |
| invoice_no | string | RO |  |  | Yazdirmaya ozel fatura numarasi |
| print_note | string | RO |  |  | Yazdirmaya ozel not |
| printed_at | string(date-time) | RO |  |  | Yazdirilma tarihi |
| created_at | string(date) | RO |  |  | Kayit tarihi |
| updated_at | string(date) | RO |  |  | Son guncelleme tarihi |
| inflow | boolean | RW |  |  | Irsaliye tipi |
| description | string | RW |  |  | Irsaliye aciklamasi |
| city | string | RW |  |  | Il |
| district | string | RW |  |  | Ilce |
| address | string | RW |  |  | Adres |
| issue_date | string(date) | RW |  | yes | Duzenleme tarihi |
| shipment_date | string(date-time) | RW |  |  | Fiili sevk tarihi |
| procurement_number | string | RW |  |  | Irsaliye Numarasi |

Relationships of ShipmentDocument (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| contact | one | contacts |
| tags | many | tags |
| stock_movements | many | stock_movements |
| invoices | many | sales_invoices, purchase_bills |

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 3 operation(s)): POST /{company_id}/shipment_documents (createShipmentDocument); PUT /{company_id}/shipment_documents/{id} (updateShipmentDocument); DELETE /{company_id}/shipment_documents/{id} (deleteShipmentDocument)

#### R18 StockMovements

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "StockMovements").
- Vendor group (x-tagGroups): Stok. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): stock movements (Stok hareketi).
- Operation description (S2, listStockMovements): Tum stok hareketlerini listeler. Her irsaliye olusturulurken stok hareketi de olusturulur. Buna ilave olarak, irsaliyeli satis faturasi veya irsaliyeli alis faturasi olusturuldugunda stok takibi yapilan bir urun iceren her fatura kalemine karsilik otomatik olarak bir stok hareketi olusur.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): stock_movements (classified unsupported).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| listStockMovements | /{company_id}/stock_movements | none documented | default id; Sortable parameters - *Available: id, date* | page[number]: default 1; Page Number / page[size]: default 15; min 1; max 25; Page Size | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: product, source, contact, warehouse* | data: array of StockMovement; included types: [warehouses,products,shipment_documents,sales_invoice_details,purchase_bill_details,contacts]; meta: ListMeta; other responses: 400,401,403,404,422 |

Schema StockMovement (attributes schema StockMovementAttributes) - json:api type value(s): stock_movements; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| detail_no | number | RO |  |  | Detay sira no |
| date | string(date) | RO |  |  | Hareket tarihi |
| created_at | string(date) | RO |  |  | Kayit tarihi |
| updated_at | string(date) | RO |  |  | Son guncelleme tarihi |
| quantity | number | RW |  | yes | Miktar |

Relationships of StockMovement (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| warehouse | one | warehouses |
| product | one | products |
| source | one | shipment_documents, sales_invoice_details, purchase_bill_details |
| contact | one | contacts |

Documented non-GET methods: none.

#### R19 InventoryLevels

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "InventoryLevels").
- Vendor group (x-tagGroups): Stok. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): stock levels per warehouse (Stok seviyesi).
- Operation description (S2, listInventoryLevels): Urunun varolan depolardaki tum stok seviyelerini listeler.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): inventory_levels (nested).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| listInventoryLevels | /{company_id}/product/{product_id}/inventory_levels | warehouses.name:string (Sonuclarin filtrelenmesini istediginiz depo ismi.); archived:boolean; has_stock:boolean; stock_count:number | default id; Sortable parameters - *Available: id, stock_count* | page[number]: default 1; Page Number / page[size]: default 15; min 1; max 25; Page Size | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: product, warehouse* | data: array of InventoryLevel; included types: [products,warehouses]; meta: ListMeta; other responses: 400,401,403,404,422 |

Schema InventoryLevel (attributes schema InventoryLevelAttributes) - json:api type value(s): inventory_levels; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |
| stock_count | number | RO |  |  | Stok Miktari |
| initial_stock_count | number | RW |  |  | Baslangic Stok Miktari |
| critical_stock_count | number | RW |  |  |  |

Relationships of InventoryLevel (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| product | one | products |
| warehouse | one | warehouses |

Documented non-GET methods: none.

#### R20 StockUpdates

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "StockUpdates").
- Vendor group (x-tagGroups): Stok. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): stock updates (Stok guncelleme).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): stock_updates (classified unsupported), stock_update_details (nested).

Documented read operations (GET): none. NOT SPECIFIED: no way to read this entity is documented.

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 1 operation(s)): POST /{company_id}/stock_updates (createStockUpdate)

#### R21 ItemCategories

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "ItemCategories").
- Vendor group (x-tagGroups): Ayarlar. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): categories (Kategori).
- Operation description (S2, showItemCategory): Ayrintisini gormek istediginiz kategorinin id'sini gondererek gerekli bilgilere ulasabilirsiniz.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): item_categories (direct-list).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| listItemCategories | /{company_id}/item_categories | name:string; category_type:string | default id; Sortable parameters - *Available: id, name, category_type* | page[number]: default 1; Page Number / page[size]: default 15; min 1; max 25; Page Size | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: parent_category, subcategories* | data: array of ItemCategory; included types: [item_categories]; meta: ListMeta; other responses: 400,401,403,404,422 |
| showItemCategory | /{company_id}/item_categories/{id} | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: parent_category, subcategories* | data: one ItemCategory; included types: [item_categories]; meta: none; other responses: 400,401,403,404,422 |

Schema ItemCategory (attributes schema ItemCategoryAttributes) - json:api type value(s): item_categories; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| full_path | string | RO |  |  |  |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |
| name | string | RW |  | yes | Kategori adi |
| bg_color | string | RW |  |  | Renk |
| text_color | string | RW |  |  | Yazi rengi |
| category_type | string | RW | Product, Contact, Employee, SalesInvoice, Expenditure | yes | Kategori tipi |
| parent_id | integer | RW |  |  |  |

Relationships of ItemCategory (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| parent_category | one | item_categories |
| subcategories | many | item_categories |

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 3 operation(s)): POST /{company_id}/item_categories (createItemCategory); PUT /{company_id}/item_categories/{id} (updateItemCategory); DELETE /{company_id}/item_categories/{id} (deleteItemCategory)

#### R22 Tags

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "Tags").
- Vendor group (x-tagGroups): Ayarlar. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): tags (Etiket).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): tags (direct-list).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| listTags | /{company_id}/tags | none documented | default id; Sortable parameters - *Available: id, name* | page[number]: default 1; Page Number / page[size]: default 15; min 1; max 25; Page Size | none documented | data: array of Tag; included types: []; meta: ListMeta; other responses: 400,401,403,404,422 |
| showTag | /{company_id}/tags/{id} | none documented | none documented | none documented | none documented | data: one Tag; included types: []; meta: none; other responses: 400,401,403,404,422 |

Schema Tag (attributes schema TagAttributes) - json:api type value(s): tags; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |
| name | string | RW |  | yes | Etiket adi |

Relationships of Tag: none published (the schema has no relationships properties).

Documented non-GET methods - OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY (listed only; not explored; 3 operation(s)): POST /{company_id}/tags (createTag); PUT /{company_id}/tags/{id} (updateTag); DELETE /{company_id}/tags/{id} (deleteTag)

#### R23 ApiHome

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "ApiHome").
- Vendor group (x-tagGroups): Diger. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): current user, profile, companies and roles (/me).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): none reported.

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| showMe | /me | none documented | none documented | none documented | Response ile birlikte geri donmesini istediginiz iliskiler - *Available: user_roles, companies, profile* | data: one Me; included types: [user_roles,companies,profiles]; meta: none; other responses: 400,401,403,404,422 |

Schema Me (attributes schema MeAttributes) - json:api type value(s): users; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| name | string | RO |  |  |  |
| email | string(email) | RO |  |  |  |
| is_confirmed | boolean | RO |  |  |  |

Relationships of Me (as published):

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| user_roles | many | user_roles |
| companies | many | companies |
| profile | one | profiles |

Documented non-GET methods: none.

#### R24 TrackableJobs

- Evidence label: DOCUMENTATION ONLY (source S2, swagger.json; tag "TrackableJobs").
- Vendor group (x-tagGroups): Diger. Tag description published: none. Name gloss (translation aid, NOT a vendor definition): asynchronous job status (Trackable job).
- Operation descriptions published: none. Entity purpose beyond the name and group is NOT SPECIFIED.
- Legacy mirror (LEGACY / UNVALIDATED, from the Stage B evidence and the legacy resource declaration): trackable_jobs (nested).

Documented read operations (GET):

| operationId | Path | Filters (query) | Sort | Pagination | Include (doc text) | Response 200: data / included types / meta |
| ----------- | ---- | --------------- | ---- | ---------- | ------------------ | ------------------------------------------- |
| showTrackableJob | /{company_id}/trackable_jobs/{id} | none documented | none documented | none documented | none documented | data: one TrackableJob; included types: []; meta: none; other responses: 400,401,403,404,422 |

Schema TrackableJob (attributes schema TrackableJobAttributes) - json:api type value(s): trackable_jobs; required keys of the resource object: attributes. Read-only flag (RO/RW) is as published; "Req" is the published required list of the shared attributes schema.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| status | string | RO | running, done, error |  |  |
| errors | array<string> | RO |  |  |  |

Relationships of TrackableJob: none published (the schema has no relationships properties).

Documented non-GET methods: none.

## C1.6 Nested and related entities without a standalone read endpoint

S2 publishes schemas for entities that can only be reached through "include" on a parent read (payments, line items, contact people, companies, roles and others) and names other json:api types for which it publishes no schema at all. The first table lists every type that may appear in an "included" array of a documented read, whether a schema is published for it, and which rows can include it. A type with no published schema is an evidence gap (G-09, DI-06, DI-11).

| json:api type (included) | Published schema | Printed in | Can be included by (tags of the GET operations) |
| ------------------------ | ---------------- | ---------- | ----------------------------------------------- |
| accounts | Account | main catalog (rows R01-R24) | Accounts, Transactions |
| activities | NONE (not published) | no schema published | SalesOffers |
| companies | Company | section C1.6 below | ApiHome |
| contact_people | ContactPerson | section C1.6 below | Contacts |
| contact_portals | NONE (not published) | no schema published | Contacts |
| contacts | Contact | main catalog (rows R01-R24) | PurchaseBills, SalesInvoices, SalesOffers, ShipmentDocuments, StockMovements |
| details | NONE (not published) | no schema published | SalesOffers |
| e_archives | EArchive | main catalog (rows R01-R24) | SalesInvoices |
| e_invoices | EInvoice | main catalog (rows R01-R24) | PurchaseBills, SalesInvoices |
| employees | Employee | main catalog (rows R01-R24) | PurchaseBills, Salaries |
| inventory_levels | InventoryLevel | main catalog (rows R01-R24) | Products, Warehouses |
| item_categories | ItemCategory | main catalog (rows R01-R24) | BankFees, Contacts, Employees, ItemCategories, Products, PurchaseBills, Salaries, SalesInvoices, Taxes |
| payments | Payment | section C1.6 below | Accounts, PurchaseBills, SalesInvoices, Transactions |
| products | Product | main catalog (rows R01-R24) | InventoryLevels, SalesOffers, StockMovements |
| profiles | Profile | section C1.6 below | ApiHome |
| purchase_bill_details | PurchaseBillDetail | section C1.6 below | PurchaseBills, StockMovements |
| purchase_bills | PurchaseBill | main catalog (rows R01-R24) | EInvoices, ShipmentDocuments |
| recurrence_plans | NONE (not published) | no schema published | PurchaseBills, SalesInvoices |
| sales_invoice | NONE (not published) | no schema published | SalesOffers |
| sales_invoice_details | SalesInvoiceDetail | section C1.6 below | SalesInvoices, StockMovements |
| sales_invoices | SalesInvoice | main catalog (rows R01-R24) | EArchives, EInvoices, SalesOffers, ShipmentDocuments |
| sales_offers | SalesOffers | main catalog (rows R01-R24) | SalesInvoices |
| sharings | NONE (not published) | no schema published | SalesInvoices, SalesOffers |
| shipment_documents | ShipmentDocument | main catalog (rows R01-R24) | StockMovements |
| stock_movements | StockMovement | main catalog (rows R01-R24) | ShipmentDocuments |
| tags | Tag | main catalog (rows R01-R24) | BankFees, PurchaseBills, Salaries, SalesInvoices, ShipmentDocuments, Taxes |
| user_roles | UserRole | section C1.6 below | ApiHome, Employees |
| users | Me | main catalog (rows R01-R24) | Employees |
| warehouses | Warehouse | main catalog (rows R01-R24) | InventoryLevels, StockMovements |

##### Schema Company (attributes schema CompanyAttributes) - json:api type value(s): companies

Evidence label: DOCUMENTATION ONLY (source S2). No standalone read endpoint is documented for this entity; it is reachable only through include on the parent operations listed in the table above.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| name | string | RO |  |  |  |
| valid_until | string(date) | RO |  |  |  |
| subscription_status | string | RO |  |  |  |
| trial_expiration_at | string(date-time) | RO |  |  |  |
| allowed_inspection_at | string(date-time) | RO |  |  |  |
| app_url | string | RO |  |  |  |
| legal_name | string | RO |  |  |  |
| occupation_field | string | RO |  |  |  |
| district | string | RO |  |  |  |
| city | string | RO |  |  |  |
| tax_office | string | RO |  |  |  |
| tax_number | string | RO |  |  |  |
| mersis_no | string | RO |  |  |  |
| total_unused_bonus_months | number | RO |  |  |  |
| subscription_started_at | string(date) | RO |  |  |  |
| subscription_renewed_at | string(date) | RO |  |  |  |
| subscription_value | number | RO |  |  |  |
| primary_job | string | RO |  |  |  |
| is_active | boolean | RO |  |  |  |
| accessible | boolean | RO |  |  |  |
| inspectable | boolean | RO |  |  |  |
| is_in_grace_period | boolean | RO |  |  |  |
| subscription_status_for_analytics | string | RO |  |  |  |
| end_of_grace_period_at | string(date) | RO |  |  |  |
| inventory_enabled | boolean | RO |  |  |  |
| is_in_trial_period | boolean | RO |  |  |  |
| has_iyzico_integration | boolean | RO |  |  |  |
| has_active_subscription | boolean | RO |  |  |  |
| logo | object{url:string,is_processing:boolean} | - |  |  |  |
| subscription_info_text | string | RO |  |  |  |
| subscription_info_title | string | RO |  |  |  |
| subscription_url | string | RO |  |  |  |
| referral_url | string | RO |  |  |  |
| subscription_plan_duration | number | RO |  |  |  |
| subscription_plan_name | string | RO |  |  |  |
| e_invoicing_activated_at | string(date-time) | RO |  |  |  |
| has_selected_plan | boolean | RO |  |  |  |

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| default_warehouse | one | warehouses |
| owner | one | users |
| address | one | addresses |

##### Schema ContactPerson (attributes schema ContactPersonAttributes) - json:api type value(s): contact_people

Evidence label: DOCUMENTATION ONLY (source S2). No standalone read endpoint is documented for this entity; it is reachable only through include on the parent operations listed in the table above.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |
| name | string | RW |  |  |  |
| email | string(email) | RW |  |  |  |
| phone | string | RW |  |  |  |
| notes | string | RW |  |  |  |

Relationships: none published.

##### Schema Payment (attributes schema PaymentAttributes) - json:api type value(s): payments

Evidence label: DOCUMENTATION ONLY (source S2). No standalone read endpoint is documented for this entity; it is reachable only through include on the parent operations listed in the table above.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |
| date | string(date) | RW |  |  | Odeme tarihi |
| amount | number | RW |  |  | Odeme tutari |
| currency | number | RW |  |  | Para birimi |
| notes | string | RW |  |  |  |

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| payable | one | sales_invoices, purchase_bills, taxes, bank_fees, salaries, checks |
| transaction | one | transactions |

##### Schema Profile (attributes schema ProfileAttributes) - json:api type value(s): profiles

Evidence label: DOCUMENTATION ONLY (source S2). No standalone read endpoint is documented for this entity; it is reachable only through include on the parent operations listed in the table above.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| phone | string | RO |  |  |  |
| job_title | string | RO |  |  |  |
| avatar | object{url:string,is_processing:boolean} | - |  |  |  |

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| user | one | users |

##### Schema PurchaseBillDetail (attributes schema PurchaseBillDetailAttributes) - json:api type value(s): purchase_bill_details

Evidence label: DOCUMENTATION ONLY (source S2). No standalone read endpoint is documented for this entity; it is reachable only through include on the parent operations listed in the table above.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| net_total | number | RO |  |  |  |
| vat_withholding | number | RO |  |  |  |
| created_at | string(date) | RO |  |  |  |
| updated_at | string(date) | RO |  |  |  |
| quantity | number | RW |  | yes |  |
| unit_price | number | RW |  | yes |  |
| vat_rate | number | RW |  | yes |  |
| vat_withholding_rate | number | RW |  |  |  |
| discount_type | string | RW | percentage, amount |  |  |
| discount_value | number | RW |  |  |  |
| excise_duty_type | string | RW | percentage, amount |  |  |
| excise_duty_value | number | RW |  |  |  |
| communications_tax_rate | number | RW |  |  |  |
| description | string | RW |  |  |  |

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| warehouse | one | warehouses |
| product | one | products |

##### Schema SalesInvoiceDetail (attributes schema SalesInvoiceDetailAttributes) - json:api type value(s): sales_invoice_details

Evidence label: DOCUMENTATION ONLY (source S2). No standalone read endpoint is documented for this entity; it is reachable only through include on the parent operations listed in the table above.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| net_total | number | RO |  |  | Urun/hizmet net tutari |
| vat_withholding | number | RO |  |  | Tevkifat |
| created_at | string(date) | RO |  |  | Kayit tarihi |
| updated_at | string(date) | RO |  |  | Son guncelleme tarihi |
| quantity | number | RW |  | yes | Miktar |
| unit_price | number | RW |  | yes | Birim fiyati |
| vat_rate | number | RW |  | yes | KDV orani |
| vat_withholding_rate | number | RW |  |  | Tevkifat orani |
| discount_type | string | RW | percentage, amount |  | Indirim turu |
| discount_value | number | RW |  |  |  |
| excise_duty_type | string | RW | percentage, amount |  | OTV tipi |
| excise_duty_value | number | RW |  |  |  |
| communications_tax_rate | number | RW |  |  | OIV orani |
| description | string | RW |  |  | Aciklama |
| delivery_method | string | RW | CFR, CIF, CIP, CPT, DAF, DAP, DPU, DDP, DDU, DEQ, DES, EXW, FAS, FCA, FOB |  | Teslim Sarti |
| shipping_method | string | RW | Denizyolu, Demiryolu, Karayolu, Havayolu, Posta, Cok aracli, Sabit tasima tesisleri, Ic su tasimaciligi |  | Gonderim Sekli |

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| warehouse | one | warehouses |
| product | one | products |

##### Schema UserRole (attributes schema UserRoleAttributes) - json:api type value(s): user_roles

Evidence label: DOCUMENTATION ONLY (source S2). No standalone read endpoint is documented for this entity; it is reachable only through include on the parent operations listed in the table above.

| Attribute | Type (as published) | RO/RW | Allowed values (enum) | Req | Description (S2, transliterated) |
| --------- | ------------------- | ----- | --------------------- | --- | -------------------------------- |
| sales_invoices | string | RO | rw, ro, na |  |  |
| expenditures | string | RO | rw, ro, na |  |  |
| own_expenditures | string | RO | rw, ro, na |  |  |
| employees | string | RO | rw, ro, na |  |  |
| accounts | string | RO | rw, ro, na |  |  |
| settings | string | RO | rw, ro, na |  |  |

| Relationship | Cardinality | Target json:api type(s) |
| ------------ | ----------- | ----------------------- |
| company | one | companies |
| user | one | users |
| managed_employee | one | employees |

## C1.7 Legacy cross-reference (LEGACY / UNVALIDATED - static historical evidence only)

Sources of this section: the Stage B report and addendum (L-09 to L-12, MAP-01, MAP-02, MAP-09, MIG-01, FIN-05, FIN-06, CHK-04), and three narrow legacy declarations read in C1 only to name mirrors and routes: server/parasut/resource-registry.ts (resource list, classification, endpoint segments), server/parasut/sync-checks.ts line 14 and server/parasut/sync-transaction-history.ts line 83 (one route declaration each). Statements such as "verified live" inside those files are legacy claims; C1 did not and could not check them. Nothing here validates, endorses or reuses legacy logic. "Classification" is the legacy author's own label (direct-list, nested, unsupported).

### C1.7.1 Legacy mirror tables against the official publication

| Legacy mirror table | Legacy classification (declared) | Official counterpart in S2 | Read route published in S2 | Static observation |
| ------------------- | -------------------------------- | -------------------------- | -------------------------- | ------------------ |
| contacts | direct-list (collection route) | R03 Contacts | list and show | Consistent with S2 |
| products | direct-list | R15 Products | list and show | Consistent |
| accounts | direct-list | R13 Accounts | list and show (plus per-account transactions) | Consistent |
| sales_invoices | direct-list | R02 SalesInvoices | list and show | Route published. Whether the legacy request sets item_type is not known here (the documented default hides some types: G-05); C3 must trace it |
| purchase_bills | direct-list | R04 PurchaseBills | list and show | Consistent |
| sales_invoice_details | nested (include=details) | SalesInvoiceDetail (C1.6) | via include only | Consistent with S2 (no standalone read) |
| purchase_bill_details | nested | PurchaseBillDetail (C1.6) | via include only | Consistent |
| payments | nested | Payment (C1.6) | via include only | Consistent. The legacy registry types payments.currency as numeric (addendum MAP-02); S2 itself types Payment.currency as number (DI-03), which is the likely origin (INFERRED [H]) |
| e_invoices | direct-list (collection route) | R11 EInvoices | show and PDF only; NO collection read published | Legacy-used collection route is absent from S2 (G-09) |
| e_invoice_inboxes | direct-list | R09 EInvoiceInboxes | list | Consistent |
| employees | direct-list | R08 Employees | list and show | Legacy claims live fields beyond the 11 published (G-10) |
| item_categories | direct-list | R21 ItemCategories | list and show | Consistent |
| salaries | direct-list | R06 Salaries | list and show | Consistent |
| sales_offers | direct-list | R01 SalesOffers | list, show, details | Consistent |
| shipment_documents | direct-list | R17 ShipmentDocuments | list and show | Consistent |
| tags | direct-list | R22 Tags | list and show | Consistent |
| taxes | direct-list | R07 Taxes | list and show | Consistent |
| warehouses | direct-list | R16 Warehouses | list and show | Consistent |
| bank_fees | unsupported (legacy says the collection route answered 404) | R05 BankFees | show only; NO collection read published | The legacy premise that S2 documents a collection read is not borne out by the current S2; the 404 is consistent with an unpublished route (INFERRED [M-H]; no documentation change is recorded in S4 between 2026-02-26 and the legacy's July 2026 run) |
| e_archives | unsupported (404 claimed) | R10 EArchives | show and PDF only | Same observation as bank_fees |
| e_smms | unsupported (404 claimed) | R12 ESmms | show and PDF only | Same observation |
| stock_updates | unsupported (404 claimed) | R20 StockUpdates | none (create form only) | Same observation; no read is published at all |
| transactions | nested (company-level collection claimed 404) | R14 Transactions | show by id and per-account list | Consistent with S2: no company-level collection is published |
| stock_movements | unsupported (HTTP 500 claimed) | R18 StockMovements | list | UNKNOWN: S2 publishes the route and is silent about failures (G-12) |
| inventory_levels | nested | R19 InventoryLevels | per-product list | Consistent |
| trackable_jobs | nested | R24 TrackableJobs | show by id | Consistent |
| sales_offers_details | nested | SalesOffersDetails (R01) | /sales_offers/{id}/details and include | A published read path exists |
| stock_update_details | nested | StockUpdateDetail (write form schema only) | none | No read is published |
| checks | direct-list (route GET /v4/{company_id}/checks) | NONE: no schema and no route; "checks" appears only as one possible target type of Payment.payable | NONE | NOT ACCESSIBLE: no official documentation found in S2. Legacy-used route is unpublished (G-09) |
| transaction_history_items | nested (per-contact route .../contacts/{id}/transaction_history_items) | NONE | NONE | NOT ACCESSIBLE: the words history, statement and opening balance do not occur in S2 |
| opening_balances | nested (side-loaded from transaction_history_items) | NONE | NONE | NOT ACCESSIBLE: not in S2 |

### C1.7.2 What the comparison does and does not show

- Of the 31 legacy mirror tables above, 26 have a published counterpart with at least one read route or a read path through include; 2 (stock_updates, stock_update_details) have a published schema but no read; 3 (checks, transaction_history_items, opening_balances) have no official documentation at all.
- Three routes that the legacy sync used (collection of e-invoices, checks, per-contact transaction history) are absent from S2. If they work as the legacy claims, the vendor API does more than it documents; C1 can only record the gap, not the behavior (G-09). Until C2 or the vendor clarifies, they have no contract.
- Statements in S2 that match legacy assumptions (static, not validation): the password grant (DI-14), the 10-requests-per-10-seconds limit (also seen in the Eclipse capture, Stage B E-08), page[size] maximum 25 (the legacy page size), the include option details, and the sales-invoice labels net_total = general total and gross_total = subtotal (Stage B FIN-05). For purchase bills S2 publishes no such labels, so the Stage B question about their VAT basis stays open (G-03).
- The legacy declaration for e-invoices says a 429 response occurred during a sync run (resource-registry.ts line 112; LEGACY / UNVALIDATED). S2 documents no 429 at all (DI-13, G-12), so the throttling response is observed only in legacy claims.
- A legacy count of 401 mapped attributes (addendum MAP-01) was derived from a snapshot of S2 taken on or before 2026-07-23 (the date of the legacy schema expansion that cites it). S4 shows no documentation change after 2026-02-26, so the snapshot is likely the same document (INFERRED [M]); C1 did not re-count against the legacy registry, which belongs to C3.

## C1.8 Evidence gaps and documentation defects

### C1.8.1 Documentation defects and inconsistencies (DI) - observed in the publication text

| ID | Defect or inconsistency (DOCUMENT INCONSISTENCY) | Where in the publication |
| -- | ------------------------------------------------ | ------------------------ |
| DI-01 | The embedded CHANGE LOG has one entry (2021-10-11) and info.version is constantly 4.0.0, while S4 shows documentation changes on 2021-11-01, 2022-12-12, 2023-02-02, 2024-02-22 to 2024-03-07, 2024-10-01 and 2026-02-26. The Amazon change is dated 2021-10-11 in the log and 2021-11-01 in S4 | S2 info.description (top); S4 |
| DI-02 | Schema Tax declares json:api type "bank_fees" | S2 definitions.Tax.properties.type.enum |
| DI-03 | Payment.currency is typed number, while every other currency attribute on documents, accounts and transactions is a string enumerated TRL, USD, EUR, GBP; Product.currency and Product.buying_currency are free strings | S2 definitions.PaymentAttributes, ProductAttributes |
| DI-04 | TrackableJob.status enumerates running, done, error but the prose also lists pending; the attributes have no url although a quote-PDF method description says the URL is read from the job's data > attributes > url | S2 prose (e-document section); definitions.TrackableJobAttributes; operation showSalesOffersPdf |
| DI-05 | Sales invoices: the payment_status filter accepts overdue, not_due, unscheduled, paid; the attribute enumerates paid, overdue, unpaid, partially_paid | S2 listSalesInvoices; definitions.SalesInvoiceAttributes |
| DI-06 | Sales offers: listSalesOffers has no page[size]; showSalesOffersDetails (a single object) has page[size] but no page[number]; included type names differ (sales_invoice in the list, sales_invoices in the show, details, relationship target sales_offer_details versus schema type sales_offers_details); activities and sharings have no schema | S2 listSalesOffers, showSalesOffers, showSalesOffersDetails; definitions.SalesOffers |
| DI-07 | Sort or filter names that are not published attributes: accounts sort balance_in_trl; sales offers sort net_total_in_trl and sales_invoice_id and filters query and invoice_status; sales invoices filter print_status; delivery notes filters flow_type and invoice_status (the attribute is inflow); taxes filter currency (Tax has no currency attribute); inventory levels filters warehouses.name, archived and has_stock | S2 operation parameters against the attribute schemas |
| DI-08 | Product.inventory_levels and Warehouse.inventory_levels are declared as a single relationship although levels exist per product and warehouse | S2 definitions.Product, Warehouse |
| DI-09 | created_at and updated_at are typed "date" (no time of day) in every schema; other timestamps are date-time | S2 attribute schemas |
| DI-10 | Typing and path defects: attribute name "shipment_addres"; e_document_accounts items typed "Number" (not a Swagger 2.0 type name); filter[vkn] typed integer while the vkn attribute is a string; the e-SMM PDF path ends in ".pdf" while the others end in "/pdf"; path ids are integers while resource ids are strings; /me returns json:api type "users" | S2 |
| DI-11 | The include vocabulary (category, contact, details, payments, ...) and the included[].type vocabulary (item_categories, contacts, sales_invoice_details, payments, ...) differ and the mapping is implicit; some include names have no included type enumerated (salaries: payments, activities; taxes: payments) | S2 operation parameters and 200 schemas |
| DI-12 | The prose says almost every operation possible in the web interface can be done through the API, but S2 publishes no read for the collections listed in C1.2 point 2 (CLAIM by the vendor, not borne out by the published routes) | S2 prose (About the API); S2 paths |
| DI-13 | The prose rate limit has no counterpart in the schemas: no 429 response, no Retry-After and no rate-limit headers | S2 prose; every operation's responses |
| DI-14 | securityDefinitions publishes only the authorization-code flow with empty scopes, while the prose also documents the password and refresh_token grants | S2 securityDefinitions; prose (Authentication) |

### C1.8.2 Evidence gaps (G) - NOT SPECIFIED or NOT ACCESSIBLE

| ID | What is not established | Why it matters | Evidence that would resolve it | Earliest stage |
| -- | ----------------------- | -------------- | ------------------------------ | -------------- |
| G-01 | Rate-limit scope and behavior (what is counted, window, headers, 429, penalties, weight of include or PDF reads) | Import throughput and failure handling (Stage B L-10) | Vendor confirmation; header observation during separately authorized reads (no stress testing) | C2, C4 |
| G-02 | Ordering stability, tie-breaks (the contacts and employees default sort is -balance), deep paging, exactness of total_count | Missing or duplicated rows (Stage B FIN-06 class) | Repeated reads of an authorized sample; vendor confirmation | C4 |
| G-03 | Money and amount semantics: VAT basis of net_total and gross_total outside sales invoices, basis of remaining and "_in_trl", exchange-rate direction, balance sign, decimal scale, number versus string | Financial correctness; Stage D gate | Record-level checks against documents and payments; accountant sign-off | C4, C5 |
| G-04 | Time semantics: date versus date-time, time zone, business date | Date-based reports and overdue logic | Samples with known dates; vendor confirmation | C4 |
| G-05 | Lifecycle visibility: whether archived, cancelled, deleted or recurring records appear in default lists; the item_type default of sales invoices; read vocabulary of quote status; state-transition rules | Completeness of any mirror | UI list versus API list comparison; sample covering every item_type | C2, C4 |
| G-06 | Change markers and webhooks: no created or updated filter or sort exists; webhook documentation was added 2023-02-02 and removed from the public documentation 2026-02-26; deletion detection is not described | Design of any incremental import | Vendor confirmation; C2 and C4 observations | C2, C4 |
| G-07 | Permissions and scopes: empty scope list; no endpoint-to-role mapping (rw, ro, na areas exist for the user); effect of role on 403; multi-company access | Least-privilege read-only access (policy: no credential is created now) | Vendor confirmation; role views in the UI; authorized read-only test | C2, C4 |
| G-08 | Plan and feature dependence of endpoints (Company schema publishes subscription and feature attributes) | Explains availability differences | Company settings view; authorized sample | C2, C4 |
| G-09 | Missing read endpoints and unpublished routes: collections of e-invoices, e-archives, e-SMMs, bank fees, payments, stock updates, company-level transactions; checks; statements and transaction history; six types without schema (activities, contact_portals, recurrence_plans, sharings, details, sales_invoice) | Completeness of any read-only import; legacy used three unpublished routes | Passive observation of what the UI itself calls (owner-driven, if authorized); vendor confirmation | C2 |
| G-10 | Fields in live responses beyond the published ones (the legacy declares extra employee fields) and personal-data exposure | Data minimisation | Field-minimised bounded sample; owner decision | C4 |
| G-11 | No sandbox or test environment is documented | Safe verification | Owner and vendor; REQUIRES SAFE TEST ENVIRONMENT | C4 |
| G-12 | Error model: 429, 5xx, machine-readable codes, message language | Robust import and alerting | Observed errors in authorized reads; vendor | C4 |
| G-13 | Identifier semantics: stability, reuse, uniqueness across types | Joins and reconciliation | Record-level comparison | C4 |
| G-14 | Include semantics: depth, size, interaction with paging, cost | Completeness and performance | Authorized sample and timing | C4, C5 |
| G-15 | Delay between a change in the UI and its appearance in the API | Freshness claims | Timed observations | C4, C5 |
| G-16 | Provenance: one constant version, an unmaintained change log, a document that can change without notice | Repeatability | Re-check the S2 hash before each later stage; the owner may decide to archive a hash-verified copy | every stage |

## C1.9 Documented non-GET methods (OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY)

S2 documents 80 operations other than GET: 30 POST, 15 PUT, 18 PATCH, 17 DELETE. They create, change, archive, cancel, recover, delete, pay, collect, convert and e-mail records, issue e-documents, and (for quotes) produce a PDF through POST. Under the current project policy none of them is in scope: they were not explored, no request or response body is recorded here, and no write integration is proposed or implied. Their existence matters to reading only because it signals lifecycle states (archived, cancelled, recurring) whose visibility in reads is NOT SPECIFIED (G-05). Each row block in C1.5 lists its own non-GET methods as method, path and operationId.

Counts per row:

| Row | Tag | POST | PUT | PATCH | DELETE | Total non-GET |
| --- | --- | ---- | --- | ----- | ------ | ------------- |
| R01 | SalesOffers | 3 | 1 | 3 | 1 | 8 |
| R02 | SalesInvoices | 2 | 1 | 4 | 2 | 9 |
| R03 | Contacts | 3 | 1 | 0 | 1 | 5 |
| R04 | PurchaseBills | 3 | 2 | 3 | 2 | 10 |
| R05 | BankFees | 2 | 1 | 2 | 1 | 6 |
| R06 | Salaries | 2 | 1 | 2 | 1 | 6 |
| R07 | Taxes | 2 | 1 | 2 | 1 | 6 |
| R08 | Employees | 1 | 1 | 2 | 1 | 5 |
| R09 | EInvoiceInboxes | 0 | 0 | 0 | 0 | 0 |
| R10 | EArchives | 1 | 0 | 0 | 0 | 1 |
| R11 | EInvoices | 1 | 0 | 0 | 0 | 1 |
| R12 | ESmms | 1 | 0 | 0 | 0 | 1 |
| R13 | Accounts | 3 | 1 | 0 | 1 | 5 |
| R14 | Transactions | 0 | 0 | 0 | 1 | 1 |
| R15 | Products | 1 | 1 | 0 | 1 | 3 |
| R16 | Warehouses | 1 | 1 | 0 | 1 | 3 |
| R17 | ShipmentDocuments | 1 | 1 | 0 | 1 | 3 |
| R18 | StockMovements | 0 | 0 | 0 | 0 | 0 |
| R19 | InventoryLevels | 0 | 0 | 0 | 0 | 0 |
| R20 | StockUpdates | 1 | 0 | 0 | 0 | 1 |
| R21 | ItemCategories | 1 | 1 | 0 | 1 | 3 |
| R22 | Tags | 1 | 1 | 0 | 1 | 3 |
| R23 | ApiHome | 0 | 0 | 0 | 0 | 0 |
| R24 | TrackableJobs | 0 | 0 | 0 | 0 | 0 |
| total | 24 tags | 30 | 15 | 18 | 17 | 80 |

## C1.10 What later stages need from this inventory (nothing below has been started)

| Stage | Evidence it needs that C1 could not provide | Preconditions from the doctrine |
| ----- | ------------------------------------------ | -------------------------------- |
| C2 Authorized web functional analysis | UI default lists and filters against the documented ones (G-05); the routes the UI itself calls, including those S2 does not publish (G-09); role and plan views (G-07, G-08); statement, ledger and payment views; states and empty or error behavior | Stage C gate opened by the owner; explicit read-only Parasut authorization naming the company, modules and navigation; owner-operated passive observation only; REA only if its active tools support the question |
| C3 Legacy failure-path analysis | Static comparison of every legacy request (parameters, page size, include, item_type, sort) with C1; re-trace of the three unpublished routes; the payments.currency typing and the 401-attribute mapping against S2 | Static reading only; legacy logic is never adopted |
| C4 Bounded reconciliation | Sample definition per row; ordering and paging behavior (G-02); amount, balance and currency semantics (G-03); lifecycle visibility (G-05); identifier semantics (G-13); error model (G-12); fields beyond the documentation (G-10) | Separate Parasut read authorization and separate Supabase read authorization with verified environment classification; no writes |
| C5 Financial semantics and performance | Signed evidence ledger over G-03, G-04, G-05; include and paging cost (G-14); freshness (G-15); the vendor confirmations listed in C1.8.2 | Authorized, non-mutating workflows only |
| Stage D | Not approved. Blocked while critical gaps affecting identity, completeness, balances, currency and rate treatment, lifecycle state and source mapping remain open | Owner and accountant sign-off |

Items for the project owner (not answered by C1): whether to open the Stage C gate; whether to ask Parasut support the vendor-confirmation questions of C1.8.2 (C1 sent no message to the vendor); whether to archive a hash-verified copy of S2 as a project record (C1 kept the downloaded copy only in a scratch directory outside the workspace).

## C1.11 Confirmations

No application file changed. Nothing in the two repositories was created, modified or deleted by this task.

| Item | Before C1 (2026-10-14T07:27:01+03:00) | After C1 research (read just before this file was written, 2026-10-14T07:48:57+03:00) |
| ---- | ------------------------------------- | ---------------------------------------------------------------------------- |
| dayandisli-legacy | "## main...origin/main" only; HEAD b1b8070717409fc69deb71ab22400dfed384b432; tree 938c08254df178836140d4de4fe746ea74d4fad1; 775 tracked files; .git\index mtime 2026-10-13T23:01:08+03:00 | identical |
| rea | "## main...origin/main" plus the pre-existing untracked entry "?? tests/fixtures/nativeaot/obj/"; HEAD 9630c8ff46533fe63ec0e06212d01545070d17f0; tree 7c080af43c0df42b4eb4629381c87c713de8dbc7; 3490 tracked files; .git\index mtime 2026-10-13T23:01:01+03:00 | identical |
| rea untracked directory | Present before this task (directory metadata only: created 2026-10-14T06:19:32, modified 06:19:37). Origin unknown. Not opened, listed, altered or cleaned. NOT attributed to this task | unchanged (metadata only) |
| Workspace root | four directories: dayandisli-legacy, dayandisli.com (empty), project-logs, rea | identical |
| Stage B report, Stage B addendum, Stage A checkpoint, doctrine | 75986, 85600, 10510 and 13988 bytes with the SHA-256 values recorded in checkpoint section C1-0 | identical (not edited) |

Final Git status after all deliverables is recorded in section C1-1 of the C1 checkpoint and in ENTRY 0021.

Constraint compliance:
- No source edit, install, build, test, migration, deployment or script run inside the repositories. No REA setup, readiness check, install or tool call.
- No Parasut account, UI, authenticated API data or API host contact (api.parasut.com was never requested, not even with GET); no Supabase; no credential or token used or created; no write path designed, tested, enabled or credentialed.
- Network use was limited to public documentation: HTTP GET of S1, S2 and the S4 Atom feed from the publication hosts (apidocs.parasut.com, github.com); three pages (S3, S4 commit page, S5) read through a fetch tool, which also fetched S1 and S2 once before they were downloaded; three public web searches. No cookie or session value was kept; response headers recorded here are publication metadata only.
- Legacy files read in C1: server/parasut/resource-registry.ts (in full) and one line each of server/parasut/sync-checks.ts and sync-transaction-history.ts, as stated in C1.7. Project records read: the doctrine, the Stage B report (Parasut-related sections), the Stage B addendum (rows cited in C1.7) and checkpoint section B-2.
- Files written by this task: in project-logs, this inventory (create-only), the C1 checkpoint (created before research; section C1-1 appended at completion) and ENTRY 0021 of the journal. Outside the workspace, in the session scratchpad only: the downloaded S1, S2 and S4 feed, the generator scripts and working notes.
- No credential or customer data is recorded in this file.

## C1.12 Stop point

C1 stops here, as the task requires. C2, C3, C4, C5, Stage D and application development have not started. This inventory is documentation only; it is not evidence of live behavior, does not resolve any financial rule, and does not approve Stage D.

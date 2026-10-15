# ERP 3.0 - Stage C1 Recovery Checkpoint (append-only sections)

- Task ID: ERP3-STAGE-C1-001 (offline Parasut API and source inventory; documentation research only; NO application changes).
- Authorization (as given in the task text): Stage B was accepted and closed by ChatGPT Work as a bounded static analysis deliverable; the project owner authorizes this bounded C1 documentation task when the prompt is transferred. Scope and evidence standard: project-logs\parasut-reverse-engineering-doctrine.md (record ERP3-PARASUT-DOCTRINE-20261014-001).
- Status at section C1-0: C1 STARTED - RESEARCH NOT YET BEGUN. Application development has NOT started. C2, C3, C4, C5 and Stage D have NOT started; the order C1 -> C2 -> C3 -> C4 -> C5 is preserved.
- Checkpoint created: 2026-10-14T07:27:47+03:00 (Turkey Standard Time, UTC+03:00). Create-only file: later sections are appended, earlier text is never edited.
- Written by: Claude Code - Sonnet 5.5 (claude-sonnet-5-5; reasoning-effort directive: max). No model gate is requested by this task.
- Companion journal (append-only, hash-chained): C:\Users\Bediz\Documents\erp 3.0\project-logs\claude-code-journal.md
  State covered by section C1-0: 20 entries, 49294 bytes, SHA-256 c0e6e7d1eac5a056d9ae25245810da8558c5082169347d8da107fd682b24e77c. Chain rule unchanged: each entry stores prev_journal_sha256 = SHA-256 of every byte before that entry's "### ENTRY" header. Checked 20 of 20 OK when this checkpoint was written. The next entry is ENTRY 0021 (appended at completion).
- Stage A checkpoint NOT modified: 10510 bytes, SHA-256 aa573fc7a72d2a92202e02026d0f0e382a16a20b6aa005c14eca84c66c40a520.
- Drive synchronization: PENDING. Google Drive is not accessed; ChatGPT Work owns Drive synchronization.
- Secrets: none are recorded here or in the journal. No credential value, customer data or raw sensitive payload is written to any C1 file. The company number and the Supabase project reference named in the task text are NOT reproduced and are not used to connect to anything.

## C1-0. State before research

### C1-0.1 Repository states (git, read 2026-10-14T07:27:01+03:00, "git --no-optional-locks status --porcelain=v1 -b --ignored")

| Repo               | branch | HEAD                                     | tree                                     | tracked | status                                                       | .git\index mtime          |
| ------------------ | ------ | ---------------------------------------- | ---------------------------------------- | ------- | ------------------------------------------------------------ | ------------------------- |
| rea                | main   | 9630c8ff46533fe63ec0e06212d01545070d17f0 | 7c080af43c0df42b4eb4629381c87c713de8dbc7 | 3490    | "## main...origin/main" + "?? tests/fixtures/nativeaot/obj/" | 2026-10-13T23:01:01+03:00 |
| dayandisli-legacy  | main   | b1b8070717409fc69deb71ab22400dfed384b432 | 938c08254df178836140d4de4fe746ea74d4fad1 | 775     | clean ("## main...origin/main" only)                         | 2026-10-13T23:01:08+03:00 |

- The untracked rea directory tests/fixtures/nativeaot/obj/ pre-dates this task (directory metadata only: created 2026-10-14T06:19:32, modified 06:19:37). Origin unknown. It is not opened, listed, altered or cleaned, and it is not attributed to this task (see Stage B checkpoint B-2.3).
- Workspace root: exactly 4 directories (dayandisli-legacy, dayandisli.com (empty), project-logs, rea).

### C1-0.2 project-logs before this checkpoint (read 2026-10-14T07:27:01+03:00)

| File                                    | Bytes | SHA-256                                                          |
| --------------------------------------- | ----- | ---------------------------------------------------------------- |
| claude-code-journal.md                  | 49294 | c0e6e7d1eac5a056d9ae25245810da8558c5082169347d8da107fd682b24e77c |
| parasut-reverse-engineering-doctrine.md | 13988 | 22ace04d1b295c9d43db604518016b42f59b2a8322f0bb5264fac4f39d3520a8 |
| stage-a-recovery-checkpoint.md          | 10510 | aa573fc7a72d2a92202e02026d0f0e382a16a20b6aa005c14eca84c66c40a520 |
| stage-b-analysis-report.md              | 75986 | 9beaf72480e2c7f88d35976381cc2c0c25c7c32a2fbbc6af9fba43b76d61492f |
| stage-b-recovery-checkpoint.md          | 21899 | d9aa1b8db210199eceb2a9151ebecb3cd5b5e049971301eee8fd9c2d59a375bf |
| stage-b-review-addendum.md              | 85600 | 692a739faf3620843ff3350395b51463e61417e63832d901f83811527fb113d9 |

The paths project-logs\stage-c1-parasut-api-source-inventory.md and project-logs\stage-c1-recovery-checkpoint.md did not exist before this checkpoint was created (checked). If the inventory path already exists when the deliverable is written, it is not overwritten: the task stops and reports the conflict.

### C1-0.3 Project records read first (as the task requires)

parasut-reverse-engineering-doctrine.md (in full), stage-b-analysis-report.md (the Parasut-related findings, the data-flow map and the open questions), stage-b-review-addendum.md (A1, the MAP, PWA and MIG findings that name Parasut resources or mirror tables) and stage-b-recovery-checkpoint.md (B-2). They are used as prior evidence; the completed source review is not repeated.

### C1-0.4 Rules for this task (from the task text)

Allowed:
- Reading the current public, static documentation published by Parasut: its API reference, official OpenAPI/Swagger material and official change history. Each source is recorded with title, exact URL, version or date if stated (or "not stated"), access date and the section or schema referenced.
- The four project records above and narrowly relevant, non-secret local source declarations, only where needed to map a documented resource to a reported legacy mirror; such a mapping is labelled LEGACY / UNVALIDATED.
- Writing ONLY: project-logs\stage-c1-parasut-api-source-inventory.md (create-only), this checkpoint (append sections), the local journal (append the next entry). Scratch files live in the session scratchpad, outside the workspace.

Forbidden:
- Any access to a Parasut account, Parasut API data, the Parasut UI, Supabase, production credentials or any live system. No API request of any kind, including GET: the Parasut API host is never contacted. Only the documentation publication is read, as static documentation.
- Designing, testing, enabling, credentialing or implementing any write path. Documented write methods are marked "OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY" and are not explored.
- REA setup, readiness or install commands; any installation; edits to the Stage B report, the Stage B addendum, application files, migrations, dependencies or tests.
- Starting C2, C3, C4, C5, Stage D or application development.
- Treating documentation as evidence of live behavior or as validation of legacy logic. Where the documentation is silent or ambiguous the inventory records an evidence gap instead of an inference.

### C1-0.5 Planned work and deliverables

1. Identify the official documentation sources and record them (title, URL, version or date, access date, hash of any downloaded document for provenance).
2. Build the inventory from documented material only: one row per documented in-scope resource (purpose, path and method, documented read operations, fields, types, relationships, envelope, filters, sorting, search, pagination, limits, lifecycle values, related resources, authentication or permission text, financial or workflow subject, candidate legacy mirror marked LEGACY / UNVALIDATED, evidence label, unresolved questions with the future stage that must answer them).
3. List documented write methods only as OUT OF SCOPE entries; add a source-coverage summary and the evidence gaps for C2-C5.
4. Deliver project-logs\stage-c1-parasut-api-source-inventory.md (create-only), append section C1-1 to this checkpoint, append ENTRY 0021 to the journal. Then STOP; do not begin C2.

### C1-0.6 Recovery if the session is interrupted

- Nothing in the two repositories is written by C1; project-logs is the only workspace location written, so there is nothing to repair or roll back in the repositories.
- Re-verify the state (read-only): git -C "C:\Users\Bediz\Documents\erp 3.0\dayandisli-legacy" --no-optional-locks status --porcelain=v1 -b --ignored (expect "## main...origin/main" only); the same for rea (expect also the pre-existing untracked entry named above); the journal hash chain; whether the inventory file exists.
- Research notes and downloaded documents live in the Claude Code session scratchpad and are NOT authoritative; only project-logs\stage-c1-parasut-api-source-inventory.md, once it exists, is the deliverable.
- To resume: start a new session, re-read this checkpoint, the journal tail and the doctrine, then redo the documentation reading from the public sources (record new access dates and document hashes; the documentation may have changed).
- Do NOT start C2-C5, Stage D or application development.

## C1-1. Stage C1 inventory delivered (2026-10-14T07:50:14+03:00)

- Task ID: ERP3-STAGE-C1-001 (offline Parasut API and source inventory; documentation research only; NO application changes).
- Status at C1-1: C1 DELIVERED - UNREVIEWED (awaiting ChatGPT Work review and project-owner decision). C2, C3, C4, C5, Stage D and application development have NOT started; the order C1 -> C2 -> C3 -> C4 -> C5 is preserved.
- Deliverable: C:\Users\Bediz\Documents\erp 3.0\project-logs\stage-c1-parasut-api-source-inventory.md ; 156629 bytes ; SHA-256 86051b82e7c03178ff0ad71c6b31a09a2e693c4c1f8292b2d51f2896bda205d9 (create-only, ASCII, LF; never edited).
- Journal state covered by section C1-1: 20 entries, 49294 bytes, SHA-256 c0e6e7d1eac5a056d9ae25245810da8558c5082169347d8da107fd682b24e77c (through ENTRY 0020). ENTRY 0021 follows this section and records the inventory and the checkpoint hash after this append.
- Stage A checkpoint NOT modified: 10510 bytes, SHA-256 aa573fc7a72d2a92202e02026d0f0e382a16a20b6aa005c14eca84c66c40a520. Stage B report unchanged: 75986 bytes, SHA-256 9beaf72480e2c7f88d35976381cc2c0c25c7c32a2fbbc6af9fba43b76d61492f.
- Drive synchronization: PENDING. Google Drive was not accessed; ChatGPT Work owns Drive synchronization.

### C1-1.1 Official sources and provenance

| ID | URL | Bytes | SHA-256 | Access (Turkey time) |
| -- | --- | ----- | ------- | -------------------- |
| S1 | https://apidocs.parasut.com/ | 824 | 83cfd73cc537b5354370ba4da2f770f4fad398004f9a1a51853e9493170b0fbc | 2026-10-14T07:31:53+03:00 |
| S2 | https://apidocs.parasut.com/swagger.json | 802473 | 4301a8b91635fb89431bd960c69929f05d2e8addf85698994e712571d78cb848 | 2026-10-14T07:28:32+03:00 |
| S4 (Atom feed) | https://github.com/parasutcom/api-doc/commits/master.atom | 17604 | 419939ec11dd3f4442a3dc026919421751e45eff605a17225e4bea1f502febd6 | 2026-10-14T07:31:30+03:00 |
| S3, S4 (commit page), S5 | https://github.com/parasutcom/api-doc ; https://github.com/parasutcom/api-doc/commits ; https://www.parasut.com/kullanim-kilavuzu/yeni-ozellikler-listesi | not saved | not hash-pinned (read through a fetch tool that summarizes the page) | 2026-10-14, about 07:30 |

The downloaded copies live only in the session scratchpad (outside the workspace) and are not authoritative; the hashes above identify the exact documents that were read.

### C1-1.2 Results in brief (detail and evidence in the inventory)

- Official material found: a ReDoc reference page (S1) that renders a Swagger 2.0 document (S2), the public repository that builds it (S3), its commit history as the only real change history (S4), and an unrelated product release-notes page (S5). Version label 4.0.0, constant; embedded change log has a single entry (2021-10-11); the last document change is 2026-02-26 (webhook documentation removed).
- S2 content: 24 resource groups (tags) in 7 vendor groups, 81 path keys (77 distinct URLs), 121 operations (41 read, all inventoried; 80 non-GET, listed only as method, path and operationId and marked OUT OF SCOPE - FORBIDDEN UNDER CURRENT PROJECT POLICY), 99 schemas.
- Inventory delivered: 24 resource rows with parameters, envelope, every published attribute (type, enumeration, read-only flag), relationships and out-of-scope methods; an index of the 41 read operations; the nested entity schemas reachable only through include; a 31-row LEGACY / UNVALIDATED cross-reference (26 tables have a published counterpart, 2 have no read, 3 - checks, transaction_history_items, opening_balances - have no official documentation); 14 documentation defects (DI-01 to DI-14); 16 evidence gaps (G-01 to G-16); what C2-C5 need.
- Findings that matter most to later stages (all documentation-only; none verified live): the sales-invoice list defaults to item_type "invoice, refund, estimate" and so may hide export, cancelled and recurring invoices; purchase bills have no amount descriptions (VAT basis unspecified) while sales invoices label net_total "general total" and gross_total "subtotal"; the rate limit (10 requests per 10 seconds) has no stated scope and no 429 response; scopes are empty and per-endpoint permissions are not published (only a rw/ro/na role model for the user); no created or updated filter or sort exists and webhook documentation was removed on 2026-02-26; money is typed as JSON number with no scale or rounding; created_at and updated_at are typed date without time; Payment.currency is typed number and the Tax schema declares type "bank_fees"; three routes the legacy used (collection of e-invoices, checks, per-contact transaction history) are not published at all.
- C1 does not resolve any financial rule, does not validate any legacy logic and does not approve Stage D.

### C1-1.3 Repository and evidence states after research (read 2026-10-14T07:49:28+03:00, "git --no-optional-locks status --porcelain=v1 -b --ignored")

| Repo               | branch | HEAD                                     | tree                                     | tracked | status                                                       | .git\index mtime          |
| ------------------ | ------ | ---------------------------------------- | ---------------------------------------- | ------- | ------------------------------------------------------------ | ------------------------- |
| rea                | main   | 9630c8ff46533fe63ec0e06212d01545070d17f0 | 7c080af43c0df42b4eb4629381c87c713de8dbc7 | 3490    | "## main...origin/main" + "?? tests/fixtures/nativeaot/obj/" | 2026-10-13T23:01:01+03:00 |
| dayandisli-legacy  | main   | b1b8070717409fc69deb71ab22400dfed384b432 | 938c08254df178836140d4de4fe746ea74d4fad1 | 775     | clean ("## main...origin/main" only)                         | 2026-10-13T23:01:08+03:00 |

- Identical to section C1-0.1 (task start, 07:27:01). The untracked rea directory pre-dates this task (metadata only: created 2026-10-14T06:19:32, modified 06:19:37; unchanged); it was not opened, listed, altered or cleaned and is NOT attributed to this task.
- Workspace root: exactly 4 directories. project-logs now holds the six files of section C1-0.2 (unchanged: hashes identical to C1-0.2) plus the C1 checkpoint (this file) and the new inventory.

### C1-1.4 Problems and corrections during C1

1. The fetch tool returned no usable content for the JavaScript-rendered landing page (S1); its raw HTML and the Swagger document were downloaded instead and parsed locally.
2. A scratch helper function named Rd collided with the PowerShell alias rd (Remove-Item). The call failed because the relative path did not exist, so nothing was deleted; the helper was renamed and the shell working directory was moved out of the repositories. The Git states above show that no workspace file was affected.
3. Generator script syntax errors (quoting, a wildcard comparison, a scope-qualified variable name) were fixed before any output was used.
4. The summaries of S3, the S4 commit page and S5 are second-hand and are labelled so in the inventory; the hash-pinned Atom feed cross-checks the 20 most recent commits.
5. By design nothing could be checked against live behavior; every statement in the inventory is DOCUMENTATION ONLY or an evidence gap.

### C1-1.5 Confirmations

- No application file changed. Nothing in rea or dayandisli-legacy was created, modified or deleted by this task.
- No Parasut account, UI, authenticated API data or API host contact (api.parasut.com was never requested, not even with GET); no Supabase; no credential or token used or created; no write path designed, tested, enabled or credentialed; no REA setup, readiness check, install or tool call; no install, build, test or migration.
- Network use was limited to public documentation (publication hosts apidocs.parasut.com and github.com, one product page on www.parasut.com, three public web searches).
- The company number and the Supabase project reference named in the task text were not used and are not recorded.
- No credential or customer data was written to any file.
- Files written by this task: in project-logs, the inventory (create-only), this checkpoint (created before research; this section appended) and ENTRY 0021 of the journal. Outside the workspace, in the session scratchpad only: downloaded documents, generator scripts and working notes.

### C1-1.6 Handoff and gating

1. Send the inventory to ChatGPT Work for review.
2. Project-owner decisions (not made here): whether to open the Stage C gate and which stage comes next; whether to ask Parasut support the vendor-confirmation questions of inventory section C1.8.2 (C1 sent no message to the vendor); whether to archive a hash-verified copy of the Swagger document as a project record.
3. C2 needs an explicit read-only Parasut authorization naming the company, modules, fields and navigation (doctrine section 8); until then no Stage C execution and no live investigation starts.
4. Do NOT begin application development, installs, builds or any command inside dayandisli-legacy. Do not design, test, enable, credential or implement any Parasut write path.
5. Drive synchronization of project-logs remains PENDING.

### C1-1.7 Recovery

- C1 wrote nothing in the workspace except project-logs, so there is nothing to roll back in the repositories.
- Re-verify the end state (read-only): the two git commands of section C1-0.6; the journal hash chain; the SHA-256 values above.
- The inventory is a create-only file. If it is lost or damaged, do not overwrite anything: regenerate under a new name from the public sources, and compare the new Swagger document's SHA-256 with 4301a8b91635fb89431bd960c69929f05d2e8addf85698994e712571d78cb848 to see whether the documentation changed.
- Working notes, downloaded documents and generator scripts are in the Claude Code session scratchpad (outside the workspace) and are not authoritative.

## C1-2. Review correction: out-of-scope write details withdrawn (2026-10-14T08:05:23+03:00)

- Task ID: ERP3-STAGE-C1-REVIEW-CORRECTION-001 (documentation correction only; no new research; no live access).
- Status at C1-2: CORRECTION DELIVERED - UNREVIEWED. The inventory is unchanged. C2, C3, C4, C5, Stage D and application development have NOT started. C2 remains gated until the project owner separately authorizes read-only access with the company, modules, fields and navigation specified.
- Addendum: C:\Users\Bediz\Documents\erp 3.0\project-logs\stage-c1-review-addendum.md ; 9720 bytes ; SHA-256 03ddf9dd28e97756622524120902191f9a475e96974e3dc1e548d8f38b84167b (create-only, ASCII, LF).
- Inventory (unchanged, create-only): 156629 bytes, SHA-256 86051b82e7c03178ff0ad71c6b31a09a2e693c4c1f8292b2d51f2896bda205d9.
- This section is appended to a checkpoint of 18838 bytes (sections C1-0 and C1-1) whose SHA-256 was 1fe79b464c170ff2101fbb2ba941f6a91c728e1e824530cff692c2a4a73b3321. Those bytes are not edited.
- Journal state covered by section C1-2: 21 entries, 60570 bytes, SHA-256 cc58e8332531b7a1f0c22e7339023b096de93006ab48fdbc77529487e7a6f027 (through ENTRY 0021; chain 21 of 21 OK). ENTRY 0022 follows this section.
- Drive synchronization: PENDING for ChatGPT Work. Google Drive was not accessed.

### C1-2.1 The correction

- Four passages of the inventory exceeded the C1 boundary (non-GET operations are limited to OUT OF SCOPE listings of method, path and operationId). They are withdrawn from the accepted evidence set. They are identified by operation ID and inventory line and are not repeated here: showSalesOffersPdf (line 220), e-mailSalesOffers (line 221), updateSalesOffersStatus (line 135), convertEstimateToInvoice (line 323).
- Exception count corrected: the inventory (line 19) says three; the correct number is four.
- Dependent passages (addendum section 4): inventory line 19, line 1517 (defect DI-04, the part that relies on one of the withdrawn passages) and line 1552 (section C1.9).
- Statement corrected by THIS section: section C1-1.2 of this checkpoint (line 95) says the 80 non-GET methods were "listed only as method, path and operationId". That was inaccurate for the four passages. The earlier text stays in the file unchanged (append-only file); this section is the correction. The same statement in ENTRY 0021 (observation 1) is corrected in ENTRY 0022.
- This correction provides no authorization, design input or evidence for any Parasut write or for live behavior. All ERP-to-Parasut writes remain forbidden.

### C1-2.2 Verification before this section was written

- Inventory: SHA-256 recomputed immediately before the addendum was created and again at 2026-10-14T08:04:51+03:00; unchanged (86051b82...05d9, 156629 bytes). The inventory was not opened for writing at any point.
- Addendum: created 2026-10-14T08:04:21+03:00 with the create-only helper; a case-insensitive search of it for the distinctive wording of the four passages found only the operation IDs, the identifiers of the TrackableJob schema and the ordinary words "accepted" and "awaiting", i.e., the withdrawn content is not reproduced.
- Journal: 21 entries, hash chain 21 of 21 OK, 60570 bytes, ends with a blank line, ASCII, LF.
- Results of the checks that can only run after the writes (this checkpoint's earlier 18838 bytes byte-identical, journal chain 22 of 22, inventory hash still unchanged, Git status unchanged) are recorded in ENTRY 0022.

### C1-2.3 Repository and evidence states (read 2026-10-14T08:04:51+03:00, "git --no-optional-locks status --porcelain=v1 -b --ignored")

| Repo               | branch | HEAD                                     | tree                                     | tracked | status                                                       | .git\index mtime          |
| ------------------ | ------ | ---------------------------------------- | ---------------------------------------- | ------- | ------------------------------------------------------------ | ------------------------- |
| rea                | main   | 9630c8ff46533fe63ec0e06212d01545070d17f0 | 7c080af43c0df42b4eb4629381c87c713de8dbc7 | 3490    | "## main...origin/main" + "?? tests/fixtures/nativeaot/obj/" | 2026-10-13T23:01:01+03:00 |
| dayandisli-legacy  | main   | b1b8070717409fc69deb71ab22400dfed384b432 | 938c08254df178836140d4de4fe746ea74d4fad1 | 775     | clean ("## main...origin/main" only)                         | 2026-10-13T23:01:08+03:00 |

- Identical to the states at the start of this correction task (08:02:40) and to sections C1-0.1 and C1-1.3. The untracked rea directory predates the C1 tasks (metadata only: created 2026-10-14T06:19:32, modified 06:19:37); it was not opened, listed, altered or cleaned and is NOT attributed to this task.
- Workspace root: exactly 4 directories. project-logs holds the files of sections C1-0.2 and C1-1 (hashes unchanged) plus the new addendum.

### C1-2.4 Confirmations

- No application source, repository, credential, Parasut API, Parasut UI, Supabase project or production resource was touched; api.parasut.com was not contacted; no REA tool was used; no network access was made in this task.
- Files written by this task: the addendum (create-only), this section (append-only) and ENTRY 0022 of the journal. Outside the workspace, in the session scratchpad only: body text for those writes.

### C1-2.5 Handoff and gating

1. Send the addendum together with the inventory and this checkpoint to ChatGPT Work. The accepted C1 evidence set is the inventory minus the passages named in the addendum (sections 2 and 4).
2. C2 remains gated until the project owner separately authorizes read-only access with the company, modules, fields and navigation specified. Application development, C3-C5 and Stage D remain gated. Do not design, test, enable, credential or implement any Parasut write path.
3. Drive synchronization of project-logs remains PENDING for ChatGPT Work.

### C1-2.6 Recovery

- This correction wrote nothing in the workspace except project-logs, so there is nothing to roll back in the repositories.
- Re-verify the end state (read-only): the inventory SHA-256 above; the first 18838 bytes of this checkpoint (SHA-256 1fe79b46...3321); the journal hash chain; the two git commands of section C1-0.6.
- The addendum is a create-only file. If it is lost or damaged, do not overwrite anything: regenerate under a new name from the line identifications recorded in this section.

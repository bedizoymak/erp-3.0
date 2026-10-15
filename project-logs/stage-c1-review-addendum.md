# ERP 3.0 - Stage C1 Review Addendum: withdrawal of out-of-scope write details

- Task ID: ERP3-STAGE-C1-REVIEW-CORRECTION-001 (documentation correction only; no new research; no live access).
- Status: CORRECTION DELIVERED - UNREVIEWED. Awaiting ChatGPT Work review. C2, C3, C4, C5, Stage D and application development have NOT started. C2 remains gated until the project owner separately authorizes read-only access with the company, modules, fields and navigation specified.
- Created: 2026-10-14T08:04:21+03:00 (Turkey Standard Time, UTC+03:00). Create-only file.
- Written by: Claude Code - Sonnet 5.5 (claude-sonnet-5-5; reasoning-effort directive: max).
- Corrects: project-logs\stage-c1-parasut-api-source-inventory.md. That file is create-only and was left unchanged: 156629 bytes, SHA-256 86051b82e7c03178ff0ad71c6b31a09a2e693c4c1f8292b2d51f2896bda205d9 (verified before this file was written). Every line number below refers to that exact file (LF line endings, first line = 1).
- Companions: project-logs\stage-c1-recovery-checkpoint.md (section C1-2 appended; sections C1-0 and C1-1 preserved byte for byte) and project-logs\claude-code-journal.md (ENTRY 0022).
- Journal state when this file was written: 21 entries, 60570 bytes, SHA-256 cc58e8332531b7a1f0c22e7339023b096de93006ab48fdbc77529487e7a6f027.
- Secrets and customer data: none. The withdrawn content is deliberately not repeated in this file.
- Drive synchronization: PENDING for ChatGPT Work. Google Drive was not accessed.

## 1. What this addendum does

1. It records that four passages of the C1 inventory exceeded the C1 boundary and withdraws them from the accepted evidence set. The boundary (task text; checkpoint C1-0.4 and C1-0.5) limits every non-GET operation to an OUT OF SCOPE listing: method, path and operationId, nothing else.
2. It corrects the exception count from three to four.
3. It lists the other passages that restate or depend on the withdrawn passages and says how each is read from now on.
4. It corrects two summary statements, in the C1 checkpoint and in ENTRY 0021, that said non-GET methods were listed only as method, path and operationId.

Nothing else in the inventory is changed, added or re-reviewed. Because the inventory is create-only, this addendum overrides it for the passages named here: read the inventory together with this addendum and treat every passage listed in sections 2 and 4 as absent. Later stages must not cite, quote, rely on or build on those passages.

## 2. The four withdrawn details

| No. | Operation ID | Method class | Inventory location | Kind of content outside the boundary | Disposition |
| --- | ------------ | ------------ | ------------------ | ------------------------------------ | ----------- |
| 1 | showSalesOffersPdf | POST (OUT OF SCOPE) | line 220 (section C1.5, block R01, operation-description bullet) | description text quoted from the method | WITHDRAWN |
| 2 | e-mailSalesOffers | POST (OUT OF SCOPE) | line 221 (section C1.5, block R01, operation-description bullet) | description text quoted from the method | WITHDRAWN |
| 3 | updateSalesOffersStatus | PATCH (OUT OF SCOPE) | line 135 (section C1.4.1, row R01, the parenthetical sentence in the first question) | a value list taken from the method's published request schema | WITHDRAWN |
| 4 | convertEstimateToInvoice | PATCH (OUT OF SCOPE) | line 323 (section C1.5, block R02, operation-description bullet) | description text quoted from the method | WITHDRAWN |

Why they are withdrawn: quoting a write method's description or request schema is not a method, path and operationId listing, so it is outside the C1 boundary whatever the stated reason. The inventory justified the passages as quoted "only because" they document what can be read. That justification is not accepted: the boundary is defined by the kind of method, not by the purpose of the quotation.

Not repeated here: the withdrawn content is neither reproduced nor paraphrased in this addendum. The operation IDs and line numbers above identify it.

Unchanged and within the boundary: the OUT OF SCOPE listings at line 317 (block R01) and line 399 (block R02) name the same operations by method, path and operationId only, as do the other per-row listings, the "Non-GET" column of the master table and the per-row counts in section C1.9.

## 3. Exception count corrected

Line 19 (section C1.0) of the inventory says "Three narrow exceptions". The correct number is four: lines 135, 220, 221 and 323. Line 19 enumerates three kinds of exception; the passage at line 220 was not among them. The descriptive wording of line 19 and its sentence that the passages "are quoted because they describe what can be read, not how a write behaves" are withdrawn together with the passages. The part of line 19 that says write methods are listed only as method, path and operationId stands as the C1 rule; the four passages did not comply with it.

## 4. Other passages that restate or depend on the withdrawn details

| Location | Passage (identified, not reproduced) | Reading from now on |
| -------- | ------------------------------------ | ------------------- |
| Inventory line 19 (C1.0) | The count and the description of the exceptions | Replaced by section 3 of this addendum |
| Inventory line 1517 (C1.8.1, defect DI-04) | The clause that relies on the description of showSalesOffersPdf, and the source reference "operation showSalesOffersPdf" | Withdrawn. The rest of DI-04 (the job-status enumeration omits a value that the introductory prose lists) rests on the introductory prose and the TrackableJob schema and is not affected by this addendum |
| Inventory line 1552 (C1.9) | The clause that characterizes what one of the four methods produces, and the sentence "no request or response body is recorded here" | The clause is withdrawn. The sentence was inaccurate while line 135 was present (a value list taken from a request schema); with line 135 withdrawn it holds for the accepted evidence set |
| Checkpoint section C1-1.2 (checkpoint line 95) | The statement that the 80 non-GET methods were "listed only as method, path and operationId" | Inaccurate for the four details. Corrected by section C1-2 of the checkpoint and by this addendum; the original bytes are unchanged (append-only file) |
| Journal ENTRY 0021 (journal line 356, observation 1) | The same statement | Same correction, recorded in ENTRY 0022; the original bytes are unchanged (append-only file) |

Scope of the search: the inventory, the C1 checkpoint and ENTRY 0021 were searched for the four operation IDs and for wording derived from them. Apart from the rows above, no other restatement was found. The rest of the inventory (read-side facts, gaps, defects, legacy cross-reference) was not re-reviewed here and its acceptance remains with ChatGPT Work.

## 5. What this correction does not do

- It provides no authorization, design input, premise or evidence for any Parasut write, and no evidence about live behavior. All ERP-to-Parasut writes remain forbidden. Documentation, including what remains in the inventory, is not evidence of live behavior.
- It adds or removes no read-side fact, re-opens none of the sources S1-S5 and uses no network access.
- It is not an acceptance of the inventory. It narrows the evidence set that ChatGPT Work is asked to review.

## 6. Verification before this file was written (read 2026-10-14T08:02:40+03:00)

| Item | Result |
| ---- | ------ |
| Inventory | 156629 bytes, SHA-256 86051b82e7c03178ff0ad71c6b31a09a2e693c4c1f8292b2d51f2896bda205d9; 0 CR bytes; line locations 19, 135, 220, 221, 317, 323, 399, 1517 and 1552 re-read in the file as it stands |
| C1 checkpoint | 18838 bytes, SHA-256 1fe79b464c170ff2101fbb2ba941f6a91c728e1e824530cff692c2a4a73b3321, sections C1-0 and C1-1 only |
| Journal | 21 entries, 60570 bytes, hash chain 21 of 21 OK, ends with a blank line |
| dayandisli-legacy | "## main...origin/main" only; HEAD b1b8070717409fc69deb71ab22400dfed384b432; tree 938c08254df178836140d4de4fe746ea74d4fad1; 775 tracked files; .git\index mtime 2026-10-13T23:01:08+03:00 |
| rea | "## main...origin/main" plus the pre-existing untracked entry "?? tests/fixtures/nativeaot/obj/" (directory metadata only: created 2026-10-14T06:19:32, modified 06:19:37; origin unknown; not opened, listed, altered or cleaned; not attributed to this task); HEAD 9630c8ff46533fe63ec0e06212d01545070d17f0; tree 7c080af43c0df42b4eb4629381c87c713de8dbc7; 3490 tracked files; .git\index mtime 2026-10-13T23:01:01+03:00 |

The results of the checks that can only run after the writes (inventory hash still unchanged, checkpoint prefix byte-identical, journal chain 22 of 22, Git status unchanged) are recorded in checkpoint section C1-2 and in ENTRY 0022.

## 7. Confirmations

- No application source file, repository, credential, Parasut API, Parasut UI, Supabase project or production resource was touched. api.parasut.com was not contacted. No REA tool was used. No network access was made in this task: the work used only local files in project-logs and read-only Git queries.
- Files written by this task: this addendum (create-only), section C1-2 appended to the C1 checkpoint, and ENTRY 0022 appended to the journal. Outside the workspace, in the session scratchpad only: body text for those writes.
- Google Drive was not accessed; synchronization is PENDING for ChatGPT Work.

## 8. Stop point and gating

This correction stops after the addendum, the checkpoint section and the journal entry. C2 has not started and remains gated until the project owner separately authorizes read-only access with the company, modules, fields and navigation specified. Application development, C3-C5 and Stage D remain gated.

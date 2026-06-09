# Waitlist → Google Sheet (Apps Script) setup

This wires the pre-registration form to a Google Sheet with **no GCP service
account or key files** — just a bound Apps Script web app. The Next.js API
(`lib/store.ts → addViaSheets`) POSTs each signup to the script, which dedupes
by email, computes a waitlist position, and appends a row.

## 1. Create the sheet
1. Go to <https://sheets.google.com> → **Blank spreadsheet**.
2. Name it e.g. **Elarion Waitlist**.
3. No need to add headers manually — the script creates a `Subscribers` tab
   with headers `createdAt | name | email | goal` on first submit.

## 2. Add the Apps Script
1. In the sheet: **Extensions → Apps Script**.
2. Delete any boilerplate, paste the code below.
3. (Optional) set `SECRET` to a long random string for extra protection;
   leave `''` to disable the check.
4. Click **Save** (💾).

The Next.js side (`lib/store.ts → addViaSheets`) expects a JSON reply of
`{ ok: true }`, `{ ok: true, duplicate: true }`, or `{ ok: false, error }`.
A `position` number is optional — include it to show the "#1248" rank on the
success card.

```javascript
const SHEET_NAME = 'Subscribers';
const SEED = 1247; // position offset, matches lib/store.ts
// Optional: set to a long random string to require a matching
// SHEETS_WEBHOOK_SECRET in Vercel. Leave '' to disable the check.
const SECRET = '';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const data = JSON.parse(e.postData.contents);
    if (SECRET && data.secret !== SECRET) return json({ ok: false, error: 'unauthorized' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) { sheet = ss.insertSheet(SHEET_NAME); sheet.appendRow(['createdAt', 'name', 'email', 'goal']); }

    const email = String(data.email || '').toLowerCase().trim();
    const lastRow = sheet.getLastRow();
    if (email && lastRow >= 2) {
      const existing = sheet.getRange(2, 3, lastRow - 1, 1).getValues().flat();
      const idx = existing.findIndex(x => String(x).toLowerCase().trim() === email);
      if (idx !== -1) return json({ ok: true, duplicate: true, position: SEED + idx + 1 });
    }

    sheet.appendRow([data.createdAt || new Date().toISOString(), data.name || '', email, data.goal || '']);
    const position = SEED + (sheet.getLastRow() - 1); // minus header row
    return json({ ok: true, position: position });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy as a web app
1. Top-right **Deploy → New deployment**.
2. Gear ⚙ next to "Select type" → **Web app**.
3. Settings:
   - **Description:** anything (e.g. `waitlist`)
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**
4. **Deploy** → authorize the script when prompted (allow access to your sheet).
5. Copy the **Web app URL** — looks like
   `https://script.google.com/macros/s/AKfy.../exec`.

> Re-deploying later: use **Deploy → Manage deployments → Edit (✏) → Version: New version → Deploy** so the URL stays the same.

## 4. Add env vars in Vercel
Project → **Settings → Environment Variables** → add (Production + Preview):

| Key | Value | Required? |
|-----|-------|-----------|
| `SHEETS_WEBHOOK_URL` | the `.../exec` URL from step 3 | **Yes** |
| `SHEETS_WEBHOOK_SECRET` | same string you set as `SECRET` in the script | Only if `SECRET` is non-empty |

> Setting `SHEETS_WEBHOOK_URL` is what switches the app to the Google Sheet
> backend. If you left `SECRET = ''` in the script, you can skip
> `SHEETS_WEBHOOK_SECRET` (the value sent is simply ignored).

Then **redeploy** (Deployments → ⋯ → Redeploy) so the new vars take effect.

## 5. Test
Open the live site, submit the form. A new row should appear in the sheet and
the success card should show your position (e.g. **#1248**). Submitting the same
email again should return the same position without adding a duplicate row.

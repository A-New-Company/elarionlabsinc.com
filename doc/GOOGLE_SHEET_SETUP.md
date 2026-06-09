# Waitlist → Google Sheet (Apps Script) setup

This wires the pre-registration form to a Google Sheet with **no GCP service
account or key files** — just a bound Apps Script web app. The Next.js API
(`lib/store.ts → addViaSheets`) POSTs each signup to the script, which dedupes
by email, computes a waitlist position, and appends a row.

## 1. Create the sheet
1. Go to <https://sheets.google.com> → **Blank spreadsheet**.
2. Name it e.g. **Elarion Waitlist**.
3. In **row 1**, add these headers (column order matters):

   | A    | B     | C    | D          | E        |
   |------|-------|------|------------|----------|
   | Name | Email | Goal | Created At | Position |

## 2. Add the Apps Script
1. In the sheet: **Extensions → Apps Script**.
2. Delete any boilerplate, paste the code below.
3. Change `SECRET` to a long random string (you'll reuse it in Vercel).
4. Click **Save** (💾).

```javascript
// ⚠️ Change this to a long random string. Must match SHEETS_WEBHOOK_SECRET in Vercel.
const SECRET = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';
const SEED = 1247; // position offset, matches lib/store.ts

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.secret !== SECRET) {
      return json({ success: false, error: 'unauthorized' });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const email = String(body.email || '').trim().toLowerCase();
    const name = String(body.name || '').trim();
    const goal = String(body.goal || '');
    const createdAt = body.createdAt || new Date().toISOString();

    if (!email || !name) {
      return json({ success: false, error: 'invalid' });
    }

    // Dedupe by email (column B). Row 1 is the header.
    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][1]).trim().toLowerCase() === email) {
        return json({ success: false, status: 'exists', position: SEED + i });
      }
    }

    const count = sheet.getLastRow(); // includes header row
    const position = SEED + count;    // header=1 → first signup = SEED+1
    sheet.appendRow([name, email, goal, createdAt, position]);
    return json({ success: true, status: 'created', position: position });
  } catch (err) {
    return json({ success: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
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

| Key | Value |
|-----|-------|
| `SHEETS_WEBHOOK_URL` | the `.../exec` URL from step 3 |
| `SHEETS_WEBHOOK_SECRET` | the same random string you set as `SECRET` |

Then **redeploy** (Deployments → ⋯ → Redeploy) so the new vars take effect.

## 5. Test
Open the live site, submit the form. A new row should appear in the sheet and
the success card should show your position (e.g. **#1248**). Submitting the same
email again should return the same position without adding a duplicate row.

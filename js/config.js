/* =============================================
   Baldons Wine Club — Site Configuration
   Edit this file to update key settings
   ============================================= */

const BWC_CONFIG = {

  // ── Google Sheets ──────────────────────────
  // 1. Create a Google Sheet with two tabs: "Events" and "Wines"
  // 2. File → Share → Publish to web → choose "Entire Document" → CSV → Publish
  // 3. Copy the Sheet ID from the URL (the long string between /d/ and /edit)
  // 4. Paste it below
  SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',

  // ── Members Area Password ──────────────────
  // Change this to whatever password you want members to use.
  // The password is stored as a SHA-256 hash for a little extra security.
  // To generate a new hash: https://emn178.github.io/online-tools/sha256.html
  // Default password is: baldons2026
  MEMBERS_PASSWORD_HASH: 'bd2b10af834d7c854b250969e903c760e10c1e6a9beb43b151c1defd8a44c756',
  // ↑ Default password: baldons2026 (all lowercase). Change via README.md instructions.

  // ── Club Details ───────────────────────────
  CLUB_NAME:    'Baldons Wine Club',
  CLUB_EMAIL:   'wine@baldons.co.uk',        // update with real address
  MEETING_PLACE: 'The Seven Stars, Marsh Baldon',
  FOUNDED:      '2018',

  // ── Social / Links ─────────────────────────
  FACEBOOK_URL: '',   // e.g. 'https://facebook.com/baldonswinecclub'
  INSTAGRAM_URL: '',

};

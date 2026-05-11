# Mobile App Store Setup — Standard Guide

End-to-end setup for App Store Connect and Google Play Console, including
metadata, in-app purchases / subscriptions, TestFlight / Internal Testing,
and RevenueCat integration. Targeted at this app's stack (Expo + EAS Build +
RevenueCat + Clerk).

## Mental model

You're maintaining **three parallel pipelines** for each platform:

| Layer | iOS | Android |
|---|---|---|
| **Identity** | App ID / Bundle ID in Apple Developer | Package name in Play Console |
| **Distribution** | TestFlight (beta) → App Store (prod) | Internal/Closed/Open testing → Production |
| **Monetization** | App Store Connect IAPs | Play Console In-app products / Subscriptions |
| **Server-of-record for entitlements** | RevenueCat (`appl_…` key) | RevenueCat (`goog_…` key) |

Each platform has **two parallel environments** for the same product:

- **Sandbox / Test** — purchases don't charge, used by your team and beta testers.
- **Production** — real money. Same product IDs, just live.

You don't maintain two separate sets of products. The same products appear on
both; the *user account* (sandbox tester vs. real account) decides whether the
purchase is sandbox or real.

---

## Part 1 — Apple: Developer Program + App Store Connect

### 1.1 Apple Developer Program enrollment

- Enroll at [developer.apple.com](https://developer.apple.com/programs/) — $99/year.
- Use a **company account** if you have a DUNS number; otherwise individual is
  fine but you'll publish under your name.
- Once approved, you get access to two consoles:
  - **Apple Developer** → certificates, identifiers, devices, profiles, capabilities.
  - **App Store Connect** → app metadata, builds, TestFlight, IAPs, submission.

### 1.2 Bundle ID (App ID)

In **Apple Developer → Certificates, Identifiers & Profiles → Identifiers**:

- Click **+** → App IDs → App.
- **Description**: e.g. "Symmetry IQ Production"
- **Bundle ID**: `com.yourcompany.symmetryiq` (must match `app.json`'s
  `ios.bundleIdentifier`).
- **Capabilities** to enable (only what you actually use):
  - `In-App Purchase` (required for RevenueCat).
  - `Push Notifications` (if you use them — you do).
  - `Sign in with Apple` (if you use Apple auth — you do).
  - `Associated Domains` (deep links / universal links).

**Standard practice:** create *one* Bundle ID for production. Don't create
separate dev/staging Bundle IDs unless your app actually needs to be installed
side-by-side on the same device. If you do want side-by-side, create
`com.yourcompany.symmetryiq.dev` and configure it under EAS profile-specific
bundle IDs.

### 1.3 Devices & Provisioning (handled by EAS)

EAS Build manages certificates and provisioning profiles for you. The first
time you run `eas build --platform ios`, it'll ask to:

- Create an Apple Distribution certificate.
- Create / manage provisioning profiles (App Store, Ad Hoc).
- Register your testers' device UDIDs (only needed for ad-hoc internal builds;
  TestFlight doesn't need UDIDs).

You only need to do anything manually if you want full control. Default — let
EAS handle it.

### 1.4 Create the app in App Store Connect

In [App Store Connect](https://appstoreconnect.apple.com/) → **My Apps → +**:

- **Platform**: iOS
- **Name**: store-facing app name (max 30 chars). Can differ from your in-app name.
- **Primary language**: e.g. English (U.S.)
- **Bundle ID**: pick the one you created.
- **SKU**: any internal identifier, e.g. `symmetry-iq-001`. Only visible to you.

### 1.5 App metadata (required for submission)

Under your app → **App Information**:

- **Subtitle** (optional, max 30 chars) — shows under the app name in the store.
- **Category**: primary + secondary (e.g. Health & Fitness / Lifestyle).
- **Content Rights** — declare whether your app contains third-party content.

Under **Pricing and Availability**:
- Free or Paid.
- Country availability (default: all available territories).

Under **App Privacy** (mandatory; submission is blocked without it):
- Data types collected (e.g. email, user ID, device ID, photos for face scans, etc.).
- For each data type: linked-to-user? Used for tracking? Purpose?
- This generates the privacy nutrition label shown on the store.

Under your version (e.g. 1.0) → **iOS App**:
- **Promotional text** (170 chars; can be updated without resubmission).
- **Description** (4000 chars).
- **Keywords** (100 chars total, comma-separated).
- **Support URL** — required.
- **Marketing URL** — optional.
- **Screenshots** — required for at least:
  - 6.9" display (iPhone 16 Pro Max) — 1290 × 2796.
  - 6.5" display (iPhone 11 Pro Max) — 1242 × 2688.
  - 12.9" iPad Pro (3rd gen) — 2048 × 2732 (only if you support iPad).
- **App Preview** (video) — optional, but improves conversion.
- **App Icon** — pulled from the build automatically; must be 1024×1024 PNG, no alpha.

Under **App Review Information**:
- **Sign-in info**: a demo account credentials reviewers can use. **Required**
  if your app has a login wall (yours does — Clerk).
- **Notes**: anything reviewers need to know to test. Include: "App uses
  RevenueCat for IAPs. Subscription products: [list]. To test, use the demo
  account above and tap [Get Started]."
- **Contact info**.
- **Attachments**: optional screenshots/videos of in-app flows reviewers might miss.

### 1.6 In-App Purchases / Subscriptions

In ASC, under your app → **Monetization → Subscriptions** (for auto-renewing)
or **In-App Purchases** (for consumables / non-consumables / non-renewing).

**For auto-renewing subscriptions** (your most likely case):

1. **Create a Subscription Group**. All subscriptions in the same group are
   mutually exclusive — a user can only be subscribed to one at a time. E.g.
   group: "Symmetry IQ Pro".
2. **Add subscriptions to the group**. Each one needs:
   - **Reference Name** — internal only.
   - **Product ID** — e.g. `com.yourcompany.symmetryiq.pro.monthly`. This is
     the canonical ID — RevenueCat references it. **Cannot be changed once used.**
   - **Subscription Duration** — 1 week / 1 month / 2 months / 3 months / 6 months / 1 year.
   - **Pricing** — price tier per territory (Apple sets the local-currency mapping).
   - **Localization** — display name + description per language. Required for at
     least your primary language. Shown on Apple's native paywall sheet.
   - **Review screenshot** — a screenshot of your in-app paywall showing this
     product. **Required** before submission.
   - **Review notes** — how reviewer reaches the paywall.
3. **Free Trials / Introductory Offers** (optional) — configure under the
   subscription's "Subscription Prices" tab → "Introductory Offers".
4. **App Store Promotions** (optional) — lets you advertise the subscription on
   the App Store page itself.

**Status flow:** Missing Metadata → Ready to Submit → (submitted alongside an
app version) → Approved.

Subscriptions must be submitted *with an app version*. The first time you
submit a build, attach the IAPs to that submission under **App Store →
[version] → In-App Purchases and Subscriptions**.

### 1.7 RevenueCat ↔ Apple integration

In RevenueCat dashboard → **Project Settings → Apps → [your iOS app]**:

- **Bundle ID**: matches the one above.
- **App Store Connect API Key**: generate in ASC → **Users and Access →
  Integrations → App Store Connect API**. Issuer ID, Key ID, .p8 file. Paste
  into RevenueCat. This lets RC fetch product metadata, prices, and validate receipts.
- **In-App Purchase Key (Shared Secret)**: ASC → your app → **App Information →
  App-Specific Shared Secret**. Generate, paste into RevenueCat. (Newer flow
  uses the API key above and this is optional.)

Then in RC → **Products** → import from App Store Connect. Then in
**Offerings**, create a default Offering, attach Packages mapped to those
products. Your app fetches `Purchases.getOfferings()` and shows whatever's in
the current offering.

### 1.8 Sandbox testers (iOS purchase testing)

In ASC → **Users and Access → Sandbox → Testers**:

- Add a sandbox tester. **Use a fresh email** that's never been used as an
  Apple ID. Common pattern: `you+sandbox1@yourdomain.com`.
- Set a region (matches the App Store country to test pricing).

On the test device:
- **Settings → App Store → Sandbox Account** → sign in with the sandbox tester
  credentials (don't sign out of the production Apple ID — sandbox lives in
  its own slot on iOS 14+).
- When your app's paywall triggers `Purchases.purchasePackage()`, the system
  sheet uses the sandbox account. Purchases are free; renewal cycles are
  accelerated (1 month → 5 minutes).

### 1.9 TestFlight

TestFlight has two tiers. Use both.

**Internal Testing:**
- Up to **100 internal testers** (must be members of your App Store Connect team).
- **No App Review required** — builds available within minutes of upload.
- Use this for your team and your client.
- Add testers in ASC → **TestFlight → Internal Testing → +** → invite by email.
  They install the TestFlight app and accept.

**External Testing:**
- Up to **10,000 external testers** (any email, no team membership).
- **Requires Beta App Review** for the first build of each version (~24h,
  lighter than full review). Subsequent builds within the same version are
  usually instant.
- Use this for wider beta groups, public betas, or larger client orgs.
- Create groups under **TestFlight → External Testing → + Add New Group**.
  Invite by email or public link.

**Uploading a build:**

```
eas build --profile production --platform ios
eas submit --profile production --platform ios --latest
```

Or set `submit.production.ios.appleId` etc. in `eas.json` for one-shot
submission. Once uploaded:

- Build appears under TestFlight after Apple finishes processing (~10–30 min).
- You'll need to fill in **Test Information** (beta description, feedback
  email) the first time.
- Add the build to your internal/external groups.

**Sandbox purchases work in TestFlight builds.** TestFlight is the standard way
to let your client buy through the real Apple paywall without being charged.
They sign in with their normal Apple ID, and TestFlight automatically routes
purchases through sandbox.

### 1.10 Submitting for App Store review

In ASC → **App Store → [version] → Submit for Review**:

- App version (semantic, e.g. `1.0.0`).
- Build (selected from uploaded TestFlight builds).
- Screenshots, metadata, all from §1.5.
- Attach your IAPs (first submission only — after that they're tied to the app).
- Answer: export compliance (encryption usage), advertising identifier (IDFA) usage.
- Phased Release option — gradually rolls out to existing users over 7 days.
  Recommended.

Review SLA is typically 24–48h. Expect rejection at least once on a first
submission — fix and resubmit.

---

## Part 2 — Google: Play Console

### 2.1 Google Play Console account

- One-time **$25** registration at [play.google.com/console](https://play.google.com/console).
- Choose **Organization** (DUNS required, identity verified) or **Personal**.
- Identity verification can take days — start this early.

### 2.2 Create the app

In Play Console → **All apps → Create app**:

- **App name** (max 30 chars, store-facing).
- **Default language**.
- **App or Game**.
- **Free or Paid** — once chosen, can only switch from Paid → Free, never back.
- **Declarations** — confirms compliance with developer policy + US export laws.

This creates the app. You don't pick the package name here — it's locked in
when you upload the first AAB.

### 2.3 App content (mandatory checklists)

Under your app → **Policy → App content**. Every item below blocks production
rollout until completed:

- **Privacy policy URL** — must be a public URL covering data your app collects.
- **App access** — provide demo account credentials if there's a login wall
  (yours has Clerk).
- **Ads** — yes/no.
- **Content rating** — fill out the IARC questionnaire. Generates ratings for
  each region.
- **Target audience and content** — age groups; if you target under-13 you
  face additional restrictions.
- **News app** declaration.
- **COVID-19 contact tracing** declaration.
- **Data safety** — what data you collect, why, whether shared, encryption in
  transit, etc. Generates the Play Store data safety section. Equivalent to
  Apple's App Privacy.
- **Government apps** — yes/no.
- **Financial features** — yes/no.
- **Health features** — yes/no (relevant if you market this as a health app).
- **Advertising ID** declaration — yes/no.

### 2.4 Store listing metadata

Under **Grow → Store presence → Main store listing**:

- **App name** (max 30 chars).
- **Short description** (80 chars).
- **Full description** (4000 chars).
- **App icon** — 512×512 PNG.
- **Feature graphic** — 1024×500 PNG/JPG (mandatory, shown at top of listing).
- **Phone screenshots** — 2 to 8 required. 16:9 or 9:16 aspect, 320–3840 px.
- **7-inch tablet screenshots** — optional.
- **10-inch tablet screenshots** — optional.
- **Promo video** (YouTube URL) — optional.
- **App category**, **Email**, **Phone**, **Website**.

### 2.5 Release tracks

Play Console organizes releases into four tracks. They're parallel — you can
have different versions on each.

| Track | Audience | Review | Use for |
|---|---|---|---|
| **Internal testing** | Up to 100 testers, opted in via list | Minimal review (~minutes) | Daily team builds, client demos |
| **Closed testing** | Email lists or Google Groups (any size) | Standard review | Private beta with named users |
| **Open testing** | Anyone with the opt-in link | Standard review | Public beta |
| **Production** | Everyone in target countries | Standard review | Live |

**Standard practice:** Internal Testing for your team and client. Closed/Open
Testing if you want a wider beta. Production for launch.

**Setting up Internal Testing:**

1. **Release → Testing → Internal testing → Testers** tab → **Create email
   list** → paste your client's Gmail and your QA emails.
2. **Internal testing → Releases** tab → **Create new release**.
3. Upload your `.aab` (EAS produces one with `eas build --profile production
   --platform android`).
4. Release name and notes.
5. **Save → Review release → Start rollout to Internal testing**.
6. After a few minutes, the **Tester opt-in URL** appears (Testers tab → "How
   testers join your test"). Send this URL to your client. They open it on
   their device, tap "Become a tester," then install via Play Store.

**Critical rule:** Google Play Billing requires the app to have been installed
by Play. Sideloaded APKs from EAS internal distribution **cannot complete Play
purchases**, even with a real `goog_` key. So purchase testing on Android *must*
go through the Internal Testing track.

### 2.6 License testers (Android purchase sandbox)

Play Console → **Setup → License testing**:

- Add tester email addresses (Gmail).
- These testers see "(Test)" pricing, can buy without being charged, and get
  accelerated subscription renewals (1 month → ~5 min, similar to iOS sandbox).

Anyone in **License testing** + opted into **Internal Testing** can test
purchases for free. This is what you give your client.

### 2.7 In-app products / Subscriptions

Under **Monetize → Products**:

- **Subscriptions** — auto-renewing.
- **In-app products** — one-time purchases (consumables / non-consumables).

**Creating a subscription:**

1. **Subscriptions → Create subscription**.
2. **Product ID** — e.g. `pro_monthly`. Must match what RevenueCat references.
   **Cannot be changed.** (Google's IDs are global within the app — different
   format than Apple's reverse-DNS, but you can use any string.)
3. **Name** (max 40 chars), **description** (max 80 chars).
4. **Base plan** — billing period, auto-renewing, price per region.
5. **Offers** (optional) — free trial, introductory pricing, win-back. Each
   offer has eligibility rules.
6. **Activate** — required before the product is available even in testing.

**Important:** Google's subscription model (since May 2022) decouples
*subscriptions* (the entitlement) from *base plans* (the billing period) from
*offers* (intro pricing). RevenueCat handles this — your app code only sees
Packages.

**Status flow:** Inactive → Active. Unlike Apple, products don't need to be
submitted alongside a build; once active, they're available in any track
including Production.

### 2.8 RevenueCat ↔ Google integration

In RC dashboard → **Project Settings → Apps → [your Android app]**:

- **Package name**: matches `app.json` `android.package`.
- **Service Account credentials JSON**: this is the trickiest part. You need to:
  1. In Google Cloud Console (linked to your Play Console), create a Service
     Account.
  2. Grant it the role to view financial reports.
  3. Generate a JSON key.
  4. In Play Console → **Users and permissions → Invite new users** → invite
     the service account's email → grant **View financial data, orders, and
     cancellation survey responses** + **Manage orders and subscriptions** +
     access to your app.
  5. Paste the JSON key into RevenueCat.
- **Product imports** — RC pulls products from Play once the service account
  is connected.

This setup is documented step-by-step at
[revenuecat.com/docs/google-play-store](https://www.revenuecat.com/docs/getting-started/installation/google-play-store) — follow it carefully, the
permissions step traps a lot of people.

### 2.9 App signing (Play App Signing)

- **Play App Signing is mandatory** for new apps. Google holds the upload key,
  you sign builds with an upload key.
- EAS Build generates and manages the upload keystore for you on first Android
  build. Don't lose access to the EAS account that holds it — losing the
  upload key means rotating it via Play Console support, which is painful.
- Optional: register a **deobfuscation file** (mapping.txt) per release for
  crash report symbolication. EAS uploads this automatically if you wire it up.

### 2.10 Production release

When you're ready to launch:

1. **Release → Production → Create new release** → upload AAB (or promote from
   Closed/Open testing).
2. Release notes, country availability.
3. Pre-launch report — Google runs your build on a few real devices, surfaces
   crashes / accessibility issues. Review before rolling out.
4. **Start rollout to Production** — staged rollout (e.g. 5% → 20% → 100%) is
   recommended.

Review SLA: typically 1–7 days for the first submission, hours for updates.

---

## Part 3 — Expo / EAS specifics

### 3.1 Build profiles

Your `eas.json` should have these three profiles. Standard shape with the
right keys:

```jsonc
{
  "build": {
    "development": {
      // Dev client. Installed alongside Metro.
      // Use test_ RevenueCat key — debug build, RC accepts it.
      "developmentClient": true,
      "distribution": "internal",
      "env": { /* dev keys */ }
    },
    "preview": {
      // Release-signed APK / IPA distributed via EAS internal share or TestFlight.
      // Use REAL appl_ / goog_ keys + sandbox accounts (NOT test_ key).
      "distribution": "internal",
      "channel": "preview",
      "env": { /* preview keys (real RC platform keys) */ }
    },
    "production": {
      // Goes to App Store / Play Production.
      "autoIncrement": true,
      "channel": "production",
      "env": { /* production keys (same real RC platform keys) */ }
    }
  }
}
```

### 3.2 Submission

```jsonc
"submit": {
  "production": {
    "ios": {
      "appleId": "you@yourdomain.com",
      "ascAppId": "1234567890",
      "appleTeamId": "ABCDE12345"
    },
    "android": {
      "serviceAccountKeyPath": "./play-service-account.json",
      "track": "internal"
    }
  }
}
```

Then `eas submit --profile production --platform ios --latest` uploads the
latest production build to TestFlight. Same for Android with `--platform
android` (lands on the Internal track per the config above; promote to
Production manually in Play Console after smoke-testing).

### 3.3 Version management

- `app.json` `version` — semver (e.g. `1.2.3`). Bumped manually when you ship a
  new public version.
- `app.json` `ios.buildNumber` and `android.versionCode` — build counter. Must
  increase every upload to ASC/Play.
- With `"autoIncrement": true` in the production EAS profile and
  `"appVersionSource": "remote"`, EAS manages buildNumber/versionCode for you.

---

## Part 4 — Standard workflow (end-to-end)

Once everything above is set up, your day-to-day looks like:

### Daily / weekly dev cycle

1. Code on `main` or feature branches.
2. `eas build --profile development --platform all` for dev client builds.
3. Test in dev client, hit RevenueCat Test Store for purchase flows.

### Beta cycle (client review)

1. Bump `version` in `app.json`.
2. `eas build --profile preview --platform all`.
3. iOS: `eas submit --profile preview --platform ios` → goes to TestFlight
   Internal Testing → client installs via TestFlight.
4. Android: `eas submit --profile preview --platform android` → goes to Play
   Internal Testing → client installs via opt-in link.
5. Client tests purchases with their sandbox Apple ID (iOS) and license-tester
   Gmail (Android). No charges.
6. Iterate. Bump versionCode/buildNumber automatically via EAS.

### Production release

1. Final QA on the same TestFlight / Internal Testing build.
2. iOS: in ASC, create a new App Store version → select that build → Submit
   for Review.
3. Android: in Play Console, **Promote release** from Internal Testing →
   Production (or upload fresh AAB to Production track).
4. Both: respond to any review feedback.
5. Phased / staged rollout. Monitor crash reports (Sentry) and RevenueCat charts.

---

## Part 5 — Pre-launch checklist

Print this. Don't submit until every box is ticked.

**Apple**

- [ ] Bundle ID created with all required capabilities.
- [ ] App created in ASC, metadata complete.
- [ ] App Privacy questionnaire completed.
- [ ] Screenshots for required device sizes.
- [ ] Demo account in Review Information.
- [ ] All IAPs created, pricing set, localized, with screenshots.
- [ ] RevenueCat connected via App Store Connect API key.
- [ ] At least one TestFlight build tested end-to-end with sandbox purchase.
- [ ] Privacy policy URL live.
- [ ] Support URL live.

**Google**

- [ ] Play Console app created.
- [ ] Package name matches `app.json`.
- [ ] All "App content" sections green (privacy policy, app access, content
      rating, target audience, data safety, ads, advertising ID, etc.).
- [ ] Store listing metadata + feature graphic + 2+ screenshots uploaded.
- [ ] Subscription/IAP products created and **activated**.
- [ ] RevenueCat service account connected with correct Play Console permissions.
- [ ] Internal Testing release tested end-to-end with license-tester account.
- [ ] Pre-launch report reviewed; no critical issues.
- [ ] Privacy policy URL same as Apple's (or a Play-specific one).

**App / RevenueCat**

- [ ] `utils/purchases.util.ts` reads platform-specific keys (`appl_` for iOS,
      `goog_` for Android).
- [ ] `eas.json` `production` env block contains the real `appl_` and `goog_` keys.
- [ ] `eas.json` `development` env block keeps `test_` key for fast iteration.
- [ ] No `test_` keys leak into preview or production builds.
- [ ] RevenueCat Offering "Current" is correctly set, with Packages mapped to
      products on both platforms.
- [ ] `Purchases.restorePurchases()` works on a fresh install (test by
      uninstalling and reinstalling on a sandbox account).
- [ ] Sentry release tagging hooked up so prod errors are mapped correctly.

---

## Common gotchas

- **iOS sandbox purchases failing silently** — usually because the device is
  signed in to App Store with a real Apple ID and there's no sandbox account
  configured. Set sandbox account in Settings → App Store.
- **Android purchases failing in EAS internal-distribution APK** — Play Billing
  only works when the app was installed by Play. Use Internal Testing track
  instead.
- **"Wrong API Key" dialog** — `test_` RevenueCat key in a release build. Use
  `appl_` / `goog_` for non-debug builds.
- **Subscription products in "Missing Metadata" status (Apple)** — usually
  missing localized name, missing review screenshot, or no price tier set.
- **Subscription products inactive (Google)** — they're created but you forgot
  to click "Activate" on each.
- **RevenueCat shows products but `getOfferings()` returns null** — the
  products exist in RC but aren't attached to any Package in the current Offering.
- **Apple rejection: "guideline 3.1.1"** — usually means your paywall doesn't
  use the platform IAP (e.g. a web checkout). RevenueCat with native StoreKit
  purchases is fine; just make sure no link to a web checkout exists in the
  paid flow.
- **Apple rejection: "guideline 5.1.1"** — Privacy. Either the in-app privacy
  disclosure is missing or App Privacy in ASC doesn't match what you actually collect.

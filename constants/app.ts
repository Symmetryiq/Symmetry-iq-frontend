import Constants from "expo-constants";

export const APP_NAME: string = "Symmetry IQ";
export const APP_SLOGAN: string = "Become Symmetrical.";
export const APP_VERSION: string = Constants.expoConfig?.version || "1.0.0";

export const MEDIAPIPE_FACE_LANDMARKER_MODEL = "face_landmarker.task";

/**
 * Screenshot/demo build flag. When the build is made with
 * EXPO_PUBLIC_SCREENSHOT_MODE=1, the app seeds sample data and bypasses
 * on-device face detection + the real purchase so App Store screenshots of the
 * core screens can be captured on a Simulator (which has no camera and can't
 * run the MediaPipe model). Unset in production builds → no effect.
 */
export const SCREENSHOT_MODE: boolean =
  process.env.EXPO_PUBLIC_SCREENSHOT_MODE === "1";

export const PRIVACY_POLICY_URL: string = "https://symmetryiq.app/privacy";
export const TERMS_OF_SERVICE_URL: string = "https://symmetryiq.app/terms";

/**
 * Remote version manifest for the force-update gate. Holds the minimum
 * supported app version per platform plus the store URL to send users to.
 * Editing this file on the server forces all clients below `minVersion` onto
 * the update screen — no app rebuild required. See hooks/useForceUpdate.ts.
 */
export const VERSION_MANIFEST_URL: string =
  "https://symmetryiq.app/version.json";

export const WEBSITE_URL: string = "https://symmetryiq.app";

/**
 * Store identifiers used by the Rate App / Share App actions.
 *
 * APP_STORE_ID is the numeric "Apple ID" from App Store Connect →
 * App Information → "Apple ID". It is assigned as soon as the app record
 * exists (well before public release), so fill it in now. While it is still the
 * placeholder, Rate/Share fall back to WEBSITE_URL so they never open a dead
 * page — see STORE_LINKS_READY.
 */
export const APP_STORE_ID: string = "6754335554";
export const ANDROID_PACKAGE: string = "com.bergmanmedia.symmetryiq";

export const STORE_LINKS_READY: boolean = APP_STORE_ID !== "0000000000";

export const APP_STORE_URL: string = `https://apps.apple.com/app/id${APP_STORE_ID}`;
export const APP_STORE_REVIEW_URL: string = `https://apps.apple.com/app/id${APP_STORE_ID}?action=write-review`;
export const PLAY_STORE_URL: string = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;
export const PLAY_STORE_MARKET_URL: string = `market://details?id=${ANDROID_PACKAGE}`;

import { Href, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

/**
 * Navigate to a new screen
 * @param path - Path to the screen
 */
export const navigateTo = (path: Href) => {
  router.push(path);
};

/**
 * Go back to the previous screen
 */
export const goBack = () => {
  router.back();
};

/**
 * Replace the current screen with a new screen
 * @param path - Path to the screen
 */
export const replaceRoute = (path: Href) => {
  router.replace(path);
};

/**
 * Open a URL in the browser
 * @param url - URL to open
 */
export const openURL = (url: string) => {
  WebBrowser.openBrowserAsync(url);
};

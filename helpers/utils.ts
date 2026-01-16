import * as WebBrowser from 'expo-web-browser';

export const openBrowserLink = async (link: string) => {
  await WebBrowser.openBrowserAsync(link);
};

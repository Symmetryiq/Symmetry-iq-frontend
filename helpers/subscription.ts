import { Platform } from 'react-native';
import Purchases, {
  PURCHASES_ERROR_CODE,
  PurchasesPackage,
} from 'react-native-purchases';

export const initializePaywall = (userId?: string) => {
  Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

  try {
    Purchases.configure({
      apiKey:
        Platform.OS === 'ios'
          ? process.env.EXPO_PUBLIC_RC_IOS_KEY!
          : process.env.EXPO_PUBLIC_RC_ANDROID_KEY!,
      appUserID: userId,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getPackages = async () => {
  const offerings = await Purchases.getOfferings();

  if (!offerings) throw new Error('No offerings configured');

  return offerings.current?.availablePackages;
};

export const purchasePackage = async (pkg: PurchasesPackage) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);

    if (customerInfo.entitlements.active['premium']) return true;

    return false;
  } catch (error: any) {
    if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR)
      console.error('Purchase Error', error);

    return false;
  }
};

export const checkPremium = async () => {
  const customerInfo = await Purchases.getCustomerInfo();

  return Boolean(customerInfo.entitlements.active['premium']);
};

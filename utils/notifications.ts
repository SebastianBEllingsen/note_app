import { supabase } from "@/utils/supbase";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function registerPushToken(): Promise<string | null> {
  const granted = await requestNotificationPermissions();
  if (!granted) return null;

  try {
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    const token = projectId
      ? (await Notifications.getExpoPushTokenAsync({ projectId })).data
      : (await Notifications.getExpoPushTokenAsync()).data;

    return token;
  } catch (e) {
    console.warn("Could not get push token:", e);
    return null;
  }
}

export async function savePushToken(userId: string): Promise<void> {
  const token = await registerPushToken();
  if (!token) return;

  await supabase
    .from("profiles")
    .update({ push_token: token })
    .eq("id", userId);
}

export async function sendLocalNotification(noteTitle: string): Promise<void> {
  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Nytt notat: ${noteTitle}`,
      body: "Et nytt notat har blitt opprettet",
    },
    trigger: null, // send immediately
  });
}

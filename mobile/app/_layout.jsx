import SafeScreen from "@/components/SafeScreen";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  // Almost always want this, helps with routing
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        <Slot />
        {/* slot renders the currently selected content */}
      </SafeScreen>
      <StatusBar style="dark"></StatusBar>
    </ClerkProvider>
  );
}

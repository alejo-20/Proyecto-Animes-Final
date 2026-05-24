import { Pressable } from "react-native";
import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/theme";

function LogoutButton() {
  const { logout } = useAuth();
  return (
    <Pressable
      onPress={async () => {
        await logout();
        router.replace("/auth/login");
      }}
      style={{ marginRight: 16 }}
    >
      <Ionicons name="power" size={20} color={colors.danger} />
    </Pressable>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.bgDarker,
          borderTopColor: colors.primary + "25",
          borderTopWidth: 2,
          height: 64,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontWeight: "700",
          fontSize: 10,
          letterSpacing: 2,
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: colors.bgDark,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "700",
          letterSpacing: 3,
        },
        headerTitleContainerStyle: {
          paddingBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{
          title: "INICIO",
          headerRight: () => <LogoutButton />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="informacion"
        options={{
          title: "DATOS",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="layers" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

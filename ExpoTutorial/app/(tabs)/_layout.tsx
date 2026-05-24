import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "INICIO",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categorias"
        options={{
          title: "CATEGORÍAS",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="folder" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="personajes"
        options={{
          title: "PERSONAJES",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="resumen"
        options={{
          title: "RESUMEN",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

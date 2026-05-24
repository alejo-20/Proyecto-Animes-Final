import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "404" }} />
      <View style={styles.container}>
        <View style={styles.codeBox}>
          <Text style={styles.code}>ERROR</Text>
          <Text style={styles.codeNum}>404</Text>
        </View>
        <Text style={styles.title}>PÁGINA NO ENCONTRADA</Text>
        <Text style={styles.desc}>La ruta solicitada no existe en el sistema</Text>
        <Link href="/" style={styles.button}>
          <Ionicons name="arrow-back" size={16} color={colors.bg} />
          <Text style={styles.buttonText}>VOLVER AL INICIO</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  codeBox: {
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.danger + "50",
    borderRadius: 6,
    padding: 20,
    paddingHorizontal: 32,
    marginBottom: 8,
  },
  code: {
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 5,
    fontWeight: "700",
  },
  codeNum: {
    color: colors.danger,
    fontSize: 52,
    fontWeight: "700",
    letterSpacing: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: 3,
  },
  desc: {
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
  },
  buttonText: {
    color: colors.bg,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
});

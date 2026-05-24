import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { colors, sharedStyles } from "@/theme";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Completa todos los campos");
      return;
    }
    setError("");
    try {
      await login(email.trim(), password);
      router.replace("/(tabs)/inicio");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.brandArea}>
        <View style={styles.logoBox}>
          <Ionicons name="flash" size={32} color={colors.bg} />
        </View>
        <Text style={styles.brandTop}>SISTEMA</Text>
        <Text style={styles.brandMain}>
          <Text style={{ color: colors.primary }}>NE</Text>X
          <Text style={{ color: colors.secondary }}>US</Text>
        </Text>
        <Text style={styles.brandBottom}>ACCESO</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.inputLabel}>USUARIO</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="tu@email.com"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.inputLabel}>CLAVE</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="********"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
        />

        {error !== "" && (
          <View style={sharedStyles.errorBox}>
            <Text style={sharedStyles.errorText}>{error}</Text>
          </View>
        )}

        <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "ACCEDIENDO..." : "INGRESAR"}</Text>
        </Pressable>

        <Link href="/auth/register" style={styles.link}>
          <Text style={styles.linkText}>
            ¿SIN CUENTA? <Text style={{ color: colors.primary, fontWeight: "700" }}>REGISTRAR</Text>
          </Text>
        </Link>

        <Text style={styles.fallback}>DEMO: admin1234@gmail.com / 1234567</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 48,
  },
  brandArea: {
    alignItems: "center",
    marginBottom: 44,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 6,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.primaryDark,
  },
  brandTop: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 5,
    fontWeight: "700",
    marginBottom: 6,
  },
  brandMain: {
    color: colors.text,
    fontSize: 38,
    fontWeight: "700",
    letterSpacing: 8,
  },
  brandBottom: {
    color: colors.textMuted,
    fontSize: 12,
    letterSpacing: 8,
    fontWeight: "700",
    marginTop: 6,
  },
  form: {
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
  },
  inputLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: 3,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 6,
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
  },
  buttonText: {
    color: colors.bg,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 3,
  },
  link: {
    marginTop: 22,
    alignItems: "center",
  },
  linkText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
  },
  fallback: {
    color: colors.textMuted + "60",
    fontSize: 10,
    textAlign: "center",
    marginTop: 36,
    letterSpacing: 1,
  },
});

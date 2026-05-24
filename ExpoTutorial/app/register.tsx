import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Link, router } from "expo-router";
import { colors, sharedStyles } from "@/theme";
import { register as authRegister } from "@/services/auth";

export default function RegisterScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setError("Completa todos los campos");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authRegister(email.trim(), password, nombre.trim());
      router.replace("/(tabs)" as any);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.brandArea}>
        <View style={styles.accentBar} />
        <Text style={styles.brandMuted}>NUEVO</Text>
        <Text style={styles.brandMain}>
          <Text style={{ color: colors.secondary }}>NE</Text>X
          <Text style={{ color: colors.primary }}>US</Text>
        </Text>
        <Text style={styles.brandSub}>REGISTRO</Text>
      </View>

      <View style={styles.form}>
        <Text style={sharedStyles.label}>NOMBRE</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Tu nombre"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={sharedStyles.label}>EMAIL</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="tu@email.com"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={sharedStyles.label}>CLAVE</Text>
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

        <Pressable style={[sharedStyles.button, { backgroundColor: colors.secondary, borderColor: colors.secondary, width: "100%" }]} onPress={handleRegister} disabled={loading}>
          <Text style={{ ...sharedStyles.buttonText, color: colors.text }}>{loading ? "REGISTRANDO..." : "CREAR CUENTA"}</Text>
        </Pressable>

        <Link href={"/" as any} style={styles.link}>
          <Text style={styles.linkText}>
            ¿YA TIENES CUENTA? <Text style={{ color: colors.secondary, fontWeight: "700" }}>INGRESAR</Text>
          </Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    padding: 24,
  },
  brandArea: {
    alignItems: "center",
    marginBottom: 36,
  },
  accentBar: {
    width: 50,
    height: 3,
    backgroundColor: colors.secondary,
    marginBottom: 16,
  },
  brandMuted: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 5,
    fontWeight: "700",
    marginBottom: 4,
  },
  brandMain: {
    color: colors.text,
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: 8,
  },
  brandSub: {
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 8,
    fontWeight: "700",
    marginTop: 6,
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 6,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  link: {
    marginTop: 18,
    alignItems: "center",
  },
  linkText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
  },
});

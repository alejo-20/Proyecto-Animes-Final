import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { colors, sharedStyles } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { getCharacters } from "@/services/api";
import { logout } from "@/services/auth";

export default function ResumenScreen() {
  const [characters, setCharacters] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => { loadCharacters(); }, [])
  );

  const loadCharacters = async () => {
    try {
      const data = await getCharacters();
      setCharacters(data.slice(0, 10));
    } catch { setCharacters([]); }
  };

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: async () => {
        await logout();
        router.replace("/");
      }},
    ]);
  };

  return (
    <ScrollView contentContainerStyle={sharedStyles.scrollContent}>
      <View style={[sharedStyles.header, { backgroundColor: colors.bgDarker }]}>
        <View style={[styles.accentBar, { backgroundColor: colors.accent }]} />
        <Text style={sharedStyles.headerTitle}>RESUMEN</Text>
        <Text style={[sharedStyles.headerSubtitle, { color: colors.textLight }]}>ÚLTIMOS PERSONAJES</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: colors.primary + "40" }]}>
            <Text style={styles.statValue}>{characters.length}</Text>
            <Text style={styles.statLabel}>PERSONAJES</Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.secondary + "40" }]}>
            <Text style={styles.statValue}>{characters.filter(c => c.images?.length > 0).length}</Text>
            <Text style={styles.statLabel}>CON IMÁGENES</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View style={[styles.sectionLine, { backgroundColor: colors.accent }]} />
          <Text style={styles.sectionLabel}>ÚLTIMOS REGISTROS</Text>
          <View style={[styles.sectionLine, { backgroundColor: colors.accent }]} />
        </View>

        {characters.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>SIN DATOS</Text>
          </View>
        ) : (
          characters.map((ch, i) => (
            <View key={ch.id || i} style={[styles.item, { borderLeftColor: i === 0 ? colors.accent : colors.border }]}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemIndex}>#{i + 1}</Text>
                <View>
                  <Text style={styles.itemName}>{ch.name}</Text>
                  <Text style={styles.itemCat}>{ch.categories?.name || "—"}</Text>
                </View>
              </View>
              {ch.images?.length > 0 && (
                <Ionicons name="image" size={16} color={colors.accent} />
              )}
            </View>
          ))
        )}

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="power" size={18} color={colors.danger} />
          <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  accentBar: { width: 50, height: 3, marginBottom: 16 },
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 6, padding: 16, alignItems: "center", borderWidth: 1.5, gap: 6 },
  statValue: { color: colors.text, fontSize: 28, fontWeight: "700", letterSpacing: 2 },
  statLabel: { color: colors.textMuted, fontSize: 9, fontWeight: "700", letterSpacing: 2 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  sectionLine: { flex: 1, height: 2 },
  sectionLabel: { color: colors.textMuted, fontSize: 10, fontWeight: "700", letterSpacing: 3 },
  empty: { alignItems: "center", marginTop: 30, gap: 10 },
  emptyText: { color: colors.text, fontSize: 14, fontWeight: "700", letterSpacing: 3 },
  item: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: colors.surface, borderRadius: 6, padding: 14, marginBottom: 6,
    borderLeftWidth: 3, borderWidth: 1.5, borderColor: colors.border,
  },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  itemIndex: { color: colors.textMuted, fontSize: 11, fontWeight: "700" },
  itemName: { color: colors.text, fontSize: 14, fontWeight: "600" },
  itemCat: { color: colors.textMuted, fontSize: 10, marginTop: 1 },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    marginTop: 24, paddingVertical: 14, borderRadius: 6,
    borderWidth: 1.5, borderColor: colors.danger + "40", backgroundColor: colors.danger + "08",
  },
  logoutText: { color: colors.danger, fontSize: 12, fontWeight: "700", letterSpacing: 2 },
});

import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, sharedStyles } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { logout } from "@/services/auth";
import { useAnimeStore } from "@/store/animeStore";

const CATEGORY_LABELS: Record<string, string> = {
  naruto: "Naruto",
  saintseiya: "Saint Seiya",
  onepiece: "One Piece",
  hunterxhunter: "Hunter x Hunter",
};

export default function ResumenScreen() {
  const lastCharacters = useAnimeStore(s => s.lastCharacters);
  const clearAll = useAnimeStore(s => s.clearAll);
  const entries = Object.entries(lastCharacters).filter(([, v]) => v !== null) as [string, NonNullable<typeof lastCharacters[string]>][];

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
        <Text style={[sharedStyles.headerSubtitle, { color: colors.textLight }]}>ÚLTIMAS BÚSQUEDAS</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: colors.primary + "40" }]}>
            <Text style={styles.statValue}>{entries.length}</Text>
            <Text style={styles.statLabel}>CATEGORÍAS</Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.secondary + "40" }]}>
            <Text style={styles.statValue}>{entries.filter(([, c]) => c.images?.length > 0).length}</Text>
            <Text style={styles.statLabel}>CON IMÁGENES</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View style={[styles.sectionLine, { backgroundColor: colors.accent }]} />
          <Text style={styles.sectionLabel}>PERSONAJES CONSULTADOS</Text>
          <View style={[styles.sectionLine, { backgroundColor: colors.accent }]} />
        </View>

        {entries.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>SIN BÚSQUEDAS</Text>
            <Text style={styles.emptySub}>Busca personajes en la pestaña INICIO</Text>
          </View>
        ) : (
          entries.map(([category, char]) => (
            <View key={category} style={[sharedStyles.card, { borderLeftWidth: 3, borderLeftColor: colors.accent }]}>
              <View style={styles.chRow}>
                {char.images?.[0] ? (
                  <Image source={{ uri: char.images[0], headers: { Accept: 'image/*' } }} style={styles.chImage} resizeMode="cover" />
                ) : (
                  <View style={[styles.chImagePlaceholder, { backgroundColor: colors.surface }]}>
                    <Ionicons name="image-outline" size={20} color={colors.textMuted} />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.chName}>{char.name}</Text>
                  <Text style={styles.chCat}>{CATEGORY_LABELS[category] || category}</Text>
                </View>
                <View style={styles.chImagesBadge}>
                  <Ionicons name="image" size={14} color={colors.accent} />
                  <Text style={styles.chImagesText}>{char.images?.length || 0}</Text>
                </View>
              </View>
              <View style={styles.chBody}>
                <Text style={styles.chLabel}>EDAD</Text>
                <Text style={styles.chValue}>{char.age || "—"}</Text>
                <Text style={styles.chLabel}>PODER / TÉCNICA</Text>
                <Text style={styles.chValue}>{char.power || "—"}</Text>
              </View>
            </View>
          ))
        )}

        {entries.length > 0 && (
          <Pressable style={styles.clearBtn} onPress={clearAll}>
            <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
            <Text style={styles.clearText}>LIMPIAR HISTORIAL</Text>
          </Pressable>
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
  empty: { alignItems: "center", marginTop: 30, gap: 8 },
  emptyText: { color: colors.text, fontSize: 14, fontWeight: "700", letterSpacing: 3 },
  emptySub: { color: colors.textMuted, fontSize: 12, textAlign: "center" },
  chRow: { flexDirection: "row", alignItems: "center", padding: 14, paddingBottom: 0, gap: 12 },
  chImage: { width: 48, height: 48, borderRadius: 8, backgroundColor: colors.bgDark },
  chImagePlaceholder: { width: 48, height: 48, borderRadius: 8, justifyContent: "center", alignItems: "center", borderWidth: 1.5, borderColor: colors.border },
  chName: { color: colors.text, fontSize: 15, fontWeight: "700", letterSpacing: 1 },
  chCat: { color: colors.textMuted, fontSize: 10, marginTop: 1 },
  chImagesBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.surface, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: colors.border },
  chImagesText: { color: colors.accent, fontSize: 10, fontWeight: "700" },
  chBody: { padding: 14, gap: 4 },
  chLabel: { color: colors.accent, fontSize: 9, fontWeight: "700", letterSpacing: 2, marginTop: 6 },
  chValue: { color: colors.textLight, fontSize: 13, lineHeight: 20 },
  clearBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, padding: 12, borderRadius: 6, borderWidth: 1.5, borderColor: colors.border },
  clearText: { color: colors.textMuted, fontSize: 11, fontWeight: "700", letterSpacing: 2 },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    marginTop: 12, paddingVertical: 14, borderRadius: 6,
    borderWidth: 1.5, borderColor: colors.danger + "40", backgroundColor: colors.danger + "08",
  },
  logoutText: { color: colors.danger, fontSize: 12, fontWeight: "700", letterSpacing: 2 },
});

import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

const FEATURES = [
  { icon: "search", label: "BUSCAR", text: "Animes y personajes" },
  { icon: "add-circle", label: "CREAR", text: "Editar información" },
  { icon: "people", label: "PERSONAJES", text: "Agregar con imágenes" },
  { icon: "folder", label: "ORGANIZAR", text: "Tu colección personal" },
  { icon: "compass", label: "DESCUBRIR", text: "Nuevos animes" },
] as const;

export default function InicioScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.hero}>
        <View style={styles.glitchLine} />
        <Text style={styles.logo}>
          <Text style={styles.logoCyan}>NE</Text>X
          <Text style={styles.logoPink}>US</Text>
        </Text>
        <Text style={styles.tagline}>
          SISTEMA DE GESTIÓN DE ANIME v2.0
        </Text>
        <View style={styles.heroBadge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>ONLINE</Text>
          <View style={styles.badgeDot} />
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: colors.primary + "40" }]}>
            <Ionicons name="tv" size={22} color={colors.primary} />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>ANIMES</Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.secondary + "40" }]}>
            <Ionicons name="person" size={22} color={colors.secondary} />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>PERSONAJES</Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.accent + "40" }]}>
            <Ionicons name="image" size={22} color={colors.accent} />
            <Text style={styles.statValue}>48</Text>
            <Text style={styles.statLabel}>IMÁGENES</Text>
          </View>
        </View>

        <View style={styles.sectionDivider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>MÓDULOS</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <View key={f.label} style={styles.featureCard}>
              <View style={[styles.featureIconBox, { backgroundColor: colors.surface }]}>
                <Ionicons name={f.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureLabel}>{f.label}</Text>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={[styles.footerLine, { backgroundColor: colors.primary }]} />
          <Text style={styles.footerText}>
            [ SISTEMA LISTO ]
          </Text>
          <View style={[styles.footerLine, { backgroundColor: colors.secondary }]} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: colors.bgDarker,
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: colors.primary + "15",
  },
  glitchLine: {
    width: 80,
    height: 3,
    backgroundColor: colors.primary,
    marginBottom: 20,
  },
  logo: {
    fontSize: 46,
    fontWeight: "700",
    letterSpacing: 6,
    color: colors.text,
  },
  logoCyan: {
    color: colors.primary,
  },
  logoPink: {
    color: colors.secondary,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 12,
    letterSpacing: 3,
    fontWeight: "700",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.success + "50",
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  badgeText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 50,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 6,
    padding: 14,
    alignItems: "center",
    borderWidth: 1.5,
    gap: 6,
  },
  statValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 2,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
  },
  sectionDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
  },
  featuresGrid: {
    gap: 8,
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 6,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  featureIconBox: {
    width: 40,
    height: 40,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary + "30",
  },
  featureInfo: {
    flex: 1,
  },
  featureLabel: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 2,
  },
  featureText: {
    color: colors.textLight,
    fontSize: 13,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingTop: 8,
  },
  footerLine: {
    width: 30,
    height: 2,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
  },
});

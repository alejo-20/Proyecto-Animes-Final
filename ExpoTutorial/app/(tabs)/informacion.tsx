import { useCallback, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useAnime } from "@/context/AnimeContext";
import { useAuth } from "@/context/AuthContext";
import ModalImagenes from "@/components/ModalImagenes";
import CrearAnimeModal from "@/components/CrearAnimeModal";
import { colors, sharedStyles } from "@/theme";
import { Ionicons } from "@expo/vector-icons";

interface AnimeEntry {
  id: number | string;
  slug: string;
  label: string;
}

export default function InformacionScreen() {
  const { personajes } = useAnime();
  const { fetchWithAuth } = useAuth();
  const [animes, setAnimes] = useState<AnimeEntry[]>([]);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [mostrarConsulta, setMostrarConsulta] = useState(false);
  const [mostrarCrearAnime, setMostrarCrearAnime] = useState(false);
  const [mostrarModalImg, setMostrarModalImg] = useState(false);

  useFocusEffect(
    useCallback(() => {
      cargarAnimes();
    }, [])
  );

  const cargarAnimes = async () => {
    try {
      const res = await fetchWithAuth("/animes");
      if (!res.ok) {
        setAnimes([]);
        return;
      }
      const data = await res.json();
      const lista: AnimeEntry[] = (Array.isArray(data) ? data : []).map((a: any, i: number) => ({
        id: a.id,
        slug: a.slug || a.nombre?.toLowerCase().replace(/\s+/g, "-") || `anime-${i}`,
        label: a.nombre || a.label || `Anime ${i + 1}`,
      }));
      setAnimes(lista);
    } catch {
      setAnimes([]);
    }
  };

  const todosPersonajes = animes
    .map((a) => personajes[a.slug])
    .filter(Boolean) as any[];
  const todasImagenes = todosPersonajes.flatMap((p: any) => (p ? p.imagenes : []));

  const handleAnimeCreado = (id: number | string, slug: string, label: string) => {
    if (!animes.find((a) => a.slug === slug)) {
      setAnimes((prev) => [...prev, { id, slug, label }]);
    }
  };

  const navegarA = (anime: AnimeEntry) => {
    setMostrarConsulta(false);
    router.push(`/animes/${anime.slug}?id=${anime.id}`);
  };

  return (
    <ScrollView contentContainerStyle={sharedStyles.scrollContent}>
      <View style={[sharedStyles.header, styles.header]}>
        <View style={styles.accentBar} />
        <Text style={sharedStyles.headerTitle}>DATOS</Text>
        <Text style={[sharedStyles.headerSubtitle, { color: colors.textLight }]}>PANEL DE CONTROL</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.actionsGrid}>
          <Pressable style={[styles.actionBtn, { borderColor: colors.primary + "40" }]} onPress={() => setMostrarResumen(!mostrarResumen)}>
            <View style={[styles.actionIcon, { backgroundColor: colors.primary + "15" }]}>
              <Ionicons name="document-text" size={22} color={colors.primary} />
            </View>
            <Text style={styles.actionTitle}>RESUMEN</Text>
            <Text style={styles.actionDesc}>Personajes consultados</Text>
          </Pressable>

          <Pressable style={[styles.actionBtn, { borderColor: colors.secondary + "40" }]} onPress={() => setMostrarConsulta(true)}>
            <View style={[styles.actionIcon, { backgroundColor: colors.secondary + "15" }]}>
              <Ionicons name="search" size={22} color={colors.secondary} />
            </View>
            <Text style={styles.actionTitle}>CONSULTA</Text>
            <Text style={styles.actionDesc}>Buscar personajes</Text>
          </Pressable>

          <Pressable style={[styles.actionBtn, { borderColor: colors.accent + "40" }]} onPress={() => setMostrarCrearAnime(true)}>
            <View style={[styles.actionIcon, { backgroundColor: colors.accent + "15" }]}>
              <Ionicons name="add" size={22} color={colors.accent} />
            </View>
            <Text style={styles.actionTitle}>CREAR</Text>
            <Text style={styles.actionDesc}>Nuevo anime</Text>
          </Pressable>
        </View>

        {mostrarResumen && (
          <View style={styles.resumenSection}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionLine, { backgroundColor: colors.primary }]} />
              <Text style={styles.sectionLabel}>RESUMEN</Text>
              <View style={[styles.sectionLine, { backgroundColor: colors.primary }]} />
            </View>
            {todosPersonajes.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="folder-open-outline" size={40} color={colors.textMuted} />
                <Text style={styles.emptyText}>SIN DATOS</Text>
                <Text style={styles.emptyHint}>Usa CONSULTA para buscar</Text>
              </View>
            ) : (
              <>
                {animes.map((anime) => {
                  const p = personajes[anime.slug];
                  if (!p) return null;
                  return (
                    <View key={anime.slug} style={[sharedStyles.card, { borderLeftWidth: 3, borderLeftColor: colors.secondary }]}>
                      <View style={[sharedStyles.cardHeader, { backgroundColor: colors.bgDarker }]}>
                        <Text style={[sharedStyles.cardTitle, { color: colors.secondary, fontSize: 12, textTransform: "uppercase", letterSpacing: 2 }]}>{anime.label}</Text>
                      </View>
                      <View style={sharedStyles.cardBody}>
                        <Text style={styles.cardName}>{p.nombre.toUpperCase()}</Text>
                        <View style={sharedStyles.infoRow}>
                          <Text style={[sharedStyles.infoLabel, { color: colors.secondary }]}>DESCRIPCION</Text>
                          <Text style={sharedStyles.infoValue}>{p.descripcion}</Text>
                        </View>
                        <View style={sharedStyles.infoRow}>
                          <Text style={[sharedStyles.infoLabel, { color: colors.secondary }]}>HABILIDADES</Text>
                          <Text style={sharedStyles.infoValue}>{p.habilidades}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
                {todasImagenes.length > 0 && (
                  <Pressable style={[sharedStyles.imagesButton, { backgroundColor: colors.secondary, borderColor: colors.secondary }]} onPress={() => setMostrarModalImg(true)}>
                    <Text style={sharedStyles.imagesButtonText}>VER IMÁGENES ({todasImagenes.length})</Text>
                  </Pressable>
                )}
              </>
            )}
          </View>
        )}

        <CrearAnimeModal
          visible={mostrarCrearAnime}
          onClose={() => setMostrarCrearAnime(false)}
          onCreated={handleAnimeCreado}
        />

        <ModalImagenes
          visible={mostrarModalImg}
          imagenes={todasImagenes}
          onClose={() => setMostrarModalImg(false)}
        />

        <Modal
          visible={mostrarConsulta}
          transparent
          animationType="fade"
          onRequestClose={() => setMostrarConsulta(false)}
        >
          <View style={sharedStyles.backdrop}>
            <View style={sharedStyles.backdropClick} onStartShouldSetResponder={() => true} onResponderRelease={() => setMostrarConsulta(false)} />
            <View style={sharedStyles.modalContainer} onStartShouldSetResponder={() => true}>
              <View style={[sharedStyles.modalHeader, { backgroundColor: colors.bgDarker }]}>
                <Text style={sharedStyles.modalTitle}>SELECCIONAR</Text>
                <Pressable style={sharedStyles.closeButton} onPress={() => setMostrarConsulta(false)}>
                  <Text style={[sharedStyles.closeButtonText, { color: colors.primary }]}>X</Text>
                </Pressable>
              </View>

              <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
                {animes.length === 0 && <Text style={[styles.emptyText, { marginTop: 20 }]}>CARGANDO...</Text>}
                {animes.map((anime) => (
                  <Pressable key={anime.slug} style={styles.animeOption} onPress={() => navegarA(anime)}>
                    <Text style={styles.animeOptionText}>{anime.label}</Text>
                    <View style={styles.animeOptionArrow}>
                      <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.bgDarker,
  },
  accentBar: {
    width: 50,
    height: 3,
    backgroundColor: colors.secondary,
    marginBottom: 16,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 6,
    padding: 14,
    alignItems: "center",
    borderWidth: 1.5,
    gap: 8,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  actionTitle: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
  },
  actionDesc: {
    color: colors.textMuted,
    fontSize: 9,
    textAlign: "center",
  },
  resumenSection: {
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  sectionLine: {
    flex: 1,
    height: 2,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 30,
    gap: 10,
  },
  emptyText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 3,
    textAlign: "center",
  },
  emptyHint: {
    color: colors.textLight,
    fontSize: 12,
    textAlign: "center",
    letterSpacing: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: colors.text,
    letterSpacing: 1,
  },
  modalBody: {
    padding: 14,
    gap: 8,
  },
  animeOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 6,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  animeOptionText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    letterSpacing: 1,
  },
  animeOptionArrow: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
});

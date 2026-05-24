import ConfirmModal from "@/components/ConfirmModal";
import CrearPersonajeModal from "@/components/CrearPersonajeModal";
import ModalImagenes from "@/components/ModalImagenes";
import { Personaje, useAnime } from "@/context/AnimeContext";
import { useAuth } from "@/context/AuthContext";
import { colors, sharedStyles } from "@/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AnimeScreen() {
  const { slug, id } = useLocalSearchParams<{ slug: string; id: string }>();

  const [nombre, setNombre] = useState("");
  const { personajes, setPersonaje } = useAnime();
  const { fetchWithAuth } = useAuth();
  const [error, setError] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarCrearPersonaje, setMostrarCrearPersonaje] = useState(false);
  const [mostrarEditarPersonaje, setMostrarEditarPersonaje] = useState(false);
  const [personajeAEditar, setPersonajeAEditar] = useState<Personaje | null>(null);
  const [imagenesModal, setImagenesModal] = useState<string[]>([]);
  const [listaPersonajes, setListaPersonajes] = useState<Personaje[]>([]);
  const [cargandoLista, setCargandoLista] = useState(false);
  const [confirmacion, setConfirmacion] = useState<{ tipo: "personaje" | "anime"; personaje?: Personaje } | null>(null);
  const [confirmEnviando, setConfirmEnviando] = useState(false);

  const personaje = personajes[slug];

  const ejecutarConfirmacion = async () => {
    if (!confirmacion) return;
    setConfirmEnviando(true);
    try {
      if (confirmacion.tipo === "personaje") {
        const p = confirmacion.personaje!;
        if (!p.id) {
          Alert.alert("Error", "Este personaje no tiene un ID válido para eliminar.");
          return;
        }
        const res = await fetchWithAuth(`/personajes/${p.id}`, { method: "DELETE" });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          Alert.alert("Error", errData.error || `Error ${res.status}`);
          return;
        }
        Alert.alert("Eliminado", `Personaje "${p.nombre}" eliminado`);
        if (personaje?.id === p.id) setPersonaje(slug, null as any);
        listarPersonajes();
      } else {
        const animeId = id || slug;
        const res = await fetchWithAuth(`/animes/${animeId}`, { method: "DELETE" });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          Alert.alert("Error", errData.error || `Error ${res.status}`);
          return;
        }
        Alert.alert("Eliminado", `Anime eliminado`);
        router.back();
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setConfirmEnviando(false);
      setConfirmacion(null);
    }
  };

  const consultarPersonaje = async () => {
    if (!nombre.trim()) return;
    setError("");
    setMostrarModal(false);
    try {
      const res = await fetchWithAuth(`/${slug}/${nombre.toLowerCase().trim()}`);
      if (!res.ok) throw new Error("Personaje no encontrado");
      const data: Personaje = await res.json();
      setPersonaje(slug, data);
      setImagenesModal(data.imagenes);
      Alert.alert(
        data.nombre.toUpperCase(),
        `Descripcion: ${data.descripcion}\nHabilidades: ${data.habilidades}\nImagenes recuperadas: ${data.imagenes.length}`,
        [
          { text: "OK" },
          ...(data.imagenes.length > 0
            ? [{ text: "Ver imagenes", onPress: () => setMostrarModal(true) }]
            : []),
        ]
      );
    } catch (e: any) {
      setError(e.message);
    }
  };

  const listarPersonajes = async () => {
    setError("");
    setCargandoLista(true);
    try {
      const res = await fetchWithAuth(`/${slug}`);
      if (!res.ok) throw new Error("Error al obtener personajes");
      const data: Personaje[] = await res.json();
      setListaPersonajes(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCargandoLista(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={sharedStyles.scrollContent} keyboardShouldPersistTaps="handled">
      <View style={[sharedStyles.header, { backgroundColor: colors.bgDarker }]}>
        <View style={[styles.accentBar, { backgroundColor: colors.secondary }]} />
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={18} color={colors.primary} />
          <Text style={styles.backText}>VOLVER</Text>
        </Pressable>
        <Text style={sharedStyles.headerTitle}>{slug.toUpperCase()}</Text>
        <Text style={[sharedStyles.headerSubtitle, { color: colors.textLight }]}>GESTIÓN DE PERSONAJES</Text>
      </View>

      <View style={[sharedStyles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.searchSection}>
          <Text style={[sharedStyles.label, { color: colors.textMuted }]}>NOMBRE DEL PERSONAJE</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="ej: seiya, gon, luffy..."
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.actionRow}>
          <Pressable style={[styles.actionPill, { backgroundColor: colors.primary }]} onPress={consultarPersonaje}>
            <Ionicons name="search" size={16} color={colors.bg} />
            <Text style={styles.actionPillText}>CONSULTAR</Text>
          </Pressable>

          <Pressable style={[styles.actionPill, { backgroundColor: colors.accent }]} onPress={() => setMostrarCrearPersonaje(true)}>
            <Ionicons name="add" size={16} color={colors.bg} />
            <Text style={styles.actionPillText}>CREAR</Text>
          </Pressable>

          <Pressable style={[styles.actionPill, { backgroundColor: colors.secondary }]} onPress={listarPersonajes}>
            <Ionicons name="list" size={16} color={colors.text} />
            <Text style={[styles.actionPillText, { color: colors.text }]}>LISTAR</Text>
          </Pressable>
        </View>

        <Pressable style={styles.deleteBtn} onPress={() => setConfirmacion({ tipo: "anime" })}>
          <Ionicons name="trash" size={14} color={colors.danger} />
          <Text style={styles.deleteText}>ELIMINAR ANIME</Text>
        </Pressable>

        {cargandoLista && <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 16 }} />}

        {error !== "" && (
          <View style={[sharedStyles.errorBox, { backgroundColor: colors.errorBg, borderColor: colors.danger }]}>
            <Text style={[sharedStyles.errorText, { color: colors.danger }]}>{error}</Text>
          </View>
        )}

        {personaje && (
          <View style={sharedStyles.card}>
            <View style={[sharedStyles.cardHeader, { backgroundColor: colors.primary }]}>
              <Text style={{ ...sharedStyles.cardTitle, color: colors.bg }}>{personaje.nombre.toUpperCase()}</Text>
            </View>
            <View style={sharedStyles.cardBody}>
              <View style={sharedStyles.infoRow}>
                <Text style={[sharedStyles.infoLabel, { color: colors.primary }]}>DESCRIPCION</Text>
                <Text style={sharedStyles.infoValue}>{personaje.descripcion}</Text>
              </View>
              <View style={sharedStyles.infoRow}>
                <Text style={[sharedStyles.infoLabel, { color: colors.primary }]}>HABILIDADES</Text>
                <Text style={sharedStyles.infoValue}>{personaje.habilidades}</Text>
              </View>
              <View style={sharedStyles.infoRow}>
                <Text style={[sharedStyles.infoLabel, { color: colors.primary }]}>IMAGENES</Text>
                <Text style={sharedStyles.infoValue}>{personaje.imagenes.length} recuperadas</Text>
              </View>
            </View>
            {personaje.imagenes.length > 0 && (
              <Pressable style={[sharedStyles.imagesButton, { backgroundColor: colors.primary, borderColor: colors.primary, marginHorizontal: 14, marginBottom: 10 }]} onPress={() => { setImagenesModal(personaje.imagenes); setMostrarModal(true); }}>
                <Text style={{ ...sharedStyles.imagesButtonText, color: colors.bg }}>VER IMAGENES ({personaje.imagenes.length})</Text>
              </Pressable>
            )}
            <View style={styles.cardActions}>
              <Pressable style={[styles.cardActionBtn, { backgroundColor: colors.accent }]} onPress={() => { setPersonajeAEditar(personaje); setMostrarEditarPersonaje(true); }}>
                <Text style={styles.cardActionText}>ACTUALIZAR</Text>
              </Pressable>
              <Pressable style={[styles.cardActionBtn, { backgroundColor: colors.danger }]} onPress={() => setConfirmacion({ tipo: "personaje", personaje })}>
                <Text style={styles.cardActionText}>ELIMINAR</Text>
              </Pressable>
            </View>
          </View>
        )}

        {listaPersonajes.length > 0 && (
          <View style={styles.listaSection}>
            <Text style={styles.sectionTitle}>PERSONAJES ({listaPersonajes.length})</Text>
            <View style={styles.tagContainer}>
              {listaPersonajes.map((p) => (
                <Pressable
                  key={p.id}
                  style={styles.tag}
                  onPress={() => setNombre(p.nombre.toLowerCase())}
                >
                  <Text style={styles.tagText}>{p.nombre.toUpperCase()}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <CrearPersonajeModal
          visible={mostrarCrearPersonaje}
          onClose={() => setMostrarCrearPersonaje(false)}
          animeId={id || slug}
          animeNombre={slug.toUpperCase()}
        />

        <CrearPersonajeModal
          visible={mostrarEditarPersonaje}
          onClose={() => { setMostrarEditarPersonaje(false); setPersonajeAEditar(null); }}
          animeId={id || slug}
          animeNombre={slug.toUpperCase()}
          personaje={personajeAEditar}
        />

        <ModalImagenes
          visible={mostrarModal}
          imagenes={imagenesModal}
          onClose={() => setMostrarModal(false)}
        />

        <ConfirmModal
          visible={confirmacion !== null}
          titulo={confirmacion?.tipo === "personaje" ? "ELIMINAR PERSONAJE" : "ELIMINAR ANIME"}
          mensaje={
            confirmacion?.tipo === "personaje"
              ? `¿Eliminar "${confirmacion?.personaje?.nombre}" permanentemente?`
              : `¿Eliminar este anime permanentemente? Se eliminarán todos sus personajes e imágenes.`
          }
          confirmarLabel="ELIMINAR"
          cancelarLabel="CANCELAR"
          peligro
          enviando={confirmEnviando}
          onConfirmar={ejecutarConfirmacion}
          onCancelar={() => { setConfirmacion(null); setConfirmEnviando(false); }}
        />

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  accentBar: {
    width: 50,
    height: 3,
    marginBottom: 16,
  },
  backBtn: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  backText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
  },
  searchSection: {
    width: "100%",
    marginBottom: 14,
  },
  input: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 6,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    width: "100%",
  },
  actionPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 6,
    paddingVertical: 12,
  },
  actionPillText: {
    color: colors.bg,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    width: "100%",
    paddingVertical: 12,
    marginBottom: 16,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.danger + "40",
    backgroundColor: colors.danger + "08",
  },
  deleteText: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  listaSection: {
    width: "100%",
    marginTop: 6,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 10,
    letterSpacing: 2,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text,
    letterSpacing: 1,
  },
  cardActions: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    paddingTop: 0,
  },
  cardActionBtn: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 11,
    alignItems: "center",
  },
  cardActionText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
});

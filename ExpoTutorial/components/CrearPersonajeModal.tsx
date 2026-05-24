import { useEffect, useState } from "react";
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/context/AuthContext";
import { colors, sharedStyles } from "@/theme";
import { Personaje } from "@/context/AnimeContext";

interface Props {
  visible: boolean;
  onClose: () => void;
  animeId: number | string;
  animeNombre: string;
  personaje?: Personaje | null;
}

export default function CrearPersonajeModal({ visible, onClose, animeId, animeNombre, personaje }: Props) {
  const { fetchWithAuth } = useAuth();
  const isEdit = !!personaje;
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [habilidades, setHabilidades] = useState("");
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (personaje) {
      setNombre(personaje.nombre || "");
      setDescripcion(personaje.descripcion || "");
      setHabilidades(personaje.habilidades || "");
      setImagenes([]);
    } else {
      setNombre("");
      setDescripcion("");
      setHabilidades("");
      setImagenes([]);
    }
  }, [personaje, visible]);

  const seleccionarImagenes = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.8,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      const bases64 = result.assets.map((a) => a.base64).filter(Boolean) as string[];
      setImagenes((prev) => [...prev, ...bases64]);
    }
  };

  const guardar = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }
    setEnviando(true);
    try {
      const url = isEdit
        ? `/personajes/${personaje!.id}`
        : `/animes/${animeId}/personajes`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          ...(descripcion.trim() && { descripcion: descripcion.trim() }),
          ...(habilidades.trim() && { habilidades: habilidades.trim() }),
          ...(imagenes.length > 0 && { imagenes }),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Error al ${isEdit ? "actualizar" : "crear"} personaje`);
      Alert.alert("Éxito", `Personaje "${nombre}" ${isEdit ? "actualizado" : "creado"} en ${animeNombre}`);
      onClose();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={sharedStyles.backdrop}>
        <View style={sharedStyles.backdropClick} onStartShouldSetResponder={() => true} onResponderRelease={onClose} />
        <View style={sharedStyles.modalContainer} onStartShouldSetResponder={() => true}>
          <View style={[sharedStyles.modalHeader, { backgroundColor: colors.secondary + "15", borderBottomColor: colors.secondary + "30" }]}>
            <Text style={sharedStyles.modalTitle}>{isEdit ? "ACTUALIZAR" : "CREAR"} PERSONAJE</Text>
            <Pressable style={sharedStyles.closeButton} onPress={onClose}>
              <Text style={[sharedStyles.closeButtonText, { color: colors.secondary }]}>X</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={sharedStyles.modalBody}>
            <View style={styles.animeBadge}>
              <Text style={styles.animeBadgeText}>{animeNombre}</Text>
            </View>

            <Text style={sharedStyles.label}>NOMBRE *</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej: Shun"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={sharedStyles.label}>DESCRIPCIÓN</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Descripción del personaje..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
            />

            <Text style={sharedStyles.label}>HABILIDADES</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={habilidades}
              onChangeText={setHabilidades}
              placeholder="Habilidades del personaje..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
            />

            <Text style={sharedStyles.label}>IMÁGENES</Text>
            <Pressable style={[styles.imageButton, { borderColor: colors.secondary }]} onPress={seleccionarImagenes}>
              <Text style={[styles.imageButtonText, { color: colors.secondary }]}>
                {imagenes.length > 0
                  ? `${imagenes.length} imagen(es) seleccionada(s)`
                  : "SELECCIONAR IMÁGENES"}
              </Text>
            </Pressable>

            {imagenes.length > 0 && (
              <View style={styles.previews}>
                {imagenes.map((b64, i) => (
                  <Image key={i} source={{ uri: `data:image/jpeg;base64,${b64}` }} style={styles.preview} />
                ))}
              </View>
            )}

            <Pressable style={[sharedStyles.button, { backgroundColor: colors.secondary, borderColor: colors.secondary }]} onPress={guardar} disabled={enviando}>
              <Text style={sharedStyles.buttonText}>
                {enviando ? "GUARDANDO..." : isEdit ? "ACTUALIZAR" : "CREAR PERSONAJE"}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  animeBadge: {
    backgroundColor: colors.secondary + "15",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.secondary + "30",
  },
  animeBadgeText: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 6,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  imageButton: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 6,
    padding: 14,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  imageButtonText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  previews: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  preview: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: colors.bgDark,
  },
});

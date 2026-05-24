import { useAuth } from "@/context/AuthContext";
import { colors, sharedStyles } from "@/theme";
import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreated?: (id: number | string, slug: string, label: string) => void;
}

export default function CrearAnimeModal({
  visible,
  onClose,
  onCreated,
}: Props) {
  const { fetchWithAuth } = useAuth();
  const [nombre, setNombre] = useState("");
  const [enviando, setEnviando] = useState(false);

  const crear = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }
    setEnviando(true);
    try {
      const res = await fetchWithAuth("/animes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear anime");
      const slug = data.slug;
      const animeId = data.id || data.anime?.id || slug;
      Alert.alert("Éxito", `Anime "${nombre}" creado correctamente`);
      onCreated?.(animeId, slug, nombre.trim());
      setNombre("");
      onClose();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={sharedStyles.backdrop}>
        <View
          style={sharedStyles.backdropClick}
          onStartShouldSetResponder={() => true}
          onResponderRelease={onClose}
        />
        <View
          style={sharedStyles.modalContainer}
          onStartShouldSetResponder={() => true}
        >
          <View
            style={[
              sharedStyles.modalHeader,
              { backgroundColor: colors.accent + "15", borderBottomColor: colors.accent + "30" },
            ]}
          >
            <Text style={sharedStyles.modalTitle}>CREAR ANIME</Text>
            <Pressable style={sharedStyles.closeButton} onPress={onClose}>
              <Text
                style={[
                  sharedStyles.closeButtonText,
                  { color: colors.accent },
                ]}
              >
                X
              </Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={sharedStyles.modalBody}>
            <Text style={sharedStyles.label}>NOMBRE *</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej: Naruto"
              placeholderTextColor={colors.textMuted}
            />
            <Pressable
              style={[sharedStyles.button, { backgroundColor: colors.accent, borderColor: colors.accent }]}
              onPress={crear}
              disabled={enviando}
            >
              <Text style={{ ...sharedStyles.buttonText, color: colors.bg }}>
                {enviando ? "CREANDO..." : "CREAR ANIME"}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 6,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
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

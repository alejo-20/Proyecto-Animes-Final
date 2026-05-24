import { useState } from "react";
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, sharedStyles } from "@/theme";

interface ModalImagenesProps {
  visible: boolean;
  imagenes: string[];
  onClose: () => void;
}

export default function ModalImagenes({ visible, imagenes, onClose }: ModalImagenesProps) {
  const total = imagenes.length;
  const [errores, setErrores] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setErrores(prev => new Set(prev).add(index));
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={sharedStyles.backdrop} onPress={onClose} collapsable={false}>
        <View
          style={sharedStyles.modalContainer}
          onStartShouldSetResponder={() => true}
        >
          <View style={[sharedStyles.modalHeader, { backgroundColor: colors.primary + "15", borderBottomColor: colors.primary + "30" }]}>
            <Text style={sharedStyles.modalTitle}>IMÁGENES ({total})</Text>
            <Pressable style={sharedStyles.closeButton} onPress={onClose}>
              <Text style={[sharedStyles.closeButtonText, { color: colors.primary }]}>X</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {total === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>SIN IMÁGENES</Text>
              </View>
            ) : (
              <View style={styles.grid}>
                {imagenes.map((url, i) => (
                  <View key={i} style={styles.imageSlot}>
                    {errores.has(i) ? (
                      <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>ERROR</Text>
                      </View>
                    ) : (
                      <Image
                        source={{ uri: url }}
                        style={styles.image}
                        resizeMode="contain"
                        onError={() => handleImageError(i)}
                      />
                    )}
                    <Text style={styles.imageLabel}>#{i + 1}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 3,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  imageSlot: {
    width: "46%",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 6,
    padding: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 4,
  },
  imageLabel: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 6,
    fontWeight: "700",
    letterSpacing: 2,
    textAlign: "center",
  },
  errorContainer: {
    width: "100%",
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgDark,
    borderRadius: 4,
  },
  errorText: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textAlign: "center",
  },
});

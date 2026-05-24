import { colors, sharedStyles } from "@/theme";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  visible: boolean;
  titulo: string;
  mensaje: string;
  confirmarLabel?: string;
  cancelarLabel?: string;
  peligro?: boolean;
  enviando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmModal({
  visible,
  titulo,
  mensaje,
  confirmarLabel = "CONFIRMAR",
  cancelarLabel = "CANCELAR",
  peligro = false,
  enviando = false,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancelar}>
      <View style={sharedStyles.backdrop}>
        <View style={sharedStyles.backdropClick} onStartShouldSetResponder={() => true} onResponderRelease={onCancelar} />
        <View style={sharedStyles.modalContainer} onStartShouldSetResponder={() => true}>
          <View style={[sharedStyles.modalHeader, { backgroundColor: peligro ? colors.danger + "20" : colors.primary + "15", borderBottomColor: peligro ? colors.danger + "30" : colors.primary + "20" }]}>
            <Text style={sharedStyles.modalTitle}>{titulo}</Text>
            <Pressable style={sharedStyles.closeButton} onPress={onCancelar}>
              <Text style={[sharedStyles.closeButtonText, { color: colors.primary }]}>X</Text>
            </Pressable>
          </View>

          <View style={sharedStyles.modalBody}>
            <Text style={styles.mensaje}>{mensaje}</Text>

            <Pressable
              style={[sharedStyles.button, { backgroundColor: peligro ? colors.danger : colors.primary, borderColor: peligro ? colors.danger : colors.primaryDark, marginBottom: 10 }]}
              onPress={onConfirmar}
              disabled={enviando}
            >
              {enviando ? (
                <ActivityIndicator color={colors.text} size="small" />
              ) : (
                <Text style={sharedStyles.buttonText}>{confirmarLabel}</Text>
              )}
            </Pressable>

            <Pressable
              style={[sharedStyles.button, { backgroundColor: "transparent", borderColor: colors.border, marginBottom: 0 }]}
              onPress={onCancelar}
              disabled={enviando}
            >
              <Text style={{ ...sharedStyles.buttonText, color: colors.textMuted }}>{cancelarLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mensaje: {
    color: colors.textLight,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 22,
  },
});

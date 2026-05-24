import { StyleSheet } from "react-native";
import { colors } from "./colors";

const FONT = "SpaceGrotesk_400Regular";
const FONT_BOLD = "SpaceGrotesk_700Bold";
const FONT_MEDIUM = "SpaceGrotesk_500Medium";
const FONT_LIGHT = "SpaceGrotesk_300Light";

export const sharedStyles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },

  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: colors.bgDarker,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary + "20",
  },
  headerTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 4,
    fontFamily: FONT_BOLD,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
    letterSpacing: 2,
    fontFamily: FONT,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },

  button: {
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  buttonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: FONT_BOLD,
  },

  label: {
    color: colors.textLight,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: FONT_BOLD,
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
    fontFamily: FONT,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    width: "100%",
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cardHeader: {
    padding: 14,
    paddingBottom: 10,
    alignItems: "center",
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
    fontFamily: FONT_BOLD,
  },
  cardBody: {
    padding: 14,
    paddingTop: 6,
  },

  infoRow: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 3,
    fontFamily: FONT_BOLD,
  },
  infoValue: {
    color: colors.textDark,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: FONT,
  },

  errorBox: {
    backgroundColor: colors.errorBg,
    borderRadius: 6,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: FONT_MEDIUM,
  },

  backdrop: {
    flex: 1,
    backgroundColor: colors.backdrop,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  backdropClick: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    maxHeight: "82%",
    backgroundColor: colors.bgDark,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: colors.border + "50",
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 2,
    fontFamily: FONT_BOLD,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  modalBody: {
    padding: 18,
    paddingBottom: 28,
  },

  imagesButton: {
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  imagesButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    fontFamily: FONT_BOLD,
  },
});

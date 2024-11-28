import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const FailedModal: React.FC<{
  visible: boolean;
  close: () => void;
  title: string;
  message: string;
}> = ({ visible, close, title, message }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.iconBadge}>
            <MaterialIcons name="error-outline" size={32} color="#721C24" />
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={close}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  iconBadge: {
    backgroundColor: "#FFE5E5",
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 32,
    marginBottom: 16,
  },
  modalTitle: {
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: "#1c1c1e",
  },
  modalText: {
    marginBottom: 24,
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 120,
    alignItems: "center",
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FailedModal;

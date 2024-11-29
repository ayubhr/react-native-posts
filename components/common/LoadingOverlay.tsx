import React, { useState } from "react";
import { ActivityIndicator, View, Modal, StyleSheet } from "react-native";

export default function LoadingOverlay() {
  return (
    <Modal transparent={true} animationType="fade" visible={true}>
      <View style={styles.modalContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(30,30,30,0.3)",
  },
});

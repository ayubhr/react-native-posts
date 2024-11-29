import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

const FavoritesEmpty = () => {
  return (
    <View style={styles.emptyFavorites}>
      <MaterialIcons name="star-border" size={48} color="#666" />
      <Text style={styles.emptyFavoritesText}>
        No favorite posts yet.{"\n"}
        Tap the star icon on a post to add it to favorites.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyFavorites: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyFavoritesText: {
    textAlign: "center",
    color: "#666",
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
  },
});

export default FavoritesEmpty;

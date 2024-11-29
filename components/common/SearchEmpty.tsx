import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

interface SearchEmptyProps {
  message: string;
}

export const SearchEmpty: React.FC<SearchEmptyProps> = ({ message }) => {
  return (
    <View style={styles.emptySearch}>
      <MaterialIcons name="search-off" size={48} color="#666" />
      <Text style={styles.emptySearchText}>
        No posts found matching "{message}"
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptySearch: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptySearchText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default SearchEmpty;

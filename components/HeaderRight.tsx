import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { usePost } from "@/context/PostContext";

interface HeaderRightProps {
  isDetailsPage?: boolean;
}

export function HeaderRight({ isDetailsPage = false }: HeaderRightProps) {
  const { 
    selectedPost, 
    favorites, 
    toggleFavorite,
    showFavorites,
    setShowFavorites 
  } = usePost();

  // If it's a details page, render a different button
  if (isDetailsPage) {
    if (!selectedPost) return null;
    const isFavorite = favorites.has(selectedPost.id);

    return (
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => toggleFavorite(selectedPost.id)}
      >
        <MaterialIcons
          name={isFavorite ? "star" : "star-outline"}
          size={24}
          color={isFavorite ? "#FFD700" : "#666"}
        />
      </TouchableOpacity>
    );
  }

  // If not a details page, render the filter button
  return (
    <TouchableOpacity
      style={[styles.filterButton, showFavorites && styles.filterButtonActive]}
      onPress={() => setShowFavorites(!showFavorites)}
    >
      <MaterialIcons
        name="star"
        size={20}
        color={showFavorites ? "#FFD700" : "#666"}
      />
      <Text
        style={[
          styles.filterButtonText,
          showFavorites && styles.filterButtonTextActive,
        ]}
      >
        Favorites
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 10,
    padding: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: "#FFF7E6",
  },
  filterButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#FFB100",
  },
}); 
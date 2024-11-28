// Importing necessary components and hooks from various libraries
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { PostProvider } from "@/context/PostContext";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { usePost } from "@/context/PostContext";
import { useState, createContext, useContext } from "react";

// Creating a new instance of QueryClient for managing queries
const queryClient = new QueryClient();

// Defining the structure of the FilterContext
interface FilterContextType {
  showFavorites: boolean; // Boolean to show or hide favorites
  setShowFavorites: (value: boolean) => void; // Function to update showFavorites
}

// Creating the FilterContext with an initial value of undefined
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Hook to use the FilterContext
export const useFilter = () => {
  // Getting the context from useContext
  const context = useContext(FilterContext);
  // Throwing an error if the context is not found (i.e., not used within FilterProvider)
  if (!context) throw new Error("useFilter must be used within FilterProvider");
  // Returning the context
  return context;
};

// Component for the header right button
function HeaderRight({
  showFavorites,
  setShowFavorites,
  isDetailsPage = false,
}: {
  showFavorites: boolean;
  setShowFavorites: (value: boolean) => void;
  isDetailsPage?: boolean;
}) {
  // Using the PostContext to get the selected post, favorites, and toggleFavorite function
  const { selectedPost, favorites, toggleFavorite } = usePost();

  // If it's a details page, render a different button
  if (isDetailsPage) {
    // If there's no selected post, return null
    if (!selectedPost) return null;
    // Check if the selected post is a favorite
    const isFavorite = favorites.has(selectedPost.id);

    // Return a TouchableOpacity for the favorite button
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

// The main application layout component
export default function RootLayout() {
  // State to manage the showFavorites boolean
  const [showFavorites, setShowFavorites] = useState(false);

  // Returning the application layout with all the necessary providers and components
  return (
    <QueryClientProvider client={queryClient}>
      <PostProvider>
        <FilterContext.Provider value={{ showFavorites, setShowFavorites }}>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="posts/index"
              options={{
                title: "Posts",
                headerShown: true,
                headerRight: () => (
                  <HeaderRight
                    showFavorites={showFavorites}
                    setShowFavorites={setShowFavorites}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="posts/[id]"
              options={{
                title: "Post Details",
                headerShown: true,
                headerRight: () => (
                  <HeaderRight
                    showFavorites={showFavorites}
                    setShowFavorites={setShowFavorites}
                    isDetailsPage={true}
                  />
                ),
              }}
            />
          </Stack>
        </FilterContext.Provider>
      </PostProvider>
    </QueryClientProvider>
  );
}

// Styles for the application
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

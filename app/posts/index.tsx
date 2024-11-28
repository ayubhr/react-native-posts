// Disable TypeScript checking for this file
// @ts-nocheck

// Import necessary components and libraries from React Native and other dependencies
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Animated,
  Platform,
  RefreshControl,
  TextInput,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../../services/api";
import { useRouter } from "expo-router";
import { usePost } from "@/context/PostContext";
import { useCallback, useRef, useState } from "react";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import { useFilter } from "../_layout";
import FailedModal from "@/components/modal/failed";
import SuccessModal from "@/components/modal/success";

export default function Posts() {
  // Get post-related functions and state from context
  const { setSelectedPost, favorites } = usePost();
  // Get filter state to show favorite posts
  const { showFavorites } = useFilter();
  // Initialize router for navigation
  const router = useRouter();
  // Create animation value for fade effect
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  // State for error modal visibility
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  // Fetch posts with infinite scrolling functionality
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.length + 1;
    },
  });

  // Function to load more posts when scrolling
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Component to show loading indicator at the bottom while fetching more posts
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color="#007AFF" size="small" />
      </View>
    );
  };

  // Show loading spinner while initially loading posts
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Show error modal if posts failed to load
  if (error) {
    return (
      <View style={styles.container}>
        <FailedModal
          visible={true}
          close={() => {
            setIsErrorModalVisible(false);
            refetch();
          }}
          title="Error Loading Posts"
          message="There was a problem loading the posts. Please check your connection and try again."
        />
      </View>
    );
  }

  // Flatten the pages of posts into a single array
  const flattenedPosts = data?.pages.flatMap((page) => page.data) ?? [];
  // Filter posts based on search query
  const filteredPosts = flattenedPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Show either favorite posts or all posts based on filter
  const displayedPosts = showFavorites 
    ? filteredPosts.filter(post => favorites.has(post.id))
    : filteredPosts;

  // Render individual post items
  const renderItem = ({ item, index }) => {
    // Animate post item appearance with fade effect
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={styles.postItem}
          onPress={() => {
            setSelectedPost(item);
            router.push(`/posts/${item.id}`);
          }}
          activeOpacity={0.7}
        >
          <BlurView
            intensity={Platform.OS === "ios" ? 50 : 100}
            style={styles.postContent}
          >
            {/* Star icon to show favorite status */}
            <View style={styles.starContainer}>
              <MaterialIcons 
                name={favorites.has(item.id) ? "star" : "star-outline"}
                size={20} 
                color={favorites.has(item.id) ? "#FFD700" : "#666"} 
              />
            </View>
            
            {/* Post title */}
            <View style={styles.postTextContent}>
              <Text style={styles.postTitle} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
            
            {/* Right arrow icon */}
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Main component render
  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search posts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
        {/* Clear search button */}
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <MaterialIcons name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* List of posts */}
      <FlatList
        data={displayedPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
        // Show appropriate message when no posts are found
        ListEmptyComponent={
          searchQuery.length > 0 ? (
            <View style={styles.emptySearch}>
              <MaterialIcons name="search-off" size={48} color="#666" />
              <Text style={styles.emptySearchText}>
                No posts found matching "{searchQuery}"
              </Text>
            </View>
          ) : showFavorites ? (
            <View style={styles.emptyFavorites}>
              <MaterialIcons name="star-border" size={48} color="#666" />
              <Text style={styles.emptyFavoritesText}>
                No favorite posts yet.{'\n'}
                Tap the star icon on a post to add it to favorites.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContainer: {
    padding: 16,
  },
  postItem: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  postContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: Platform.OS === "ios" ? "rgba(255,255,255,0.8)" : "white",
  },
  starContainer: {
    marginRight: 12,
    width: 24,
  },
  postTextContent: {
    flex: 1,
    marginRight: 8,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 4,
  },
  postExcerpt: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  postMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  postMetaText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  error: {
    color: "#FF3B30",
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyFavorites: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyFavoritesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  emptySearch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptySearchText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});

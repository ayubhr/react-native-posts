// @ts-nocheck
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform,
  RefreshControl,
  TextInput,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../../services/api";
import { useRouter } from "expo-router";
import { usePost } from "@/context/PostContext";
import { useCallback, useRef, useState, useMemo } from "react";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import FailedModal from "@/components/modal/failed";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import SearchEmpty from "@/components/common/SearchEmpty";
import FavoritesEmpty from "@/components/common/FavoritesEmpty";
export default function Posts() {
  // Get post-related functions and state from context
  const { setSelectedPost, favorites, showFavorites, getFavoritePosts } =
    usePost();

  const router = useRouter();

  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");

  // State for error modal visibility
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  //query configuration
  const {
    data,
    isLoading,
    isError,
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
    onError: (error) => {
      setIsErrorModalVisible(true);
      console.error("Failed to fetch posts:", error);
    },
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount
  });

  // Simplify posts processing logic
  const posts = useMemo(() => {
    // First, flatten the pages
    const allPosts = data?.pages.flatMap((page) => page.data) ?? [];

    // Then apply search filter
    const searchedPosts = searchQuery
      ? allPosts.filter((post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : allPosts;

    // Finally, filter favorites if needed
    return showFavorites
      ? searchedPosts.filter((post) => favorites.has(post.id))
      : searchedPosts;
  }, [data?.pages, searchQuery, showFavorites, favorites]);

  // Optimize renderItem with useCallback
  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <View>
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
              <View style={styles.starContainer}>
                <MaterialIcons
                  name={favorites.has(item.id) ? "star" : "star-outline"}
                  size={20}
                  color={favorites.has(item.id) ? "#FFD700" : "#666"}
                />
              </View>

              <View style={styles.postTextContent}>
                <Text style={styles.postTitle} numberOfLines={1}>
                  {item.title}
                </Text>
              </View>

              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </BlurView>
          </TouchableOpacity>
        </View>
      );
    },
    [favorites, router, setSelectedPost]
  );

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

  // Show loading spinner while loading posts from api
  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingOverlay />
      </View>
    );
  }

  // Show error modal if posts failed to load
  if (isError || isErrorModalVisible) {
    return (
      <View style={styles.container}>
        <FailedModal
          visible={true}
          close={() => {
            setIsErrorModalVisible(false);
            refetch();
          }}
          title="Error"
          message="There was a problem loading the posts!"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search posts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={styles.clearButton}
          >
            <MaterialIcons name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={posts}
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
        ListEmptyComponent={
          searchQuery.length > 0 ? (
            <SearchEmpty message={searchQuery} />
          ) : showFavorites ? (
            <FavoritesEmpty />
          ) : null
        }
      />
    </View>
  );
}

// Make sure all styles are defined
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
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  emptySearch: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptySearchText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  emptyFavorites: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyFavoritesText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  searchSkeleton: {
    marginLeft: 8,
    borderRadius: 8,
  },
});

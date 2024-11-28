// @ts-nocheck

import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../../services/api";
import { useRouter } from "expo-router";
import { usePost } from "@/context/PostContext";
import { useCallback } from "react";

export default function Posts() {
  const { setSelectedPost } = usePost();
  const router = useRouter();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.length + 1;
    },
  });

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>
          Error loading posts. Please try again later.
        </Text>
      </View>
    );
  }

  const flattenedPosts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <FlatList
      data={flattenedPosts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.postItem}
          onPress={() => {
            setSelectedPost(item);
            router.push(`/posts/${item.id}`);
          }}
        >
          <Text style={styles.postTitle}>{item.title}</Text>
        </TouchableOpacity>
      )}
      onEndReached={loadMore}
      onEndReachedThreshold={0.3}
      ListFooterComponent={renderFooter}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContainer: {
    flexGrow: 1,
  },
  postItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { usePost } from "@/context/PostContext";

export default function PostDetails() {
  const { selectedPost: post } = usePost();

  console.log({ post });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post?.title}</Text>
      <Text style={styles.userId}>User ID: {post?.userId}</Text>
      <Text style={styles.body}>{post?.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userId: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

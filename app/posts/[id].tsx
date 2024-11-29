import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  SafeAreaView,
} from "react-native";
import { usePost } from "@/context/PostContext";
import { MaterialIcons } from "@expo/vector-icons";

export default function PostDetails() {
  // This line gets the currently selected post from the context
  const { selectedPost: post } = usePost();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{post?.title}</Text>
            <View style={styles.metaInfo}>
              <MaterialIcons name="person-outline" size={16} color="#666" />
              <Text style={styles.metaText}>User Id : {post?.userId}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.bodyContainer}>
            <Text style={styles.body}>{post?.body}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Platform.OS === "ios" ? "rgba(255,255,255,0.8)" : "white",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1c1c1e",
    lineHeight: 34,
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#666",
    marginHorizontal: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginVertical: 20,
  },
  bodyContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  tagsContainer: {
    marginTop: 24,
  },
  tagTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1c1c1e",
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "rgba(0,122,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
});

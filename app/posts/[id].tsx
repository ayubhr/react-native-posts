import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Share,
  Animated,
} from "react-native";
import { usePost } from "@/context/PostContext";
import { useRouter } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from "react";
import { BlurView } from "expo-blur";

export default function PostDetails() {
  // This line gets the currently selected post from the context
  const { selectedPost: post } = usePost();
  // This line initializes the router for navigation
  const router = useRouter();
  // These lines create references to animated values for fade and slide animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // This effect runs once when the component mounts, starting the animations
  useEffect(() => {
    // This line starts the parallel animations for fade and slide
    Animated.parallel([
      // This animation fades the view in over 500ms
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // This animation slides the view up over 500ms
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // This function handles the sharing of the post
  const handleShare = async () => {
    try {
      // This line shares the post title and body
      await Share.share({
        message: `${post?.title}\n\n${post?.body}`,
        title: post?.title,
      });
    } catch (error) {
      // This line logs any error that occurs during sharing
      console.error(error);
    }
  };

  // This is the JSX for the component
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
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
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.8)' : 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
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
    fontWeight: 'bold',
    color: '#1c1c1e',
    lineHeight: 34,
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
    marginHorizontal: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 20,
  },
  bodyContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
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
    color: '#333',
  },
  tagsContainer: {
    marginTop: 24,
  },
  tagTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1c1c1e',
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(0,122,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

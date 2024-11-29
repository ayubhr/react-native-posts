import { View, StyleSheet, Platform } from 'react-native';
import Skeleton from './Skeleton';
import { BlurView } from 'expo-blur';

export default function PostSkeleton() {
  return (
    <View style={styles.postItem}>
      <BlurView
        intensity={Platform.OS === "ios" ? 50 : 100}
        style={styles.postContent}
      >
        <View style={styles.starContainer}>
          <Skeleton width={20} height={20} style={styles.circle} />
        </View>
        
        <View style={styles.postTextContent}>
          <Skeleton width="80%" height={16} />
        </View>
        
        <Skeleton width={24} height={24} style={styles.circle} />
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  postItem: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  postContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.8)' : 'white',
  },
  starContainer: {
    marginRight: 12,
    width: 24,
  },
  postTextContent: {
    flex: 1,
    marginRight: 8,
  },
  circle: {
    borderRadius: 50,
  },
}); 
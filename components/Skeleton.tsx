import { View, Animated, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: any;
}

export default function Skeleton({ width = '100%', height = 20, style }: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          useNativeDriver: true,
          duration: 1000,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          useNativeDriver: true,
          duration: 1000,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width as number, width as number],
  });

  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: '#E1E9EE',
          overflow: 'hidden',
          borderRadius: 4,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }],
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
        ]}
      />
    </View>
  );
} 
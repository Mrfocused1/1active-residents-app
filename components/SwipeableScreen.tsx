import React, { ReactNode, useRef } from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120; // Distance to trigger navigation

interface SwipeableScreenProps {
  children: ReactNode;
  onSwipeBack?: () => void;
  enabled?: boolean;
}

const SwipeableScreen: React.FC<SwipeableScreenProps> = ({
  children,
  onSwipeBack,
  enabled = true,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      // Don't block initial touch
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,

      // Only capture when moving in a swipe pattern
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (!enabled) return false;

        const { dx, dy, x0 } = gestureState;

        // Must start from left edge (within 50px)
        const isFromLeftEdge = x0 < 50;

        // Must be swiping right (positive dx)
        const isSwipingRight = dx > 8;

        // Must be mostly horizontal (dx > dy)
        const isHorizontalSwipe = Math.abs(dx) > Math.abs(dy) * 1.5;

        return isFromLeftEdge && isSwipingRight && isHorizontalSwipe;
      },

      onMoveShouldSetPanResponderCapture: () => false,

      onPanResponderGrant: () => {
        // Gesture started
      },

      onPanResponderMove: (evt, gestureState) => {
        if (!enabled) return;

        // Apply translation as user swipes
        const newValue = Math.max(0, Math.min(gestureState.dx, SCREEN_WIDTH));
        translateX.setValue(newValue);
      },

      onPanResponderRelease: (evt, gestureState) => {
        if (!enabled) {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 80,
            friction: 10,
          }).start();
          return;
        }

        // Trigger navigation if:
        // 1. Swiped past threshold OR
        // 2. Fast swipe with good velocity
        const shouldNavigate =
          gestureState.dx > SWIPE_THRESHOLD ||
          (gestureState.dx > 60 && gestureState.vx > 0.5);

        if (shouldNavigate) {
          // Complete the swipe animation
          Animated.timing(translateX, {
            toValue: SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            if (onSwipeBack) {
              onSwipeBack();
            }
            // Reset after navigation
            translateX.setValue(0);
          });
        } else {
          // Cancel - spring back to original position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 80,
            friction: 10,
          }).start();
        }
      },

      onPanResponderTerminate: () => {
        // Gesture was interrupted - reset
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }).start();
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Animated.View
        style={[
          styles.contentContainer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});

export default SwipeableScreen;

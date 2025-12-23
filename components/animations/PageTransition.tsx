import React, { useEffect } from 'react';
import { ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  FadeIn as ReanimatedFadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';

interface PageTransitionProps extends ViewProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide' | 'scale';
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'fade',
  style,
  ...props
}) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(type === 'slide' ? 50 : 0);
  const scale = useSharedValue(type === 'scale' ? 0.95 : 1);

  useEffect(() => {
    if (type === 'fade') {
      opacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
    } else if (type === 'slide') {
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
    } else if (type === 'scale') {
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 100,
      });
    }
  }, [type]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
};

export default PageTransition;

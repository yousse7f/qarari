import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type RatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  maxValue?: number;
};

const RatingInput = ({ value, onChange, maxValue = 10 }: RatingInputProps) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  
  const handlePressIn = (index: number) => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  // Create array from 1 to maxValue
  const ratings = Array.from({ length: maxValue }, (_, i) => i + 1);
  
  // For smaller screens, use pill slider style
  const RatingPills = () => (
    <View style={styles.pillsContainer}>
      {ratings.map((rating) => (
        <Pressable
          key={rating}
          onPress={() => onChange(rating)}
          onPressIn={() => handlePressIn(rating)}
          onPressOut={handlePressOut}
          style={({ pressed }) => [
            styles.pill,
            {
              backgroundColor: rating <= value ? theme.colors.primary : theme.colors.card,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.pillText,
              { color: rating <= value ? '#FFFFFF' : theme.colors.text },
            ]}
          >
            {rating}
          </Text>
        </Pressable>
      ))}
    </View>
  );
  
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <RatingPills />
      <Text style={[styles.valueText, { color: theme.colors.primary }]}>
        {value || 0}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  pill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 1,
  },
  pillText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  valueText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginLeft: 12,
    width: 24,
    textAlign: 'center',
  },
});

export default RatingInput;
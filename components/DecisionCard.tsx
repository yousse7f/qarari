import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { Decision } from '@/types/decisions';
import { ChevronRight, Trash2 } from 'lucide-react-native';
import { formatDate } from '@/utils/helpers';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type DecisionCardProps = {
  decision: Decision;
  onPress?: () => void;
  deleteMode?: boolean;
};

const DecisionCard = ({ decision, onPress, deleteMode = false }: DecisionCardProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const scale = useSharedValue(1);
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/result/${decision.id}`);
    }
  };
  
  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  // Get the winning option with optional chaining to safely handle undefined results
  const winningOption = decision.results?.optionScores[0]?.option.name || 'No result';
  
  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            opacity: pressed ? 0.9 : 1,
          },
          deleteMode && { borderColor: theme.colors.error },
        ]}
      >
        <View style={styles.cardContent}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
              {decision.title}
            </Text>
            <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
              {formatDate(decision.createdAt)}
            </Text>
          </View>
          
          <View style={styles.resultContainer}>
            <View>
              <Text style={[styles.resultLabel, { color: theme.colors.textSecondary }]}>
                Result
              </Text>
              <Text style={[styles.resultValue, { color: theme.colors.primary }]} numberOfLines={1}>
                {winningOption}
              </Text>
            </View>
            
            {deleteMode ? (
              <Trash2 size={20} color={theme.colors.error} />
            ) : (
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  resultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 2,
  },
  resultValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});

export default DecisionCard;
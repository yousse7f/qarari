import React from 'react';
import { 
  Pressable, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
};

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon
}: ButtonProps) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  
  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  // Button styling based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.primary,
          borderWidth: 1,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'primary':
      default:
        return {
          backgroundColor: theme.colors.primary,
        };
    }
  };
  
  // Text styling based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return {
          color: theme.colors.primary,
        };
      case 'primary':
      default:
        return {
          color: '#FFFFFF',
        };
    }
  };
  
  // Size styling
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 12,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
        };
      case 'medium':
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 16,
        };
    }
  };
  
  // Text size
  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: 14,
        };
      case 'large':
        return {
          fontSize: 18,
        };
      case 'medium':
      default:
        return {
          fontSize: 16,
        };
    }
  };
  
  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          getButtonStyle(),
          getSizeStyle(),
          { opacity: (pressed || disabled) ? 0.8 : 1 },
          disabled && styles.disabled,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isLoading || disabled}
      >
        {isLoading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'primary' ? '#FFFFFF' : theme.colors.primary} 
          />
        ) : (
          <>
            {icon && <Text style={styles.iconContainer}>{icon}</Text>}
            <Text 
              style={[
                styles.text, 
                getTextStyle(), 
                getTextSizeStyle(),
                textStyle
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    marginRight: 8,
  },
});

export default Button;
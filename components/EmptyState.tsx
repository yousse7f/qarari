import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ClipboardList } from 'lucide-react-native';
import Button from './Button';

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
};

const EmptyState = ({
  title,
  description,
  icon = 'clipboard',
  actionLabel,
  onAction
}: EmptyStateProps) => {
  const { theme } = useTheme();

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
    ]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
        <ClipboardList size={32} color={theme.colors.primary} />
      </View>

      <Text style={[styles.title, { color: theme.colors.text }]}>
        {title}
      </Text>

      <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
        {description}
      </Text>

      {actionLabel && onAction && (
        <View style={styles.actionContainer}>
          <Button
            title={actionLabel}
            onPress={onAction}
            size="small"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionContainer: {
    marginTop: 16,
  },
});

export default EmptyState;
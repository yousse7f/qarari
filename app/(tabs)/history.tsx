import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { loadAllDecisions, deleteDecision } from '@/utils/storage';
import { Decision } from '@/types/decisions';
import { useRouter } from 'expo-router';
import DecisionCard from '@/components/DecisionCard';
import EmptyState from '@/components/EmptyState';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';

export default function HistoryScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { t } = useLanguage();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    loadDecisionsData();
  }, []);

  const loadDecisionsData = async () => {
    try {
      setLoading(true);
      const loadedDecisions = await loadAllDecisions();
      setDecisions(loadedDecisions || []);
    } catch (error) {
      console.error('Error loading decisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDecision(id);
      setDecisions(decisions.filter(decision => decision.id !== id));
    } catch (error) {
      console.error('Error deleting decision:', error);
    }
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (decisions.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          title={t('noDecisionsFound')}
          description={t('noDecisionsDesc')}
          icon="clipboard-list"
          actionLabel={t('startNewDecision')}
          onAction={() => router.push('/create')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t('decisionHistory')}
        </Text>
        <Pressable
          onPress={toggleDeleteMode}
          style={({ pressed }) => [
            styles.deleteButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
        >
          <Text
            style={{
              color: deleteMode ? theme.colors.error : theme.colors.primary,
              fontFamily: 'Inter-Medium'
            }}
          >
            {deleteMode ? t('done') : t('edit')}
          </Text>
        </Pressable>
      </View>

      {deleteMode && (
        <View
          style={[
            styles.deleteWarning,
            { backgroundColor: theme.colors.errorLight, borderColor: theme.colors.error }
          ]}
        >
          <AlertTriangle size={20} color={theme.colors.error} />
          <Text style={[styles.deleteWarningText, { color: theme.colors.error }]}>
            {t('tapToDelete')}
          </Text>
        </View>
      )}

      <FlatList
        data={decisions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DecisionCard
            decision={item}
            onPress={deleteMode ? () => handleDelete(item.id) : undefined}
            deleteMode={deleteMode}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
          {t('copyright')}
        </Text>
        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
          {t('tagline')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  deleteButton: {
    padding: 8,
  },
  deleteWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  deleteWarningText: {
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  listContent: {
    gap: 12,
    paddingBottom: 20,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 4,
  },
});
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, ChevronRight } from 'lucide-react-native';
import { Decision } from '@/types/decisions';
import { loadRecentDecisions } from '@/utils/storage';
import DecisionCard from '@/components/DecisionCard';
import EmptyState from '@/components/EmptyState';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [recentDecisions, setRecentDecisions] = useState<Decision[]>([]);
  const buttonAnim = new Animated.Value(1);

  useEffect(() => {
    loadRecentDecisions().then(decisions => {
      setRecentDecisions(decisions || []);
    });
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const navigateToCreate = () => {
    router.push('/create');
  };

  const navigateToHistory = () => {
    router.push('/history');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/6980885/pexels-photo-6980885.jpeg' }}
          // or Take this
          // source={require('@/assets/images/v.png')}
          style={styles.heroImage}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            {t('makeWiserChoices')}
          </Text>
          <Text style={styles.heroSubtitle}>
            {t('compareOptions')}
          </Text>
        </View>
      </View>

      <Animated.View
        style={[
          styles.createButtonContainer,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            transform: [{ scale: buttonAnim }]
          }
        ]}
      >
        <Pressable
          onPress={navigateToCreate}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.createButton}
        >
          <View style={styles.createButtonContent}>
            <View>
              <Text style={[styles.createButtonTitle, { color: theme.colors.text }]}>
                {t('startNewDecision')}
              </Text>
              <Text style={[styles.createButtonSubtitle, { color: theme.colors.textSecondary }]}>
                {t('compareOptionsSubtitle')}
              </Text>
            </View>
            <View style={[styles.arrowContainer, { backgroundColor: theme.colors.primary }]}>
              <ArrowRight color={theme.colors.background} size={20} />
            </View>
          </View>
        </Pressable>
      </Animated.View>

      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('recentDecisions')}
          </Text>
          {recentDecisions.length > 0 && (
            <Pressable onPress={navigateToHistory} style={styles.viewAllButton}>
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                {t('viewAll')}
              </Text>
              <ChevronRight size={16} color={theme.colors.primary} />
            </Pressable>
          )}
        </View>

        {recentDecisions.length > 0 ? (
          <View style={styles.decisionsList}>
            {recentDecisions.slice(0, 3).map(decision => (
              <DecisionCard key={decision.id} decision={decision} />
            ))}
          </View>
        ) : (
          <EmptyState
            title={t('noRecentDecisions')}
            description={t('startFirstDecision')}
            icon="clipboard-list"
          />
        )}
      </View>

      <View style={styles.tipsContainer}>
        <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>
          {t('decisionTips')}
        </Text>
        <View style={[styles.tipCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.tipText, { color: theme.colors.text }]}>
            {t('tip1')}
          </Text>
        </View>
        <View style={[styles.tipCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.tipText, { color: theme.colors.text }]}>
            {t('tip2')}
          </Text>
        </View>
        <View style={[styles.tipCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.tipText, { color: theme.colors.text }]}>
            {t('tip3')}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  heroContainer: {
    height: 200,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 32,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroTitle: {
    fontFamily: 'cairo-Bold',
    fontSize: 20,
    marginBottom: 4,
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontFamily: 'cairo-Regular',
    fontSize: 14,
    opacity: 0.9,
    color: '#FFFFFF',
  },
  createButtonContainer: {
    marginTop: -24,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  createButton: {
    padding: 16,
  },
  createButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  createButtonTitle: {
    fontFamily: 'cairo-Bold',
    fontSize: 18,
  },
  createButtonSubtitle: {
    fontFamily: 'cairo-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginRight: 4,
  },
  decisionsList: {
    gap: 12,
  },
  tipsContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  tipsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 12,
  },
  tipCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
});
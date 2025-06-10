import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Share, Platform } from 'react-native';
import { Clipboard } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Decision } from '@/types/decisions';
import { loadDecision } from '@/utils/storage';
import ResultsTable from '@/components/ResultsTable';
import { formatDate } from '@/utils/helpers';
import Button from '@/components/Button';
import { ArrowLeft, Share2, Copy, Check } from 'lucide-react-native';
import { generateAIInsights } from '@/utils/ai';
// import PrintButton from '@/components/PrintButton';

export default function ResultScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const handleCopyInsights = async () => {
    if (!insights) return;

    await Clipboard.setString(insights);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (id) {
      loadDecisionData(id);
    }
  }, [id]);

  const loadDecisionData = async (decisionId: string) => {
    try {
      setLoading(true);
      const loadedDecision = await loadDecision(decisionId);
      if (loadedDecision) {
        setDecision(loadedDecision);
      } else {
        console.error('Decision not found');
      }
    } catch (error) {
      console.error('Error loading decision:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    if (!decision) return;

    try {
      const winningOption = decision.results.optionScores[0].option.name;
      const message = `${t('shareMessage').replace('{title}', decision.title).replace('{result}', winningOption)}`;

      await Share.share({
        message,
        title: t('shareTitle'),
      });
    } catch (error) {
      console.error('Error sharing decision:', error);
    }
  };

  const handleGenerateInsights = async () => {
    if (!decision) return;

    try {
      setLoadingInsights(true);
      const result = await generateAIInsights(decision);
      setInsights(result);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Sorry, we could not generate insights at this time. Please try again later.');
    } finally {
      setLoadingInsights(false);
    }
  };

  const getWinnerMessage = () => {
    if (!decision || !decision.results.optionScores.length) return '';

    const winner = decision.results.optionScores[0];
    const runnerUp = decision.results.optionScores[1];

    if (!runnerUp) {
      return t('clearChoice').replace('{option}', winner.option.name);
    }

    const scoreDifference = (winner.score - runnerUp.score).toFixed(1);
    const percentageDifference = (((winner.score - runnerUp.score) / runnerUp.score) * 100).toFixed(0);

    if (winner.score - runnerUp.score < 0.5) {
      return t('narrowMargin').replace('{option}', winner.option.name);
    } else if (winner.score - runnerUp.score < 2) {
      return t('betterBy')
        .replace('{option}', winner.option.name)
        .replace('{points}', scoreDifference)
        .replace('{percent}', percentageDifference);
    } else {
      return t('decisivelyBetter')
        .replace('{option}', winner.option.name)
        .replace('{points}', scoreDifference);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!decision) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>{t('decisionNotFound')}</Text>
        <Button title={t('goBack')} onPress={handleBack} style={{ marginTop: 16 }} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[
        styles.header,
        {
          backgroundColor: theme.colors.card,
          borderBottomColor: theme.colors.border,
          paddingTop: Platform.OS === 'web' ? 16 : insets.top,
        }
      ]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {t('results')}
        </Text>
        <Pressable onPress={handleShare} style={styles.shareButton}>
          <Share2 size={20} color={theme.colors.text} />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{decision.title}</Text>
          <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
            {formatDate(decision.createdAt)}
          </Text>
        </View>

        {decision.description && (
          <View style={[styles.descriptionContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.description, { color: theme.colors.text }]}>
              {decision.description}
            </Text>
          </View>
        )}

        <View style={[styles.resultCard, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.resultTitle}>{t('result')}</Text>
          <Text style={styles.winnerMessage}>{getWinnerMessage()}</Text>
          <View style={styles.scoreContainer}>
            {decision.results.optionScores.slice(0, 3).map((result, index) => (
              <View
                key={result.option.id}
                style={[
                  styles.placementBadge,
                  { backgroundColor: index === 0 ? theme.colors.successLight : theme.colors.background }
                ]}
              >
                <Text
                  style={[
                    styles.placementText,
                    { color: index === 0 ? theme.colors.success : theme.colors.primary }
                  ]}
                >
                  {t(`place${index + 1}`)}
                </Text>
                <Text
                  style={[
                    styles.placementOption,
                    {
                      color: index === 0 ? theme.colors.success : theme.colors.primary,
                      fontFamily: index === 0 ? 'Inter-Bold' : 'Inter-Medium',
                    }
                  ]}
                >
                  {result.option.name}
                </Text>
                <Text
                  style={[
                    styles.placementScore,
                    { color: index === 0 ? theme.colors.success : theme.colors.primary }
                  ]}
                >
                  {result.score.toFixed(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.tableContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('detailedBreakdown')}</Text>
          <ResultsTable decision={decision} />
        </View>

        <View style={styles.insightsContainer}>
          <View style={styles.insightsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('aiInsights')}</Text>
            {!insights && !loadingInsights && (
              <Button
                title={t('generateInsights')}
                onPress={handleGenerateInsights}
                variant="outline"
                style={{ alignSelf: 'flex-start' }}
              />
            )}
          </View>

          {loadingInsights ? (
            <View style={[styles.insightsLoading, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <ActivityIndicator color={theme.colors.primary} />
              <Text style={[styles.insightsLoadingText, { color: theme.colors.textSecondary }]}>
                {t('generatingInsights')}
              </Text>
            </View>
          ) : insights ? (
            <View style={[styles.insightsContent, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <View style={styles.insightsHeader}>
                <Text style={[styles.insights, { color: theme.colors.text }]}>{insights}</Text>
                <Pressable
                  onPress={handleCopyInsights}
                  style={({ pressed }) => [
                    styles.copyButton,
                    { opacity: pressed ? 0.7 : 1 }
                  ]}
                >
                  {copied ? (
                    <Check size={20} color={theme.colors.success} />
                  ) : (
                    <Copy size={20} color={theme.colors.text} />
                  )}
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={[styles.insightsPlaceholder, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.insightsPlaceholderText, { color: theme.colors.textSecondary }]}>
                {t('insightsPlaceholder')}
              </Text>
            </View>
          )}
        </View>

        {/* <View style={styles.buttonContainer}>
          <PrintButton decisionData={decision} />
        </View> */}

        <View style={styles.actionsContainer}>
          <Button
            title={t('editDecision')}
            onPress={() => router.push(`/edit/${decision.id}`)}
            variant="outline"
            style={{ marginRight: 8, flex: 1 }}
          />
          <Button
            title={t('newDecision')}
            onPress={() => router.push('/create')}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    flex: 1,
    marginHorizontal: 16,
    textAlign: 'center',
  },
  shareButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 32,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  descriptionContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  resultCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  resultTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  winnerMessage: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  scoreContainer: {
    gap: 8,
  },
  placementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  placementText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    marginRight: 12,
  },
  placementOption: {
    flex: 1,
    fontSize: 14,
  },
  placementScore: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  tableContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 16,
  },
  insightsContainer: {
    marginBottom: 24,
  },
  insightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightsContent: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1
  },
  // insightsHeader: {
  //   flexDirection: 'row',
  //   alignItems: 'flex-start',
  //   justifyContent: 'space-between',
  //   gap: 12
  // },
  insights: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 22,
    flex: 1
  },
  copyButton: {
    padding: 4
  },
  insightsPlaceholder: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  insightsPlaceholderText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  insightsLoading: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  insightsLoadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },



});

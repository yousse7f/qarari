import React, { useEffect, useState, useRef } from 'react';
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
import { ArrowLeft, Share2, Copy, Check, Printer } from 'lucide-react-native';
import { generateAIInsights } from '@/utils/ai';
import * as Print from 'expo-print';

export default function ResultScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Hooks and State
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // --- Functions ---
  const handlePrint = async () => {
    // التأكد من وجود بيانات القرار
    if (!decision) {
      console.error("لا يمكن الطباعة، بيانات القرار غير موجودة.");
      return;
    }

    // فلترة الخيارات والمعايير الصحيحة
    const validOptions = decision.options.filter(option => option.name.trim() !== '');
    const validCriteria = decision.criteria.filter(criterion => criterion.name.trim() !== '');

    // بناء كود HTML للتقرير
    const htmlContent = `
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 20px; 
            color: #333;
            direction: ${t('direction', 'ltr')}; /* يضبط اتجاه النص بناءً على اللغة */
          }
          .report-container { 
            border: 1px solid #eee; 
            border-radius: 8px; 
            padding: 25px; 
          }
          h1 { 
            font-size: 28px; 
            text-align: center; 
            margin-bottom: 8px;
            color: #111;
          }
          .date { 
            text-align: center; 
            color: #888; 
            margin-bottom: 24px; 
          }
          h2 { 
            font-size: 20px; 
            border-bottom: 2px solid #eee; 
            padding-bottom: 8px; 
            margin-top: 30px; 
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 16px; 
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: center; 
          }
          th { 
            background-color: #f8f8f8; 
            font-weight: bold;
          }
          .criteria-name {
            font-weight: 500;
            text-align: left;
          }
          .total-row {
            background-color: #f0f8ff;
            font-weight: bold;
          }
          .winner-card {
            background-color: #007bff;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 24px;
          }
          .winner-message {
            font-size: 24px;
            font-weight: bold;
          }
        </style>
        <title>${decision.title}</title>
      </head>
      <body>
        <div class="report-container">
          <h1>${decision.title}</h1>
          <p class="date">${formatDate(decision.createdAt)}</p>

          <div class="winner-card">
            <div class="winner-message">${getWinnerMessage()}</div>
          </div>

          <h2>${t('detailedBreakdown', 'Detailed Breakdown')}</h2>
          <table>
            <thead>
              <tr>
                <th>${t('criteria', 'Criteria')}</th>
                ${validOptions.map(option => `<th>${option.name}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${validCriteria.map(criterion => `
                <tr>
                  <td class="criteria-name">${criterion.name}</td>
                  ${validOptions.map(option => `<td>${option.ratings[criterion.id] || '0'}</td>`).join('')}
                </tr>
              `).join('')}
              <tr class="total-row">
                <td>${t('total', 'Total')}</td>
                ${decision.results.optionScores.map(result => `<td>${result.score.toFixed(1)}</td>`).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `;

    // الطباعة باستخدام expo-print
    try {
      if (Platform.OS === 'web') {
        // على الويب، هذه الطريقة تعمل بشكل أفضل
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        window.open(uri); // تفتح الـ PDF في تبويب جديد ليقوم المستخدم بطباعته
      } else {
        // على الجوال، هذه الطريقة تفتح نافذة الطباعة مباشرة
        await Print.printAsync({ html: htmlContent });
      }
    } catch (error) {
      console.error("فشل في الطباعة:", error);
    }
  };

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
      await Share.share({ message, title: t('shareTitle') });
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
      setInsights('نأسف لعدم توفر هذه الميزة في الوقت الحالي، شكرا لتفهمكم.');
    } finally {
      setLoadingInsights(false);
    }
  };

  const getWinnerMessage = () => {
    if (!decision || !decision.results.optionScores.length) return '';
    const scores = decision.results.optionScores;
    const winner = scores[0];
    const winnerScore = winner.score;

    // تحقق من تساوي جميع الخيارات
    const allEqual = scores.every(opt => opt.score === winnerScore);

    // تحقق من وجود بعض الخيارات المتساوية مع  (وليس جميعها)
    const someEqual = scores.slice(1).some(opt => opt.score === winnerScore);

    //  الخيارات متساوية
    if (allEqual) {
      return t('optionsEqual');
    }

    //  بعض الخيارات متساوية (وليس جميعها)
    if (someEqual) {
      return t('optionsSomeEqual');
    }

    // حساب الفارق بين الأول والثاني
    const second = scores[1];
    if (!second) {
      // يوجد خيار واحد فقط
      return t('clearChoice').replace('{option}', winner.option.name);
    }
    const diff = winnerScore - second.score;
    const percent = second.score === 0 ? 100 : ((diff / second.score) * 100);

    //  الفارق صغير جداً (مثلاً أقل من 1 نقطة أو أقل من 5%)
    if (diff < 1 || percent < 5) {
      return t('narrowMargin').replace('{option}', winner.option.name);
    }

    //  الفارق متوسط (مثلاً أقل من 3 نقاط أو أقل من 15%)
    if (diff < 3 || percent < 15) {
      return t('betterBy')
        .replace('{option}', winner.option.name)
        .replace('{points}', diff.toFixed(1))
        .replace('{percent}', percent.toFixed(1));
    }
    if (diff > 3 || percent > 15) {
      //  الفارق كبير (3 نقاط أو أكثر أو 15% أو أكثر)
      return t('decisivelyBetter')
        .replace('{option}', winner.option.name)
        .replace('{points}', diff.toFixed(1));
    }
  };

  // --- Render Logic ---
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
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border, paddingTop: Platform.OS === 'web' ? 16 : insets.top, }]}>
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
        <View style={{ backgroundColor: theme.colors.background, padding: 1 }}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{decision.title}</Text>
            <Text style={[styles.date, { color: theme.colors.textSecondary }]}>{formatDate(decision.createdAt)}</Text>
          </View>

          {decision.description && (
            <View style={[styles.descriptionContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.description, { color: theme.colors.text }]}>{decision.description}</Text>
            </View>
          )}

          <View style={[styles.resultCard, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.resultTitle}>{t('result')}</Text>
            <Text style={styles.winnerMessage}>{getWinnerMessage()}</Text>
            <View style={styles.scoreContainer}>
              {decision.results.optionScores.slice(0, 3).map((result, index) => (
                <View key={result.option.id} style={[styles.placementBadge, { backgroundColor: index === 0 ? theme.colors.successLight : theme.colors.background }]}>
                  <Text style={[styles.placementText, { color: index === 0 ? theme.colors.success : theme.colors.primary }]}>{t(`place${index + 1}`)}</Text>
                  <Text style={[styles.placementOption, { color: index === 0 ? theme.colors.success : theme.colors.primary, fontFamily: index === 0 ? 'Inter-Bold' : 'Inter-Medium' }]}>{result.option.name}</Text>
                  <Text style={[styles.placementScore, { color: index === 0 ? theme.colors.success : theme.colors.primary }]}>{result.score.toFixed(1)}</Text>
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
              {!insights && !loadingInsights && (<Button title={t('generateInsights')} onPress={handleGenerateInsights} variant="outline" style={{ alignSelf: 'flex-start' }} />)}
            </View>
            {loadingInsights ? (
              <View style={[styles.insightsLoading, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                <ActivityIndicator color={theme.colors.primary} />
                <Text style={[styles.insightsLoadingText, { color: theme.colors.textSecondary }]}>{t('generatingInsights')}</Text>
              </View>
            ) : insights ? (
              <View style={[styles.insightsContent, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                <View style={styles.insightsHeader}>
                  <Text style={[styles.insights, { color: theme.colors.text }]}>{insights}</Text>
                  <Pressable onPress={handleCopyInsights} style={({ pressed }) => [styles.copyButton, { opacity: pressed ? 0.7 : 1 }]}>
                    {copied ? (<Check size={20} color={theme.colors.success} />) : (<Copy size={20} color={theme.colors.text} />)}
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={[styles.insightsPlaceholder, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                <Text style={[styles.insightsPlaceholderText, { color: theme.colors.textSecondary }]}>{t('insightsPlaceholder')}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.printButtonContainer}>
          <Button
            title={t('printReport')}
            onPress={handlePrint}
            variant="outline"
            icon={<Printer size={16} color={theme.colors.primary} />}
          />
        </View>

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
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  errorText: { fontFamily: 'Inter-Medium', fontSize: 18, textAlign: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingBottom: 12, paddingHorizontal: 16, borderBottomWidth: 1 },
  backButton: { padding: 8 },
  headerTitle: { fontFamily: 'Inter-Bold', fontSize: 18, flex: 1, marginHorizontal: 16, textAlign: 'center' },
  shareButton: { padding: 8 },
  scrollView: { flex: 1 },
  scrollViewContent: { padding: 16, paddingBottom: 32 },
  titleContainer: { marginBottom: 16 },
  title: { fontFamily: 'Inter-Bold', fontSize: 22, marginBottom: 4 },
  date: { fontFamily: 'Inter-Regular', fontSize: 14 },
  descriptionContainer: { padding: 16, borderRadius: 8, marginBottom: 24, borderWidth: 1 },
  description: { fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 20 },
  resultCard: { borderRadius: 12, padding: 16, marginBottom: 24 },
  resultTitle: { fontFamily: 'Inter-Bold', fontSize: 16, color: 'white', marginBottom: 8, textAlign: 'center' },
  winnerMessage: { fontFamily: 'Inter-Bold', fontSize: 24, color: 'white', textAlign: 'center', marginBottom: 16 },
  scoreContainer: { gap: 8 },
  placementBadge: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8 },
  placementText: { fontFamily: 'Inter-Bold', fontSize: 14, marginRight: 12 },
  placementOption: { flex: 1, fontSize: 14 },
  placementScore: { fontFamily: 'Inter-Bold', fontSize: 14 },
  tableContainer: { marginBottom: 24 },
  sectionTitle: { fontFamily: 'Inter-Bold', fontSize: 18, marginBottom: 16 },
  insightsContainer: { marginBottom: 24 },
  insightsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  insightsContent: { padding: 16, borderRadius: 8, borderWidth: 1 },
  insights: { fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 22, flex: 1 },
  copyButton: { padding: 4 },
  insightsPlaceholder: { padding: 16, borderRadius: 8, borderWidth: 1, borderStyle: 'dashed' },
  insightsPlaceholderText: { fontFamily: 'Inter-Regular', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  insightsLoading: { padding: 16, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  insightsLoadingText: { fontFamily: 'Inter-Regular', fontSize: 14, marginTop: 8 },
  printButtonContainer: { marginBottom: 16, marginTop: 8 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
});
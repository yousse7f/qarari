import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Decision } from '@/types/decisions';
import { calculatePercentage } from '@/utils/calculations';
import { useLanguage } from '@/context/LanguageContext';

type ResultReportProps = {
    decision: Decision;
};

const ResultReport = ({ decision }: ResultReportProps) => {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const { options, criteria, results } = decision;

    // Filter out any empty options or criteria
    const validOptions = options.filter(option => option.name.trim() !== '');
    const validCriteria = criteria.filter(criterion => criterion.name.trim() !== '');

    return (
        <View style={styles.container}>
            {validOptions.slice(0, 1).map(option => (
                <View key={option.id} style={[styles.optionBlock, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                    <Text style={[styles.optionTitle, { color: theme.colors.primary }]}>{t('bestOption')}{option.name}</Text>
                    <Text style={[styles.optionTitle, { color: theme.colors.textSecondary, fontSize: 10, fontWeight: "100" }]}>{t('recommendations')}</Text>
                    {validCriteria.map(criterion => {
                        const value = option.ratings[criterion.id] || 0;
                        const max = 10;
                        const percent = calculatePercentage(value, max);
                        const improvePercent = value < max ? ((max - value) / max) * 100 : 0;
                        const allCriteriaComplete = validCriteria.every(c => (option.ratings[c.id] || 0) === max);
                        if (allCriteriaComplete && criterion.id === validCriteria[0].id) {
                            return (
                                <Text key="all-complete" style={[styles.criterionText, { color: theme.colors.text }]}>
                                    {t('allCompletedStandar')}
                                </Text>
                            );
                        }

                        if (allCriteriaComplete) {
                            return null;
                        }

                        return (
                            <Text key={criterion.id} style={[styles.criterionText, { color: theme.colors.text }]}>
                                {t('standard')} {criterion.name} {t('option')}  {option.name} = {value} من {max}
                                {value < max
                                    ? `${t('recommendation')} ${improvePercent.toFixed(0)}%`
                                    : t('completedStandar')
                                }
                            </Text>
                        );
                    })}
                    <Text style={[styles.totalText, { color: theme.colors.textSecondary }]}>
                        {t('total')} {results.optionScores.find(r => r.option.id === option.id)?.score.toFixed(1)} من {results.highestPossibleScore}
                        {' '}({calculatePercentage(
                            results.optionScores.find(r => r.option.id === option.id)?.score || 0,
                            results.highestPossibleScore
                        ).toFixed(0)}%)
                    </Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 16,
    },
    optionBlock: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    optionTitle: {
        fontFamily: 'Cairo-Bold',
        fontSize: 16,
        marginBottom: 8,
    },
    criterionText: {
        fontFamily: 'Cairo-Regular',
        fontSize: 14,
        marginBottom: 4,
    },
    totalText: {
        fontFamily: 'Cairo-Bold',
        fontSize: 13,
        marginTop: 8,
        textAlign: 'left',
    },
});

export default ResultReport;

import React from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Decision } from '@/types/decisions';
import { calculatePercentage } from '@/utils/calculations';

const MIN_CELL_WIDTH = 120; // Minimum width for each cell

type ResultsTableProps = {
  decision: Decision;
};

const ResultsTable = ({ decision }: ResultsTableProps) => {
  const { theme } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const { options, criteria, results } = decision;

  // Filter out any empty options or criteria
  const validOptions = options.filter(option => option.name.trim() !== '');
  const validCriteria = criteria.filter(criterion => criterion.name.trim() !== '');

  // Calculate cell width to fill screen
  const totalColumns = validOptions.length + 1; // +1 for criteria column
  const cellWidth = Math.max(MIN_CELL_WIDTH, (windowWidth - 32) / totalColumns);

  return (
    <View style={[styles.container, { width: windowWidth - 32, borderColor: theme.colors.border }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ width: cellWidth * totalColumns }}>
          {/* Header Row */}
          <View style={[styles.headerRow, { borderColor: theme.colors.border }]}>
            {validOptions.map(option => (
              <View
                key={option.id}
                style={[
                  styles.headerCell,
                  { borderColor: theme.colors.border, width: cellWidth }
                ]}
              >
                <Text
                  style={[styles.headerText, { color: theme.colors.text }]}
                  numberOfLines={1}
                >
                  {option.name}
                </Text>
              </View>
            ))}
            <View style={[
              styles.headerCell,
              { borderColor: theme.colors.border, width: cellWidth }
              ]}>
              <Text style={[styles.headerText, { color: theme.colors.textSecondary }]}>
                المعايير
              </Text>
            </View>
          </View>
          {/* Criteria Rows */}
          {validCriteria.map(criterion => (
            <View key={criterion.id} style={[styles.dataRow, { borderColor: theme.colors.border }]}>
              {validOptions.map(option => (
                <View
                  key={option.id}
                  style={[
                    styles.dataCell,
                    { borderColor: theme.colors.border, width: cellWidth }
                  ]}
                >
                  <Text style={[styles.dataText, { color: theme.colors.text }]}>
                    {option.ratings[criterion.id] || '0'}
                  </Text>
                </View>
              ))}
                            <View style={[
                styles.labelCell,
                { borderColor: theme.colors.border, width: cellWidth }
              ]}>
                <Text style={[styles.labelText, { color: theme.colors.text }]}>
                  {criterion.name}
                </Text>
              </View>
            </View>
          ))}
          {/* Total Row */}
          <View style={[styles.totalRow, { backgroundColor: theme.colors.card }]}>   
            {results.optionScores.map(result => (
              <View
                key={result.option.id}
                style={[
                  styles.dataCell,
                  { borderColor: theme.colors.border, width: cellWidth }
                ]}
              >
                <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
                  {result.score.toFixed(1)}
                </Text>
                <Text style={[styles.percentageText, { color: theme.colors.textSecondary }]}>
                  ({calculatePercentage(result.score, results.highestPossibleScore).toFixed(0)}%)
                </Text>
              </View>
            ))}
            <View style={[
              styles.labelCell,
              { borderColor: theme.colors.border, width: cellWidth }
            ]}>
              <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
                المجموع
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    overflow: 'hidden',
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'center',
  },
  headerRow: {
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    borderBottomWidth: 2,
  },
  headerCell: {
    padding: 10,
    borderRightWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    textAlign: 'center',
    fontFamily: 'cairo-Bold',
    fontSize: 10,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  labelCell: {
    padding: 10,
    borderRightWidth: 1,
    justifyContent: 'center',
  },
  labelText: {
    textAlign: 'center',
    fontFamily: 'Cairo-Medium',
    fontSize: 10,
  },
  dataCell: {
    padding: 10,
    borderRightWidth: 1,
    alignItems: 'center',

  },
  dataText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  totalRow: {
    flexDirection: 'row',
  },
  totalLabel: {
    textAlign: 'center',
    fontFamily: 'Cairo-Medium',
    fontSize: 10,
  },
  totalValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  percentageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
});

export default ResultsTable;
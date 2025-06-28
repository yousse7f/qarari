// components/PrintableResultsTable.tsx

import React, { useRef } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Print from 'expo-print';

// 1. استيراد الأنواع اللازمة من مشروعك
import { Decision } from '@/types/decisions';
import { useTheme } from '@/context/ThemeContext';
import { calculatePercentage } from '@/utils/calculations';
import ResultsTable from './ResultsTable'; // استيراد المكون الأصلي للعرض على الشاشة

// 2. تحديد الـ props للمكون الجديد (نفس props المكون الأصلي)
type PrintableResultsTableProps = {
  decision: Decision;
};

// --- عرض الطباعة: نسخة مبسطة من جدولك بدون ScrollView ---
const PrintLayout = ({ decision }: { decision: Decision }) => {
  const { theme } = useTheme();
  const { options, criteria, results } = decision;
  const validOptions = options.filter(option => option.name.trim() !== '');
  const validCriteria = criteria.filter(criterion => criterion.name.trim() !== '');
  const cellWidth = 120; // عرض ثابت للخلايا في نسخة الطباعة

  return (
    <View style={styles.printContainer}>
      {/* يمكنك إضافة عنوان هنا إذا أردت */}
      <Text style={[styles.printTitle, { color: theme.colors.text }]}>Decision Results</Text>

      <View style={{ width: (validOptions.length + 1) * cellWidth, borderColor: theme.colors.border, borderWidth: 1 }}>
        {/* Header Row */}
        <View style={[styles.headerRow, { borderColor: theme.colors.border }]}>
          <View style={[styles.headerCell, { borderColor: theme.colors.border, width: cellWidth }]}><Text style={[styles.headerText, { color: theme.colors.textSecondary }]}>Criteria</Text></View>
          {validOptions.map(option => (
            <View key={option.id} style={[styles.headerCell, { borderColor: theme.colors.border, width: cellWidth }]}><Text style={[styles.headerText, { color: theme.colors.text }]}>{option.name}</Text></View>
          ))}
        </View>

        {/* Criteria Rows */}
        {validCriteria.map(criterion => (
          <View key={criterion.id} style={[styles.dataRow, { borderColor: theme.colors.border }]}>
            <View style={[styles.labelCell, { borderColor: theme.colors.border, width: cellWidth }]}><Text style={[styles.labelText, { color: theme.colors.text }]}>{criterion.name}</Text></View>
            {validOptions.map(option => (
              <View key={option.id} style={[styles.dataCell, { borderColor: theme.colors.border, width: cellWidth }]}><Text style={[styles.dataText, { color: theme.colors.text }]}>{option.ratings[criterion.id] || '0'}</Text></View>
            ))}
          </View>
        ))}

        {/* Total Row */}
        <View style={[styles.totalRow, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.labelCell, { borderColor: theme.colors.border, width: cellWidth }]}><Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total</Text></View>
          {results.optionScores.map(result => (
            <View key={result.option.id} style={[styles.dataCell, { borderColor: theme.colors.border, width: cellWidth }]}>
              <Text style={[styles.totalValue, { color: theme.colors.primary }]}>{result.score.toFixed(1)}</Text>
              <Text style={[styles.percentageText, { color: theme.colors.textSecondary }]}>({calculatePercentage(result.score, results.highestPossibleScore).toFixed(0)}%)</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};


const PrintableResultsTable: React.FC<PrintableResultsTableProps> = ({ decision }) => {
  const viewShotRef = useRef<ViewShot>(null);

  const handlePrint = async () => {
    if (!viewShotRef.current?.capture) return;

    try {
      // 3. التقاط الصورة وإضافة هوامش للطباعة
      const uri = await viewShotRef.current.capture();
      const html = `
        <html>
          <body style="margin: 0; padding: 20px;">
            <img src="data:image/png;base64,${uri}" style="width: 100%;" />
          </body>
        </html>`;

      await Print.printAsync({ html });
    } catch (e) {
      console.error("Failed to print:", e);
    }
  };

  return (
    <View>
      {/* 4. الجزء الخفي الذي سنلتقط منه الصورة */}
      <View style={styles.hiddenContainer}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
          <PrintLayout decision={decision} />
        </ViewShot>
      </View>

      {/* 5. عرض المكون الأصلي على الشاشة للمستخدم */}
      <ResultsTable decision={decision} />

      {/* 6. زر الطباعة */}
      <View style={styles.buttonWrapper}>
        <Button title="طباعة النتائج" onPress={handlePrint} />
      </View>
    </View>
  );
};

// 7. التنسيقات (العديد منها منسوخ من ملفك الأصلي)
const styles = StyleSheet.create({
  // --- Styles for PrintLayout ---
  printContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF', // خلفية بيضاء ثابتة للطباعة
    alignItems: 'flex-start',
  },
  printTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  // --- Styles for containers ---
  hiddenContainer: {
    position: 'absolute',
    top: -10000, // إخفاء المكون خارج الشاشة
    left: 0,
    opacity: 0,
  },
  buttonWrapper: {
    margin: 16,
    marginTop: 24,
  },
  // --- Copied styles from ResultsTable.tsx ---
  headerRow: { flexDirection: 'row', borderBottomWidth: 2 },
  headerCell: { padding: 12, borderRightWidth: 1 },
  headerText: { fontFamily: 'Inter-Bold', fontSize: 14 },
  dataRow: { flexDirection: 'row', borderBottomWidth: 1 },
  labelCell: { padding: 12, borderRightWidth: 1, justifyContent: 'center' },
  labelText: { fontFamily: 'Inter-Medium', fontSize: 14 },
  dataCell: { padding: 12, borderRightWidth: 1, alignItems: 'center' },
  dataText: { fontFamily: 'Inter-Regular', fontSize: 14 },
  totalRow: { flexDirection: 'row' },
  totalLabel: { fontFamily: 'Inter-Bold', fontSize: 14 },
  totalValue: { fontFamily: 'Inter-Bold', fontSize: 16 },
  percentageText: { fontFamily: 'Inter-Regular', fontSize: 12 },
});

export default PrintableResultsTable;
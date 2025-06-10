// مسار الملف: components/PrintButton.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Alert } from 'react-native';
import * as Print from 'expo-print';
import { Decision } from '@/types/decisions';
import { Ionicons } from '@expo/vector-icons';

type PrintButtonProps = {
  decisionData: Decision | null | undefined;
};

const PrintButton: React.FC<PrintButtonProps> = ({ decisionData }) => {
  // دالة createHtmlForPrint والمنطق الداخلي لا يتغيران
  const createHtmlForPrint = (data: Decision): string => {
    // ... (لا حاجة لتغيير هذا الجزء، فهو يعمل بشكل صحيح)
    const optionsRows = data.options?.map(option => `
      <tr>
        <td>${option.name || 'N/A'}</td>
        <td>${option.finalScore?.toFixed(2) || 'N/A'}%</td>
      </tr>
    `).join('') || '';

    const criteriaSections = data.criteria?.map(criterion => `
      <div class="criterion"><h3>- المعيار: ${criterion.name || 'N/A'} (الأهمية: ${criterion.weight || 0}%)</h3></div>
    `).join('') || '';

    return `<html><head><style>/* ... أنماط الـ HTML ... */</style></head><body><h1>تقرير: ${data.name || ''}</h1>${optionsRows}${criteriaSections}</body></html>`;
  };

  const print = async () => {
    if (!decisionData) {
      Alert.alert("خطأ", "لا توجد بيانات متاحة للطباعة.");
      return;
    }
    const htmlContent = createHtmlForPrint(decisionData);
    const fileName = decisionData.name ? decisionData.name.replace(/\s/g, '_') : 'Report';
    try {
      await Print.printAsync({
        html: htmlContent,
        printerName: `Decision-${fileName}`,
      });
    } catch (error) {
      console.error("Error printing:", error);
      Alert.alert("خطأ في الطباعة", "حدث خطأ غير متوقع.");
    }
  };

  // سنقوم بتفعيل حالة "معطل" إذا لم تكن هناك بيانات للطباعة
  const isDisabled = !decisionData;

  // ============================================
  // === هذا هو الجزء الذي تم تكييفه ليناسب أنماطك ===
  // ============================================
  return (
    // نستخدم anmaطك ونضيف حالة التعطيل
    <TouchableOpacity 
      style={[styles.button, isDisabled && styles.disabled]} 
      onPress={print} 
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="print-outline" size={20} color={styles.text.color} />
      </View>
      <Text style={styles.text}>
       Print the report طباعة التقرير
      </Text>
    </TouchableOpacity>
  );
};

// ==============================================================
// === هنا قمنا بدمج أنماطك مع بعض الخصائص الإضافية للتصميم ===
// ==============================================================
const styles = StyleSheet.create({
button: {
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  borderColor: 'rgb(96, 165, 250)',
  borderWidth: 1, 
  paddingVertical: 14,
  paddingHorizontal: 20,
  marginTop: 10,
  marginBottom: 10,
},
  text: {
    // هذه أنماطك
    fontFamily: 'Inter-Medium', // تأكد من أن هذا الخط مُحمّل في مشروعك
    textAlign: 'center',
    // خصائص إضافية مقترحة
    color: 'white', // لون النص
    fontSize: 16,
  },
  disabled: {
    // هذا نمطك لحالة التعطيل
    opacity: 0.5,
  },
  iconContainer: {
    // هذا نمطك لحاوية الأيقونة
    marginRight: 8,
  },
});

export default PrintButton;
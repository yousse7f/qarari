// مسار الملف: app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, StyleSheet, View, I18nManager } from 'react-native';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

// 1. نستورد useFonts من expo-font
import { useFonts } from 'expo-font';

// 2. نستورد كل أوزان خط Cairo التي نريدها من الحزمة الجديدة
import {
  Cairo_300Light,
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
  Cairo_900Black,
} from '@expo-google-fonts/cairo';

export default function RootLayout() {
  useFrameworkReady();

  // هذا الجزء يبقى كما هو
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(false);

  // 3. نقوم بتحميل الخطوط الجديدة هنا
  const [fontsLoaded] = useFonts({
    // 'Inter-Regular': Inter_400Regular,
    // 'Inter-Medium': Inter_500Medium,
    // 'Inter-Bold': Inter_700Bold,

    // إضافة خطوط Cairo   
    'Cairo-Light': Cairo_300Light,
    'Cairo-Regular': Cairo_400Regular,
    'Cairo-Medium': Cairo_500Medium,
    'Cairo-SemiBold': Cairo_600SemiBold,
    'Cairo-Bold': Cairo_700Bold,
    'Cairo-Black': Cairo_900Black,
  });

  // شاشة التحميل تبقى كما هي
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // باقي الكود يبقى كما هو تمامًا
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <LanguageProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </LanguageProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

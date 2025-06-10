// مسار الملف: app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Chrome as Home, History, Settings, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function TabLayout() {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 6,
          direction: isRTL ? 'rtl' : 'ltr'
        },
        tabBarLabelStyle: {
          // --- التغيير الأول هنا ---
          fontFamily: 'Cairo-Medium', // تم استبدال 'Inter-Medium'
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTitleStyle: {
          // --- التغيير الثاني هنا ---
          fontFamily: 'Cairo-Bold', // تم استبدال 'Inter-Bold'
          color: theme.colors.text,
          textAlign: isRTL ? 'right' : 'left'
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          // يمكنك تغيير الخط هنا أيضًا إذا أردت، لكن headerTitleStyle هو الذي يطبق النمط العام
          headerTitle: 'قراري', 
        }}
        listeners={{
          tabPress: handlePress,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: t('create'),
          tabBarIcon: ({ color }) => <Plus color={color} size={24} />,
          headerTitle: t('startNewDecision'),
        }}
        listeners={{
          tabPress: handlePress,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('history'),
          tabBarIcon: ({ color }) => <History color={color} size={24} />,
          headerTitle: t('recentDecisions'),
        }}
        listeners={{
          tabPress: handlePress,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ color }) => <Settings color={color} size={24} />,
          headerTitle: t('settings'),
        }}
        listeners={{
          tabPress: handlePress,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

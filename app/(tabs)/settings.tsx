import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Moon, Sun, Info } from 'lucide-react-native';
import InfoModal from '@/components/InfoModal';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('appearance')}</Text>
        <View 
          style={[
            styles.settingItem, 
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
          ]}
        >
          <View style={styles.settingContent}>
            <View style={styles.settingLabelContainer}>
              {isDark ? <Moon size={20} color={theme.colors.text} /> : <Sun size={20} color={theme.colors.text} />}
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{t('darkMode')}</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: theme.colors.primaryLight }}
              thumbColor={isDark ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 24 }]}>{t('language')}</Text>
        <View 
          style={[
            styles.settingItem, 
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
          ]}
        >
          <Pressable
            onPress={() => setLanguage('en')}
            style={({ pressed }) => [
              styles.languageOption,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
              {t('english')}
            </Text>
            {language === 'en' && (
              <View style={[styles.activeDot, { backgroundColor: theme.colors.primary }]} />
            )}
          </Pressable>
          
          <View style={[styles.languageDivider, { backgroundColor: theme.colors.border }]} />
          
          <Pressable
            onPress={() => setLanguage('ar')}
            style={({ pressed }) => [
              styles.languageOption,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
              {t('arabic')}
            </Text>
            {language === 'ar' && (
              <View style={[styles.activeDot, { backgroundColor: theme.colors.primary }]} />
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('about')}</Text>
        <View 
          style={[
            styles.settingItem, 
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
          ]}
        >
          <View style={styles.settingContent}>
            <View style={styles.settingLabelContainer}>
              <Info size={20} color={theme.colors.text} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{t('version')}</Text>
            </View>
            <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>1.0.1</Text>
          </View>
        </View>

        <Pressable
          onPress={() => setShowPrivacyPolicy(true)}
          style={({ pressed }) => [
            styles.settingItem, 
            { 
              backgroundColor: theme.colors.card, 
              borderColor: theme.colors.border,
              opacity: pressed ? 0.7 : 1
            }
          ]}
        >
          <View style={styles.settingContent}>
            <View style={styles.settingLabelContainer}>
              <Info size={20} color={theme.colors.text} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{t('privacyPolicy')}</Text>
            </View>
          </View>
        </Pressable>

        <Pressable
          onPress={() => setShowTerms(true)}
          style={({ pressed }) => [
            styles.settingItem, 
            { 
              backgroundColor: theme.colors.card, 
              borderColor: theme.colors.border,
              opacity: pressed ? 0.7 : 1,
              marginBottom: 0
            }
          ]}
        >
          <View style={styles.settingContent}>
            <View style={styles.settingLabelContainer}>
              <Info size={20} color={theme.colors.text} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{t('termsOfService')}</Text>
            </View>
          </View>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
          {t('copyright')}
        </Text>
        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
          {t('tagline')}
        </Text>
      </View>
      
      <InfoModal
        visible={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
        title={t('privacyPolicy')}
        content={t('privacyPolicyContent')}
      />
      
      <InfoModal
        visible={showTerms}
        onClose={() => setShowTerms(false)}
        title={t('termsOfService')}
        content={t('termsOfServiceContent')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 16,
  },
  settingItem: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  settingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 12,
  },
  settingValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    flex: 1,
  },
  languageDivider: {
    height: 1,
    width: '100%',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CirclePlus as PlusCircle, Trash2, ArrowLeft, Save } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Decision, Option, Criterion } from '@/types/decisions';
import Button from '@/components/Button';
import RatingInput from '@/components/RatingInput';
import { loadDecision, updateDecision } from '@/utils/storage';
import { calculateResults } from '@/utils/calculations';

export default function EditScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { t } = useLanguage();
  const { id } = useLocalSearchParams<{ id: string }>();
  const scrollViewRef = useRef<ScrollView>(null);

  const [decision, setDecision] = useState<Decision | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadDecisionData(id);
    }
  }, [id]);

  const loadDecisionData = async (decisionId: string) => {
    try {
      setIsLoading(true);
      const loadedDecision = await loadDecision(decisionId);
      if (loadedDecision) {
        setDecision(loadedDecision);
        setTitle(loadedDecision.title);
        setDescription(loadedDecision.description || '');
        setOptions(loadedDecision.options);
        setCriteria(loadedDecision.criteria);
      } else {
        Alert.alert(t('error'), t('decisionNotFound'));
        router.back();
      }
    } catch (error) {
      console.error('Error loading decision:', error);
      Alert.alert(t('error'), t('errorLoadingDecision'));
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const addOption = () => {
    setOptions([...options, { id: `option-${Date.now()}`, name: '', ratings: {} }]);
  };

  const addCriterion = () => {
    setCriteria([...criteria, { id: `criterion-${Date.now()}`, name: '', weight: 1 }]);
  };

  const updateOption = (id: string, name: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, name } : option
    ));
  };

  const updateCriterion = (id: string, name: string) => {
    setCriteria(criteria.map(criterion => 
      criterion.id === id ? { ...criterion, name } : criterion
    ));
  };

  const removeOption = (id: string) => {
    if (options.length > 1) {
      setOptions(options.filter(option => option.id !== id));
    } else {
      Alert.alert(t('cannotRemove'), t('needOneOption'));
    }
  };

  const removeCriterion = (id: string) => {
    if (criteria.length > 1) {
      setCriteria(criteria.filter(criterion => criterion.id !== id));
    } else {
      Alert.alert(t('cannotRemove'), t('needOneCriterion'));
    }
  };

  const updateRating = (optionId: string, criterionId: string, rating: number) => {
    setOptions(options.map(option => {
      if (option.id === optionId) {
        return {
          ...option,
          ratings: {
            ...option.ratings,
            [criterionId]: rating
          }
        };
      }
      return option;
    }));
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert(t('missingInformation'), t('enterTitle'));
      return false;
    }
    
    const validOptions = options.filter(option => option.name.trim() !== '');
    if (validOptions.length < 2) {
      Alert.alert(t('missingInformation'), t('enterTwoOptions'));
      return false;
    }
    
    const validCriteria = criteria.filter(criterion => criterion.name.trim() !== '');
    if (validCriteria.length < 1) {
      Alert.alert(t('missingInformation'), t('enterOneCriterion'));
      return false;
    }
    
    // Check if all ratings are filled
    let allRatingsComplete = true;
    validOptions.forEach(option => {
      validCriteria.forEach(criterion => {
        if (option.ratings[criterion.id] === undefined) {
          allRatingsComplete = false;
        }
      });
    });
    
    if (!allRatingsComplete) {
      Alert.alert(t('incompleteRatings'), t('rateAllOptions'));
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!decision || !validateForm()) return;
    
    setIsSaving(true);
    try {
      // Filter options and criteria to remove any empty ones
      const validOptions = options.filter(option => option.name.trim() !== '');
      const validCriteria = criteria.filter(criterion => criterion.name.trim() !== '');
      
      // Calculate new results
      const results = calculateResults(validOptions, validCriteria);
      
      // Create updated decision object
      const updatedDecision: Decision = {
        ...decision,
        title,
        description,
        options: validOptions,
        criteria: validCriteria,
        results
      };
      
      // Update decision
      await updateDecision(updatedDecision);
      
      // Navigate back to results screen
      router.push(`/result/${decision.id}`);
    } catch (error) {
      console.error('Error updating decision:', error);
      Alert.alert(t('error'), t('errorUpdatingDecision'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {t('editDecision')}
        </Text>
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Save size={20} color={theme.colors.primary} />
        </Pressable>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Animated.View entering={FadeInDown} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('decisionDetails')}
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('decisionTitle')} *
            </Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder={t('decisionTitlePlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('description')} ({t('optional')})
            </Text>
            <TextInput
              style={[
                styles.input, 
                styles.textArea,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder={t('descriptionPlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
              multiline={true}
              numberOfLines={4}
            />
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('optionsToCompare')}
          </Text>
          
          {options.map((option, index) => (
            <View key={option.id} style={styles.optionRow}>
              <TextInput
                style={[
                  styles.input, 
                  styles.optionInput,
                  { 
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text,
                    borderColor: theme.colors.border
                  }
                ]}
                value={option.name}
                onChangeText={(text) => updateOption(option.id, text)}
                placeholder={`${t('option')} ${index + 1}`}
                placeholderTextColor={theme.colors.textSecondary}
              />
              <Pressable 
                onPress={() => removeOption(option.id)}
                style={({ pressed }) => [
                  styles.iconButton,
                  { opacity: pressed ? 0.7 : 1 }
                ]}
              >
                <Trash2 size={20} color={theme.colors.error} />
              </Pressable>
            </View>
          ))}
          
          <Pressable
            onPress={addOption}
            style={({ pressed }) => [
              styles.addButton,
              {
                backgroundColor: pressed ? theme.colors.primaryLight : 'transparent',
                borderColor: theme.colors.primary
              }
            ]}
          >
            <PlusCircle size={20} color={theme.colors.primary} />
            <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>
              {t('addOption')}
            </Text>
          </Pressable>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('defineCriteria')}
          </Text>
          
          {criteria.map((criterion, index) => (
            <View key={criterion.id} style={styles.criterionContainer}>
              <View style={styles.criterionRow}>
                <TextInput
                  style={[
                    styles.input, 
                    styles.criterionInput,
                    { 
                      backgroundColor: theme.colors.card,
                      color: theme.colors.text,
                      borderColor: theme.colors.border
                    }
                  ]}
                  value={criterion.name}
                  onChangeText={(text) => updateCriterion(criterion.id, text)}
                  placeholder={t('criterionPlaceholder')}
                  placeholderTextColor={theme.colors.textSecondary}
                />
                <Pressable
                  onPress={() => removeCriterion(criterion.id)}
                  style={({ pressed }) => [
                    styles.iconButton,
                    { opacity: pressed ? 0.7 : 1 }
                  ]}
                >
                  <Trash2 size={20} color={theme.colors.error} />
                </Pressable>
              </View>
            </View>
          ))}
          
          <Pressable
            onPress={addCriterion}
            style={({ pressed }) => [
              styles.addButton,
              {
                backgroundColor: pressed ? theme.colors.primaryLight : 'transparent',
                borderColor: theme.colors.primary
              }
            ]}
          >
            <PlusCircle size={20} color={theme.colors.primary} />
            <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>
              {t('addCriterion')}
            </Text>
          </Pressable>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('rateOptions')}
          </Text>
          
          {criteria.map(criterion => (
            <View key={criterion.id} style={styles.ratingSection}>
              <Text style={[styles.criterionTitle, { color: theme.colors.text }]}>
                {criterion.name} {criterion.weight > 1 ? `(${criterion.weight}x)` : ''}
              </Text>
              
              {options.map(option => (
                <View key={option.id} style={styles.ratingRow}>
                  <Text style={[styles.optionName, { color: theme.colors.text }]}>
                    {option.name}
                  </Text>
                  <RatingInput
                    value={option.ratings[criterion.id] || 0}
                    onChange={(rating) => updateRating(option.id, criterion.id, rating)}
                  />
                </View>
              ))}
            </View>
          ))}
        </Animated.View>
        
        <View style={styles.buttonContainer}>
          <Button
            title={t('cancel')}
            onPress={handleBack}
            variant="outline"
            style={{ flex: 1, marginRight: 8 }}
          />
          <Button
            title={t('saveChanges')}
            onPress={handleSave}
            isLoading={isSaving}
            style={{ flex: 2 }}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
    marginLeft: 8,
  },
  saveButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionInput: {
    flex: 1,
    marginRight: 8,
  },
  criterionContainer: {
    marginBottom: 16,
  },
  criterionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  criterionInput: {
    flex: 1,
    marginRight: 8,
  },
  iconButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  ratingSection: {
    marginBottom: 20,
  },
  criterionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
});
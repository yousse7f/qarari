import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'expo-router';
import { CirclePlus as PlusCircle, Trash2, CircleCheck as CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { generateUniqueId } from '@/utils/helpers';
import { saveDecision } from '@/utils/storage';
import { Decision, Option, Criterion } from '@/types/decisions';
import Button from '@/components/Button';
import RatingInput from '@/components/RatingInput';
import { calculateResults } from '@/utils/calculations';

export default function CreateScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { t } = useLanguage();
  const scrollViewRef = useRef<ScrollView>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<Option[]>([
    { id: generateUniqueId(), name: '', ratings: {} }
  ]);
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: generateUniqueId(), name: '' }
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const addOption = () => {
    setOptions([...options, { id: generateUniqueId(), name: '', ratings: {} }]);
  };

  const addCriterion = () => {
    setCriteria([...criteria, { id: generateUniqueId(), name: '' }]);
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
      Alert.alert('Cannot Remove', 'You need at least one option');
    }
  };

  const removeCriterion = (id: string) => {
    if (criteria.length > 1) {
      setCriteria(criteria.filter(criterion => criterion.id !== id));
    } else {
      Alert.alert('Cannot Remove', 'You need at least one criterion');
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

  const validateStep1 = () => {
    if (!title.trim()) {
      Alert.alert('Missing Information', 'Please enter a title for your decision');
      return false;
    }

    const validOptions = options.filter(option => option.name.trim() !== '');
    if (validOptions.length < 2) {
      Alert.alert('Missing Information', 'Please enter at least two options');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    const validCriteria = criteria.filter(criterion => criterion.name.trim() !== '');
    if (validCriteria.length < 1) {
      Alert.alert('Missing Information', 'Please enter at least one criterion');
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;

      // Filter out empty options
      setOptions(options.filter(option => option.name.trim() !== ''));
      setCurrentStep(2);
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }, 100);
    } else if (currentStep === 2) {
      if (!validateStep2()) return;

      // Filter out empty criteria
      setCriteria(criteria.filter(criterion => criterion.name.trim() !== ''));
      setCurrentStep(3);
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }, 100);
    } else if (currentStep === 3) {
      saveAndViewResults();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }, 100);
    }
  };

  const saveAndViewResults = async () => {
    setIsLoading(true);

    try {
      // Filter options and criteria to remove any empty ones
      const validOptions = options.filter(option => option.name.trim() !== '');
      const validCriteria = criteria.filter(criterion => criterion.name.trim() !== '');

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
        Alert.alert('Incomplete Ratings', 'Please rate all options for each criterion');
        setIsLoading(false);
        return;
      }

      // Calculate results
      const results = calculateResults(validOptions, validCriteria);

      // Create decision object
      const newDecision: Decision = {
        id: generateUniqueId(),
        title,
        description,
        options: validOptions,
        criteria: validCriteria,
        results,
        createdAt: new Date().toISOString()
      };

      // Save decision
      await saveDecision(newDecision);

      // Navigate to results screen
      router.push(`/result/${newDecision.id}`);
    } catch (error) {
      console.error('Error saving decision:', error);
      Alert.alert('Error', 'An error occurred while saving your decision');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutUp}
      style={styles.stepContainer}
    >
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
        {t('defineDecision')}
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

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {t('optionsToCompare')} *
        </Text>
        <Text style={[styles.sublabel, { color: theme.colors.textSecondary }]}>
          {t('addAtLeastTwo')}
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
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutUp}
      style={styles.stepContainer}
    >
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
        {t('rateOptions')}
      </Text>
      <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
        {t('rateDescription')}
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

      <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>
        {t('ratingHint')}
      </Text>
    </Animated.View>
  );

  const renderStep3 = () => {
    const validOptions = options.filter(option => option.name.trim() !== '');
    const validCriteria = criteria.filter(criterion => criterion.name.trim() !== '');

    return (
      <Animated.View
        entering={FadeInDown}
        exiting={FadeOutUp}
        style={styles.stepContainer}
      >
        <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
          {t('rateOptions')}
        </Text>
        <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
          {t('rateDescription')}
        </Text>

        {validCriteria.map(criterion => (
          <View key={criterion.id} style={styles.ratingSection}>
            <Text style={[styles.criterionTitle, { color: theme.colors.text }]}>
              {criterion.name}
            </Text>

            {validOptions.map(option => (
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

        <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>
          {t('ratingHint')}
        </Text>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.stepIndicator}>
          {[1, 2, 3].map(step => (
            <View key={step} style={styles.stepDot}>
              {currentStep >= step ? (
                <View style={[
                  styles.activeDot,
                  { backgroundColor: theme.colors.primary }
                ]}>
                  {currentStep > step && (
                    <CheckCircle2 size={16} color="#fff" />
                  )}
                </View>
              ) : (
                <View style={[
                  styles.inactiveDot,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border
                  }
                ]}>
                  <Text style={{ color: theme.colors.textSecondary }}>{step}</Text>
                </View>
              )}
              {step < 3 && (
                <View style={[
                  styles.stepLine,
                  { backgroundColor: currentStep > step ? theme.colors.primary : theme.colors.border }
                ]} />
              )}
            </View>
          ))}
        </View>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <Button
              title={t('back')}
              onPress={prevStep}
              variant="outline"
              style={{ flex: 1, marginRight: 8 }}
            />
          )}
          <Button
            title={currentStep === 3 ? t('viewResults') : t('continue')}
            onPress={nextStep}
            isLoading={isLoading}
            style={currentStep === 1 ? { flex: 1 } : { flex: 2 }}
          />
        </View>
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            {t('copyright')}
          </Text>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            {t('tagline')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  stepDot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLine: {
    height: 2,
    width: 40,
  },
  stepContainer: {
    marginBottom: 24,
  },
  stepTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    marginBottom: 8,
  },
  stepDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  sublabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 12,
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
    borderRadius: 8,
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
    marginBottom: 24,
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
    marginBottom: 16,
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
  hint: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 16,
    textAlign: 'center',
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
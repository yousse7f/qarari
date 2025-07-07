import AsyncStorage from '@react-native-async-storage/async-storage';
import { Decision } from '@/types/decisions';

const DECISIONS_STORAGE_KEY = 'Qarari_decisions';

export async function saveDecision(decision: Decision): Promise<void> {
  try {
    // Get existing decisions
    const existingDecisionsJson = await AsyncStorage.getItem(DECISIONS_STORAGE_KEY);
    let decisions: Decision[] = [];

    if (existingDecisionsJson) {
      decisions = JSON.parse(existingDecisionsJson);
    }

    // Add new decision
    decisions.push(decision);

    // Save to storage
    await AsyncStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(decisions));
  } catch (error) {
    console.error('Error saving decision:', error);
    throw error;
  }
}

export async function updateDecision(decision: Decision): Promise<void> {
  try {
    // Get existing decisions
    const existingDecisionsJson = await AsyncStorage.getItem(DECISIONS_STORAGE_KEY);

    if (!existingDecisionsJson) {
      throw new Error('No decisions found');
    }

    let decisions: Decision[] = JSON.parse(existingDecisionsJson);

    // Find and update the decision
    const index = decisions.findIndex(d => d.id === decision.id);

    if (index === -1) {
      throw new Error('Decision not found');
    }

    decisions[index] = decision;

    // Save to storage
    await AsyncStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(decisions));
  } catch (error) {
    console.error('Error updating decision:', error);
    throw error;
  }
}

export async function loadDecision(id: string): Promise<Decision | null> {
  try {
    // Get existing decisions
    const existingDecisionsJson = await AsyncStorage.getItem(DECISIONS_STORAGE_KEY);

    if (!existingDecisionsJson) {
      return null;
    }

    const decisions: Decision[] = JSON.parse(existingDecisionsJson);

    // Find the decision
    const decision = decisions.find(d => d.id === id);

    return decision || null;
  } catch (error) {
    console.error('Error loading decision:', error);
    throw error;
  }
}

export async function loadRecentDecisions(limit = 3): Promise<Decision[] | null> {
  try {
    // Get existing decisions
    const existingDecisionsJson = await AsyncStorage.getItem(DECISIONS_STORAGE_KEY);

    if (!existingDecisionsJson) {
      return null;
    }

    const decisions: Decision[] = JSON.parse(existingDecisionsJson);

    // Sort by creation date (newest first) and limit
    return decisions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error loading recent decisions:', error);
    throw error;
  }
}

export async function loadAllDecisions(): Promise<Decision[] | null> {
  try {
    // Get existing decisions
    const existingDecisionsJson = await AsyncStorage.getItem(DECISIONS_STORAGE_KEY);

    if (!existingDecisionsJson) {
      return null;
    }

    const decisions: Decision[] = JSON.parse(existingDecisionsJson);

    // Sort by creation date (newest first)
    return decisions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error loading all decisions:', error);
    throw error;
  }
}

export async function deleteDecision(id: string): Promise<void> {
  try {
    // Get existing decisions
    const existingDecisionsJson = await AsyncStorage.getItem(DECISIONS_STORAGE_KEY);

    if (!existingDecisionsJson) {
      return;
    }

    let decisions: Decision[] = JSON.parse(existingDecisionsJson);

    // Filter out the decision to delete
    decisions = decisions.filter(d => d.id !== id);

    // Save to storage
    await AsyncStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(decisions));
  } catch (error) {
    console.error('Error deleting decision:', error);
    throw error;
  }
}

export async function clearAllDecisions(): Promise<void> {
  try {
    await AsyncStorage.removeItem(DECISIONS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing all decisions:', error);
    throw error;
  }
}
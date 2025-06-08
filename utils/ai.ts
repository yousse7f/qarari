import { Decision } from '@/types/decisions';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const API_KEY = 'AIzaSyCHa_sIECy4voO-';
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateAIInsights(decision: Decision): Promise<string> {
  try {
    // Create a clean representation of the decision data for the AI
    const optionsInfo = decision.options.map(option => {
      const scores = decision.criteria.map(criterion => ({
        criterion: criterion.name,
        weight: criterion.weight,
        rating: option.ratings[criterion.id] || 0
      }));
      
      return {
        name: option.name,
        scores
      };
    });
    
    const resultInfo = decision.results.optionScores.map(score => ({
      optionName: score.option.name,
      totalScore: score.score,
      percentage: (score.score / decision.results.highestPossibleScore) * 100
    }));
    
    // Prepare the prompt for the AI
    const prompt = `
    I need to analyze a decision about "${decision.title}".
    
    Options and scores:
    ${JSON.stringify(optionsInfo)}
    
    Results:
    ${JSON.stringify(resultInfo)}
    
    Provide a brief analysis (2 short paragraphs) that covers:
    1. Why the top option won
    2. How close the decision was
    3. Quick recommendation if more consideration is needed
    
    Keep it very concise and to the point.
    `;

    // Send the prompt to the Gemini API
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7
      }
    });
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    return response.text();
  } catch (error) {
    console.error('Error generating AI insights:', error);
    throw new Error('Failed to generate insights. Please try again later.');
  }
}
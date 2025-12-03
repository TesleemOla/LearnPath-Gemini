import { GoogleGenerativeAI } from '@google/generative-ai';
import { validationResult } from 'express-validator';
import { logger } from '../utils/logger.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

// Helper function to call the generative AI and handle responses
const callGenerativeAI = async (res, prompt, responseKey) => {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const jsonResponse = { [responseKey]: text };
    if (responseKey === 'content') {
      jsonResponse.promptUsed = prompt;
    }
    res.json(jsonResponse);
  } catch (error) {
    logger.error(`Error in AI generation: ${error.message}`);
    res.status(500).json({ message: 'AI generation error', error: error.message });
  }
};

// @desc    Generate content using Gemini AI
// @route   POST /api/ai/generate
// @access  Private
export const generateContent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { prompt, language, level, contextType } = req.body;

    // Enhanced prompt with context
    const enhancedPrompt = generateEnhancedPrompt(prompt, language, level, contextType);

    await callGenerativeAI(res, enhancedPrompt, 'content');
  } catch (error) { // Catches errors from outside the AI call, e.g., in generateEnhancedPrompt
    logger.error(`Error in generateContent setup: ${error.message}`);
    res.status(500).json({ message: 'Error setting up AI prompt', error: error.message });
  }
};

// @desc    Generate conversation practice using Gemini AI
// @route   POST /api/ai/conversation
// @access  Private
export const generateConversation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { language, level, topic, userMessage } = req.body;

    // Conversation prompt
    const conversationPrompt = `
      You are a fluent ${language} speaker helping someone practice their conversational skills.
      Their current level is: ${level}
      The conversation topic is: ${topic}
      
      Respond to the following message in ${language}, keeping your response appropriate for their level.
      If they're a beginner, use simple words and short sentences.
      If they're intermediate, use moderate vocabulary and some complex sentences.
      If they're advanced, use natural, native-like language.
      
      Include a translation of your response in English, and provide feedback on any errors in their message.
      
      Their message: "${userMessage}"
    `;

    await callGenerativeAI(res, conversationPrompt, 'conversation');
  } catch (error) {
    logger.error(`Error in generateConversation setup: ${error.message}`);
    res.status(500).json({ message: 'Error setting up AI prompt', error: error.message });
  }
};

// @desc    Generate feedback on user's writing or speaking
// @route   POST /api/ai/feedback
// @access  Private
export const generateFeedback = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { language, level, content, contentType } = req.body;

    // Feedback prompt
    const feedbackPrompt = `
      You are a language teacher providing feedback on a student's ${contentType} in ${language}.
      Their current level is: ${level}
      
      Please analyze the following ${contentType} and provide:
      1. Overall assessment (strengths and areas for improvement)
      2. Grammatical corrections (if any)
      3. Vocabulary suggestions (better word choices)
      4. Pronunciation tips (if it's speaking)
      5. Natural phrasing alternatives
      6. A score out of 10
      
      The ${contentType}: "${content}"
    `;

    await callGenerativeAI(res, feedbackPrompt, 'feedback');
  } catch (error) {
    logger.error(`Error in generateFeedback setup: ${error.message}`);
    res.status(500).json({ message: 'Error setting up AI prompt', error: error.message });
  }
};

// @desc    Generate weekly assessment for language learning
// @route   POST /api/ai/assessment
// @access  Private
export const generateAssessment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { language, level, week, topics } = req.body;

    // Assessment prompt
    const assessmentPrompt = `
      Create a comprehensive language assessment for week ${week} of an ${language} learning course.
      Level: ${level}
      Topics covered: ${topics.join(', ')}
      
      Include the following sections:
      1. Vocabulary assessment (10 multiple choice questions)
      2. Grammar assessment (5 fill-in-the-blank questions)
      3. Reading comprehension (a short passage with 5 questions)
      4. Writing prompt (relevant to the week's topics)
      5. Speaking exercise instructions
      
      For each question, provide the correct answer as well.
      Format everything clearly with sections and numbering.
    `;

    await callGenerativeAI(res, assessmentPrompt, 'assessment');
  } catch (error) {
    logger.error(`Error in generateAssessment setup: ${error.message}`);
    res.status(500).json({ message: 'Error setting up AI prompt', error: a.message });
  }
};

// Helper function to generate enhanced prompts
const generateEnhancedPrompt = (prompt, language, level, contextType) => {
  let systemContext = '';
  
  // Add level-specific instructions
  switch (level) {
    case 'beginner':
      systemContext += `As a language teacher helping a beginner learning ${language}, use simple vocabulary, basic grammar structures, and provide clear explanations. Avoid complex terminology and focus on everyday practical usage. `;
      break;
    case 'intermediate':
      systemContext += `As a language teacher helping an intermediate student of ${language}, use a mix of familiar and new vocabulary, introduce more complex grammar structures, and provide examples that build on basic knowledge. `;
      break;
    case 'advanced':
      systemContext += `As a language teacher helping an advanced student of ${language}, use authentic language with rich vocabulary, complex grammar structures, idiomatic expressions, and provide nuanced explanations of language usage. `;
      break;
  }
  
  // Add context-specific instructions
  switch (contextType) {
    case 'vocabulary':
      systemContext += `Focus on teaching vocabulary. For each word or phrase, provide: the word in ${language}, its pronunciation guide, its translation, example sentences, common collocations, and memory tips. Group related words together.`;
      break;
    case 'grammar':
      systemContext += `Focus on explaining grammar concepts. Provide clear explanations of the grammar rule, its usage, exceptions, multiple examples showing correct usage, and practice exercises.`;
      break;
    case 'conversation':
      systemContext += `Create conversational examples that would occur in real-life situations. Include dialogues between multiple speakers, with translations and cultural notes where relevant.`;
      break;
    case 'culture':
      systemContext += `Explain cultural aspects related to ${language}-speaking regions, including customs, traditions, etiquette, history, or cultural perspectives that influence language usage.`;
      break;
    case 'reading':
      systemContext += `Create a reading passage appropriate for ${level} level, followed by comprehension questions, vocabulary explanations, and discussion points.`;
      break;
    case 'exercises':
      systemContext += `Design language practice exercises including fill-in-the-blanks, multiple choice, matching, sentence transformation, and free response questions with an answer key.`;
      break;
  }
  
  return `${systemContext}\n\n${prompt}`;
};
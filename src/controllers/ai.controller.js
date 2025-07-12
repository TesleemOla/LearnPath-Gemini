import { GoogleGenerativeAI } from '@google/generative-ai';
import { validationResult } from 'express-validator';
import { logger } from '../utils/logger.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    // Generate content with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(enhancedPrompt);
    const response = result.response;
    const text = response.text();

    res.json({ 
      content: text,
      promptUsed: enhancedPrompt
    });
  } catch (error) {
    logger.error(`Error in generateContent: ${error.message}`);
    res.status(500).json({ message: 'AI generation error', error: error.message });
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

    // Generate content with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(conversationPrompt);
    const response = result.response;
    const text = response.text();

    res.json({ 
      conversation: text
    });
  } catch (error) {
    logger.error(`Error in generateConversation: ${error.message}`);
    res.status(500).json({ message: 'AI conversation error', error: error.message });
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

    // Generate content with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(feedbackPrompt);
    const response = result.response;
    const text = response.text();

    res.json({ 
      feedback: text
    });
  } catch (error) {
    logger.error(`Error in generateFeedback: ${error.message}`);
    res.status(500).json({ message: 'AI feedback error', error: error.message });
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

    // Generate content with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(assessmentPrompt);
    const response = result.response;
    const text = response.text();

    res.json({ 
      assessment: text
    });
  } catch (error) {
    logger.error(`Error in generateAssessment: ${error.message}`);
    res.status(500).json({ message: 'AI assessment error', error: error.message });
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
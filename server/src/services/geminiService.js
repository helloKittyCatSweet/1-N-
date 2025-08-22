import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, MODEL_NAME } from '../utils/config.js';
import PromptService from './promptService.js';

class GeminiService {
    constructor() {
        // Check if API key is available
        if (!GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not set, service will not work properly');
            return;
        }
        
        try {
            // Initialize Gemini instance with API key
            this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            this.model = this.genAI.getGenerativeModel({ model: MODEL_NAME });
        } catch (error) {
            console.error('Failed to initialize Gemini service:', error.message);
        }
    }

    /**
     * Generate meme content
     * @param {string} keyword - User input keyword
     * @returns {Promise<object>} - Generated content
     */
    async generateMeme(keyword) {
        try {
            if (!this.model) {
                throw new Error('Gemini service not properly initialized');
            }
            
            // Build prompt
            const prompt = PromptService.buildMemePrompt(keyword);

            const result = await this.model.generateContent({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }]
                    }
                ]
            });

            // Get generated text content
            const response = result.response;
            const text = response.text();

            return { text };
        } catch (error) {
            throw new Error(`Failed to generate meme: ${error.message}`);
        }
    }

    /**
     * Content safety check (optional)
     * @param {string} content - Content to check
     * @returns {Promise<boolean>} - Whether content is safe
     */
    async performSafetyCheck(content) {
        try {
            if (!this.model) {
                throw new Error('Gemini service not properly initialized');
            }
            
            const prompt = PromptService.buildSafetyCheckPrompt(content);
            const result = await this.model.generateContent({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }]
                    }
                ]
            });
            const response = result.response;
            return response.text().includes('安全');
        } catch (error) {
            console.error('Safety check failed:', error);
            return false;
        }
    }
}

export default GeminiService;
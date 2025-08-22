import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, MODEL_NAME } from '../utils/config.js';
import PromptService from './promptService.js';

class GeminiService {
    constructor() {
        // 直接用 API 密钥初始化 Gemini 实例
        this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: MODEL_NAME });
    }

    /**
     * 生成吐槽内容
     * @param {string} keyword - 用户输入的关键词
     * @returns {Promise<string>} - 生成的吐槽内容
     */

    async generateMeme(keyword) {
        try {
            // 构建提示词
            const prompt = PromptService.buildMemePrompt(keyword);

            // 按照 target.txt 示例，直接传递字符串给 contents

            const result = await this.model.generateContent({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }]
                    }
                ]
            });


            // 获取生成的文本内容
            const response = result.response;
            const text = response.text();

            return { text };
        } catch (error) {
            throw new Error(`生成吐槽失败: ${error.message}`);
        }
    }

    /**
     * 内容安全检查（可选，如不需要可移除）
     * @param {string} content - 需要检查的内容
     * @returns {Promise<boolean>} - 是否安全
     */
    async performSafetyCheck(content) {
        try {
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
            console.error('安全检查失败:', error);
            return false;
        }
    }
}

export default GeminiService;
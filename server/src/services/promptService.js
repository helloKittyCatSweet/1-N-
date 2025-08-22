class PromptService {
    /**
     * 构建吐槽梗的提示词
     * @param {string} keyword - 用户输入的关键词
     * @returns {string} - 构建好的提示词
     */
    static buildMemePrompt(keyword) {
        return `
        Act as a humorous comedian and create a funny joke or meme about "${keyword}".
        Requirements:
        1. Keep it witty and humorous
        2. Keep it under 100 words
        3. You can use internet slang
        4. Include a twist or unexpected element

        Output the joke directly without any additional explanation.
        `.trim();
    }

    /**
     * 构建安全检查的提示词
     * @param {string} content - 需要检查的内容
     * @returns {string} - 构建好的提示词
     */
    static buildSafetyCheckPrompt(content) {
        return `
        请判断以下内容是否包含不当言论：
        ${content}

        只需回答"安全"或"不安全"。
                `.trim();
    }   
}

export default PromptService;

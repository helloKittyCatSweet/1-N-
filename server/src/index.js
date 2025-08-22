import GeminiService from './services/geminiService.js';
import ErrorHandler from './utils/errorHandler.js';

class MemeGenerator {
    constructor() {
        this.geminiService = new GeminiService();
    }

    /**
     * 处理用户请求
     * @param {string} keyword - 用户输入的关键词
     * @returns {Promise<object>} - 处理结果
     */
    async generateMeme(keyword) {
        try {
            if (!keyword || typeof keyword !== 'string') {
                throw new Error('请输入有效的关键词');
            }

            const memeContent = await this.geminiService.generateMeme(keyword);

            return {
                success: true,
                data: {
                    keyword,
                    content: memeContent.text
                }
            };

        } catch (error) {
            return ErrorHandler.handle(error);
        }
    }
}

/**
 * 演示函数
 */
async function demo() {
    const generator = new MemeGenerator();
    console.log('开始生成吐槽文本...');

    try {
        const result = await generator.generateMeme('程序员');

        if (result.success) {
            console.log('生成成功！');
            console.log('关键词:', result.data.keyword);
            console.log('生成的吐槽:', result.data.content);
        } else {
            console.error('生成失败:', result.error);
        }
    } catch (error) {
        console.error('发生错误:', error);
    }
}

// 如果直接运行此文件，执行演示
// src/index.js
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// 如果直接运行此文件，执行演示
if (import.meta.url === `file://${process.argv[1]}`) {
  demo().catch(console.error);
}

export default MemeGenerator;
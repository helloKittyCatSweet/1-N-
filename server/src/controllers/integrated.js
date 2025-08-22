import MemeGenerator from '../index.js';
import { GoogleGenAI } from '@google/genai';
import { writeFileSync } from 'node:fs';
import { GEMINI_API_KEY } from '../utils/config.js';

async function generateMemeImage() {
    try {
        // 1. 首先生成吐槽文本
        const generator = new MemeGenerator();
        console.log('开始生成吐槽文本...');
        const result = await generator.generateMeme('programmer');

        if (!result.success) {
            throw new Error(result.error);
        }

        console.log('生成的吐槽:', result.data.content);

        // 2. 用生成的文本作为提示词生成图片
        const ai = new GoogleGenAI(GEMINI_API_KEY);
        const model = ai.getGenerativeModel({
            model: 'gemini-1.5-flash-latest',
        });

        console.log('开始生成图片...');

        const genRes = await model.generateContent({
            model: 'gemini-2.0-flash-preview-image-generation',
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: `Create a funny meme image based on this caption: ${result.data.content}
Make it humorous and entertaining. If appropriate, render the caption clearly inside the image.` }
                    ]
                }
            ],
            // 关键：声明双模态
            generationConfig: {
                responseMimeType: 'image/png',
                responseModalities: ['IMAGE']
            }
        });

        const response = genRes;
        // 处理图片生成结果
        // console.log("这是我的断点")
        const candidate = response?.candidates?.[0];
        if (!candidate) throw new Error('No candidates returned from image model');

        for (const part of candidate.content.parts) {
            if (part.text) {
                console.log('图片描述:', part.text);
            } else if (part.inlineData) {
                const buffer = Buffer.from(part.inlineData.data, 'base64');
                const outputFile = `meme_${Date.now()}.png`;
                writeFileSync(outputFile, buffer);
                console.log(`图片已保存为 ${outputFile}`);
            }
        }
    } catch (error) {
        console.error('生成过程出错:', error.message);
    }
}

// 运行集成功能 
if (import.meta.url === `file://${process.argv[1]}`) {
    generateMemeImage().catch(console.error);
}

export default generateMemeImage;
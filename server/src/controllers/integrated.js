// Updated version based on working CommonJS code
import MemeGenerator from '../index.js';
import { GoogleGenAI } from '@google/genai';
import { writeFileSync } from 'node:fs';
import { GEMINI_API_KEY } from '../utils/config.js';

async function generateMemeImage() {
    try {
        // 1. First generate meme text
        const generator = new MemeGenerator();
        console.log('🚀 Starting meme generation...');
        const result = await generator.generateMeme('programmer');

        if (!result.success) {
            throw new Error(result.error);
        }

        console.log('📝 Generated text:', result.data.content);

        // 2. Use generated text as prompt to generate image
        const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
        
        console.log('🔄 Generating image...');

        const genRes = await ai.models.generateContent({
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
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
                // 推荐：要求图片以 PNG 返回，便于读取 inlineData
                // responseMimeType: 'image/png'
            }
        });

        const response = genRes;
        // Process image generation result
        const candidate = response?.candidates?.[0];
        if (!candidate) throw new Error('No candidates returned from image model');

        for (const part of candidate.content.parts) {
            if (part.text) {
                console.log('📝 Image description:', part.text);
            } else if (part.inlineData) {
                const buffer = Buffer.from(part.inlineData.data, 'base64');
                const outputFile = `meme_${Date.now()}.png`;
                writeFileSync(outputFile, buffer);
                console.log(`✅ Image saved as ${outputFile}`);
            }
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    console.log('✅ Process completed');
}

// Run integrated functionality - use multiple ways to detect direct execution
const isDirectExecution = 
    import.meta.url === `file://${process.argv[1]}` || 
    process.argv[1]?.endsWith('integrated.js') ||
    process.argv[1]?.includes('integrated');

if (isDirectExecution) {
    generateMemeImage()
        .then(() => {
            console.log('🎉 All done!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Fatal error:', error);
            process.exit(1);
        });
} else {
    console.log('📋 Module imported, not executed directly');
}

export default generateMemeImage;
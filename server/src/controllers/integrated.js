// Updated version based on working CommonJS code
import MemeGenerator from '../index.js';
import { GoogleGenAI } from '@google/genai';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GEMINI_API_KEY } from '../utils/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateMemeImage(keyword = 'programmer') {
    try {
        const generator = new MemeGenerator();
        console.log('🚀 Starting meme generation...');
        const result = await generator.generateMeme(keyword);

        if (!result.success) {
            throw new Error(result.error);
        }

        console.log('📝 Generated text:', result.data.content);

        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        console.log('🔄 Generating image...');

        const genRes = await ai.models.generateContent({
            model: 'gemini-2.0-flash-preview-image-generation',
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: `Create a funny meme image based on this caption: ${result.data.content}\nMake it humorous and entertaining. If appropriate, render the caption clearly inside the image.`
                        }
                    ]
                }
            ],
            config: {
                responseModalities: ['TEXT', 'IMAGE']
            }
        });

        const response = genRes;
        const candidate = response?.candidates?.[0];
        if (!candidate) throw new Error('No candidates returned from image model');

        for (const part of candidate.content.parts) {
            if (part.text) {
                console.log('📝 Image description:', part.text);
            } else if (part.inlineData) {
                const buffer = Buffer.from(part.inlineData.data, 'base64');
                // save under server/src/memes
                const memesDir = path.join(__dirname, '../memes');
                mkdirSync(memesDir, { recursive: true });
                const fileName = `meme_${Date.now()}.png`;
                const outputPath = path.join(memesDir, fileName);
                writeFileSync(outputPath, buffer);
                // return relative path from server/src
                return `memes/${fileName}`;
            }
        }
        throw new Error('No inline image data found');
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    }
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
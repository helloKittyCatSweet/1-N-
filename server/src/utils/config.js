import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your_gemini_api_key_here';
export const MODEL_NAME = process.env.MODEL_NAME || 'gemini-1.5-flash-latest';
export const MAX_RETRIES = 3;
export const TIMEOUT = 30000;
export const MAX_OUTPUT_LENGTH = 1000;
export const DEFAULT_LANGUAGE = 'en';
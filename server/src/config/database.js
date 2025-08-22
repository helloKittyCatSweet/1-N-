import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server directory
config({ path: path.join(__dirname, '../../.env') });

// Create Sequelize instance with fallback values
const sequelize = new Sequelize(
  process.env.DB_NAME || 'uniapp',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false, // Set to true to see SQL queries in console
  }
);

export default sequelize;
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  discordToken: process.env.DISCORD_TOKEN,
  apiBaseUrl: process.env.API_BASE_URL,
  apiKey: process.env.API_KEY,
  roleId: process.env.ROLE_ID,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  }
};
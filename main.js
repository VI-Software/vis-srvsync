// main.mjs

import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import mysql from 'mysql2/promise';

// Load environment variables from .env file
config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// MySQL connection
const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

// Listen for role updates in the defined server
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const definedServerId = process.env.DEFINED_SERVER_ID;
    const verifyRoleId = process.env.VERIFY_ROLE_ID;

    // Check if the update is in the defined server
    if (newMember.guild.id !== definedServerId) return;

    const hadRole = oldMember.roles.cache.has(verifyRoleId);
    const hasRole = newMember.roles.cache.has(verifyRoleId);

    // If the role is added
    if (!hadRole && hasRole) {
        const [configs] = await connection.execute('SELECT serverId, roleId FROM serverConfigs');
        for (const config of configs) {
            const guild = client.guilds.cache.get(config.serverId);
            if (guild) {
                const member = await guild.members.fetch(newMember.id);
                if (member) {
                    await member.roles.add(config.roleId);
                }
            }
        }
    }

    // If the role is removed
    if (hadRole && !hasRole) {
        const [configs] = await connection.execute('SELECT serverId, roleId FROM serverConfigs');
        for (const config of configs) {
            const guild = client.guilds.cache.get(config.serverId);
            if (guild) {
                const member = await guild.members.fetch(newMember.id);
                if (member) {
                    await member.roles.remove(config.roleId);
                }
            }
        }
    }
});

// Log in to Discord with your app's token
client.login(process.env.DISCORD_TOKEN);
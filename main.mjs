import { Client, Intents } from 'discord.js';
import axios from 'axios';
import mariadb from 'mariadb';
import { config } from './config.mjs';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });
const pool = mariadb.createPool(config.db);

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', async member => {
  const userId = member.id;
  const guildId = member.guild.id;
  await addToQueue(userId, guildId);
  console.log(`User ${userId} has been added to the verification queue.`);
});

async function addToQueue(userId, guildId, retryCount = 0) {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('INSERT INTO queue (userId, guildId, retryCount) VALUES (?, ?, ?)', [userId, guildId, retryCount]);
  } catch (err) {
    console.error('Error adding to queue:', err);
  } finally {
    if (conn) conn.end();
  }
}

async function processQueue() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM queue WHERE status = "pending" LIMIT 1');
    if (rows.length > 0) {
      const user = rows[0];
      const verified = await verifyUser(user.userId, user.guildId);
      if (verified) {
        await conn.query('UPDATE queue SET status = "processed" WHERE id = ?', [user.id]);
      } else {
        const newRetryCount = user.retryCount + 1;
        const delay = Math.pow(2, newRetryCount) * 1000; // Exponential backoff
        setTimeout(() => addToQueue(user.userId, user.guildId, newRetryCount), delay);
        await conn.query('UPDATE queue SET status = "requeued" WHERE id = ?', [user.id]);
      }
    }
  } catch (err) {
    console.error('Error processing queue:', err);
  } finally {
    if (conn) conn.end();
  }
}

async function verifyUser(userId, guildId) {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/services/teams/dev/verification`, {
      headers: {
        user: userId,
        authorization: `Bearer ${config.apiKey}`
      }
    });
    if (response.status === 200) {
      const guild = client.guilds.cache.get(guildId);
      const member = guild.members.cache.get(userId);
      const role = guild.roles.cache.get(config.roleId);
      if (member && role) {
        await member.roles.add(role);
        console.log(`User ${userId} verified and role assigned.`);
        return true;
      }
    }
  } catch (err) {
    console.error('Error verifying user:', err);
  }
  return false;
}

setInterval(processQueue, 60000); // Process queue every minute

client.login(config.discordToken);
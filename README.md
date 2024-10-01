# VIS-SRCSYNC

![Node.js](https://img.shields.io/badge/Node.js-v18.12.0-green.svg)
![License](https://img.shields.io/badge/License-MIT-red.svg)

A Discord bot that verifies users through the VI Software API and assigns roles based on verification status. The bot uses a persistent queue system to handle rate limiting and retries verification with exponential backoff.

## Features
- **User Verification:** Verifies users through the VI Software API.
- **Role Assignment:** Assigns roles to verified users.
- **Persistent Queue:** Uses MariaDB to manage a persistent queue for handling rate limits.
- **Exponential Backoff:** Retries verification with increasing delays for unverified users.

## Prerequisites
- Node.js v18.12.0 (LTS) or higher
- MariaDB

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/discord-verification-bot.git
   cd discord-verification-bot
   ```

2. Install dependencies:
```bash
npm install
```
3. Set up environment variables

Rename .env.example to .env and fill out the information.

4. Set up the database

```bash
npm run db:setup
```

## Usage

1. Start the bot:

```bash
npm start
```

2. Run the bot in development mode:

```bash
npm run dev
```

## License
This project is licensed under the MIT  License.

```
Copyright (c) 2024 VI Software

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
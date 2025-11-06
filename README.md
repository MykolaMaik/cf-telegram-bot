# Cloudflare Telegram Bot

Telegram bot for managing domains and DNS records through Cloudflare API with a React admin panel for user management.

## 📋 Description

The project consists of three main components:

1. **Telegram Bot** - bot for managing domains and DNS records through commands in Telegram
2. **Express API** - REST API for managing users and processing webhook requests
3. **React Admin Panel** - web interface for adding and managing bot users

## 🚀 Features

### Telegram Bot Commands:
- `/start` or `/help` - list of available commands
- `/registerdomain <domain>` - register a new domain on Cloudflare
- `/listdomains` - list all registered domains
- `/listdns <domain>` - list all DNS records for a domain
- `/createdns <domain> <type> <name> <value> [TTL] [priority]` - create a DNS record
- `/updatedns <domain> <name> <type> <new_content> [TTL]` - update a DNS record
- `/deletedns <domain> <record_id>` or `/deletedns <domain> <name> <type>` - delete a DNS record

## 📦 Requirements

- Node.js (v16 or newer)
- MongoDB (locally or via Docker)
- Cloudflare account with API token
- Telegram Bot Token

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/MykolaMaik/cf-telegram-bot.git
cd cloudflare-telegram-bot
```

### 2. Install dependencies

**Backend:**
```bash
npm install
```

**Frontend (Admin Panel):**
```bash
cd admin
npm install
cd ..
```

### 3. Setup MongoDB

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Get tokens and keys

**Telegram Bot Token:**
1. Find [@BotFather](https://t.me/botfather) in Telegram
2. Send `/newbot` and follow the instructions
3. Copy the received token

**Cloudflare API Token:**
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to "My Profile" → "API Tokens"
3. Create a new token with the following permissions:
   - `Zone:Zone:Edit`
   - `Zone:Zone:Read`
   - `Zone:DNS:Edit`
   - `Zone:DNS:Read`
   - `Account Resources: Include All accounts`
4. Copy the token

**Cloudflare Account ID:**
1. In Cloudflare Dashboard, go to the main page
2. Copy the Account ID from the URL or from the right side

**ALLOWED_CHAT_ID:**
- For private messages: get it via [@userinfobot](https://t.me/userinfobot)
- For group chats: add the bot to the group and get the ID via [@getidsbot](https://t.me/getidsbot)

## 🏃 Running

**Backend:**
```bash
npm start
```

**Frontend (Admin Panel):**
```bash
cd admin
npm start
```

## 📖 Usage

### Adding users

1. Start the admin panel (by default on `http://localhost:3000`)
2. Log in with password (default `admin123`, can be changed via `REACT_APP_ADMIN_PASSWORD`)
3. Add a user by specifying their Telegram username (with @ or without)
4. When the user writes `/start` to the bot, their Telegram ID will be added automatically

### Working with the bot

1. Add a user through the admin panel
2. The user writes `/start` to the bot in Telegram
3. The bot automatically adds the Telegram ID and activates access
4. The user can use all bot commands

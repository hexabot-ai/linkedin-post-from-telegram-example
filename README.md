# Automate LinkedIn Posts from Telegram with Hexabot

A small launchpad for building Hexabot AI automation apps.

This template gives you a ready-to-run Nest app powered by `@hexabot-ai/api`. That dependency brings the Hexabot runtime, workflow engine, extension discovery, and built admin frontend, so this repo can stay focused on your project-specific code.

Hexabot lets you build agentic workflows across channels: conversational, manual, scheduled, tool-calling, memory-aware, or whatever your automation needs next.

---

# Telegram–LinkedIn Integration

This guide explains how to integrate Telegram with LinkedIn using Hexabot workflows.

## Quick Start

Requirements:

* Node.js `20.19.x`
* npm, unless you change `hexabot.config.json`
* Docker only for `hexabot ... --docker`
* `curl`
* An AI model API key
* Recommended AI model: `gemma-4-31b-it`

Install the CLI and create an app:

```sh
npm install -g @hexabot-ai/cli@3.2.2-alpha.17
npx @hexabot-ai/cli@alpha create support-bot
cd support-bot
hexabot dev
```

Verify the installation:

```bash
hexabot --version
```
![Step 1 - Create Telegram Bot](/screenshots/cli-version-check.png)

Or:

```bash
npm list -g --depth=0
```

The CLI creates `.env`, asks for the first admin credentials, installs dependencies, and starts local development with SQLite.

The admin UI runs at:

```text
http://localhost:3000
```

---


## Telegram–LinkedIn Setup Guide

### 1. Create a Telegram Bot

1. Sign up or sign in to your Telegram account.
2. Search for the username `@BotFather`.
3. Send the following commands one by one:

```text
/start
/newbot
```

4. Choose a username for your bot.

Example:

```text
hexabot_telegram_linkedin_bot
```

> The username must end with `bot`.

You will receive a response similar to this:

```text
Done! Congratulations on your new bot.
Use this token to access the HTTP API:
1234567890:ABCD-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

If you receive this message:

```text
Sorry, this username is already taken. Please try something different.
```

it means the username is already in use. Try another one.

You can test the generated token using this endpoint:

```http
GET https://api.telegram.org/bot1234567890:ABCD-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/getMe
```

---

### 2. Install `hexabot-channel-telegram`

Create a new project using the CLI:

```bash
hexabot create hexabot-linkedin-bot
```

Move into the project directory:

```bash
cd hexabot-linkedin-bot
```

Install dependencies:

```bash
npm install
```

Install the Telegram channel extension:

```bash
npm install hexabot-channel-telegram
```

Extension page:

* [https://hexabot.ai/extensions/69f9980e63955b4b36b7af3a](https://hexabot.ai/extensions/69f9980e63955b4b36b7af3a)

---

### 3. Expose the Local API

Expose your local API using a public tunneling service such as:

* ngrok
* pinggy

Once configured, you will receive a temporary public URL.

Example:

```text
https://dqfsj-x-x-x-x.run.pinggy-free.link
```

---

### 4. Update the Project `.env`

Update your `.env` file:

```env
API_ORIGIN=https://dqfsj-x-x-x-x.run.pinggy-free.link/api
```

---

### 5. Configure `hexabot-channel-telegram`

Start the project:

```bash
hexabot start
```

Open the Sources page:

```text
http://localhost:3000/settings/sources
```

Then:

1. Make sure a Telegram source exists.
2. If not, create one.
3. Edit the Telegram source.
4. Select a default workflow linked to the Telegram integration.
5. Ensure the source is enabled.

#### Create a Bot Token Credential

Example:

* Name: `Telegram API access token`
* Value:

```text
1234567890:ABCD-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Select the created credential.

#### Create a Webhook Secret Credential

Example:

* Name: `Webhook secret`
* Value:

```text
HeLLo_123405678
```

Select the created credential.

Finally:

* Enable **Auto set webhook**
* Click **Submit**

---

### 6. Register the Webhook with Telegram

Open the following API endpoint in your browser after replacing the placeholders with your actual values:

```text
https://api.telegram.org/bot1234567890:ABCD-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/setWebhook?url=https%3A%2F%2Fdqfsj-x-x-x-x.run.pinggy-free.link%2Fapi%2Fwebhook%2F826e0fdb-429d-4039-a24c-48a8dbe5cbc2&secret_token=HeLLo_123405678
```

---

### 7. Generate a LinkedIn Access Token

Create a LinkedIn application:

* [https://developer.linkedin.com/](https://developer.linkedin.com/)

#### Create the App

Fill in the following:

* App name
* Select or create a LinkedIn Page
* Upload a logo
* Accept the terms
* Click **Create app**

#### Activate Products

Request access for:

1. **Share on LinkedIn**
2. **Sign In with LinkedIn using OpenID Connect**

For both:

* Accept the terms
* Click **Request access**

#### Generate the Token

Open:

* [https://www.linkedin.com/developers/tools/oauth](https://www.linkedin.com/developers/tools/oauth)

Steps:

1. Click **Create token**

2. Select your app

3. Select all required scopes, especially:

   * `openid`
   * `w_member_social`

4. Accept the redirect URL update notice

5. Click **Request access token**

6. Sign in and authorize the app

7. Confirm the verification code

8. Click **Allow**

Example access token:

```text
A11B22C33D44XXXXXXXX
```

Store it securely.

---

### 8. Get Your LinkedIn `sub`

Run:

```bash
curl -X GET "https://api.linkedin.com/v2/userinfo" \
-H "Authorization: Bearer A11B22C33D44XXXXXXXX"
```

Expected response:

```json
{
  "sub": "ABCD1EF234"
}
```

The value of `sub` is the LinkedIn member identifier you need.

---

### 9. Import and Configure the Workflow

Start the project:

```bash
hexabot start
```

Then:

1. Log in to your account.
2. Open the Workflow Builder:

```text
http://localhost:3000/workflow-editor/
```

3. Click Import and select:

```text
linkedin-post-form-telegram.yml file
```

#### Configure the AI Model

1. Click **Model**
2. Select provider: `gemini`
3. Set model name:

```text
gemma-4-31b-it
```

4. Add a Gemini API key credential
5. Select the created credential
6. Click **Save**

#### Configure the LinkedIn Publisher

Set:

* Access Token:

```text
A11B22C33D44XXXXXXXX
```

* Default Author URN:

```text
ABCD1EF234
```

Click **Save**.

---

### 10. Trigger the Process via Telegram
1. Open Telegram.
2. Select your bot:

```text
hexabot_telegram_linkedin_bot
```

![Step 10 - Trigger Telegram Workflow](screenshots/telegram-start-bot-conversation.png)

3. Send a message such as:

```text
Write me a LinkedIn post about this first test post that I sent from Telegram to my Hexabot LinkedIn integration.
```

4. Check your LinkedIn profile.

A new LinkedIn post generated by Hexabot should now appear.

---

## Final Notes

Your Telegram ↔ LinkedIn integration is now complete. 🚀

Keep this README close to the app. Update it when your project gains new scripts, services, extensions, workflows, or deployment rules.

# Integral Type Calculator - Discord Bot

## Overview

Integral Type Calculator is a [Discord](https://discord.com/) bot designed to calculate integral type of relationships between Socionics types. This bot helps users explore and understand the dynamics of personality relationships and interactions within the framework.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- You have a Discord account.
- You have a Discord server where you have permission to add bots.
- You have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your local machine.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/jastka4/bot-integral-type-calculator.git
   cd bot-integral-type-calculator
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Setup Environment Variables**

   Create a `.env` file in the root directory of the project and add your Discord bot token:

   ```env
   DISCORD_TOKEN=your-discord-bot-token
   CLIENT_ID=your-client-id
   ```

4. **Run the Bot**

   ```bash
   npm start
   ```

## Usage

1. **Invite the Bot to Your Server**

   Generate an invite link for your bot using the [Discord Developer Portal](https://discord.com/developers/applications) and invite the bot to your server.

2. **Use Commands**

   Once the bot is in your server, use the commands listed below to interact with it.

## Commands

| Command                                  | Description                                                  | Examples                                         |
| ---------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------ |
| `/calculate [type1] [type2] ... [typeX]` | Calculate the integral type of the provided Socionics types. | `/calculate LSI EIE`<br>`/calculate SEI LIE SEE` |

## Contributing

Contributions are welcome! To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request to the original repository.

## Contact

If you have any questions or suggestions, feel free to open an issue or reach out to me.

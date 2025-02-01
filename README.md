# Git Commit Bot

## Overview
Git Commit Bot is a tool that automates the generation of concise and descriptive Git commit messages by leveraging OpenAI's API. It follows the Conventional Commits specification to ensure commit messages are consistent and meaningful.

## Features
- **Automated Commit Messages**: Generates commit messages based on staged changes.
- **Conventional Commits Compliance**: Follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.
- **Git Hook Integration**: Installs a `prepare-commit-msg` Git hook to automate commit message generation during the commit process.
- **Customizable Configurations**: Allows users to specify OpenAI API keys, commit types, and other settings.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/makalin/GitCommit-Bot.git
   cd GitCommit-Bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your OpenAI API key as an environment variable:
   ```bash
   export OPENAI_API_KEY=your_openai_api_key
   ```

4. Install the Git hook:
   ```bash
   node git-commit-bot.js installGitHook
   ```

## Usage

1. Stage your changes:
   ```bash
   git add .
   ```

2. Commit your changes:
   ```bash
   git commit
   ```
   The bot will automatically analyze the staged changes and generate a commit message. If no staged changes are found, the commit process will proceed without a generated message.

## Configuration

Configuration can be customized by editing the `config` object in `git-commit-bot.js`. Available options:
- `openaiApiKey`: Your OpenAI API key.
- `model`: The OpenAI model to use (default: `gpt-3.5-turbo`).
- `maxDiffLines`: The maximum number of diff lines to analyze (default: 100).
- `commitTypes`: An array of valid commit types (default: `["feat", "fix", "docs", "style", "refactor", "test", "chore"]`).

## Files
- **`git-commit-bot.js`**: Core script for managing commit messages and Git hooks.
- **`git-hook-script.js`**: Git hook script that integrates with `prepare-commit-msg`.

## Dependencies
- [Node.js](https://nodejs.org/)
- [OpenAI API](https://platform.openai.com/)
- `child_process` and `fs` modules (built-in Node.js modules).

## License
This project is licensed under the MIT License.

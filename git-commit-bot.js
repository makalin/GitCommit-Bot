// commitBot.js
const { execSync } = require('child_process');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const path = require('path');

class GitCommitBot {
    constructor(config) {
        this.config = {
            openaiApiKey: config.openaiApiKey,
            model: config.model || 'gpt-3.5-turbo',
            maxDiffLines: config.maxDiffLines || 100,
            commitTypes: ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']
        };

        this.openai = new OpenAIApi(
            new Configuration({
                apiKey: this.config.openaiApiKey
            })
        );
    }

    async getDiff() {
        try {
            // Get staged changes
            const diff = execSync('git diff --cached').toString();
            const lines = diff.split('\n');
            
            // Truncate if diff is too long
            if (lines.length > this.config.maxDiffLines) {
                return lines.slice(0, this.config.maxDiffLines).join('\n') + '\n[diff truncated...]';
            }
            
            return diff;
        } catch (error) {
            throw new Error(`Failed to get git diff: ${error.message}`);
        }
    }

    async generateCommitMessage(diff) {
        try {
            const response = await this.openai.createChatCompletion({
                model: this.config.model,
                messages: [{
                    role: 'system',
                    content: `You are a commit message generator. Analyze the git diff and generate a concise, descriptive commit message following the Conventional Commits specification (type(scope): description). Types: ${this.config.commitTypes.join(', ')}`
                }, {
                    role: 'user',
                    content: `Generate a commit message for this diff:\n\n${diff}`
                }],
                temperature: 0.7,
                max_tokens: 100
            });

            return response.data.choices[0].message.content.trim();
        } catch (error) {
            throw new Error(`Failed to generate commit message: ${error.message}`);
        }
    }

    async installGitHook() {
        const hookPath = path.join(process.cwd(), '.git', 'hooks', 'prepare-commit-msg');
        const hookScript = `#!/bin/sh
node ${path.join(__dirname, 'prepareCommitMsg.js')} "$@"`;

        try {
            fs.writeFileSync(hookPath, hookScript);
            fs.chmodSync(hookPath, '755');
            console.log('Git hook installed successfully!');
        } catch (error) {
            throw new Error(`Failed to install git hook: ${error.message}`);
        }
    }
}

module.exports = GitCommitBot;

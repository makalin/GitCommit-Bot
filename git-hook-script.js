// prepareCommitMsg.js
const GitCommitBot = require('./commitBot');
const fs = require('fs');

async function main() {
    const [, , commitMsgFile] = process.argv;
    
    try {
        // Load configuration from package.json or dedicated config file
        const config = {
            openaiApiKey: process.env.OPENAI_API_KEY,
            // Add other config options as needed
        };

        const bot = new GitCommitBot(config);
        const diff = await bot.getDiff();
        
        if (!diff) {
            console.log('No staged changes found.');
            process.exit(0);
        }

        const suggestedMessage = await bot.generateCommitMessage(diff);
        
        // Read existing commit message
        const existingMsg = fs.readFileSync(commitMsgFile, 'utf8');
        
        // Only prepend suggested message if there isn't already a message
        if (!existingMsg.trim()) {
            fs.writeFileSync(commitMsgFile, suggestedMessage);
            console.log('Suggested commit message:', suggestedMessage);
        }
    } catch (error) {
        console.error('Error generating commit message:', error);
        process.exit(1);
    }
}

main();

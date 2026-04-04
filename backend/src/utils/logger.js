import chalk from 'chalk';

// First install chalk: npm install chalk

const logger = {
    // Info logs (blue)
    info: (message, ...args) => {
        console.log(chalk.blue('ℹ'), chalk.blue.bold('[INFO]'), chalk.white(message), ...args);
    },

    // Success logs (green)
    success: (message, ...args) => {
        console.log(chalk.green('✓'), chalk.green.bold('[SUCCESS]'), chalk.white(message), ...args);
    },

    // Error logs (red)
    error: (message, ...args) => {
        console.log(chalk.red('✗'), chalk.red.bold('[ERROR]'), chalk.white(message), ...args);
    },

    // Warning logs (yellow)
    warn: (message, ...args) => {
        console.log(chalk.yellow('⚠'), chalk.yellow.bold('[WARNING]'), chalk.white(message), ...args);
    },

    // Database logs (magenta)
    db: (message, ...args) => {
        console.log(chalk.magenta('🗄'), chalk.magenta.bold('[DATABASE]'), chalk.white(message), ...args);
    },

    // Server logs (cyan)
    server: (message, ...args) => {
        console.log(chalk.cyan('🚀'), chalk.cyan.bold('[SERVER]'), chalk.white(message), ...args);
    },

    // Auth logs (yellow)
    auth: (message, ...args) => {
        console.log(chalk.yellow('🔐'), chalk.yellow.bold('[AUTH]'), chalk.white(message), ...args);
    },

    // Request logs (gray)
    request: (method, url, status, time) => {
        const statusColor = status >= 200 && status < 300 ? chalk.green : 
                           status >= 400 && status < 500 ? chalk.yellow : 
                           chalk.red;
        console.log(
            chalk.gray('→'),
            chalk.white.bold(method),
            chalk.gray(url),
            statusColor(status),
            chalk.gray(`${time}ms`)
        );
    },

    // Line break
    line: () => {
        console.log(chalk.gray('─'.repeat(50)));
    },

    // Clear console
    clear: () => {
        console.clear();
    },

    // Dev logs (only in development)
    dev: (message, ...args) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(chalk.gray('🔧'), chalk.gray.bold('[DEV]'), chalk.gray(message), ...args);
        }
    }
};

export default logger;
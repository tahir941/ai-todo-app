const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'server'); // Adjust if needed

function findSequelizeQueries(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            findSequelizeQueries(fullPath);
        } else if (stats.isFile() && file.endsWith('.js')) {
            const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
            lines.forEach((line, idx) => {
                if (line.includes('sequelize.query(')) {
                    console.log(`Found in: ${fullPath} [Line ${idx + 1}]: ${line.trim()}`);
                }
            });
        }
    });
}

findSequelizeQueries(directoryPath);

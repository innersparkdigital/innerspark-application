const fs = require('fs');
const path = require('path');

const targetDir = '/Users/alphonse/Labs/AppLab/Innerspark/src/screens/therapistDashboardScreens';
const oldText = " || '52863268761'";
const newText = '';

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            replaceInDir(filePath);
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            let content = fs.readFileSync(filePath, 'utf8');
            if (content.includes(oldText)) {
                content = content.split(oldText).join(newText);
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated ${filePath}`);
            }
        }
    }
}

replaceInDir(targetDir);

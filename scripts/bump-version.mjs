#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

async function main() {
    const cwd = process.cwd();
    const entries = await fs.readdir(cwd);
    const htmlFiles = entries.filter((f) => f.endsWith('.html'));

    if (htmlFiles.length === 0) {
        console.error('No HTML files found in current directory.');
        process.exit(1);
    }

    for (const file of htmlFiles) {
        const fp = path.join(cwd, file);
        let content = await fs.readFile(fp, 'utf8');
        let updated = false;
        content = content.replace(/\?v=(\d+)/g, (m, p1) => {
            updated = true;
            return `?v=${parseInt(p1, 10) + 1}`;
        });
        if (updated) {
            await fs.writeFile(fp, content, 'utf8');
            console.log(`Bumped ?v in ${file}`);
        } else {
            console.log(`No ?v=NN patterns found in ${file}`);
        }
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(2);
});

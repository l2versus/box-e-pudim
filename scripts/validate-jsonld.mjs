#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

async function main() {
    const cwd = process.cwd();
    const entries = await fs.readdir(cwd);
    const htmlFiles = entries.filter((f) => f.endsWith('.html'));
    let errors = [];

    const re = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

    for (const file of htmlFiles) {
        const fp = path.join(cwd, file);
        const content = await fs.readFile(fp, 'utf8');
        let match;
        let found = false;
        re.lastIndex = 0;
        while ((match = re.exec(content)) !== null) {
            found = true;
            const inner = match[1].trim();
            if (!inner) continue;
            try {
                JSON.parse(inner);
                console.log(`[OK] ${file} — JSON-LD valid`);
            } catch (err) {
                console.error(`[ERROR] ${file} — invalid JSON-LD: ${err.message}`);
                errors.push({ file, message: err.message });
            }
        }
        if (!found) {
            console.log(`[WARN] ${file} — no application/ld+json script found`);
        }
    }

    if (errors.length) {
        console.error(`\nFound ${errors.length} JSON-LD errors.`);
        process.exit(2);
    }
    console.log('\nAll JSON-LD blocks are valid.');
}

main().catch((err) => {
    console.error(err);
    process.exit(3);
});

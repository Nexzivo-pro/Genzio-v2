import fs from 'fs';

const homeContent = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const startIndex = homeContent.indexOf('{/* ==========================================================================');
const endIndex = homeContent.indexOf('      {/* PLATFORM STATS */}');

if (startIndex === -1 || endIndex === -1) {
    console.log("Markers not found", startIndex, endIndex);
    process.exit(1);
}

const extractedSection = homeContent.substring(startIndex, endIndex);

fs.writeFileSync('extracted.tsx', extractedSection);
const newHomeContent = homeContent.substring(0, startIndex) + homeContent.substring(endIndex);
fs.writeFileSync('src/pages/Home.tsx', newHomeContent);
console.log("Successfully stripped Home.tsx and wrote extracted.tsx");

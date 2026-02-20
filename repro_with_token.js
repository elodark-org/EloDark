const fetch = require('node-fetch'); // Needs node-fetch or use built-in if node 18+

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IldpbGwiLCJlbWFpbCI6IndpbGwuZ2FicmllbDU2NEBnbWFpbC5jb20iLCJyb2xlIjoiYm9vc3RlciIsImlhdCI6MTc3MTQ0Njc5NCwiZXhwIjoxNzcyMDUxNTk0fQ.chuQqv3m-GvhY_okCLM5mqAyonaBR4xGXpzzKkBe2bw";
const URL = "http://localhost:3000/api/chat/8";

async function run() {
    console.log(`Fetching ${URL}...`);
    try {
        const res = await fetch(URL, {
            headers: {
                "Accept": "*/*",
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        console.log(`Status: ${res.status} ${res.statusText}`);
        console.log('Headers:', res.headers.raw());

        const text = await res.text();
        console.log('\n--- BODY START ---');
        console.log(text.substring(0, 500)); // Print first 500 chars
        console.log('--- BODY END ---');

    } catch (err) {
        console.error('Fetch error:', err);
    }
}

run();

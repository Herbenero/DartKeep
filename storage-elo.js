// storage-elo.js (Fixed)
const BIN_ID = '6a2ad0e3f5f4af5e29dfe321'; 
const API_KEY = '$2a$10$FahBJGmWqnfEa/M6NF2s8eQbttylJcYUn5l3vAbWI.Px8cwh02hm2'; // Fixed: Trailing space removed
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Helper to fetch data from the online bin
async function fetchOnlineData() {
    try {
        const url = `${BASE_URL}/latest`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 
                'X-Master-Key': API_KEY 
            }
        });

        if (!response.ok) {
            const body = await response.text();
            console.error('fetchOnlineData: non-OK response', response.status, body);
            return { games: [], elo: {} };
        }

        const data = await response.json();
        // JSONbin v3 wraps the actual payload inside the .record property
        return data.record || { games: [], elo: {} }; 
    } catch (err) {
        console.error("Failed to fetch online data", err);
        return { games: [], elo: {} };
    }
}

// Helper to save data back to the online bin
async function saveOnlineData(newData) {
    try {
        const response = await fetch(BASE_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify(newData)
        });

        if (!response.ok) {
            const body = await response.text();
            console.error('saveOnlineData: non-OK response', response.status, body);
        }
    } catch (err) {
        console.error("Failed to save online data", err);
    }
}

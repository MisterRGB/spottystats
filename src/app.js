// Spotify API credentials
const CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID'; // Replace with your actual Spotify Client ID
const REDIRECT_URI = 'http://localhost:8000/';
const SCOPE = 'user-top-read user-read-recently-played';

// DOM elements
const loginBtn = document.getElementById('login-btn');
const statsContainer = document.getElementById('stats-container');

// Initialize app
function init() {
    // Check for access token in URL (callback from Spotify)
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    
    if (accessToken) {
        // User is authenticated
        window.history.pushState({}, document.title, window.location.pathname);
        loginBtn.style.display = 'none';
        statsContainer.style.display = 'block';
        
        // Show loading state
        statsContainer.innerHTML = '<div class="loading">Loading your stats...</div>';
        
        // Fetch and display stats
        fetchStats(accessToken).catch(error => {
            statsContainer.innerHTML = '<div class="error">Failed to load stats. Please try again.</div>';
            console.error('Error:', error);
        });
    } else {
        // Set up login button
        loginBtn.addEventListener('click', () => {
            loginBtn.disabled = true;
            loginBtn.textContent = 'Redirecting...';
            window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=token`;
        });
    }
}

// Fetch stats from Spotify API
async function fetchStats(token) {
    try {
        // Fetch top tracks
        const tracksRes = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const tracksData = await tracksRes.json();
        displayTracks(tracksData.items);
        
        // Fetch top artists
        const artistsRes = await fetch('https://api.spotify.com/v1/me/top/artists?limit=5', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const artistsData = await artistsRes.json();
        displayArtists(artistsData.items);
        
        // Fetch recently played
        const recentRes = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=5', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const recentData = await recentRes.json();
        displayRecentlyPlayed(recentData.items);
        
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

// Display functions
function displayTracks(tracks) {
    const container = document.getElementById('tracks-list');
    container.innerHTML = tracks.map(track => 
        `<div>${track.name} - ${track.artists.map(a => a.name).join(', ')}</div>`
    ).join('');
}

function displayArtists(artists) {
    const container = document.getElementById('artists-list');
    container.innerHTML = artists.map(artist => 
        `<div>${artist.name}</div>`
    ).join('');
}

function displayRecentlyPlayed(recent) {
    const container = document.getElementById('recent-list');
    container.innerHTML = recent.map(item => 
        `<div>${item.track.name} - ${item.track.artists.map(a => a.name).join(', ')}</div>`
    ).join('');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
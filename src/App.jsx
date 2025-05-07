import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleSpotifyLogin = () => {
    const clientId = 'bd96946fb9404e2f832ad9e12cc0096c';
    const redirectUri = window.location.hostname === 'localhost' ? 'https://localhost:5173/callback' : 'https://misterrgb.github.io/spottystats/callback';
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'playlist-read-private',
      'user-library-read',
    ];
    const authUrl =
      'https://accounts.spotify.com/authorize' +
      '?client_id=' + clientId +
      '&response_type=token' +
      '&redirect_uri=' + encodeURIComponent(redirectUri) +
      '&scope=' + encodeURIComponent(scopes.join(' '));
    window.location.href = authUrl;
  }

  useEffect(() => {
    if (window.location.pathname === '/callback') {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        if (accessToken) {
          setIsAuthenticated(true);
          // Optionally, store the token in state or localStorage
        }
      }
    }
  }, []);

  return (
    <div className="material-bg">
      <div className="material-container">
        <h1 className="material-title">SpottyStats</h1>
        {!isAuthenticated ? (
          <>
            <p className="material-desc">Login with your Spotify account to see your music statistics.</p>
            <button className="material-login-btn" onClick={handleSpotifyLogin}>
              <span className="material-btn-text">Login with Spotify</span>
              <span className="material-btn-ripple"></span>
            </button>
          </>
        ) : (
          <div className="material-stats">
            <h2 className="material-stats-title">Your Spotify Statistics</h2>
            {/* Statistics UI will go here */}
          </div>
        )}
      </div>
    </div>
  )
}

export default App

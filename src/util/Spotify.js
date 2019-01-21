//const spotifyAuthorizeURIBase = 'https://accounts.spotify.com/authorize';
const spotifyAPIURIBase = 'https://api.spotify.com/v1/';
const clientId='e8492c4381344b0392723808bf80a98e';
const redirectUri = 'https://jammmingproject.surge.sh'
//const redirectUri = 'http://localhost:3000/';


let accessToken;

let Spotify = {

  getAccessToken() {
    if(accessToken) {
      return accessToken;
    }
    const hasAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const hasExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
    if(hasAccessToken&&hasExpiresIn){
      accessToken = hasAccessToken[1];
      const expiresIn = Number(hasExpiresIn[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        window.location = accessUrl;
    }
},

search(searchTerm) {
       const accessToken = Spotify.getAccessToken();
       const searchRequest = `${spotifyAPIURIBase}search?type=track&q=${searchTerm}`
       return fetch(searchRequest, {
         headers: {
           Authorization: `Bearer ${accessToken}`
         }
       }).then(response => {
         return response.json();
       }).then(jsonResponse => {
         if (!jsonResponse.tracks) {
           return [];
         }
         return jsonResponse.tracks.items.map(track => ({
               id: track.id,
               name: track.name,
               artist: track.artists[0].name,
               album: track.album.name,
               uri: track.uri
           }));
       });
   },


savePlaylist(playlistName, trackUris) {
        if (!playlistName || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` }
        let userId

        return fetch(`${spotifyAPIURIBase}me`, {headers: headers}
            ).then(response => response.json()
            ).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`${spotifyAPIURIBase}users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: playlistName})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`${spotifyAPIURIBase}users/${userId}/playlists/${playlistId}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackUris})
                });
            });
        });
    }

}

export default Spotify;

import React from 'react';
import './App.css';
import SearchResults from '../SearchResults/SearchResults';
import SearchBar from  '../SearchBar/SearchBar';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName:'New Playlist',
      playlistTracks:[],
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

  }

  // Adds track from Search Results to Playlist
  addTrack(track) {
  if(this.state.playlistTracks.findIndex(_track => _track.id === track.id) === -1) {
    let tracks = this.state.playlistTracks
    tracks.push(track)
    this.setState({playlistTracks: tracks})
  }
}

  // Removes track from Playlist (filter out track id from playlistTracks)
  removeTrack(track) {
   const trackIndx = this.state.playlistTracks.findIndex(_track => _track.id === track.id);
    if(trackIndx > -1) {
      let tracks = this.state.playlistTracks
      tracks.splice(trackIndx, 1)
      this.setState({playlistTracks: tracks})
    }
  }


  // updates the name of the Playlist
  updatePlaylistName(name) {
     this.setState({playlistName: name})
  }

  // saves Playlist name and tracks to user's account
  savePlayList() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri)
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState(
        {
          playlistName: 'New Playlist',
          playlistTracks: []
        })
    })
  }

  // calls the Spotify.js (in util directory) to run a call for Spotify API, then sets state
  search(term) {
   Spotify.search(term)
     .then(tracks => {
       this.setState({ searchResults: tracks })
     });
 }



 render() {
    return(
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
        <SearchBar onSearch={this.search}/>
         <div className="App-playlist">
           <SearchResults SearchResults={this.state.searchResults} onAdd={this.addTrack}  />
          <Playlist playlistName ={this.state.playlistName}
                    playlistTracks ={this.state.playlistTracks}
                    onNameChange={this.updatePlaylistName}
                    onSave={this.savePlaylist}
                    onRemove={this.removeTrack}/>

         </div>
        </div>
      </div>
   );
  }
}

export default App;

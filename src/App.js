import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import { Credentials } from './Credentials';
import axios from 'axios';
import SpotifyPlayer from 'react-spotify-player';
import logo from './logo.png';

const App = () => {

  const spotify = Credentials();  

  const [token, setToken] = useState('');  
  const [genres, setGenres] = useState({selectedGenre: '', listOfGenresFromAPI: []});
  const [playlist, setPlaylist] = useState({selectedPlaylist: '37i9dQZF1DXcBWIGoYBM5M', listOfPlaylistFromAPI: []});
  
  const uri = `spotify:playlist:${playlist.selectedPlaylist}`;
  const size = {
    width: '100%',
    height: 330,
  };
  const view = 'list'; 
  const theme = 'black'; 
  

  useEffect(() => {

    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)      
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .then(tokenResponse => {      
      setToken(tokenResponse.data.access_token);

      axios('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })
      .then (genreResponse => {        
        setGenres({
          selectedGenre: genres.selectedGenre,
          listOfGenresFromAPI: genreResponse.data.categories.items
        })
      });
      
    });

  }, [genres.selectedGenre, spotify.ClientId, spotify.ClientSecret]); 

  const genreChanged = val => {
    setGenres({
      selectedGenre: val, 
      listOfGenresFromAPI: genres.listOfGenresFromAPI
    });

    axios(`https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`, {
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + token}
    })
    .then(playlistResponse => {
      setPlaylist({
        selectedPlaylist: playlist.selectedPlaylist,
        listOfPlaylistFromAPI: playlistResponse.data.playlists.items
      })
    });

    console.log(val);
  }

  const playlistChanged = val => {
    setPlaylist({
      selectedPlaylist: val,
      listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI
    });
  }
  

  return (
    <div className="containter">
      <div className="nav">
        <img src={logo} className="logo" alt="Logo" />
      </div>
      <div className="container row mx-auto main">
        <div className="col-sm-6 dropdowns">
          <form>     
            <Dropdown label="Genre:" options={genres.listOfGenresFromAPI} selectedValue={genres.selectedGenre} changed={genreChanged} />
            <Dropdown label="Playlist:" options={playlist.listOfPlaylistFromAPI} selectedValue={playlist.selectedPlaylist} changed={playlistChanged} />    
          </form>
        </div>
        <div className="col-sm-6 player">
          <SpotifyPlayer
            uri={uri}
            size={size}
            view={view}
            theme={theme}
          />   
        </div> 
      </div>
      <div className="footer">
        <p>©Francisco Leto - Powered by <a href="https://www.spotify.com">Spotify®</a></p>
      </div>
    </div>
  );
}

export default App;
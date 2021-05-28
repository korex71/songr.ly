import React, { useContext, useState, useEffect} from "react"
import PlayerContext from "../context/PlayerContext"
import * as Feather from 'react-feather'
import {
  Search, 
  ImageControls, 
  Container, 
  Wrapper, 
  Controls, 
  SongInfo, 
  SetSearch,
  SearchModal
} from  "../styles/Player.js"
import { secondsToMinutes } from "../helpers"
import {API_URL} from "../api/constants"
import axios from "../api/axios"

function Player() {
    const {triggerPlay, audio, searchSong, activeSearch, setActiveSearch, results} = useContext(PlayerContext)

    const [time, setTime] = useState(0)
    const [volume, setVolume] = useState(100)
    const [duration, setDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [newSong, setNewSong] = useState("")
    const [songInfo, setSongInfo] = useState({})
    const [nextSongs, setNextSongs] = useState([])
    const [container, setContainer] = useState(false)
    const [search, setSearch] = useState("")

    useEffect(() => { // Get song from localstorage and play.
      const song = localStorage.getItem("@App:song");

      if(song){
        const info = JSON.parse(song);

        const id = info.videoId;
        const title = info.media.song || info.title
        const artist = info.media.artist || info.author.name;
        console.log(`Last song from storage: ${title} - ${artist} - ${id}`)
        setSongInfo({title, artist, thumbnail: `http://i.ytimg.com/vi/${id}/maxresdefault.jpg`})
        audio.current.src = `${API_URL}/audio/${id}`
        
        audio.current.id = id;
        
        return audio.current.play();
      }
    }, [audio])

    useEffect(() => { // Detect new song and request info for mediasession
      if(!newSong) return
      console.log('Request info for', audio.current.id)
      axios.post('/audio/info', {id: audio.current.id})
      .then(res => {
          const info = res.data.videoDetails;

          setSongOnLocalstorage(info);

          const id = info.videoId
          const title = info.media.song || info.title;
          const artist = info.media.artist || info.media.writers || info.author.name;
          const album = info.media.album || ""
          const thumbnail = info.thumbnails.pop().url || ""

          document.title = `${title} - ${artist}`

          if('mediaSession' in navigator) {
            const thumbnails = []
          
            info.thumbnails.map(thumb => {
              return thumbnails.push({src: thumb.url, sizes: `${thumb.width}x${thumb.height}`, type: 'image/jpeg'})
            })
          
            navigator.mediaSession.metadata = new window.MediaMetadata({
              title,
              artist,
              album,
              artwork: thumbnails
            })
          
            navigator.mediaSession.setActionHandler('play', () => triggerPlay());
            navigator.mediaSession.setActionHandler('pause', () => triggerPlay());
            navigator.mediaSession.setActionHandler('seekbackward', () => audio.current.currentTime = 0);
            navigator.mediaSession.setActionHandler('nexttrack', () => playNextSong());
          }

          setSongInfo({ title, artist, thumbnail, id })
      })
    }, [newSong, audio]) // eslint-disable-line

    useEffect(() => {
      audio.current.volume = volume / 100
    }, [volume]) // eslint-disable-line

    useEffect(() => {
      console.log(nextSongs)
    }, [nextSongs])

    const setSongOnLocalstorage = (song) => {
      localStorage.setItem("@App:song", JSON.stringify(song))
    }

    const handleSetSong = (song) => {
      const id = song.id || song.videoId;
      const title = song.hasOwnProperty("media") ? song.media.song : song.title
      const artist = song.hasOwnProperty("media") ? song.media.author : song.author.name;
      console.log(`Playlist from: ${title} - ${artist} - ${id}`)
      setSongInfo({title, artist, thumbnail: `http://i.ytimg.com/vi/${id}/maxresdefault.jpg`})
      setActiveSearch(false)
      audio.current.src = `${API_URL}/audio/${id}`
      
      audio.current.id = id;

      return audio.current.play();
    } 

    const generatePlaylistById = async (id, next) => {
      axios.post("/audio", {id})
      .then(res => res.data)
      .then(data => data.related_videos)
      .then(songs => {
        const firstSong = songs[0];
        const list = songs.slice(1);
        setNextSongs(list);
        next(firstSong)
      })
      .catch(err => console.error(err))
    }

    const playNextSong = async () => {

      if(!nextSongs.length){
        return generatePlaylistById(audio.current.id, (song) => {
          if(!song) return null;

          const {id, title} = song;
          const artist = song.author.name;
          console.log(`Playlist from: ${title} - ${artist} - ${id}`)
          setSongInfo({title, artist, thumbnail: songInfo.thumbnail})
          audio.current.src = `${API_URL}/audio/${id}`
          
          audio.current.id = id;
          return audio.current.play();

        })
      }

      const nextSong = nextSongs[0];

      setNextSongs(nextSongs.slice(1))
      
      const {id} = nextSong

      audio.current.src = `${API_URL}/audio/${id}`
      
      audio.current.id = id;
      audio.current.play();
    }
    
    audio.current.onplaying = () => setIsPlaying(true)
    audio.current.onpause = () => setIsPlaying(false)

    audio.current.ontimeupdate = () => setTime(secondsToMinutes(audio.current.currentTime))

    audio.current.onerror = (error) => console.warn('Não foi possível alcançar o servidor', error.message)

    audio.current.onended = () => playNextSong()

    audio.current.onloadedmetadata = () => {
      setNewSong(audio.current.id)
      setDuration(secondsToMinutes(audio.current.duration))
    }

    useEffect(() => {
      setNewSong(audio.current.id)
    }, [isPlaying, audio])

    const handleSearch = () => {
      searchSong(search)
      setSearch("")
    }

    useEffect(() => {
      console.log(results)
    }, [results])

    useEffect(() => {
      if('title' in songInfo){
        setContainer(true)
      }else {
        setActiveSearch(true)
      }
    }, [songInfo])

      return (
        <Wrapper>
          <Search>
            <button onClick={() => setActiveSearch(true)}>
              <Feather.Search />
            </button>
            
          </Search>

          <SearchModal active={activeSearch}>
            <div id="modal">
              <input type="text" 
              value={search}
              placeholder="Músicas, podcasts, artistas, etc..."
              onChange={(e) => setSearch(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
              <div id="results">
                {
                  results && results.map(item => {
                    return (
                      <div id="item" onClick={() => handleSetSong(item)}>
                        <img src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} alt="item" width="64" height="64"/>
                        <p class="title">{item.title}</p>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </SearchModal>

          <Container active={container}>
            <ImageControls>
              <img src={songInfo.thumbnail} alt="Thumbnail" onClick={() => triggerPlay()} style={{opacity: !isPlaying && 0.5, borderRadius: !isPlaying && 0}}/>
              <button onClick={() => {window.open(audio.current.src, "_blank")}}>
                <Feather.Download />
              </button>
              <input type="range" value={volume || 0} min="0" max="100" onChange={(e) => setVolume(e.target.value)} />
            </ImageControls>
              <SongInfo>
                <h1 className="song-title">{songInfo.title}</h1>
                <h1 className="song-title">{songInfo.artist}</h1>
                <h1 className="song-time">{time || '0:00'} / {duration || '0:00'}</h1>
              </SongInfo>
            <Controls>
              <button onClick={() => {audio.current.currentTime = 0}} alt="Replay"><Feather.Repeat /></button>
              <button onClick={() => triggerPlay()} alt="Play/Pause">
                { isPlaying ? <Feather.Pause /> : <Feather.Play /> }
              </button>
              <button onClick={() => playNextSong()} alt="Skip"><Feather.SkipForward /></button>
            </Controls>
          </Container>
            <SetSearch>
              <button onClick={() => setActiveSearch(!activeSearch)}>
                {activeSearch ? (<Feather.X />) : <Feather.List />}
              </button>
            </SetSearch>
        </Wrapper>
      )
}

export default Player
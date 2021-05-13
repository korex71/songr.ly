import React, { useContext, useState, useEffect, useRef } from "react"
import PlayerContext from "../context/PlayerContext"
import * as Feather from 'react-feather'
import "../styles/Player.css"
import { secondsToMinutes } from "../helpers"
import axios from "../api/axios"

function Player() {
    const {triggerPlay, audio, searchSong, activeSearch, setActiveSearch} = useContext(PlayerContext)

    const inputRef = useRef(null)

    const [time, setTime] = useState(0)
    const [volume, setVolume] = useState(100)
    const [duration, setDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [newSong, setNewSong] = useState("")
    const [songInfo, setSongInfo] = useState({})
    const [nextSongs, setNextSongs] = useState(null)
    const [search, setSearch] = useState("")

    useEffect(() => {
      if(newSong === "") return
      console.log('Request info for', audio.current.id)
      axios.post('/audio/info', {id: audio.current.id})
      .then(res => {
          const info = res.data.videoDetails;

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

    const playNextSong = async () => {

      console.log(nextSongs)

      if(!nextSongs){
        const {data: relatedSongs} = await axios.post(`/audio`, {id: audio.current.id})

        const nextSong = relatedSongs.related_videos[0];

        const Next = relatedSongs.related_videos.slice(1);

        setNextSongs(Next);
        
        const {id, title} = nextSong
        const artist = nextSong.author.name;

        console.log(`Playlist: ${title} - ${artist}`)

        setSongInfo({title, artist, thumbnail: songInfo.thumbnail})
        
        audio.current.src = `${process.env.REACT_APP_API_URL}/audio/${id}`
        
        audio.current.id = id;
        return audio.current.play();
      }

      const nextSong = nextSongs[0];

      setNextSongs(nextSongs.slice(1))
      
      const {id, title} = nextSong
      const artist = nextSong.author.name;

      console.log(`Playlist: ${title} - ${artist}`)

      setSongInfo({title, artist, thumbnail: songInfo.thumbnail})
      
      audio.current.src = `${process.env.REACT_APP_API_URL}/audio/${id}`
      
      audio.current.id = id;
      audio.current.play();
    }
    
    audio.current.onplaying = () => setIsPlaying(true)
    audio.current.onpause = () => setIsPlaying(false)

    audio.current.ontimeupdate = () => setTime(secondsToMinutes(audio.current.currentTime))

    audio.current.onerror = () => console.error('Não foi possível alcançar o servidor')

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

    

    if('title' in songInfo)
      return (
        <div id="Player">
          <div id="InputSearch">
            <button onClick={() => handleSearch()}>
              <Feather.Search />
            </button>
            <input type="text" ref={inputRef} value={search} onChange={(e) => setSearch(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSearch()}/>
          </div>
          <div className="container">
            <div className="image-controls">
              <img src={songInfo.thumbnail} alt="" onClick={() => triggerPlay()} style={{opacity: !isPlaying && 0.5, borderRadius: !isPlaying && 0}}/>
              <button onClick={() => {window.open(audio.current.src, "_blank")}}>
                <Feather.Download />
              </button>
              <input type="range" value={volume || 0} min="0" max="100" aria-orientation="vertical" onChange={(e) => setVolume(e.target.value)} />
            </div>
              <div className="song-info">
                <h1 className="song-title">{songInfo.title}</h1>
                <h1 className="song-title">{songInfo.artist}</h1>
                <h1 className="song-time">{time || '0:00'} / {duration || '0:00'}</h1>
              </div>
            <div className="controls">
              <button className="btn-controls" id="btn-play" onClick={() => {audio.current.currentTime = 0}} alt="Replay"><Feather.Repeat /></button>
              <button className="btn-controls" id="btn-play" onClick={() => triggerPlay()} alt="Play/Pause">
                { isPlaying ? <Feather.Pause /> : <Feather.Play /> }
              </button>
              <button className="btn-controls" id="btn-play" onClick={() => playNextSong()} alt="Skip"><Feather.SkipForward /></button>
            </div>
          </div>

          
              <div className="openSearch">
                <button onClick={() => setActiveSearch(!activeSearch)}>
                  <Feather.List />
                </button>
              </div>
        </div>
      )
    else
      return ""
}

export default Player
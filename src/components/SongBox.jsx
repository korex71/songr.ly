import React, { useContext } from 'react'
import PlayerContext from '../context/PlayerContext'


export default function SongBox(item) {
  const {setSongUri, setActiveSearch} = useContext(PlayerContext);

  const handleSetSong = (id) => {
    setSongUri(id)
    setActiveSearch(false)
  }

  return (
    <div className="song-box" onClick={() => handleSetSong(item.id)}>
      <h1 className="title-result">{item.title}</h1>
      <button id={item.id} onClick={() => handleSetSong(item.id)}>{item.author || ''}</button>
    </div>
  )
  
}
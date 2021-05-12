import React, { useContext, useState } from 'react'
import SongBox from '../components/SongBox'
import PlayerContext from '../context/PlayerContext'
import * as Feather from 'react-feather'
import '../styles/Search.css'

function Search() {
  const {results, searchSong, activeSearch} = useContext(PlayerContext)

  const [input, setInput] = useState("")

  const handleInput = (e) => {
    e.key === 'Enter' && searchSong(input)
  }

  return (
    <div id="Search" style={{display: activeSearch ? 'flex' : 'none'}}>
          <div className="results">
            {
              results ? (
                results.map((item, key) => {
                  return (<SongBox title={item.title} id={item.id} author={item.author.name || ''} key={key} />)
                })
              ) : (
                <div id="firstSearch">
                 <input type="text" placeholder="Comece pesquisando uma música." onChange={(e) => setInput(e.target.value)} onKeyPress={e => handleInput(e)}></input>
                 <button onClick={e => searchSong(input)}><Feather.Search /></button>
                </div>
              )
            }
          </div>
    </div>
  )
}

export default Search
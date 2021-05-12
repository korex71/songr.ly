import React from 'react'
import * as Feather from 'react-feather'
import SongBox from './SongBox'
import PlayerContext from '../context/PlayerContext'

export default function SearchList() {
  const {results} = React.useContext(PlayerContext)
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    setIsActive(true)
  }, [results])
  
  if(isActive)
    return (
    <div id="Searchlist">
      <div className="SearchContainer">
        <div className="modalheader">
          <button onClick={() => setIsActive(false)}><Feather.X /></button>
        </div>
        {
          results.map((item, key) => {
            return (<SongBox title={item.title} id={item.id} author={item.author.name || ''} key={key} />)
          })
        }
      </div>
    </div>
    )
}

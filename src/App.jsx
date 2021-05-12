import React, { useState, useRef, useEffect } from "react";
import Player from "./modules/Player";
import Search from "./modules/Search";
import axios from "./api/axios";
import { PlayerProvider } from "./context/PlayerContext";
import "./styles/App.css";

function App() {
  const audio = useRef(new Audio());

  const [songUri, setSongUri] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState();
  const [activeSearch, setActiveSearch] = useState(true);

  const searchSong = async (value) => {
    const response = await axios.get(`/search/${value}`);

    if (response.status !== 200)
      return console.log(
        "Não foi possível alcançar o servidor: Código ",
        response.status
      );

    setResults(response.data);
    setActiveSearch(true);
    return response.data;
  };

  useEffect(() => {
    if (songUri === "") return;
    audio.current.src = `${process.env.REACT_APP_API_URL}/audio/${songUri}`
    audio.current.id = songUri;
    audio.current.play();
    setActiveSearch(false);
  }, [songUri]);

  const triggerPlay = () =>
    audio.current.paused ? audio.current.play() : audio.current.pause();

  const data = {
    searchSong,
    results,
    songUri,
    search,
    setSearch,
    setSongUri,
    triggerPlay,
    audio,
    setActiveSearch,
    activeSearch,
  };

  return (
    <PlayerProvider value={data}>
      <div className="App">
        <Player />
        <Search />
      </div>
    </PlayerProvider>
  );
}

export default App;

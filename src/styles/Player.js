import styled from "styled-components";

export const Wrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 8px;
`;

export const SearchModal = styled.div`
  position: absolute;
  opacity: 0.8;
  background: black;
  height: 100vh;
  width: 100vw;
  z-index: 1;
  display: ${(props) => (props.active ? "flex" : "none")};
  justify-content: center;

  #modal {
    display: flex;
    flex-direction: column;
    width: 40%;
    margin: 30px 20px;

    input {
      border: 1pt solid white;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 0.5em;
    }

    #results {
      display: flex;
      flex-direction: column;

      #item {
        display: flex;
        cursor: pointer;

        &:hover {
          border-right: 1pt solid;
          padding: 5px 0px;
        }

        p {
          align-self: center;
          margin-left: 1em;
        }
      }
    }
  }
`;

export const Search = styled.div`
  display: flex;
  flex-direction: row;
  z-index: 1;
  top: 0;
  position: absolute;
  margin-top: 3em;
  left: 0;
  margin-left: 3.5em;
  transition: 0.3s ease background;

  button {
    padding: 10px;
    border-radius: 0px;
    background: transparent;
    color: white;
  }

  input {
    padding: 10px;
    border-radius: 0%;
    background: transparent;
    color: white;
  }

  &:hover {
    background: #bd0303;
  }
`;

export const Container = styled.div`
  display: ${(props) => (props.active ? "block" : "none")};

  @media only screen and (max-width: 1550px) {
    .container img {
      width: 100% !important;
      height: 100% !important;
    }
  }
`;

export const ImageControls = styled.div`
  position: relative;

  button {
    position: absolute;
    left: 30px;
    bottom: 20px;
    padding: 10px;
    color: white;
    background: #00000096;
    transition: 0.3s ease background;
    cursor: pointer;

    &:hover {
      background-color: #bd0303;
    }
  }

  input {
    position: absolute;
    /* top: 0; */
    right: 2%;
    padding: 20px;
    /* border-radius: 8px; */
    opacity: 0 background;
    background: #00000096;
    bottom: 3.5%;
    box-sizing: border-box;
    font-size: 8px;
    line-height: 1;
    height: 2em;
    background-color: transparent;
    cursor: pointer;
    -webkit-appearance: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 2em;
      height: 2em;
      margin-top: 0;
      background-color: #fff;
      border-radius: 1em;
      border: 2px solid rgba(255, 255, 255, 0.5);
      cursor: pointer;
    }

    &::-moz-range-thumb {
      width: 2em;
      height: 2em;
      margin-top: 0;
      background-color: #fff;
      border-radius: 1em;
      border: 2px solid rgba(255, 255, 255, 0.5);
      cursor: pointer;
    }

    &::-ms-thumb {
      width: 2em;
      height: 2em;
      margin-top: 0;
      background-color: #fff;
      border-radius: 1em;
      border: 2px solid rgba(255, 255, 255, 0.5);
      cursor: pointer;
    }

    &:hover::-webkit-slider-thumb {
      border-color: rgba(255, 255, 255, 0.7);
    }

    &:active::-webkit-slider-thumb {
      border-color: #ffffff;
    }

    &::-webkit-slider-runnable-track {
      cursor: pointer;
      height: 1em;
      border-bottom: 2px solid rgba(255, 255, 255, 0.5);
      background-color: transparent;
    }

    &:focus {
      outline: none;
    }

    &::-ms-track {
      cursor: pointer;
      background: transparent;
      border-color: transparent;
      color: transparent;
    }
  }

  img {
    border-radius: 30px;
    cursor: pointer;
    transition: 0.4s ease all;
    width: 100%;
    height: 100%;

    &:hover {
      opacity: 1;
    }
  }
`;

export const Controls = styled.div`
  display: flex;
  justify-content: space-around;

  button {
    background: transparent;
    color: white;
    padding: 9px;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.2s ease;

    &:hover {
      background: red;
      border-radius: 0px;
    }
  }
`;

export const SongInfo = styled.div`
  margin-top: 0.5em;

  h1.song-title {
    padding: 10px;
    font-size: 20px;
  }

  h1.song-time {
    padding: 15px 0px 40px 10px;
    font-size: 18px;
  }
`;

export const SetSearch = styled.div`
  button {
    position: absolute;
    top: 3em;
    right: 3.5em;
    background: transparent;
    color: white;
    padding: 10px;
    padding-bottom: 7px;
    cursor: pointer;
    transition: 0.3s ease background;
    z-index: 1;

    &:hover {
      background: #bd0303;
    }
  }
`;

'use client'

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

export const initialState = {
  players: [],
  turn: 0,
  word: '**********',
  words: null,
  hidden: true,
  currentPlayerName: '',
  vote: false,
};

const setUnderCover = (players) => {
  // Set one undercover
  if (players.length > 1) {
    players.forEach(player => {
      player.undercover = false;
    });

    players[Math.floor(Math.random() * players.length)].undercover = true;
  }
}

export const AppReducer = (state, action) => {
  switch (action.type) {
    case 'init_stored': {
      return action.value;
    }
    case 'set_words': {
      let { hidden, turn, players } = state;
      let word = initialState.word;
      let words = action.value;

      setUnderCover(players);

      if (!hidden) {
        if (players[turn]?.undercover) {
          word = words.undercover;
        } else {
          word = words.citizen;
        }
      }

      return {
        ...state,
        word,
        words,
      };
    }
    case 'add_player': {
      let currentPlayerName = state.currentPlayerName;
      const newPlayer = { name: action.value, score: 0, undercover: false, out: false };
      state.players.push(newPlayer);
      if (state.players.length === 1) {
        currentPlayerName = newPlayer.name;
      }
      setUnderCover(state.players);
      return { ...state, currentPlayerName };
    }
    case 'remove_player': {
      state.players = state.players.filter(player => player.name !== action.value);
      setUnderCover(state.players);
      return { ...state };
    }
    case 'vote_player': {
      state.players.forEach(player => {
        if (player.name === action.value) {
          player.out = true;
        }
      });
      return { ...state };
    }
    case 'next_turn': {
      let { hidden, turn, players, words } = state;
      let nextTurn = turn;
      let currentPlayerName = initialState.currentPlayerName;
      let player = players[turn] || null;
      let word = initialState.word;
      let finished = false;

      if (hidden) {
        hidden = false;
      } else if (players.length > 1) {
        do {
          if (turn + 1 > players.length - 1 && nextTurn !== -1) {
            // Last player, go vote
            finished = true;
            nextTurn = -1;
            word = 'Vote';
            player = { name: '', out: false };
          } else {
            // Next player
            nextTurn = (nextTurn + 1) % players.length;
            player = players[nextTurn];
          }
        } while (player.out);
        hidden = true;
      } else {
        // No players left
      }

      if (words && !hidden) {
        if (player?.undercover) {
          word = words.undercover;
        } else {
          word = words.citizen;
        }
      }

      currentPlayerName = player?.name || '';

      return {
        ...state,
        turn: nextTurn,
        hidden,
        currentPlayerName,
        word,
      };
    }
  }
};

export const StorageContext = createContext();

export function StorageProvider({ children }) {
  const [ state, dispatch ] = useReducer(AppReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  const getNewWords = () => {
    fetch('/api')
    .then(response => response.json())
    .then(value => {
      console.log(value);
      dispatch({
        type: 'set_words',
        value,
      });
    });
  };

  // const [data, setData] = useLocalStorage('data', initialState);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('state'))) {

      //checking if there already is a state in localstorage
      //if yes, update the current state with the stored one
      dispatch({
        type: 'init_stored',
        value: JSON.parse(localStorage.getItem('state')),
      });
    } else {
      // Init storage with a new word
      getNewWords();
    }
  }, []);

  useEffect(() => {
    if (JSON.stringify(state) !== JSON.stringify(initialState)) {

      localStorage.setItem('state', JSON.stringify(state || initialState));

      //create and/or set a new localstorage variable called 'state'
    }
  }, [state]);

  return (
    <StorageContext.Provider value={contextValue}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  return useContext(StorageContext);
}

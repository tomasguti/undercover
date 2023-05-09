'use client'

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

export const initialState = {
  players: [],
  turn: 0,
  finished: true,
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
      player.out = false;
    });

    players[Math.floor(Math.random() * players.length)].undercover = true;
  }
}

export const AppReducer = (state, action) => {
  switch (action.type) {
    case 'clear_storage': {
      initialState.players = [];
      localStorage.setItem('state', JSON.stringify(initialState));
      return { ...initialState };
    }
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
        finished: false,
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
      const { players, words } = state;
      let word;
      let finished = false;
      let votedPlayer;
      let turn = -1;
      let undercoverWon = false;
      players.forEach(player => {
        if (player.name === action.value) {
          votedPlayer = player;
          if (player.undercover) {
            word = `${player.name} era el impostor. La palabra de los ciudadanos era "${words.citizen}" y la del impostor "${words.undercover}".`;
            finished = true;
            undercoverWon = false;
          } else {
            word = `${player.name} no era el impostor.`;
            player.out = true;
          }
        }
      });

      const playersIn = players.filter(player => !player.out);
      const undercover = players.find(player => player.undercover);
      if (playersIn.length < 3) {
        word = `${votedPlayer.name} no era el impostor. Era ${undercover.name}. La palabra de los ciudadanos era "${words.citizen}" y la del impostor "${words.undercover}".`;
        finished = true;
        undercoverWon = true;
        // Give undercover points
        undercover.score += 10;
      }

      if (finished) {
        // Give citizen points
        if (!undercoverWon) {
          players.forEach(player => {
            if (!player.undercover) {
              player.score += 2;
            }
          });
        }

        // Shuffle players
        const firstPlayer = players.shift();
        players.push(firstPlayer);

        // Reset state
        players.forEach(player => player.out = false);
      }
      
      return { ...state, turn, word, finished, hidden: false };
    }
    case 'next_turn': {
      let { hidden, turn, players, words, finished } = state;
      let nextTurn = turn;
      let currentPlayerName = initialState.currentPlayerName;
      let player = players[turn];
      let word = initialState.word;

      if (hidden) {
        hidden = false;
      } else if (players.length > 1) {
        do {
          // Last player or wrong undercover selected
          if ((turn + 1 > players.length - 1 && nextTurn !== -2) || (nextTurn === -1 && !finished)) {
            // Go vote 
            nextTurn = -2;
            word = 'Vote';
            player = { name: '', out: false };
          } else {
            // Next player
            nextTurn = (nextTurn + 1) % players.length;
            player = players[nextTurn];
          }
        } while (player.out);
        hidden = true;
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
        finished,
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
    fetch(`/api/${new Date().getTime()}`)
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
    const state = JSON.parse(localStorage.getItem('state'));
    if (state) {
      const { players, turn } = state;
      let currentPlayerName = state.currentPlayerName;

      if (!currentPlayerName && players[turn]) {
        currentPlayerName = players[turn].name;
      }
    
      //checking if there already is a state in localstorage
      //if yes, update the current state with the stored one
      dispatch({
        type: 'init_stored',
        value: { ...state, currentPlayerName },
      });
    } else {
      // Init storage with a new word
      getNewWords();
    }
  }, []);

  useEffect(() => {
    if (JSON.stringify(state) !== JSON.stringify(initialState)) {

      // Move players and get new words
      if (state.finished && state.turn === 0) {
        getNewWords();
      }

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

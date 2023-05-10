'use client'

import React from "react"
import Button from "./components/button";
import { useStorage } from "./storage/StorageProvider"
import styles from './page.module.css'

export default function Home() {
  const { state: { word, turn, currentPlayerName, players, finished, hidden }, dispatch } = useStorage();
  return (
    <div className={styles.main}>
      { turn !== -2 ? <>
        <div className={styles.word}>
          <h1>{word}</h1>
        </div>
        <h2>{currentPlayerName || ''}</h2>
        <Button onClick={() => {
          dispatch({
            type: 'next_turn',
            value: '',
          });
        }}>{ (turn === -1 && finished) ? "Nuevo juego" : (hidden ? "Mostrar" : "Siguiente")  }</Button>
      </> : 
      <div>
        <div className={styles.startPlayer}>
          Arranca: {players[Math.floor(Math.random() * players.length)].name}
        </div>
        <div className={styles.vote}>
          Votación
          {players.map(player => !player.out && <Button key={player.name} onClick={() => {
            dispatch({
              type: 'vote_player',
              value: player.name,
            });
          }}>{player.name}</Button>)}
        </div>
    </div>
      }
    </div>
  )
}

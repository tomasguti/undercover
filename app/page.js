'use client'

import React from "react"
import Button from "./components/button";
import { useStorage } from "./components/StorageProvider"
import styles from './page.module.css'

export default function Home() {
  const { state: { word, turn, currentPlayerName, players }, dispatch } = useStorage();
  return (
    <div className={styles.main}>
      Juego
      { turn !== -1 ? <>
        <h1>{word}</h1>
        <h1>{currentPlayerName || ''}</h1>
        <Button onClick={() => {
          dispatch({
            type: 'next_turn',
            value: '',
          });
        }}>Siguiente</Button>
      </> : <>
        {players.map(player => <Button key={player.name} onClick={() => {
          dispatch({
            type: 'vote_player',
            value: player.name,
          });
        }}>{player.name}</Button>)}
      </>}
    </div>
  )
}

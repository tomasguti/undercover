'use client'

import React, { useContext, useState } from "react"
import Button from "../components/button";
import Input from "../components/input";
import { StorageConsumer, StorageProvider, useStorage } from "../components/StorageProvider";
import styles from './page.module.css'

export default function Players() {
  return (
    <div className={styles.main}>
      Jugadores
      <PlayersInput />
      <PlayersList />
    </div>
  )
}

function PlayersInput() {
  const { dispatch } = useStorage();
  const [playerName, setPlayerName] = useState('');
  return (
    <>
      <Input value={playerName} onChange={e => setPlayerName(e.target.value)} autoFocus />
      <Button onClick={ () => {
        dispatch({
          type: 'add_player',
          value: playerName,
        });
        setPlayerName('');
      }}>+</Button>
    </>
  );
}

function PlayersList() {
  const { state: { players }, dispatch } = useStorage();
  return (
    <div className={styles.players}>
      { players.map(player => (<div key={player.name} className={styles.player}>
        <h1>{ player.score } { player.name }</h1>
        <div className={styles.close} onClick={ () => dispatch({
          type: 'remove_player',
          value: player.name,
        }) }><h2>X</h2></div>
      </div>)) }
    </div>
  );
}
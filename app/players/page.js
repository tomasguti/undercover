'use client'

import React from 'react'
import Button from '../components/button'
import { useStorage } from '../storage/StorageProvider'
import styles from './page.module.css'
import PlayersInput from './PlayersInput'
import PlayersList from './PlayersList'

export default function Players() {
  const { dispatch } = useStorage();
  return (
    <div className={styles.main}>
      Agregar jugadores
      <PlayersInput />
      <PlayersList />
      <Button onClick={() => dispatch({ type: 'clear_storage' })}>
        Borrar todo
      </Button>
    </div>
  )
};

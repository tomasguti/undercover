'use client'

import React from "react"
import { useStorage, SCREEN } from "./storage/StorageProvider"
import styles from './page.module.css'
import Vote from "./Vote";
import Play from "./Play";

export default function Game() {
  const { state: { turn } } = useStorage();
  return (
    <div className={styles.main}>
      { turn === SCREEN.VOTE ? <Vote/> : <Play/> }
    </div>
  )
}

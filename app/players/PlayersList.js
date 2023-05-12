import React from 'react'
import { useStorage } from '../storage/StorageProvider';
import styles from './page.module.css'

export default function PlayersList() {
  const { state: { players }, dispatch } = useStorage();
  return (
    <div className={styles.players}>
      { players.map(player => (<div key={player.name} className={styles.player}>
        <div className={styles.close}>{ player.score }</div>
        <p><b>{ player.name }</b></p>
        <div className={styles.close} onClick={ () => dispatch({ type: 'remove_player', value: player.name })}>
          -
        </div>
      </div>)) }
    </div>
  );
};

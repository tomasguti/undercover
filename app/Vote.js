import React from 'react'
import Button from './components/button';
import { useStorage } from './storage/StorageProvider'
import styles from './page.module.css'

export default function Vote() {
  const { state: { players, startPlayer }, dispatch } = useStorage();
  return (
    <div className={styles.vote}>
      { startPlayer && <div className={styles.startPlayer}> Arranca: {startPlayer.name} </div> }
      Votación
      { 
        players.map(player => !player.out && <Button key={player.name}
          onClick={() => {
            dispatch({
              type: 'vote_player',
              value: player.name,
            });
          }
        }>{player.name}</Button>)
      }
    </div>
  );
};

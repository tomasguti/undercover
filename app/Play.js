import React, { useState } from 'react'
import Button from './components/button';
import { useStorage, SCREEN } from './storage/StorageProvider'
import styles from './page.module.css'

export default function Play() {
  const { state: { word, turn, currentPlayerName, finished, hidden }, dispatch } = useStorage();
  const [disableNext, setDisableNext] = useState(false);

  const debounceButton = () => {
    setDisableNext(true);
    setTimeout(() => {
      setDisableNext(false)}, 1000);
  };

  const nextLabel = hidden ? 'Mostrar' : 'Siguiente';
  const roundEnded = turn === SCREEN.RESULT && finished;
  const buttonLabel = roundEnded ? 'Nuevo juego' : nextLabel;

  return (
    <>
      <div className={styles.word}>
        <h1>{word}</h1>
      </div>
      <h2>{currentPlayerName || ''}</h2>
      <Button disabled={disableNext} onClick={() => {
        if (!disableNext) {
          debounceButton();
          dispatch({
            type: 'next_turn',
            value: '',
          });
        }
      }}>
        { buttonLabel }
      </Button>
    </>
  );
};

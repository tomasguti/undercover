import React, { useState } from 'react'
import Button from '../components/button';
import Input from '../components/input';
import { useStorage } from '../storage/StorageProvider';

export default function PlayersInput() {
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

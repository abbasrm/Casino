import React, { useState } from 'react';

import './App.css';
import axios from './components/axios/axios';
import Spinner from './components/spinner/spinner';

const app = () => {
  // App state
  const [coins, setCoins] = useState(null);
  const [freeBet, setFreeBet] = useState(false);
  const [messages, setMessages] = useState([]);

  // Initial (fetch) the coins for the user from the database and update the 'coins' state
  React.useEffect(() => {
    axios.get('/bet-params.json').then(res => {
      // In case of new data base or the database was deleted so the app won't crash
      try {
        setCoins(res.data.coins);
      } catch{
        updateCoins(10000);
      }
    });
  }, []);

  // Update the database with each coin change
  const updateCoins = amount => {
    if (coins + (amount) >= 0 ) {
      setCoins(prevCoins => {
        axios
          .put('/bet-params.json', { coins: prevCoins + (amount) })
          .then(d => {
          })
          .catch(err => console.log(err));
        return prevCoins + (amount)
      });
      return true;
    }
    setMessages(['Please purchase coins to play!']);
    return false;
  }

  // Generate two random numbers
  const chances = () => [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];

  const bet = () => {
    // Initial messages when a new bet
    setMessages([]);

    // Get two random numbers for chances of winnig coins and winning a free be
    const [winCoinsChance, winFreeBetChance] = chances();

    // if coins or free bet won
    let wonSomething = false;

    console.log('====================================');
    console.log('win Coins Chance: ', winCoinsChance);
    console.log('win Free Bet Chance: ', winFreeBetChance);

    if (winCoinsChance < 3) {
      updateCoins(+20);
      wonSomething = true;
      setMessages(['You won 20 coins!']);
    }
    if (winFreeBetChance < 1) {
      setFreeBet(true);
      wonSomething = true;
      setMessages(prevMessage => [...prevMessage, 'You won a free bet!']);
    }
    return !wonSomething ? setMessages(['You didn\'t win anything, please try agian']) : null;
  }

  const betHandler = async () => {
    if(updateCoins(-10)){
      await bet();
    }
  }

  const freeBetHandler = () => {
    setFreeBet(false);
    bet();
  }

  const newGameHandler = () => {
    updateCoins(10000 - coins);
    setFreeBet(false);
    setMessages([]);
  }

  // Load spinner till the coins get fetched from the database
  let contents = <Spinner />
  if (coins !== null) {
    contents = (
      <>
        <div className={["coins", coins > 10000 ? "bg3" : "bg1"].join(' ')}>
          <p>x {coins}</p>
        </div>

        {messages.map(message => <p key={message}>{message}</p>)}
        <button className="bet" onClick={betHandler} disabled={freeBet}>Bet</button>
        {freeBet ? <button onClick={freeBetHandler}>Free Bet</button> : null}
        <br />
        <br />
        <br />
        <button onClick={newGameHandler}>Start a new game!</button>
        <br />
        <button onClick={() => updateCoins(50)}>Purchase 50 coins</button>
        <br/>
        <button onClick={() => updateCoins(-coins)}>Rest coins</button>
      </>
    )
  }
  

  return (
    <div className="App">
      {contents}
    </div>
  );
}

export default app;

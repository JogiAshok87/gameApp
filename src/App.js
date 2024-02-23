import React, { useState, useEffect } from "react";
import "./App.css";

const cardTypes = ["😼", "🙅‍♂️", "🔀", "💣"];

const App = () => {
  const [deck, setDeck] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [defuseCount, setDefuseCount] = useState(0);
  const [drawnCards, setDrawnCards] = useState([]);
  const [message, setMessage] = useState("");
  const [win, setWin] = useState(false);
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (gameStarted) {
      initializeDeck();
    }
  }, [gameStarted]);

  const initializeDeck = () => {
    const shuffledDeck = shuffle([...cardTypes, ...cardTypes, ...cardTypes, ...cardTypes, ...cardTypes]);
    setDeck(shuffledDeck);
    setDrawnCards([]);
    setGameOver(false);
    setDefuseCount(0);
    setWin(false);
  };

  const shuffle = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const handleCardClick = () => {
    if (deck.length === 0) {
      setGameOver(true);
      setGameStarted(false);
      setMessage("Congratulations! You won the game!");
      setWin(true);
      return;
    }

    const drawnCard = deck.pop();
    setDrawnCards([...drawnCards, drawnCard]);
    handleCard(drawnCard);
  };

  const handleCard = (card) => {
    switch (card) {
      case "😼":
        // Cat card - Remove from the deck
        setMessage("Cat card! Removed from the deck.");
        break;
      case "🙅‍♂️":
        // Defuse card - Remove from the deck and increase defuse count
        setMessage("Defuse card! Removed from the deck.");
        setDefuseCount(defuseCount + 1);
        break;
      case "🔀":
        // Shuffle card - Restart the game with a new deck
        setMessage("Shuffle card! Restarting the game.");
        initializeDeck();
        break;
      case "💣":
        // Exploding Kitten card - Check if player has a defuse card to survive
        if (defuseCount > 0) {
          setDefuseCount(defuseCount - 1);
          setMessage("Exploding Kitten defused! Continue drawing.");
          setScore(score + 1);
        } else {
          setGameOver(true);
          setGameStarted(false);
          setMessage("Game over! You drew an Exploding Kitten!");
        }
        break;
      default:
        setMessage("Unknown card!");
        break;
    }
  };

  const renderDeck = () => (
    <div className="deck" onClick={handleCardClick}>
      {deck.length > 0 ? "🂠" : "🃏"}
    </div>
  );

  const renderDrawnCards = () => (
    <div className="drawn-cards">
      {drawnCards.map((card, index) => (
        <span key={index} className="card">
          {card}
        </span>
      ))}
    </div>
  );

  const handleUsernameInput = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div className="app">
      <h1>Exploding Kittens Card Game</h1>
      <div className="game-container">
        <div className="info">
          <p>{message}</p>
          {gameOver && (
            <p>
              {win ? "Congratulations! You won!" : "Better luck next time!"}
            </p>
          )}
          {!gameStarted && !gameOver && (
            <div className="inputContainer">
              <label htmlFor="username">Enter your username:</label>
              <input type="text" id="username" value={username} onChange={handleUsernameInput} className="inputField"/>
              <button onClick={() => setGameStarted(true)}>Start Game</button>
            </div>
          )}
        </div>
        
        {gameStarted && !gameOver && renderDeck()}
        {gameStarted && !gameOver && renderDrawnCards()}
        
        <div className="scoreboard">
          <h3>Score: {score}</h3>
        </div>
      </div>
    </div>
  );
};

export default App;
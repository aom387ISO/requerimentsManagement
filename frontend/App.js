import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Prueba from './Prueba';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Estado para el tema

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); // Alternar entre claro y oscuro
  };

  return (
    <div className={isDarkMode ? "App dark-mode" : "App light-mode"}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <MyButton toggleTheme={toggleTheme} />
      </header>
    </div>
  );
}

function MyButton({ toggleTheme }) {
  return (
    <button onClick={toggleTheme}>Toggle Theme</button>
  );
}

export default App;

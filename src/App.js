import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import UserList from './Components/UserList';
import UserDetails from './Components/UserDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/user/:userId" element={<UserDetails />} />   
        </Routes>
      </div>
    </Router>
  );
}

export default App;

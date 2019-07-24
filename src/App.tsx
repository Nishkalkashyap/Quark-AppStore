import React from 'react';
import './App.css';
import Header from './components/header/header.index';
import Sidebar from './components/sidebar/sidebar.index';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header></Header>
      <div style={{ flexGrow: 1 }}>
        <Sidebar></Sidebar>
      </div>
    </div>
  );
}

export default App;

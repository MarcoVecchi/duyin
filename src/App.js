import './App.css';
import React, { Component } from 'react';
import data from './data/data.json';
import Layout from './script/Layout'

function App(props) {
  return (
    <Layout data={data}></Layout> 
  );
}

// const cfg = {
//   Provider: './data/data.json',
//   Psm: 'http://localhost:10002',
//   // Rotation: 270,
//   Scale: 100,
//   data: data
// }

export default App;

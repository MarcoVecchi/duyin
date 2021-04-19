import './App.css';
import React, { Component } from 'react';
import {ReactComponent as SvgLayout}  from './img/6603-17.svg';
import {ReactComponent as SvgLoadingUnit} from "./img/Components/pallet.svg"
// import { SVG } from './script/svgIntegrationB';
import data from './data/data.json';


var loadingUnit = []

data.forEach(d => loadingUnit.push(<LoadingUnit key={d.Id_Udc} data={d}></LoadingUnit>));

function App(props) {
  return (
    <Layout inbasso={loadingUnit}></Layout> 
  );
}

function LoadingUnit(props){
  var gUdc =  <SvgLoadingUnit></SvgLoadingUnit>;
  var Scale = 100;
  var item = props.data;

  var width = item.LARGHEZZA / Scale * 3.543;
  var height = item.PROFONDITA / Scale * 3.543;

  return (
    <svg width={width + 'px'} height = {height + 'px'}>{gUdc}</svg>
  );
}

function Layout(props){
  return (
  <svg width="3000px" height="5000px">
    <SvgLayout ></SvgLayout>
    {props.inbasso}
  </svg>
  );
}

// class LoadingUnit extends Component {
//   render(props) {
//     return ({svgLoadingUnit});
//     }
// }

// const cfg = {
//   Provider: './data/data.json',
//   Psm: 'http://localhost:10002',
//   // Rotation: 270,
//   Scale: 100,
//   data: data
// }

// setTimeout(function(){SVG(document.getElementById("svgContainer"), cfg)},10000);

// console.log(React);

export default App;

import "./style.css";
import React, { useState } from "react";
import { render } from "react-dom";
import svgLayout from './img/6603-17.svg';
import { SVG } from './script/svgIntegrationB';

const htmlContainer  =  <object id="objContainer" data={svgLayout} />;

const cfg = {
  Provider: 'http://localhost:10001',
  Psm: 'http://localhost:10002',
  // Rotation: 270,
  Scale: 100
}

function App() {
    return (
        <div className="App">
          {htmlContainer}
        </div>
      );
}

render(<App />, document.getElementById("root"));

setTimeout(function(){SVG(document.getElementById("objContainer"), cfg)}, 3000);

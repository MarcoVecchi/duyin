import './App.css';
import svgLayout from './img/6603-17.svg';
import { SVG } from './script/svgIntegrationB';

const htmlContainer  =  <object id="objContainer" data={svgLayout} />;

function App() {
  return (
    <div className="App">
      {htmlContainer}
    </div>
  );
}

const cfg = {
  Provider: 'http://localhost:10001',
  Psm: 'http://localhost:10002',
  // Rotation: 270,
  Scale: 100
}

setTimeout(function(){SVG(document.getElementById("objContainer"), cfg)},3000);

export default App;

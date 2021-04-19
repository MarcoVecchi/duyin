import './App.css';
import  {ReactComponent as ReactLayout}  from './img/6603-17.svg';
import { SVG } from './script/svgIntegrationB';
import data from './data/data.json';

function App(props) {
  return (
    <div className="App">
      <Layout></Layout>
    </div>
  );
}

function Layout(props){
  return (
  <svg width='3000px' height="3000px">
    <ReactLayout></ReactLayout>
  </svg>
  );
}

const cfg = {
  Provider: './data/data.json',
  Psm: 'http://localhost:10002',
  // Rotation: 270,
  Scale: 100,
  data: data
}

setTimeout(function(){SVG(document.getElementById("svgContainer"), cfg)},10000);

// console.log(document.getElementById("svgContainer"));

export default App;

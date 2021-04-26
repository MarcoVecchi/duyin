import {useState, useEffect} from 'react'
import SvgLoadingUnit from "./pallet"

function LoadingUnit(props){
    const[pos, setPos] = useState(props.pos);
    const[x, setX] = useState(0);
    const[y, setY] = useState(0);

    var width = props.width / props.Scale * 3.543;
    var height = props.height / props.Scale * 3.543;

    useEffect(() => {
      var posRef = document.querySelector("[id*='" + pos + "']")?.getBBox();
      if (posRef){
        setX(posRef.x);  
        setY(posRef.y);  
      }
    })
    
    return (
      <SvgLoadingUnit x={x} y={y} width={width} height={height}></SvgLoadingUnit>
    );
}

export default LoadingUnit
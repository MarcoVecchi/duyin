import {useState, useEffect} from 'react'
import {ReactComponent as SvgLoadingUnit} from "../img/Components/pallet.svg"

function LoadingUnit(props){
    const[pos, setPos] = useState(props.pos);

    var width = props.width / props.Scale * 3.543;
    var height = props.height / props.Scale * 3.543;

    return (
      <SvgLoadingUnit  width={width + 'px'}  height = {height + 'px'}></SvgLoadingUnit>
    );
}

export default LoadingUnit
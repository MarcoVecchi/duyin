import {lazy, useState, useEffect, Suspense} from 'react';

function Partition(props){
    const[pos, setPos] = useState(props.pos);
    const[x, setX] = useState(0);
    const[y, setY] = useState(0);
    const[width, setWidth] = useState(0);
    const[height, setHeight] = useState(0);

    const PartitonObj = lazy(() => import('../svgComponent/obj/rulliera/rulliera'));

    useEffect(() => {
      document.querySelectorAll("*[id*='" + pos + "']").forEach(el => {
        setX(el.getBBox().x);
        setY(el.getBBox().y);
        setWidth(el.getBBox().width);
        setHeight(el.getBBox().height);
      });
    });

    return (
      <Suspense fallback="<div>Loading...</div>">
        <PartitonObj x={x} y={y} width={width} height={height}></PartitonObj>
      </Suspense>
    );
}

export default Partition
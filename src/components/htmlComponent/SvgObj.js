import {lazy, useState, useEffect, Suspense} from 'react';

function SvgObj(props) {
    const[x, setX] = useState(0);
    const[y, setY] = useState(0);
    const[width, setWidth] = useState(props.width || 0);
    const[height, setHeight] = useState(props.height || 0);
    const[transform, setTransform] = useState('rotate(90)');

    if (!props.refId) throw 'refId missing'
 
    useEffect(() => {
      document.querySelectorAll("*[id*='" + props.refId + "']").forEach(el => {
        setX(el.getBBox().x);
        setY(el.getBBox().y);
        if (!width) setWidth(el.getBBox().width);
        if (!height) setHeight(el.getBBox().height);
        setTransform(el.getAttributeNS(null, 'transform'));
      });
    });

    if (props.svg) {
      var DynObj = lazy(() => import('../' + props.svg));

      return (
        <Suspense fallback="<div>Loading...</div>">
          <g transform={transform}>
            <DynObj  x={x} y={y} width={width} height={height}></DynObj>
          </g>
        </Suspense>
      );
    } else return (<div></div>);
}

export default SvgObj
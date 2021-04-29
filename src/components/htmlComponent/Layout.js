import { React, lazy, useState, useEffect, Suspense} from 'react';
import SvgObj from './SvgObj';
import {arrayUnique} from '../../script/utils'

function Layout (props) {
    var data = props.data;    
    var partitionChildren = [];
    var loadingUnitChildren = [];
    var SvgLayout = lazy(() => import('../' + props.svg));


    partitionChildren = arrayUnique(data, ['SORG']).map(d => { return (<SvgObj key={d.SORG} svg={d.svg} refId={d.SORG}></SvgObj>) });
    
    loadingUnitChildren = data.filter(d => d.Id_Udc != null).map(d => { 
        return (<SvgObj key={d.Id_Udc} width={d.LARGHEZZA / props.Scale * 3.543} height={d.PROFONDITA / props.Scale * 3.543} svg={d.svgUdc} refId={d.SORG}></SvgObj>) 
    });
    
    return (
        <Suspense fallback="Loading...">
            <SvgLayout partition={partitionChildren} loadingunit={loadingUnitChildren}></SvgLayout>
        </Suspense>
    );
}

export default Layout
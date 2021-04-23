function getRelativeXY(x, y, svg, element) {
    var p = svg.createSVGPoint();
    var ctm = element.getCTM();
    p.x = x;
    p.y = y;
    return p.matrixTransform(ctm);
}

function decomposeMatrix(matrix) {
    // calculate delta transform point
    var px = deltaTransformPoint(matrix, { x: 0, y: 1 });
    var py = deltaTransformPoint(matrix, { x: 1, y: 0 });

    // calculate skew
    var skewX = 180 / Math.PI * Math.atan2(px.y, px.x) - 90;

    if (skewX < 0) skewX = 360 - skewX * -1;

    var skewY = 180 / Math.PI * Math.atan2(py.y, py.x);

    return {
        translateX: matrix.e,
        translateY: matrix.f,
        scaleX: Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b),
        scaleY: Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d),
        skewX: skewX,
        skewY: skewY,
        rotation: skewX
    };
}

function deltaTransformPoint(matrix, point) {
    var dx = point.x * matrix.a + point.y * matrix.c + 0;
    var dy = point.x * matrix.b + point.y * matrix.d + 0;
    return { x: dx, y: dy };
}

export { getRelativeXY, decomposeMatrix, deltaTransformPoint}
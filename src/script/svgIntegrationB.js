/* eslint-disable */
var ASIArray;
var logycalStateTimer;
var physicalStateTimer;
var logycalStatexmlHttp;
var physicalStatexmlHttp;
var faultArray = [];
var pTimerInterval = 2000;
var lTimerInterval = 2000;
var svg;
var panZoom;
var logycalStateUrl;
var physicalStateUrl;
var svgContainer;
var selectedFloor = 1;
var svgdoc;
var gpart, gArrows;
var htmlCont;
var objContainer;
var arrowFlag = false;
var btnFault;
var btnWarning;
var contDiv;
var rootGroup;

export function SVG(elem, cfg) {
    logycalStateUrl = cfg.Provider;
    physicalStateUrl = cfg.Psm;

    var Scale = cfg.Scale ? cfg.Scale : 1;
    var Rotation = cfg.Rotation ? cfg.Rotation : 0;

    objContainer = elem;
    htmlCont = elem.parentElement;
    svgdoc = elem.contentDocument;
    svgContainer = svgdoc.getElementById("svgContainer");
    svgContainer.style.pointerEvents = 'none';
    rootGroup = svgdoc.getElementById('root');
    svg = svgdoc.getElementById("gLAYOUT");
    gpart = svgdoc.createElementNS("http://www.w3.org/2000/svg", "svg");
    gpart.setAttributeNS(null, "id", "gpart");
    svg.appendChild(gpart);
    gArrows = svgdoc.createElementNS("http://www.w3.org/2000/svg", "svg");
    gArrows.setAttributeNS(null, "id", "gArrows");
    svg.appendChild(gArrows);
    ASIArray = [];

    // creo la freccia che verrà assegnata come markerEnd della linea.
    var arrow = svgdoc.createElementNS("http://www.w3.org/2000/svg", 'path');
    arrow.setAttributeNS(null, "d", "M0,0 L0,6 L9,3 z");
    svg.appendChild(arrow);

    // MARKER BLUE WAITING
    var marker1 = svgdoc.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker1.setAttributeNS(null, 'id', 'markerTriangolo1');
    marker1.setAttributeNS(null, "markerWidth", 10);
    marker1.setAttributeNS(null, "markerHeight", 10);
    marker1.setAttributeNS(null, "markerUnits", "strokeWidth");
    marker1.setAttributeNS(null, "refX", 5);
    marker1.setAttributeNS(null, "refY", 3);
    marker1.setAttributeNS(null, "orient", "auto");
    marker1.setAttributeNS(null, "fill", "#007bff");
    marker1.appendChild(arrow);

    // MARKER GREEN RUNNING
    var marker2 = marker1.cloneNode(true);
    marker2.setAttributeNS(null, 'id', 'markerTriangolo2');
    marker2.setAttributeNS(null, "fill", "green");

    // MARKER YELLOW WARNING
    var marker4 = marker1.cloneNode(true);
    marker4.setAttributeNS(null, 'id', 'markerTriangolo4');
    marker4.setAttributeNS(null, "fill", "yellow");

    // APPENDO I MARKER ALL SVG
    var defs = svgdoc.createElementNS("http://www.w3.org/2000/svg", 'defs')
    svg.appendChild(defs);

    defs.appendChild(marker1);
    defs.appendChild(marker2);
    defs.appendChild(marker4);

    var style = svgdoc.createElementNS("http://www.w3.org/2000/svg", 'style');
    style.innerHTML = ".statusLayer {fill: #044b94;opacity: 0.5;} .fault {fill: #FF0000;opacity: 0.5;}"

    defs.appendChild(style);
    
    // // WRAPPNG SVG IN ELEMENTO ZOOM.
    // panZoom = svgPanZoom(svgContainer, {
    //     onUpdatedCTM: function onUpdatedCTM() {
    //         var popover = $(document.getElementById("divSVGContainer")).find('.popover');
    //         if (popover) popover.popover('update');
    //     }
    // });

    btnWarning = null;
    btnFault = null;

    // SE è SPECIFICATA UNA ROTAZIONE NELLA ACTION PARAMETER WIDGET RUOTO L'SVG ED I TESTI.
    if (Rotation != 0 && Rotation) {
        if (Rotation == 1) {
            rootGroup.setAttribute("transform", "rotate(90 " + rootGroup.getBBox().width * 0.5 + ' ' + rootGroup.getBBox().height * 0.5 + ')');
            // panZoom.updateBBox();
        } else if (Rotation == 2) {
            rootGroup.setAttribute("transform", "rotate(180 " + rootGroup.getBBox().width * 0.5 + ' ' + rootGroup.getBBox().height * 0.5 + ')');
        } else if (Rotation == 3) {
            rootGroup.setAttribute("transform", "rotate(270 " + rootGroup.getBBox().width * 0.5 + ' ' + rootGroup.getBBox().height * 0.5 + ')');
            // panZoom.updateBBox();
        } else if (Rotation) {
            rootGroup.setAttribute("transform", "rotate(" + Rotation + " " + rootGroup.getBBox().width * 0.5 + ' ' + rootGroup.getBBox().height * 0.5 + ')');
            // panZoom.updateBBox();
        }

        // I TESTI LI RUOTO SOLO SE LA ROTAZIONE è 180
        //if (Rotation == 2) Array.prototype.forEach.call(svg.getElementsByTagName("text"), function (textItem) {
        //    textItem.setAttribute("transform", "rotate(180 " + (textItem.getBBox().x + textItem.getBBox().width / 2) + ' ' + (textItem.getBBox().y + textItem.getBBox().height / 2) + ')');
        //});
    }

    // FIT AL CONTAINER CONSIDERANDO ROTAZIONE.
    // panZoom.fit();

    // SE IL FILTRO DEI PIANI NON è VISIBLE MANDO 0 COME FILTRO (TIRA SU TUTTI I PIANI);
    if (cfg.FloorFilterVisible == false) selectedFloor = 0;

    // POLLING LOGYCAL STATUS
    logycalStateTimer = setTimeout(logicalStateFetch, lTimerInterval, logycalStateUrl + "/Scada/0/" + selectedFloor, svgdoc, Rotation, Scale);

    // POLLING PHYSICAL STATUS
    physicalStateTimer = setTimeout(physicalStateFetch, pTimerInterval, physicalStateUrl + '/psm/livestatus', Scale);

    contDiv = document.createElement('div');
    contDiv.style.zIndex = 1;
    contDiv.style.position = 'absolute';
    contDiv.className = 'd-flex flex-column';
    htmlCont.insertBefore(contDiv, objContainer);

    // AGGIUNGO IL FILTRO DEI PIANI
    var req = new XMLHttpRequest();

    req.open("GET", logycalStateUrl + "/Scada/getFloors", true);

    req.onload = function () {
        if (req.readyState == 4 && req.status == 200) {
            var data = JSON.parse(req.responseText);
            var flDiv = document.createElement('div');
            flDiv.id = "floorsFilter";
            flDiv.setAttribute("class", "dropdown bg-white m-2");
            var flButton = document.createElement('button');
            flButton.setAttribute("class", "btn btn-outline-primary dropdown-toggle w-100");
            flButton.setAttribute("data-toggle", "dropdown");
            flButton.setAttribute("type", "button");
            flButton.setAttribute("aria-haspopup", "true");
            flButton.setAttribute("aria-expanded", "false");
            flButton.setAttribute("id", "dropdownMenu2");
            flButton.innerHTML = "Livello : 1";
            flDiv.appendChild(flButton);
            var flDivInt = document.createElement('div');
            flDiv.appendChild(flDivInt);
            flDivInt.setAttribute("aria-labelledby", "dropdownMenu2");
            flDivInt.setAttribute("class", "dropdown-menu");
            data.map(function (item) {
                return item.PIANO;
            }).filter(onlyUnique).forEach(function (val) {
                var choiceButton = document.createElement('button');
                choiceButton.setAttribute("class", "dropdown-item");
                choiceButton.setAttribute("type", "button");
                choiceButton.innerHTML = val;
                choiceButton.onclick = function () {
                    //Fermo la richiesta in corso.
                    logycalStatexmlHttp.abort();
                    //Fermo il timer.
                    clearTimeout(logycalStateTimer);
                    //Cancello il rendering attuale.
                    ASIArray.filter(function (ASI) {
                        return ASI.PIANO == selectedFloor;
                    }).forEach(function (ASI) {
                        clearPopovers();

                        if (ASI.svgElement.length > 0) {
                            ASI.svgElement.forEach(function (arrObj) {
                                arrObj.grpObj.remove();
                                if (arrObj.txtObj) arrObj.txtObj.remove();
                            });

                            if (ASI.svgElement[0].seqObj) ASI.svgElement[0].seqObj.remove();
                            var sl = svg.getElementById("sl" + ASI.ASI);
                            if (sl) sl.remove();

                            var lockIcon = svgdoc.getElementById("lock" + ASI.ASI);
                            if (lockIcon) lockIcon.remove();
                        }

                        ASI.udcObjArr.forEach(function (udcItemArray) {
                            udcItemArray.udcObj.remove();
                        });

                        if (ASI.destObj) {
                            ASI.svgElement[0].destObj.grpObj.remove();
                        }
                    });
                    //Per il momento per comodità svuoto tutto l array.
                    ASIArray = ASIArray.filter(function (ASI) {
                        return ASI.PIANO != selectedFloor || ASI.PIANO == 0 || ASI.PIANO == null;
                    });

                    //Imposto la variabile del piano selezionato che verrà usata dalla query
                    selectedFloor = val;
                    //Aggiorno il testo del bottone.
                    flButton.innerHTML = "Livello: " + val;
                    //Rifaccio partire il timer.
                    logycalStateTimer = setTimeout(logicalStateFetch, lTimerInterval, logycalStateUrl + "/Scada/0/" + selectedFloor, svgdoc, Rotation, Scale, true);
                };

                flDivInt.appendChild(choiceButton);
            });

            contDiv.appendChild(flDiv);
        }
    };

    req.send();

    var arrowDiv = document.createElement('div');
    arrowDiv.setAttribute("class", "btn-group-toggle m-2 bg-white");
    arrowDiv.setAttribute("data-toggle", "buttons");
    arrowDiv.innerHTML = '<label class="btn btn-outline-primary w-100"><input type="checkbox" autocomplete="off">Show steps</label></div>'
    arrowDiv.onclick = function (e) {
        arrowFlag = !(e.target.classList.contains('active'));
    }
    contDiv.appendChild(arrowDiv);
}

export function resetSequence(asi) {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };

    req.open("POST", physicalStateUrl + '/psm/resetSequence', true);

    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    req.send(JSON.stringify(ASIArray.filter(function (asiObj) {
        return asiObj.ASI == asi;
    })[0].activeSequence));
} 

function transform(ASI, val) {
    var duration = pTimerInterval;

    var pStart = ASI.svgElement[0].flowPath.getPointAtLength(0);
    var pEnd = ASI.svgElement[0].flowPath.getPointAtLength(ASI.svgElement[0].flowPath.getTotalLength());

    if (val < ASI.PosX && pStart.x === pEnd.x && pStart.y === pEnd.y) {
        duration = 0;
    }

    if (val > ASI.svgElement[0].flowPath.getTotalLength()) {
        duration = 0;
        val = ASI.svgElement[0].flowPath.getTotalLength();
    }

    if (ASI.PosX != val) {
        ASI.svgElement.forEach(o => o.grpObj.animate({ offsetDistance: val * 100 / ASI.svgElement[0].flowPath.getTotalLength() + '%' }
            ,{
                fill: 'forwards',
                duration: duration,
                iterations: 1
            })
        );

        if (ASI.LOCKED)
        ASI.lockIcon.animate({ offsetDistance: val * 100 / ASI.svgElement[0].flowPath.getTotalLength() + '%' },{
            fill: 'forwards',
            duration: duration,
            iterations: 1
            });

        // traslo l udc se è ancora sulla macchina
        ASI.udcObjArr.forEach(function (arrObj) {
            arrObj.udcObj.animate({ offsetDistance: val * 100 / ASI.svgElement[0].flowPath.getTotalLength() + '%' }, {
                fill: 'forwards',
                duration: duration,
                iterations: 1
            });
        });

        var p = ASI.svgElement[0].flowPath.getPointAtLength(val);
        // traslo l'origine della freccia sequenza se esiste

        if (ASI.Id_Percorso) 
            ASI.svgElement[0].seqObj.animate({ d: 'path("M' + p.x + "," + p.y + " L" + ASI.svgElement[0].destObj.center.x + "," + ASI.svgElement[0].destObj.center.y + '")' }, {
                fill: 'forwards',
                duration: duration,
                iterations: 1
            });
        

        ASIArray.filter(a => a.DEST == ASI.ASI).forEach(function (SeqFromASI) {
            if (SeqFromASI && SeqFromASI.svgElement[0].seqObj) {
                SeqFromASI.svgElement[0].seqObj.animate({ d: 'path("M' + SeqFromASI.svgElement[0].center.x + "," + SeqFromASI.svgElement[0].center.y + " L" + p.x + "," + p.y + '")' }, {
                    fill: 'forwards',
                    duration: duration,
                    iterations: 1
                });
            }
        })
        
        ASI.PosX = val;
    }
}

function moveUdc(udcObj, item, ASI) {
    if (ASI.svgElement.length > 0 ) {
        var svgEl = ASI.svgElement[ASI.svgElement.length - 1]; 
        // IL CAMPO ROTATION INDICA COME è ORIENTATA L'UDC SULL ITEM RISPETTO ALL ASSE X.
        var itemRotation = 0
        if (item.Rotation == 1) itemRotation = 90;
        else if (item.Rotation == 2) itemRotation = 180;
        else if (item.Rotation == 3) itemRotation = 270;
        else if (item.Rotation) itemRotation = item.Rotation;

        var p;

        svgEl.grpObj.parentElement.appendChild(udcObj.udcObj);

        if (svgEl.grpObj.style.offsetPath) {
            udcObj.udcObj.style.offsetPath = svgEl.grpObj.style.offsetPath;
            udcObj.udcObj.style.offsetDistance = ASI.PosX + 'px';
            udcObj.udcObj.style.offsetRotate = "auto " + itemRotation + 'deg'
            udcObj.udcObj.style.willChange = "transform"
            udcObj.udcObj.style.offsetAnchor = (udcObj.udcObj.getBBox().x + udcObj.udcObj.getBBox().width / 2 * udcObj.xScale) + 'px ' + (udcObj.udcObj.getBBox().y + udcObj.udcObj.getBBox().height / 2 * udcObj.yScale) + 'px'
        }
        else {
            udcObj.udcObj.style.offsetPath = null;
            udcObj.udcObj.style.offsetRotate = null;
            udcObj.udcObj.style.offsetAnchor = null;
            udcObj.udcObj.style.offsetDistance = null;
            udcObj.udcObj.style.willChange = null;

            if (!svgEl.rackOriginObjX) p = svgEl.center
            else {
                var deltaX, deltaY;

                var offsetX = svgEl.grpObj.getBBox().width / 2;
                if (item.QuotaDepositoX != null) offsetX = item.QuotaDepositoX * 3.543;

                deltaX = svgEl.rackOriginObjX.getPointAtLength(svgEl.renderLength + offsetX).x - svgEl.rackOriginObjX.getPointAtLength(0).x;
                deltaY = svgEl.rackOriginObjX.getPointAtLength(svgEl.renderLength + offsetX).y - svgEl.rackOriginObjX.getPointAtLength(0).y;

                p = svg.createSVGPoint();

                var offsetY = svgEl.grpObj.getBBox().height / 2;
                if (item.QuotaDeposito != null) offsetY = item.QuotaDeposito * 3.543;

                p.x = svgEl.rackOriginObjZ.getPointAtLength(offsetY).x + deltaX;
                p.y = svgEl.rackOriginObjZ.getPointAtLength(offsetY).y + deltaY;
            }
        }

        var tTf = ""
        if (p) tTf = 'translate(' + [p.x - udcObj.udcObj.getBBox().width * udcObj.xScale / 2, p.y - udcObj.udcObj.getBBox().height * udcObj.yScale / 2] + ')';

        var rTf = "";
        if (p) rTf = 'rotate(' + item.Rotation  + ', ' + p.x + ', ' + p.y + ')';

        var sTf = "";
        sTf = 'scale(' + udcObj.xScale + ',' + udcObj.yScale + ')';

        var tS = rTf + tTf + sTf;

        udcObj.udcObj.setAttributeNS(null, "transform", tS);
        
        // udcObj.udcObj.animate({ transform: rTf },{
        //     fill: 'forwards',
        //     duration: 0,
        //     iterations: 1
        // });

        // udcObj.udcObj.animate({ transform: tTf + sTf },{
        //     fill: 'forwards',
        //     duration: 0,
        //     iterations: 1
        // });
    } else udcObj.udcObj.remove();
    
    //Metto l oggetto udc nell array dell oggetto asi
    ASI.udcObjArr.push(udcObj);
}

function deltaTransformPoint(matrix, point) {
    var dx = point.x * matrix.a + point.y * matrix.c + 0;
    var dy = point.x * matrix.b + point.y * matrix.d + 0;
    return { x: dx, y: dy };
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

function getRelativeXY(x, y, svg, element) {
    var p = svg.createSVGPoint();
    var ctm = element.getCTM();
    p.x = x;
    p.y = y;
    return p.matrixTransform(ctm);
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

export function fitSVG() {
    setTimeout(function () {
        panZoom.resize();
        panZoom.fit();
        panZoom.center();
    }, 500);
}

function initSl(obj, element) {
    //ISTANZIO IL TOOLTIP SULL'ELEMENTO HTML SE NON ESISTE IL CONTESTO DATI, ALTRIMENTI ALLINEO LA SELEZIONE.
    // $(element).popover({
    //     container: document.getElementById("divSVGContainer"),
    //     placement: 'top',
    //     html: true,
    //     title: function title() {
    //         var title = document.createElement("div");
    //         title.setAttribute("class", "d-flex flex-row justify-content-between");

    //         if (!obj.Id_Udc) {
    //             title.innerText = "POS: " + obj.ASI;
    //         } else {
    //             title.innerText = 'UDC: ' + obj.Codice_Udc;
    //         }

    //         var closeButton = document.createElement("button");
    //         closeButton.setAttribute("class", "close");
    //         closeButton.setAttribute("type", "button");
    //         closeButton.setAttribute("aria-label", "Close");
    //         closeButton.onclick = function () {clearPopovers();};
    //         closeButton.innerHTML = '<span aria-hidden="true" >&times;</span>';

    //         title.append(closeButton);

    //         return title;
    //     },
    //     content: function content() {
    //         var tmpId = $.now();
    //         var htmlString = '<table id=' + tmpId + ' class="table"><tbody>';
    //         if (obj.ALTEZZA) htmlString += '<tr><th scope="row">ALTEZZA:</th><td>' + obj.ALTEZZA + '</td></tr>';
    //         if (obj.LARGHEZZA) htmlString += '<tr><th scope="row">LARGHEZZA:</th><td>' + obj.LARGHEZZA + '</td></tr>';
    //         if (obj.LUNGHEZZA) htmlString += '<tr><th scope="row">LUNGHEZZA:</th><td>' + obj.LUNGHEZZA + '</td></tr>';

    //         if (!obj.Id_Udc) {
    //             htmlString += '<tr><th scope="row" class="text-right">UDC#:</th><td class="text-left">' + obj.udcObjArr.length + '</td></tr>';
    //             if (obj.Motivo_Blocco) htmlString += '<tr><th scope="row" class="text-right">MOTIVO BLOCCO:</th><td class="text-left">' + obj.Motivo_Blocco + '</td></tr>';
    //             if (obj.activeSequence) {
    //                 htmlString +=   '<tr class="table-active"><td>SEQUENZA ATTIVA</td>';
    //                 htmlString +=   '<td>'
    //                                     + '<button type="button" class="btn btn-primary" onclick="resetSequence(\'' + obj.ASI + '\')">'
    //                                     + '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bootstrap-reboot" viewBox="0 0 16 16">'
    //                                     + '<path d="M1.161 8a6.84 6.84 0 1 0 6.842-6.84.58.58 0 0 1 0-1.16 8 8 0 1 1-6.556 3.412l-.663-.577a.58.58 0 0 1 .227-.997l2.52-.69a.58.58 0 0 1 .728.633l-.332 2.592a.58.58 0 0 1-.956.364l-.643-.56A6.812 6.812 0 0 0 1.16 8z"></path>' + '<path d="M6.641 11.671V8.843h1.57l1.498 2.828h1.314L9.377 8.665c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H5.5v7.352h1.141zm0-3.75V5.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.504 1.324-1.386 1.324h-1.6z"></path>'
    //                                     + '</svg>'
    //                                     + '</button>';
    //                                 '</td></tr>';
    //             }

    //             faultArray.filter(function (activeFault) {
    //                 if (activeFault.asi != null) return activeFault.asi.split(',').findIndex(function (asiInFault) {
    //                     return obj.ASI.startsWith(asiInFault);
    //                 }) != -1;else return false;
    //             }).forEach(function (activeFault, index) {
    //                 htmlString += '<tr class="table-danger"><td colspan="2">' + activeFault.description + '</td></tr>';
    //             });
    //         } else {
    //             var req = new XMLHttpRequest();

    //             req.onreadystatechange = function () {
    //                 if (req.readyState == 4 && req.status == 200) {
    //                     var data = JSON.parse(req.responseText);

    //                     data.forEach(function (itemData) {
    //                         htmlString += '<tr><th scope="row">CONTENUTO:</th><td>' + itemData.Codice_Articolo + "<br/>" + itemData.Descrizione_Articolo + '</td></tr>';
    //                     });

    //                     // recupero dati di missione
    //                     if (obj.epObj.Id_Percorso) {
    //                         req.onreadystatechange = function () {
    //                             if (req.readyState == 4 && req.status == 200) {
    //                                 var mData = JSON.parse(req.responseText);

    //                                 if (mData.length > 0) htmlString += '<tr><th scope="row">MISSIONE:<td>' + mData[0].TipoMissione + "<br/>" + mData[0].Destinazione + '</td></tr>';

    //                                 htmlString += '</tbody></table>';

    //                                 var popover = $(document.getElementById("divSVGContainer")).find('#' + tmpId);
    //                                 popover.html(htmlString);

    //                                 popover = $(document.getElementById("divSVGContainer")).find('.popover');
    //                                 if (popover) popover.popover('update');
    //                             }
    //                         };

    //                         req.open("POST", logycalStateUrl + '/entities/get', true);

    //                         req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    //                         req.send(JSON.stringify({
    //                             "EntityName": "AwmConfig.vMissioni",
    //                             "FilterParameters": [{ "Name": "Id_Missione", "DbType": 0, "Value": obj.epObj.Id_Percorso, "Operator": 0 }]
    //                         }));
    //                     } else {
    //                         htmlString += '</tbody></table>';

    //                         var popover = $(document.getElementById("divSVGContainer")).find('#' + tmpId);
    //                         popover.html(htmlString);

    //                         popover = $(document.getElementById("divSVGContainer")).find('.popover');
    //                         if (popover) popover.popover('update');
    //                     }
    //                 }
    //             };

    //             req.open("POST", logycalStateUrl + '/entities/get', true);

    //             req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    //             req.send(JSON.stringify({
    //                 "EntityName": "AwmConfig.vUdcDettaglio",
    //                 "FilterParameters": [{ "Name": "Id_Udc", "DbType": 8, "Value": obj.Id_Udc, "Operator": 0 }],
    //                 //"OrderParameters": [{ "Name": "Id_Missione", "Descending": false }, { "Name": "Sorgente" }],
    //                 "Pagination": {
    //                     "Page": 1,
    //                     "PageSize": 25
    //                 }
    //             }));
    //         }

    //         return htmlString;
    //     },
    //     sanitize: false
    // });

    // $(element).on('show.bs.popover', function () {
    //     clearPopovers();
    // });
}

function clearPopovers() {
    // $(document.getElementById("divSVGContainer")).find(".popover").popover('hide');
}

function logicalStateFetch(url, svgdoc, Rotation, Scale, Force) {
    if (!svgdoc.getAnimations().some(a => {
        return (a.playState == 'paused')
    }) || Force) {
        logycalStatexmlHttp = new XMLHttpRequest();

        logycalStatexmlHttp.onreadystatechange = function () {
            if (logycalStatexmlHttp.readyState == 4 && logycalStatexmlHttp.status == 200) {
                try {
                    var data = JSON.parse(logycalStatexmlHttp.responseText);

                    // Se è specificata una scala faccio un ovverride dei dati dimensionali.
                    data = data.map(function (obj) {
                        obj.LARGHEZZA = obj.LARGHEZZA ? obj.LARGHEZZA / Scale : obj.LARGHEZZA;
                        obj.PROFONDITA = obj.PROFONDITA ? obj.PROFONDITA / Scale : obj.PROFONDITA;
                        obj.ALTEZZA = obj.ALTEZZA ? obj.ALTEZZA / Scale : obj.ALTEZZA;
                        obj.LARGHEZZATUNNEL = obj.LARGHEZZATUNNEL ? obj.LARGHEZZATUNNEL / Scale : obj.LARGHEZZATUNNEL;
                        obj.OffsetSottoComponente = obj.OffsetSottoComponente ? obj.OffsetSottoComponente / Scale : obj.OffsetSottoComponente;
                        obj.QuotaDeposito = obj.QuotaDeposito ? obj.QuotaDeposito / Scale : obj.QuotaDeposito;
                        obj.QuotaDepositoX = obj.QuotaDepositoX ? obj.QuotaDepositoX / Scale : obj.QuotaDepositoX;
                        obj.posHeight = obj.posHeight ? obj.posHeight / Scale : obj.posHeight;
                        obj.posLength = obj.posLength ? obj.posLength / Scale : obj.posLength;
                        obj.posWidth = obj.posWidth ? obj.posWidth / Scale : obj.posWidth;
                        obj.PosX = obj.PosX ? obj.PosX / Scale : obj.PosX;

                        if (arrowFlag == false) {
                            obj.Id_Percorso = null;
                            obj.Sequenza_Percorso = null;
                        }

                        return obj;
                    });

                    // Se ASI ARRAY VUOTO POPOLO
                    if (ASIArray.length == 0 || Force) {
                        data.forEach(function (ASI) {
                            var obj = ASIArray.find(function (asiItem) {
                                return asiItem.ASI == ASI.SORG;
                            });

                            if (!obj) {
                                obj = {
                                    ASI: ASI.SORG,
                                    ID_COMPONENTE: ASI.ID_COMPONENTE,
                                    PIANO: ASI.PIANO,
                                    COLONNA: ASI.COLONNA,
                                    PARTITION: ASI.PARTITION,
                                    Id_Percorso: null,
                                    Sequenza_Percorso: null,
                                    Id_Tipo_Stato_Percorso: null,
                                    svgElement: [],
                                    Rotation: ASI.Rotation,
                                    udcObjArr: [],
                                    hasFault: false,
                                    hasWarning: false,
                                    ALTEZZA: ASI.posHeight * Scale,
                                    LUNGHEZZA: ASI.posLength * Scale,
                                    LARGHEZZA: ASI.posWidth * Scale
                                };

                                ASIArray.push(obj);

                                // RENDERIUNG SCAFFALI
                                if (ASI.ID_TIPO_COMPONENTE == 'S') {
                                    // SE SONO UNA CELLA DELLO SCAFFALE DEVO TROVARE L ELEMENTO SCAFFALE E FARE IL RENDERING Lì.
                                    var rackOriginObjX = svgdoc.querySelector("[id*='" + ASI.SORG.substring(0, 4) + '.' + ASI.PARTITION + '.' + 'x' + "']");
                                    var rackOriginObjZ = svgdoc.querySelector("[id*='" + ASI.SORG.substring(0, 4) + '.' + ASI.PARTITION + '.' + 'z' + "']");

                                    // SE HO TROVATO ENTRAMBE LE DIRETTRICI DISEGNO LA PARTIZIONE.
                                    if (rackOriginObjX && rackOriginObjZ) {
                                        var renderLength = 0;

                                        var prevObj = ASIArray.find(function (asiItem) {
                                            return asiItem.ID_COMPONENTE == ASI.ID_COMPONENTE && asiItem.PIANO == ASI.PIANO && asiItem.PARTITION == ASI.PARTITION && asiItem.COLONNA == ASI.COLONNA - 1;
                                        });

                                        // RECUPERO LA POSIZIONE DI PARTENZA (O L INIZIO DELLO SCAFFALE O IL COMPONENTE PRECEDENTE) 
                                        if (prevObj) renderLength = prevObj.svgElement[0].renderLength - prevObj.svgElement[0].OffsetSottoComponente + prevObj.svgElement[0].LARGHEZZATUNNEL + 500 / Scale;

                                        // OFFSET CHE INDICA IL DISTANZIAMENTO TRA LE COLONNE
                                        if (ASI.svgOFFSET) renderLength += ASI.svgOFFSET * 3.543 / Scale;

                                        // OFFSET CHE INDICA DOVE LA CELLA PARTE RISPETTO AL TUNNEL.
                                        if (ASI.OffsetSottoComponente) renderLength += ASI.OffsetSottoComponente * 3.543 / Scale;

                                        var deltaX = rackOriginObjX.getPointAtLength(renderLength).x - rackOriginObjX.getPointAtLength(0).x;
                                        var deltaY = rackOriginObjX.getPointAtLength(renderLength).y - rackOriginObjX.getPointAtLength(0).y;

                                        var x1Start = rackOriginObjZ.getPointAtLength(0).x + deltaX;
                                        var y1Start = rackOriginObjZ.getPointAtLength(0).y + deltaY;
                                        var x2Start = rackOriginObjZ.getPointAtLength(ASI.posLength * 3.543).x + deltaX;
                                        var y2Start = rackOriginObjZ.getPointAtLength(ASI.posLength * 3.543).y + deltaY;

                                        deltaX = rackOriginObjX.getPointAtLength(renderLength + ASI.posWidth * 3.543).x - rackOriginObjX.getPointAtLength(0).x;
                                        deltaY = rackOriginObjX.getPointAtLength(renderLength + ASI.posWidth * 3.543).y - rackOriginObjX.getPointAtLength(0).y;

                                        var x1End = rackOriginObjZ.getPointAtLength(0).x + deltaX;
                                        var y1End = rackOriginObjZ.getPointAtLength(0).y + deltaY;
                                        var x2End = rackOriginObjZ.getPointAtLength(ASI.posLength * 3.543).x + deltaX;
                                        var y2End = rackOriginObjZ.getPointAtLength(ASI.posLength * 3.543).y + deltaY;

                                        var partitionObj = svgdoc.createElementNS(svgdoc.rootElement.namespaceURI, 'polygon');
                                        var pWrap = svgdoc.createElementNS(svgdoc.rootElement.namespaceURI, 'g');
                                        pWrap.append(partitionObj);

                                        var points = "";
                                        points += x1Start + "," + y1Start;
                                        points += " " + x2Start + "," + y2Start;
                                        points += " " + x2End + "," + y2End;
                                        points += " " + x1End + "," + y1End;

                                        partitionObj.setAttributeNS(null, "points", points);
                                        partitionObj.setAttributeNS(null, "id", ASI.SORG);
                                        partitionObj.style.pointerEvents = 'auto'

                                        gpart.appendChild(pWrap);

                                        if (ASI.ID_TIPO_PARTIZIONE == 'OO') partitionObj.setAttributeNS(null, "fill", "#333333"); else partitionObj.setAttributeNS(null, "fill", "#C2C2C2");

                                        obj.svgElement.push({
                                            grpObj: partitionObj,
                                            x: null,
                                            y: null,
                                            txtObj: null,
                                            renderLength: renderLength,
                                            LARGHEZZATUNNEL: ASI.LARGHEZZATUNNEL * 3.543,
                                            svgOFFSET: ASI.svgOFFSET * 3.543 || 0,
                                            OffsetSottoComponente: ASI.OffsetSottoComponente * 3.543 || 0,
                                            yScale: 1,
                                            xScale: 1,
                                            rackOriginObjX: rackOriginObjX,
                                            rackOriginObjZ: rackOriginObjZ,
                                            center: getRelativeXY(partitionObj.getBBox().x + partitionObj.getBBox().width / 2, partitionObj.getBBox().y + partitionObj.getBBox().height / 2, svg, partitionObj)
                                        });

                                        initSl(obj, partitionObj);

                                        rackOriginObjX.setAttributeNS(null, 'visibility', 'hidden');
                                        rackOriginObjZ.setAttributeNS(null, 'visibility', 'hidden');
                                    }
                                } else {
                                    // RENDERING DI TUTTO QUELLO CHE NON è SCAFFALE (CENSITO SUL FILE SVG DEL GRAFICO)
                                    //var elArray = svgdoc.querySelectorAll("[id*='" + ASI.SORG + "']")
                                    var elArray = svgdoc.querySelectorAll("[id*='" + ASI.SORG + "']:not([id*='flowPath'])");
                                    //Se non trovo corrispondenza dell'elemento nel file SVG scateno un errore.
                                    if (elArray.length == 0) console.error(ASI.SORG + " non trovato nell'SVG.")
                                    else elArray.forEach(function (ItemG, index) {
                                        //Calcolo rapporto tra la larghezza e la lunghezza dell'elemento con l obiettivo di caricare il file con le proporzioni + simili alle dimensioni dell'elemento stesso.
                                        var wL = ItemG.getBBox().width / ItemG.getBBox().height;
                                        //Capire per quali file ha senso gestire la misura diversa.
                                        if (ASI.svg && ASI.svg.includes('rulliera.')) {
                                            if (wL > 2 || wL < 0.5) {
                                                ASI.svg = ASI.svg.replace('rulliera.', 'rullieraL.');
                                            } else if (wL > 1.3 || wL <= 0.7) {
                                                ASI.svg = ASI.svg.replace('rulliera.', 'rullieraM.');
                                            }
                                        }

                                        var req = new XMLHttpRequest();

                                        req.open("GET", ASI.svg.split(',')[index], true);

                                        req.onload = function (e) {
                                            var parser = new DOMParser();
                                            var componentSvg = parser.parseFromString(req.responseText, "image/svg+xml");
                                            var g = componentSvg.getElementsByTagName('g')[0];
                                            var center;

                                            //SCALA
                                            var xScale = 1,
                                                yScale = 1;

                                            var flowPath = null;

                                            if (ASI.ID_TIPO_COMPONENTE == 'T') {
                                                var i = ASI.SORG.length + 1;
                                                do {
                                                    flowPath = svgdoc.querySelector("[id^='flowPath" + ASI.SORG.substring(0, i) + "']");
                                                    i -= 1;
                                                    //Se sono una lettera fermo la ricerca.
                                                } while (!flowPath && i > 1 && isNaN(ASI.SORG.charAt(i)) == false);
                                            }
                                            


                                            center = getRelativeXY(ItemG.getBBox().x + ItemG.getBBox().width / 2, ItemG.getBBox().y + ItemG.getBBox().height / 2, svg, ItemG);

                                            //Se non trovo alcun SVG associato all'item allora creo il gruppo attorno all'elemento individuato
                                            //Se trovo il file SVG allora lo posiziono sopra all'elemento esistente e lo rimuovo.
                                            if (!g) {
                                                g = svgdoc.createElementNS(svgdoc.rootElement.namespaceURI, 'g');
                                                gpart.appendChild(g);

                                                ItemG.removeAttributeNS(null, 'id');

                                                if (flowPath) {
                                                    ItemG.removeAttributeNS(null, 'transform');
                                                    ItemG.setAttributeNS(null, 'x', 0);
                                                    ItemG.setAttributeNS(null, 'y', 0);

                                                    if (ItemG.getBBox().width > ItemG.getBBox().height) {
                                                        var width = ItemG.getBBox().height;
                                                        var height = ItemG.getBBox().width;
                                                        ItemG.setAttributeNS(null, 'width', width);
                                                        ItemG.setAttributeNS(null, 'height', height);
                                                    }
                                                }

                                                g.id = ASI.SORG;
                                                g.appendChild(ItemG);
                                            } else {
                                                g.id = ASI.SORG + '-' + index;

                                                var rTf = "";

                                                var pWrap = svgdoc.createElementNS(svgdoc.rootElement.namespaceURI, 'g');
                                                pWrap.appendChild(g);

                                                if (!flowPath) {
                                                    gpart.appendChild(pWrap);
                                                    // ROTAZIONE NORMALIZZANDO DIMENSIONI LARGHEZZA / ALTEZZA, AGGIUNGENDO LA ROTAZIONE SE LARGHEZZA è > DI ALTEZZA.
                                                    var elRotation = decomposeMatrix(ItemG.getCTM()).rotation;
                                                    if (ItemG.getBBox().width > ItemG.getBBox().height) elRotation += 90;
                                                    if (elRotation) rTf = "rotate(" + elRotation + ' ' + center.x + ' ' + center.y + ")";
                                                } else {
                                                    var fpGRoup = svgdoc.getElementById('gMotion' + flowPath.id);
                                                    if (!fpGRoup) {
                                                        fpGRoup = svgdoc.createElementNS(svgdoc.rootElement.namespaceURI, 'g');
                                                        fpGRoup.id = 'gMotion' + flowPath.id;
                                                        svg.appendChild(fpGRoup);
                                                    }
                                                    fpGRoup.appendChild(pWrap);
                                                }

                                                xScale = (ItemG.getBBox().width > ItemG.getBBox().height ? ItemG.getBBox().height : ItemG.getBBox().width) * decomposeMatrix(ItemG.getCTM()).scaleX / g.getBBox().width;
                                                yScale = (ItemG.getBBox().width > ItemG.getBBox().height ? ItemG.getBBox().width : ItemG.getBBox().height) * decomposeMatrix(ItemG.getCTM()).scaleY / g.getBBox().height;

                                                //TRANSLATE CHE TIENE CONTO DEL DELTA X (CHE PUò ESSERE ALTEZZA - LARGHEZZA IN BASE ALLA ROTAZIONE) COSì COME Y SEMPRE CENTRANDO L OGGETTO
                                                var tTf = "";
                                                if (!flowPath) tTf = 'translate(' + [center.x - g.getBBox().width * xScale / 2, center.y - g.getBBox().height * yScale / 2] + ")";

                                                var sTf = "";
                                                sTf = 'scale(' + xScale + ',' + yScale + ')';

                                                var tS = rTf + tTf + sTf;

                                                g.setAttributeNS(null, 'transform', tS);

                                                g.style.pointerEvents = 'auto'

                                                ItemG.setAttributeNS(null, 'visibility', 'hidden');
                                            }

                                            var text = null;

                                            //if (flowPath && index == 0) {
                                            //    text = svgdoc.createElementNS("http://www.w3.org/2000/svg", 'text');
                                            //    text.setAttributeNS(null, "x", 0);
                                            //    text.setAttributeNS(null, "y", 0);
                                            //    text.setAttributeNS(null, "style", "fill: blue");
                                            //    text.setAttributeNS(null, "font-size", 3000 / Scale);
                                            //    text.setAttributeNS(null, 'font-family', 'Segoe UI');
                                            //    text.appendChild(svgdoc.createTextNode(ASI.SORG));
                                            //    svg.appendChild(text);
                                            //}

                                            obj.svgElement.push({
                                                grpObj: g,
                                                x: null,
                                                y: null,
                                                txtObj: text,
                                                flowPath: flowPath,
                                                Rotation: ASI.Rotation,
                                                xScale: xScale,
                                                yScale: yScale,
                                                center: center
                                            });

                                            initSl(obj, g);

                                            //Se l'elemento ha una flow path associata lo muobo al punto 0 e la nascondo.
                                            if (flowPath) {
                                                if (flowPath.tagName == 'path')
                                                    g.style.offsetPath = "path('" + flowPath.getAttributeNS(null, 'd') + "')"
                                                else if ((flowPath.tagName == 'line'))
                                                    g.style.offsetPath = "path('M" + flowPath.getAttributeNS(null, 'x1') + ' ' + flowPath.getAttributeNS(null, 'y1') + ',L' + flowPath.getAttributeNS(null, 'x2') + ' ' + flowPath.getAttributeNS(null, 'y2') + "')";

                                                g.style.offsetRotate = 'auto 90deg';
                                                g.style.offsetAnchor = (g.getBBox().x + g.getBBox().width / 2 * xScale) + 'px ' + (g.getBBox().y + g.getBBox().height / 2 * yScale) + 'px'
                                                flowPath.setAttributeNS(null, 'visibility', 'hidden');
                                                g.style.willChange = 'transform';
                                                transform(obj, 0);
                                            }

                                            obj.persistent = true;
                                        };

                                        req.send();
                                    });
                                }
                            }
                        });

                        //Alla prima chiamata nascondo tutto quello che non deve essere visibile.
                        if (!Force) {
                            try {
                                svgdoc.addEventListener('pointerover', (e) => {
                                    if (e.target.parentElement) {
                                        var statusLayer = svgdoc.createElementNS("http://www.w3.org/2000/svg", 'rect');
                                        statusLayer.setAttributeNS(null, "class", 'statusLayer');
                                        statusLayer.style.pointerEvents = 'none'
                                        statusLayer.setAttributeNS(null, "width", e.target.parentElement.getBBox().width);
                                        statusLayer.setAttributeNS(null, "height", e.target.parentElement.getBBox().height);
                                        statusLayer.setAttributeNS(null, "x", e.target.parentElement.getBBox().x);
                                        statusLayer.setAttributeNS(null, "y", e.target.parentElement.getBBox().y);
                                        e.target.parentElement.append(statusLayer);
                                        e.target.parentElement.onpointerout = () => {
                                            statusLayer.remove()
                                        };
                                    }
                                });

                                svgdoc.addEventListener("pointerout", function (e) {
                                    if (e.target.parentElement) e.target.parentElement.querySelectorAll(".statusLayer").forEach(e => e.remove());
                                });

                                svg.getElementById("macchine")?.setAttributeNS(null, 'visibility', 'hidden');
                                svg.getElementById("catenarie")?.setAttributeNS(null, 'visibility', 'hidden');
                                svg.getElementById("rulliere")?.setAttributeNS(null, 'visibility', 'hidden');
                                svg.getElementById("Switcher")?.setAttributeNS(null, 'visibility', 'hidden');
                                svg.getElementById("ralle")?.setAttributeNS(null, 'visibility', 'hidden');
                                svg.getElementById("magazzino")?.setAttributeNS(null, 'visibility', 'hidden');
                                svg.getElementById("flowpath")?.setAttributeNS(null, 'visibility', 'hidden');

                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }

                    //rimuovo tutti gli elementi che non sono + nella query della waTracking (non vanno + tracciati.)
                    ASIArray.forEach(function (asiItem) {
                        asiItem.udcObjArr.filter(function (udcObjItem) {
                            return data.find(function (item) {
                                return udcObjItem.Id_Udc == item.Id_Udc;
                            }) == undefined;
                        }).forEach(function (item) {
                            // rimuovo dal rendering
                            item.udcObj.remove();
                            item.Id_Udc = null;
                        });

                        asiItem.udcObjArr = asiItem.udcObjArr.filter(function (obj) {
                            return obj.Id_Udc != null;
                        });
                    });

                    //rimuovo tutte le sequenze che non sono più attiva.
                    ASIArray.filter(function (seqItem) {
                        return data.find(function (item) {
                            return seqItem.Id_Percorso == item.Id_Percorso && seqItem.Sequenza_Percorso == item.Sequenza_Percorso;
                        }) == undefined;
                    }).forEach(function (item) {
                        // rimuovo dal rendering
                        item.svgElement.forEach(function (svgEl) {
                            // può essere che non abbia una sequenza se non ho l'item sul layout nominato ???
                            if (svgEl.seqObj) svgEl.seqObj.remove();
                            svgEl.seqObj = null;
                        });

                        item.Id_Percorso = null;
                        item.Sequenza_Percorso = null;
                        item.DEST = null;
                    });

                    // aggiorno le posizioni dell udc, delle macchine, delle sequenze.
                    data.forEach(function (item) {
                        var ASI;

                        ASI = ASIArray.find(function (ASIArrayObj) {
                            return ASIArrayObj.ASI == item.SORG;
                        });

                        try {
                            //FRECCE SEQUENZE
                            if (item.DEST) {
                                // recupero l'eventuale oggetto sequenza
                                var seqObj = ASIArray.find(function (seqItem) {
                                    return seqItem.Id_Percorso == item.Id_Percorso && seqItem.Sequenza_Percorso == item.Sequenza_Percorso;
                                });

                                // derfinisco il colore da usare per disegnare la freccia in base allo stato del passo
                                var svgItemDest = void 0;
                                var color = void 0;
                                switch (item.Id_Tipo_Stato_Percorso) {
                                    case 2:
                                        color = "green";
                                        break;
                                    case 4:
                                        color = "yellow";
                                        break;
                                    default:
                                        color = "#007bff";
                                }

                                // se non ho un oggetto sequenza lo creo altrimenti gli cambio colore.
                                if (!seqObj) {
                                    svgItemDest = ASIArray.find(function (ASIArrayObj) {
                                        return ASIArrayObj.ASI == item.DEST;
                                    });
                                    // disegno l udc e come riferimento di posizione uso il centro del gruppo asi nell svg ex 'g2A01'
                                    var seqPath = svgdoc.createElementNS("http://www.w3.org/2000/svg", 'path');
                                    if (svgItemDest && svgItemDest.svgElement.length > 0 && ASI.svgElement.length > 0) {
                                        gArrows.appendChild(seqPath);
                                        var destPoint = svgItemDest.svgElement[0].center;
                                        if (svgItemDest.svgElement[0].flowPath) {
                                            destPoint = svgItemDest.svgElement[0].flowPath.getPointAtLength(svgItemDest.PosX);
                                            svgdoc.getElementById('gMotion' + svgItemDest.svgElement[0].flowPath.id).appendChild(seqPath);
                                        }
                                        var sPoint =  ASI.svgElement[0].center;
                                        if (ASI.svgElement[0].flowPath){
                                            sPoint = ASI.svgElement[0].flowPath.getPointAtLength(ASI.PosX);
                                            svgdoc.getElementById('gMotion' + ASI.svgElement[0].flowPath.id).appendChild(seqPath);
                                        }

                                        if (ASI.svgElement[0].flowPath || svgItemDest.svgElement[0].flowPath) seqPath.style.willChange = 'transform';
                                        
                                        seqPath.setAttributeNS(null, "d", "M" + sPoint.x + " " + sPoint.y + " L" + destPoint.x + " " + destPoint.y);
                                        seqPath.setAttributeNS(null, "marker-end", "url(#markerTriangolo" + item.Id_Tipo_Stato_Percorso) + ")";
                                        seqPath.style.stroke = color;
                                        seqPath.style.strokeWidth = 300 / Scale;

                                        ASI.Id_Percorso = item.Id_Percorso;
                                        ASI.Sequenza_Percorso = item.Sequenza_Percorso;
                                        ASI.Id_Tipo_Stato_Percorso = item.Id_Tipo_Stato_Percorso;
                                        ASI.svgElement[0].seqObj = seqPath;
                                        ASI.svgElement[0].destObj = svgItemDest.svgElement[0];
                                        ASI.DEST = item.DEST;
                                    }
                                } else if (seqObj.Id_Percorso && seqObj.Id_Tipo_Stato_Percorso != item.Id_Tipo_Stato_Percorso) {
                                    ASI.Id_Tipo_Stato_Percorso = item.Id_Tipo_Stato_Percorso;
                                    ASI.svgElement[0].seqObj.style.stroke = color;
                                    // creo la freccia che verrà assegnata come markerEnd della linea. DA FARE MEGLIO!
                                    ASI.svgElement[0].seqObj.setAttributeNS(null, "marker-end", "url(#markerTriangolo" + item.Id_Tipo_Stato_Percorso + ")");
                                }
                            }

                            //TRACKING UDC
                            var gUdc = null;
                            var udc = null;

                            if (item.Id_Udc != 0 && ASI.udcObjArr.findIndex(function (udcObjItem) {
                                return item.Id_Udc == udcObjItem.Id_Udc;
                            }) == -1) {
                                // se l'item sta hostando un udc la disegno.
                                // se esiste un udc con lo stesso Id disegnata prendo lei e la traslo.
                                // tiro su tutte le istanze relative a quell udc (posso averne + d una perchè se lo stesso ASI è disegnato in punti diversi anche l udc a bordo lo sarà).
                                var standingASI = null;
                                var udcIndex = null;
                                var udcObj = null;
                                var _iteratorNormalCompletion = true;
                                var _didIteratorError = false;
                                var _iteratorError = undefined;

                                try {
                                    for (var _iterator = ASIArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                        var asiItem = _step.value;

                                        udcIndex = asiItem.udcObjArr.findIndex(function (udcObjItem) {
                                            return item.Id_Udc == udcObjItem.Id_Udc;
                                        });

                                        if (udcIndex != -1) {
                                            standingASI = asiItem;
                                            break;
                                        }
                                    }
                                } catch (err) {
                                    _didIteratorError = true;
                                    _iteratorError = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion && _iterator.return) {
                                            _iterator.return();
                                        }
                                    } finally {
                                        if (_didIteratorError) {
                                            throw _iteratorError;
                                        }
                                    }
                                };

                                if (standingASI) {
                                    udcObj = standingASI.udcObjArr[udcIndex];
                                    gUdc = standingASI.udcObjArr[udcIndex].udcObj;
                                    udc = gUdc.getElementsByTagName('rect')[0];

                                    if (gUdc) {
                                        // Pulisco la prensenza logica sull ASI
                                        standingASI.udcObjArr.splice(udcIndex, 1);
                                    }

                                    if (udcObj.LARGHEZZA / Scale != item.LARGHEZZA || udcObj.LUNGHEZZA / Scale != item.PROFONDITA) {
                                        udcObj.LARGHEZZA = item.LARGHEZZA * Scale;
                                        udcObj.LUNGHEZZA = item.PROFONDITA * Scale;
                                        udcObj.xScale = item.LARGHEZZA * 3.453 / gUdc.getBBox().width;
                                        udcObj.yScale = item.PROFONDITA * 3.453 / gUdc.getBBox().height;
                                    }

                                    moveUdc(udcObj, item, ASI);
                                } else {
                                    var req = new XMLHttpRequest();

                                    req.open("GET", item.svgUdc, true);

                                    req.onload = function (e) {
                                        var parser = new DOMParser();
                                        var gUdc = parser.parseFromString(req.responseText, "image/svg+xml").getElementsByTagName('g')[0];
                                        var width = (item.LARGHEZZA ? item.LARGHEZZA : 800 / Scale || 1) * 3.543;
                                        var height = (item.PROFONDITA ? item.PROFONDITA : 1200 / Scale || 1) * 3.543;

                                        var xScale = 1,
                                            yScale = 1;

                                        // Se non ho trovato il file aggiungo un quadrato.
                                        if (!gUdc) {
                                            gUdc = svgdoc.createElementNS("http://www.w3.org/2000/svg", 'g');
                                            gUdc.id = 'udc' + item.Id_Udc;
                                            // disegno l udc e come riferimento di posizione uso il centro del gruppo asi nell svg ex 'g2A01'
                                            udc = svgdoc.createElementNS("http://www.w3.org/2000/svg", 'rect');
                                            udc.setAttributeNS(null, "width", width);
                                            udc.setAttributeNS(null, "height", height);
                                            udc.setAttributeNS(null, "x", 0);
                                            udc.setAttributeNS(null, "y", 0);
                                            //udc.setAttributeNS(null, "pointer-events", "none");
                                            udc.style.fill = item.udcColour || "#007bff";
                                            gUdc.appendChild(udc);
                                        } else {
                                            svg.appendChild(gUdc);
                                            xScale = width / gUdc.getBBox().width;
                                            yScale = height / gUdc.getBBox().height;
                                        }

                                        gUdc.id = 'udc' + item.Id_Udc;

                                        gUdc.style.pointerEvents = 'auto';

                                        udcObj = {
                                            Id_Udc: item.Id_Udc,
                                            emptyUdc: true,
                                            emptyUdcObj: null,
                                            Codice_Udc: item.Codice_Udc,
                                            udcObj: gUdc,
                                            epObj: item,
                                            xScale: xScale,
                                            yScale: yScale,
                                            LARGHEZZA: item.LARGHEZZA * Scale,
                                            LUNGHEZZA: item.PROFONDITA * Scale
                                        };

                                        initSl(udcObj, gUdc);

                                        moveUdc(udcObj, item, ASI);
                                    };

                                    req.addEventListener("error", function () {
                                        setTimeout(function () {
                                            req.open("GET", item.svgUdc, true);
                                            req.send();
                                        }, 1000);
                                    });

                                    req.send();
                                }
                            }

                            //LOCKICON
                            if ((item.LOCKED != ASI.LOCKED || ASI.LOCKED == undefined) && ASI.svgElement.length > 0) {
                                ASI.LOCKED = item.LOCKED;
                                ASI.Motivo_Blocco = item.Motivo_Blocco;
                                if (item.LOCKED) {
                                    setTimeout(function(){
                                        var req = new XMLHttpRequest();
                                        req.open("GET", 'App/SVG/Icons/lock.svg', true);
                                        req.onload = function (e) {
                                            var parser = new DOMParser();
                                            var lockIcon = svgdoc.createElementNS("http://www.w3.org/2000/svg", 'g');
                                            lockIcon.setAttributeNS(null, "id", "lock" + ASI.ASI);
                                            lockIcon.appendChild(parser.parseFromString(req.responseText, "image/svg+xml").getElementsByTagName('svg')[0]);
                                            lockIcon.childNodes[0].setAttributeNS(null, "width", 60);
                                            lockIcon.childNodes[0].setAttributeNS(null, "height", 60);
                                            lockIcon.childNodes[0].setAttributeNS(null, "viewbox", '0 0 60 60');
                                            ASI.svgElement[0].grpObj.parentElement.appendChild(lockIcon);

                                            if (ASI.svgElement[0].flowPath){
                                                lockIcon.style.offsetPath = ASI.svgElement[0].grpObj.style.offsetPath;
                                                lockIcon.style.offsetDistance = ASI.PosX + 'px';
                                                lockIcon.style.offsetRotate = "auto " + ASI.Rotation + 'deg'
                                                lockIcon.style.willChange = "transform"
                                                lockIcon.style.offsetAnchor = (lockIcon.getBBox().x + lockIcon.getBBox().width / 2) + 'px ' + (lockIcon.getBBox().y + lockIcon.getBBox().height / 2) + 'px'
                                            } else {
                                                lockIcon.setAttributeNS(null, 'transform','translate(' + [ASI.svgElement[0].center.x - 30, ASI.svgElement[0].center.y - 30] + ")");
                                            }

                                            ASI.lockIcon = lockIcon
                                        }
                                        req.send();
                                    },500);
                                } else {
                                    var lockIcon = svgdoc.getElementById("lock" + ASI.ASI);
                                    ASI.lockIcon = null;
                                    if (lockIcon) lockIcon.remove();
                                }
                            }
                        } catch (e) {
                            console.log(e, e.message);
                        }
                    });

                    // var popover = $(document.getElementById("divSVGContainer")).find('.popover');
                    // if (popover) popover.popover('update');
                } catch (e) {
                    console.log(e, e.message);
                }
            }
        };

        logycalStatexmlHttp.addEventListener('loadend', function () {
            logycalStateTimer = setTimeout(logicalStateFetch, lTimerInterval, logycalStateUrl + "/Scada/0/" + selectedFloor, svgdoc, Rotation, Scale);
        });

        logycalStatexmlHttp.open("GET", url, true); // true for asynchronous

        logycalStatexmlHttp.send(null);
    } else logycalStateTimer = setTimeout(logicalStateFetch, lTimerInterval, logycalStateUrl + "/Scada/0/" + selectedFloor, svgdoc, Rotation, Scale);
}

function physicalStateFetch(pUrl, Scale) {
    if (!svgdoc.getAnimations().some(a => {
        return (a.playState == 'paused')
    })) {
        physicalStatexmlHttp = new XMLHttpRequest();

        physicalStatexmlHttp.onreadystatechange = function () {
            if (physicalStatexmlHttp.readyState == 4 && physicalStatexmlHttp.status == 200) {
                var jsonData = JSON.parse(physicalStatexmlHttp.responseText)

                if (jsonData.filter(function (data) {
                    return data.tagType == 10 && data.value == true;
                }).length > 0) {
                    if (!btnFault) {
                        btnFault = document.createElement('button');
                        btnFault.setAttribute("class", "btn btn-danger m-2 float-none");
                        btnFault.innerText = 'RESET FAULT'
                        btnFault.onclick = function (e) {
                            var req = new XMLHttpRequest();
                            req.onreadystatechange = function () {
                                if (req.readyState == 4 && req.status == 200) {
                                    console.log(req.responseText);
                                }
                            };
                            req.open("GET", physicalStateUrl + '/psm/resetFault', true);
                            req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                            req.send();
                        }
                        contDiv.appendChild(btnFault);
                    }
                } else if (btnFault) {
                    btnFault.remove();
                    btnFault = null;
                }

                if (jsonData.filter(function (data) {
                    return data.tagType == 9 && data.value == true;
                }).length > 0) {
                    if (!btnWarning) {
                        btnWarning = document.createElement('button');
                        btnWarning.setAttribute("class", "btn btn-warning m-2");
                        btnWarning.innerText = 'RESET WARNING'
                        btnWarning.onclick = function (e) {
                            var req = new XMLHttpRequest();
                            req.onreadystatechange = function () {
                                if (req.readyState == 4 && req.status == 200) {
                                    console.log(req.responseText);
                                }
                            };
                            req.open("GET", physicalStateUrl + '/psm/resetWarning', true);
                            req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                            req.send();
                        }
                        contDiv.appendChild(btnWarning);
                    }
                } else if (btnWarning) {
                    btnWarning.remove();
                    btnWarning = null;
                }

                // TO DO : CAPIRE COME GESTIRE I TIPI DI TAGS
                jsonData.filter(function (data) {
                    return data.value != null && (data.tagType == 4 || data.tagType == 12 || data.tagType == 15);
                }).forEach(function (tagObj) {
                    var ASI = ASIArray.find(function (ASI) {
                        return ASI.ASI == tagObj.asi;
                    });

                    if (ASI) {
                        // GESTIONE ANIMAZIONE
                        // se ho associato una flowPath (percorso) ed ho il posizionamento delle macchina allora il mio riferimento per posizionarmi sarà il punto del percorso tenendo conto delle sue trasformazioni.
                        if (ASI.svgElement.length > 0 && tagObj.tagType == 15) transform(ASI, tagObj.value / Scale * 3.543);

                        if (tagObj.tagType == 12 && ASI.activeSequence != tagObj.value) {
                            if (tagObj.value == true) ASI.activeSequence = tagObj;
                            else ASI.activeSequence = false;
                        }
                    }
                });

                // Gestione Fault e Warning
                faultArray = jsonData.filter(function (data) {
                    return data.value != null && data.value != false && data.tagType == 1;
                });

                ASIArray.filter(function (asiObj) {
                    return asiObj.hasFault == true && asiObj.persistent == true && this.findIndex(function (asiInFault) {
                        return asiObj.ASI.startsWith(asiInFault);
                    }) == -1;
                }, faultArray.map(function (item) {
                    if (item.asi) return item.asi.split(',');
                }).flat().filter(onlyUnique)).forEach(function (asiItem) {
                    asiItem.hasFault = false;
                    asiItem.svgElement.forEach(e => e.grpObj.querySelector(".fault").remove());
                });

                ASIArray.filter(function (asiObj) {
                    return asiObj.hasFault == false && asiObj.persistent == true && this.findIndex(function (asiInFault) {
                        return asiObj.ASI.startsWith(asiInFault);
                    }) != -1;
                }, faultArray.map(function (item) {
                    if (item.asi) return item.asi.split(',');
                }).flat().filter(onlyUnique)).forEach(function (asiItem) {
                    asiItem.hasFault = true;
                    asiItem.svgElement.forEach(el => {
                        var faultRect = svgdoc.createElementNS("http://www.w3.org/2000/svg", 'rect');
                        faultRect.setAttributeNS(null, "class", 'fault');
                        faultRect.setAttributeNS(null, "width", el.grpObj.getBBox().width);
                        faultRect.setAttributeNS(null, "height", el.grpObj.getBBox().height);
                        faultRect.setAttributeNS(null, "x", el.grpObj.getBBox().x);
                        faultRect.setAttributeNS(null, "y", el.grpObj.getBBox().y);
                        el.grpObj.appendChild(faultRect);
                    })
                });
            }
        };

        physicalStatexmlHttp.addEventListener('loadend', function () {
            physicalStateTimer = setTimeout(physicalStateFetch, pTimerInterval, pUrl, Scale);
        });

        physicalStatexmlHttp.open("GET", pUrl, true);

        physicalStatexmlHttp.send(null);
    } else physicalStateTimer = setTimeout(physicalStateFetch, pTimerInterval, pUrl, Scale);
}

export function dispose() {
    if (logycalStatexmlHttp) logycalStatexmlHttp.abort();
    if (physicalStatexmlHttp) physicalStatexmlHttp.abort();
    clearTimeout(logycalStateTimer);
    clearTimeout(physicalStateTimer);
}


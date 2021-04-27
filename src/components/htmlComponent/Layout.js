import React, {useState, useEffect, Suspense} from 'react';
import ReactDOM from 'react-dom'
import LoadingUnit from './LoadingUnit';
import Partition from './Partition';
import SvgLayout from '../svgComponent/layout/6603-17'
import {arrayUnique} from '../../script/utils'

function Layout (props) {
    var ASIArray = [];
    var Scale = 100;
    var arrowFlag = false;
    var data;
    var gpart;
    var svg;
    var partition = [];
    var data = props.data;

    // // Se ASI ARRAY VUOTO POPOLO
    // if  (ASIArray.length == 0 /*|| Force*/) {
    //     // svg = document.getElementById("gLAYOUT");
    //     // gpart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    //     // gpart.setAttributeNS(null, "id", "gpart");
    //     // svg.appendChild(gpart);

    //     data.map(function (obj) {
    //         obj.LARGHEZZA = obj.LARGHEZZA ? obj.LARGHEZZA / Scale : obj.LARGHEZZA;
    //         obj.PROFONDITA = obj.PROFONDITA ? obj.PROFONDITA / Scale : obj.PROFONDITA;
    //         obj.ALTEZZA = obj.ALTEZZA ? obj.ALTEZZA / Scale : obj.ALTEZZA;
    //         obj.LARGHEZZATUNNEL = obj.LARGHEZZATUNNEL ? obj.LARGHEZZATUNNEL / Scale : obj.LARGHEZZATUNNEL;
    //         obj.OffsetSottoComponente = obj.OffsetSottoComponente ? obj.OffsetSottoComponente / Scale : obj.OffsetSottoComponente;
    //         obj.QuotaDeposito = obj.QuotaDeposito ? obj.QuotaDeposito / Scale : obj.QuotaDeposito;
    //         obj.QuotaDepositoX = obj.QuotaDepositoX ? obj.QuotaDepositoX / Scale : obj.QuotaDepositoX;
    //         obj.posHeight = obj.posHeight ? obj.posHeight / Scale : obj.posHeight;
    //         obj.posLength = obj.posLength ? obj.posLength / Scale : obj.posLength;
    //         obj.posWidth = obj.posWidth ? obj.posWidth / Scale : obj.posWidth;
    //         obj.PosX = obj.PosX ? obj.PosX / Scale : obj.PosX;

    //         if (arrowFlag == false) {
    //             obj.Id_Percorso = null;
    //             obj.Sequenza_Percorso = null;
    //         }

    //         return obj;
    //     });

    //     data.forEach(function (ASI) {
    //         var obj = ASIArray.find(function (asiItem) {
    //             return asiItem.ASI == ASI.SORG;
    //         });

    //         if (!obj) {
    //             obj = {
    //                 ASI: ASI.SORG,
    //                 ID_COMPONENTE: ASI.ID_COMPONENTE,
    //                 PIANO: ASI.PIANO,
    //                 COLONNA: ASI.COLONNA,
    //                 PARTITION: ASI.PARTITION,
    //                 Id_Percorso: null,
    //                 Sequenza_Percorso: null,
    //                 Id_Tipo_Stato_Percorso: null,
    //                 svgElement: [],
    //                 Rotation: ASI.Rotation,
    //                 udcObjArr: [],
    //                 hasFault: false,
    //                 hasWarning: false,
    //                 ALTEZZA: ASI.posHeight * Scale,
    //                 LUNGHEZZA: ASI.posLength * Scale,
    //                 LARGHEZZA: ASI.posWidth * Scale
    //             };

    //             ASIArray.push(obj);

    //             // RENDERIUNG SCAFFALI
    //             if (ASI.ID_TIPO_COMPONENTE == 'S') {
    //                 // SE SONO UNA CELLA DELLO SCAFFALE DEVO TROVARE L ELEMENTO SCAFFALE E FARE IL RENDERING Lì.
    //                 var rackOriginObjX = document.querySelector("[id*='" + ASI.SORG.substring(0, 4) + '.' + ASI.PARTITION + '.' + 'x' + "']");
    //                 var rackOriginObjZ = document.querySelector("[id*='" + ASI.SORG.substring(0, 4) + '.' + ASI.PARTITION + '.' + 'z' + "']");

    //                 // SE HO TROVATO ENTRAMBE LE DIRETTRICI DISEGNO LA PARTIZIONE.
    //                 if (rackOriginObjX && rackOriginObjZ) {
    //                     var renderLength = 0;

    //                     var prevObj = ASIArray.find(function (asiItem) {
    //                         return asiItem.ID_COMPONENTE == ASI.ID_COMPONENTE && asiItem.PIANO == ASI.PIANO && asiItem.PARTITION == ASI.PARTITION && asiItem.COLONNA == ASI.COLONNA - 1;
    //                     });

    //                     // RECUPERO LA POSIZIONE DI PARTENZA (O L INIZIO DELLO SCAFFALE O IL COMPONENTE PRECEDENTE)
    //                     if (prevObj) renderLength = prevObj.svgElement[0].renderLength - prevObj.svgElement[0].OffsetSottoComponente + prevObj.svgElement[0].LARGHEZZATUNNEL + 500 / Scale;

    //                     // OFFSET CHE INDICA IL DISTANZIAMENTO TRA LE COLONNE
    //                     if (ASI.svgOFFSET) renderLength += ASI.svgOFFSET * 3.543 / Scale;

    //                     // OFFSET CHE INDICA DOVE LA CELLA PARTE RISPETTO AL TUNNEL.
    //                     if (ASI.OffsetSottoComponente) renderLength += ASI.OffsetSottoComponente * 3.543 / Scale;

    //                     var deltaX = rackOriginObjX.getPointAtLength(renderLength).x - rackOriginObjX.getPointAtLength(0).x;
    //                     var deltaY = rackOriginObjX.getPointAtLength(renderLength).y - rackOriginObjX.getPointAtLength(0).y;

    //                     var x1Start = rackOriginObjZ.getPointAtLength(0).x + deltaX;
    //                     var y1Start = rackOriginObjZ.getPointAtLength(0).y + deltaY;
    //                     var x2Start = rackOriginObjZ.getPointAtLength(ASI.posLength * 3.543).x + deltaX;
    //                     var y2Start = rackOriginObjZ.getPointAtLength(ASI.posLength * 3.543).y + deltaY;

    //                     deltaX = rackOriginObjX.getPointAtLength(renderLength + ASI.posWidth * 3.543).x - rackOriginObjX.getPointAtLength(0).x;
    //                     deltaY = rackOriginObjX.getPointAtLength(renderLength + ASI.posWidth * 3.543).y - rackOriginObjX.getPointAtLength(0).y;

    //                     var x1End = rackOriginObjZ.getPointAtLength(0).x + deltaX;
    //                     var y1End = rackOriginObjZ.getPointAtLength(0).y + deltaY;
    //                     var x2End = rackOriginObjZ.getPointAtLength(ASI.posLength * 3.543).x + deltaX;
    //                     var y2End = rackOriginObjZ.getPointAtLength(ASI.posLength * 3.543).y + deltaY;

    //                     var partitionObj = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
    //                     var pWrap = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    //                     pWrap.append(partitionObj);

    //                     var points = "";
    //                     points += x1Start + "," + y1Start;
    //                     points += " " + x2Start + "," + y2Start;
    //                     points += " " + x2End + "," + y2End;
    //                     points += " " + x1End + "," + y1End;

    //                     partitionObj.setAttributeNS(null, "points", points);
    //                     partitionObj.setAttributeNS(null, "id", ASI.SORG);
    //                     partitionObj.style.pointerEvents = 'auto'

    //                     gpart.appendChild(pWrap);

    //                     if (ASI.ID_TIPO_PARTIZIONE == 'OO') partitionObj.setAttributeNS(null, "fill", "#333333"); else partitionObj.setAttributeNS(null, "fill", "#C2C2C2");

    //                     obj.svgElement.push({
    //                         grpObj: partitionObj,
    //                         x: null,
    //                         y: null,
    //                         txtObj: null,
    //                         renderLength: renderLength,
    //                         LARGHEZZATUNNEL: ASI.LARGHEZZATUNNEL * 3.543,
    //                         svgOFFSET: ASI.svgOFFSET * 3.543 || 0,
    //                         OffsetSottoComponente: ASI.OffsetSottoComponente * 3.543 || 0,
    //                         yScale: 1,
    //                         xScale: 1,
    //                         rackOriginObjX: rackOriginObjX,
    //                         rackOriginObjZ: rackOriginObjZ,
    //                         center: getRelativeXY(partitionObj.getBBox().x + partitionObj.getBBox().width / 2, partitionObj.getBBox().y + partitionObj.getBBox().height / 2, svg, partitionObj)
    //                     });

    //                     // initSl(obj, partitionObj);

    //                     rackOriginObjX.setAttributeNS(null, 'visibility', 'hidden');
    //                     rackOriginObjZ.setAttributeNS(null, 'visibility', 'hidden');
    //                 }
    //             } else {
    //                 // RENDERING DI TUTTO QUELLO CHE NON è SCAFFALE (CENSITO SUL FILE SVG DEL GRAFICO)
    //                 //var elArray = svgdoc.querySelectorAll("[id*='" + ASI.SORG + "']")
    //                 var elArray = document.querySelectorAll("[id*='" + ASI.SORG + "']:not([id*='flowPath'])");
    //                 //Se non trovo corrispondenza dell'elemento nel file SVG scateno un errore.
    //                 if (elArray.length == 0) console.error(ASI.SORG + " non trovato nell'SVG.")
    //                 else elArray.forEach(function (ItemG, index) {
    //                     //Calcolo rapporto tra la larghezza e la lunghezza dell'elemento con l obiettivo di caricare il file con le proporzioni + simili alle dimensioni dell'elemento stesso.
    //                     var wL = ItemG.getBBox().width / ItemG.getBBox().height;
    //                     //Capire per quali file ha senso gestire la misura diversa.
    //                     if (ASI.svg && ASI.svg.includes('rulliera.')) {
    //                         if (wL > 2 || wL < 0.5) {
    //                             ASI.svg = ASI.svg.replace('rulliera.', 'rullieraL.');
    //                         } else if (wL > 1.3 || wL <= 0.7) {
    //                             ASI.svg = ASI.svg.replace('rulliera.', 'rullieraM.');
    //                         }
    //                     }

    //                     // console.log('../img/Components/rulliera/rullieraM.svg' === ASI.svg.split(',')[index])
    //                     // console.log(import(/* webpackIgnore: true */ASI.svg.split(',')[index]));

    //                     // return import('../img/Components/rulliera/rullieraM.svg').then(function(SvgComponent){
    //                         var g = <SvgRulliera key={ASI.SORG}></SvgRulliera>
    //                         var center;

    //                         //SCALA
    //                         var xScale = 1,
    //                             yScale = 1;

    //                         var flowPath = null;

    //                         if (ASI.ID_TIPO_COMPONENTE == 'T') {
    //                             var i = ASI.SORG.length + 1;
    //                             do {
    //                                 flowPath = document.querySelector("[id^='flowPath" + ASI.SORG.substring(0, i) + "']");
    //                                 i -= 1;
    //                                 //Se sono una lettera fermo la ricerca.
    //                             } while (!flowPath && i > 1 && isNaN(ASI.SORG.charAt(i)) == false);
    //                         }

    //                         // center = getRelativeXY(ItemG.getBBox().x + ItemG.getBBox().width / 2, ItemG.getBBox().y + ItemG.getBBox().height / 2, svg, ItemG);

    //                         //Se non trovo alcun SVG associato all'item allora creo il gruppo attorno all'elemento individuato
    //                         //Se trovo il file SVG allora lo posiziono sopra all'elemento esistente e lo rimuovo.
    //                         // if (!g) {
    //                         //     g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    //                         //     gpart.appendChild(g);

    //                         //     ItemG.removeAttributeNS(null, 'id');

    //                         //     if (flowPath) {
    //                         //         ItemG.removeAttributeNS(null, 'transform');
    //                         //         ItemG.setAttributeNS(null, 'x', 0);
    //                         //         ItemG.setAttributeNS(null, 'y', 0);

    //                         //         if (ItemG.getBBox().width > ItemG.getBBox().height) {
    //                         //             var width = ItemG.getBBox().height;
    //                         //             var height = ItemG.getBBox().width;
    //                         //             ItemG.setAttributeNS(null, 'width', width);
    //                         //             ItemG.setAttributeNS(null, 'height', height);
    //                         //         }
    //                         //     }

    //                         //     g.id = ASI.SORG;
    //                         //     g.appendChild(ItemG);
    //                         // } else {
    //                             // g.id = ASI.SORG + '-' + index;

    //                             // var rTf = "";

    //                             // var pWrap = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    //                             // pWrap.appendChild(g);

    //                             // if (!flowPath) {
    //                             //     gpart.appendChild(pWrap);
    //                             //     // ROTAZIONE NORMALIZZANDO DIMENSIONI LARGHEZZA / ALTEZZA, AGGIUNGENDO LA ROTAZIONE SE LARGHEZZA è > DI ALTEZZA.
    //                             //     var elRotation = decomposeMatrix(ItemG.getCTM()).rotation;
    //                             //     if (ItemG.getBBox().width > ItemG.getBBox().height) elRotation += 90;
    //                             //     if (elRotation) rTf = "rotate(" + elRotation + ' ' + center.x + ' ' + center.y + ")";
    //                             // } else {
    //                             //     var fpGRoup = document.getElementById('gMotion' + flowPath.id);
    //                             //     if (!fpGRoup) {
    //                             //         fpGRoup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    //                             //         fpGRoup.id = 'gMotion' + flowPath.id;
    //                             //         svg.appendChild(fpGRoup);
    //                             //     }
    //                             //     fpGRoup.appendChild(pWrap);
    //                             // }

    //                             // xScale = (ItemG.getBBox().width > ItemG.getBBox().height ? ItemG.getBBox().height : ItemG.getBBox().width) * decomposeMatrix(ItemG.getCTM()).scaleX / g.getBBox().width;
    //                             // yScale = (ItemG.getBBox().width > ItemG.getBBox().height ? ItemG.getBBox().width : ItemG.getBBox().height) * decomposeMatrix(ItemG.getCTM()).scaleY / g.getBBox().height;

    //                             //TRANSLATE CHE TIENE CONTO DEL DELTA X (CHE PUò ESSERE ALTEZZA - LARGHEZZA IN BASE ALLA ROTAZIONE) COSì COME Y SEMPRE CENTRANDO L OGGETTO
    //                             // var tTf = "";
    //                             // if (!flowPath) tTf = 'translate(' + [center.x - g.getBBox().width * xScale / 2, center.y - g.getBBox().height * yScale / 2] + ")";

    //                             // var sTf = "";
    //                             // sTf = 'scale(' + xScale + ',' + yScale + ')';

    //                             // var tS = rTf + tTf + sTf;

    //                             // g.setAttributeNS(null, 'transform', tS);

    //                             // g.style.pointerEvents = 'auto'

    //                             // ItemG.setAttributeNS(null, 'visibility', 'hidden');
    //                         // }

    //                         var text = null;

    //                         //if (flowPath && index == 0) {
    //                         //    text = svgdoc.createElementNS("http://www.w3.org/2000/svg", 'text');
    //                         //    text.setAttributeNS(null, "x", 0);
    //                         //    text.setAttributeNS(null, "y", 0);
    //                         //    text.setAttributeNS(null, "style", "fill: blue");
    //                         //    text.setAttributeNS(null, "font-size", 3000 / Scale);
    //                         //    text.setAttributeNS(null, 'font-family', 'Segoe UI');
    //                         //    text.appendChild(svgdoc.createTextNode(ASI.SORG));
    //                         //    svg.appendChild(text);
    //                         //}

    //                         partition.push(g);

    //                         obj.svgElement.push({
    //                             grpObj: g,
    //                             x: null,
    //                             y: null,
    //                             txtObj: text,
    //                             flowPath: flowPath,
    //                             Rotation: ASI.Rotation,
    //                             xScale: xScale,
    //                             yScale: yScale,
    //                             center: center
    //                         });

    //                         // initSl(obj, g);

    //                         //Se l'elemento ha una flow path associata lo muobo al punto 0 e la nascondo.
    //                         // if (flowPath) {
    //                         //     if (flowPath.tagName == 'path')
    //                         //         g.style.offsetPath = "path('" + flowPath.getAttributeNS(null, 'd') + "')"
    //                         //     else if ((flowPath.tagName == 'line'))
    //                         //         g.style.offsetPath = "path('M" + flowPath.getAttributeNS(null, 'x1') + ' ' + flowPath.getAttributeNS(null, 'y1') + ',L' + flowPath.getAttributeNS(null, 'x2') + ' ' + flowPath.getAttributeNS(null, 'y2') + "')";

    //                         //     g.style.offsetRotate = 'auto 90deg';
    //                         //     g.style.offsetAnchor = (g.getBBox().x + g.getBBox().width / 2 * xScale) + 'px ' + (g.getBBox().y + g.getBBox().height / 2 * yScale) + 'px'
    //                         //     flowPath.setAttributeNS(null, 'visibility', 'hidden');
    //                         //     g.style.willChange = 'transform';
    //                         //     // transform(obj, 0);
    //                         // }

    //                         // obj.persistent = true;
    //                     // });
    //                 });
    //             }
    //         }
    //     });


    // //Alla prima chiamata nascondo tutto quello che non deve essere visibile.
    // // if (!Force) {
    // //     try {
    // //         document.addEventListener('pointerover', (e) => {
    // //             if (e.target.parentElement) {
    // //                 var statusLayer = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    // //                 statusLayer.setAttributeNS(null, "class", 'statusLayer');
    // //                 statusLayer.style.pointerEvents = 'none'
    // //                 statusLayer.setAttributeNS(null, "width", e.target.parentElement.getBBox().width);
    // //                 statusLayer.setAttributeNS(null, "height", e.target.parentElement.getBBox().height);
    // //                 statusLayer.setAttributeNS(null, "x", e.target.parentElement.getBBox().x);
    // //                 statusLayer.setAttributeNS(null, "y", e.target.parentElement.getBBox().y);
    // //                 e.target.parentElement.append(statusLayer);
    // //                 e.target.parentElement.onpointerout = () => {
    // //                     statusLayer.remove()
    // //                 };
    // //             }
    // //         });

    // //         document.addEventListener("pointerout", function (e) {
    // //             if (e.target.parentElement) e.target.parentElement.querySelectorAll(".statusLayer").forEach(e => e.remove());
    // //         });

    // //         svg.getElementById("macchine")?.setAttributeNS(null, 'visibility', 'hidden');
    // //         svg.getElementById("catenarie")?.setAttributeNS(null, 'visibility', 'hidden');
    // //         svg.getElementById("rulliere")?.setAttributeNS(null, 'visibility', 'hidden');
    // //         svg.getElementById("Switcher")?.setAttributeNS(null, 'visibility', 'hidden');
    // //         svg.getElementById("ralle")?.setAttributeNS(null, 'visibility', 'hidden');
    // //         svg.getElementById("magazzino")?.setAttributeNS(null, 'visibility', 'hidden');
    // //         svg.getElementById("flowpath")?.setAttributeNS(null, 'visibility', 'hidden');

    // //     } catch (e) {
    // //         console.log(e);
    // //     }
    // // }
    // }

    var loadingUnit = [];
    var logycalStateUrl = props.Provider;
    var physicalStateUrl = props.Psm;
    var Scale = props.Scale ? props.Scale : 1;
    var Rotation = props.Rotation ? props.Rotation : 0;
    var lTimerInterval = 2000;
    //   svgContainer = elem
    //   svgContainer.style.pointerEvents = 'none';
    //   rootGroup = elem.getElementById('root');
    //   svg.appendChild(gpart);
    //   var gArrows = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    //   gArrows.setAttributeNS(null, "id", "gArrows");
    //   svg.appendChild(gArrows);
    //   creo la freccia che verrà assegnata come markerEnd della linea.
    var arrow = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    arrow.setAttributeNS(null, "d", "M0,0 L0,6 L9,3 z");
    // svg.appendChild(arrow);

    // MARKER BLUE WAITING
    var marker1 = document.createElementNS("http://www.w3.org/2000/svg", "marker");
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
    var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs')
    // svg.appendChild(defs);

    defs.appendChild(marker1);
    defs.appendChild(marker2);
    defs.appendChild(marker4);

    var style = document.createElementNS("http://www.w3.org/2000/svg", 'style');
    style.innerHTML = ".statusLayer {fill: #044b94;opacity: 0.5;} .fault {fill: #FF0000;opacity: 0.5;}"

    defs.appendChild(style);
    // // WRAPPNG SVG IN ELEMENTO ZOOM.
    // panZoom = svgPanZoom(svgContainer, {
    //     onUpdatedCTM: function onUpdatedCTM() {
    //         var popover = $(document.getElementById("divSVGContainer")).find('.popover');
    //         if (popover) popover.popover('update');
    //     }
    // });

    var btnWarning = null;
    var btnFault = null;

    // SE è SPECIFICATA UNA ROTAZIONE NELLA ACTION PARAMETER WIDGET RUOTO L'SVG ED I TESTI.
    //   if (Rotation != 0 && Rotation) {
    //       if (Rotation == 1) {
    //           rootGroup.setAttribute("transform", "rotate(90 " + rootGroup.getBBox().width * 0.5 + ' ' + rootGroup.getBBox().height * 0.5 + ')');
    //           // panZoom.updateBBox();
    //       } else if (Rotation == 2) {
    //           rootGroup.setAttribute("transform", "rotate(180 " + rootGroup.getBBox().width * 0.5 + ' ' + rootGroup.getBBox().height * 0.5 + ')');
    //       } else if (Rotation == 3) {
    //           rootGroup.setAttribute("transform", "rotate(270 " + rootGroup.getBBox().width * 0.5 + ' ' + rootGroup.getBBox().height * 0.5 + ')');
    //           // panZoom.updateBBox();
    //       } else if (Rotation) {
    //           rootGroup.setAttribute("transform", "rotate(" + Rotation + " " + rootGroup.getBBox().width * 0.5 + ' ' + rootGroup.getBBox().height * 0.5 + ')');
    //           // panZoom.updateBBox();
    //       }

    //       // I TESTI LI RUOTO SOLO SE LA ROTAZIONE è 180
    //       //if (Rotation == 2) Array.prototype.forEach.call(svg.getElementsByTagName("text"), function (textItem) {
    //       //    textItem.setAttribute("transform", "rotate(180 " + (textItem.getBBox().x + textItem.getBBox().width / 2) + ' ' + (textItem.getBBox().y + textItem.getBBox().height / 2) + ')');
    //       //});
    //   }

    // FIT AL CONTAINER CONSIDERANDO ROTAZIONE.
    // panZoom.fit();

    // SE IL FILTRO DEI PIANI NON è VISIBLE MANDO 0 COME FILTRO (TIRA SU TUTTI I PIANI);
    var selectedFloor = 0;

    // POLLING LOGYCAL STATUS
    // var logycalStateTimer = setTimeout(logicalStateFetch, lTimerInterval, logycalStateUrl + "/Scada/0/" + selectedFloor, Rotation, Scale);

    // POLLING PHYSICAL STATUS
    // physicalStateTimer = setTimeout(physicalStateFetch, pTimerInterval, physicalStateUrl + '/psm/livestatus', Scale);

    // contDiv = document.createElement('div');
    // contDiv.style.zIndex = 1;
    // contDiv.style.position = 'absolute';
    // contDiv.className = 'd-flex flex-column';
    // htmlCont.insertBefore(contDiv, objContainer);

    // AGGIUNGO IL FILTRO DEI PIANI
    // var req = new XMLHttpRequest();

    // req.open("GET", logycalStateUrl + "/Scada/getFloors", true);

    // req.onload = function () {
    //     if (req.readyState == 4 && req.status == 200) {
    //         var data = JSON.parse(req.responseText);
    //         var flDiv = document.createElement('div');
    //         flDiv.id = "floorsFilter";
    //         flDiv.setAttribute("class", "dropdown bg-white m-2");
    //         var flButton = document.createElement('button');
    //         flButton.setAttribute("class", "btn btn-outline-primary dropdown-toggle w-100");
    //         flButton.setAttribute("data-toggle", "dropdown");
    //         flButton.setAttribute("type", "button");
    //         flButton.setAttribute("aria-haspopup", "true");
    //         flButton.setAttribute("aria-expanded", "false");
    //         flButton.setAttribute("id", "dropdownMenu2");
    //         flButton.innerHTML = "Livello : 1";
    //         flDiv.appendChild(flButton);
    //         var flDivInt = document.createElement('div');
    //         flDiv.appendChild(flDivInt);
    //         flDivInt.setAttribute("aria-labelledby", "dropdownMenu2");
    //         flDivInt.setAttribute("class", "dropdown-menu");
    //         data.map(function (item) {
    //             return item.PIANO;
    //         }).filter(onlyUnique).forEach(function (val) {
    //             var choiceButton = document.createElement('button');
    //             choiceButton.setAttribute("class", "dropdown-item");
    //             choiceButton.setAttribute("type", "button");
    //             choiceButton.innerHTML = val;
    //             choiceButton.onclick = function () {
    //                 //Fermo la richiesta in corso.
    //                 logycalStatexmlHttp.abort();
    //                 //Fermo il timer.
    //                 clearTimeout(logycalStateTimer);
    //                 //Cancello il rendering attuale.
    //                 ASIArray.filter(function (ASI) {
    //                     return ASI.PIANO == selectedFloor;
    //                 }).forEach(function (ASI) {
    //                     clearPopovers();

    //                     if (ASI.svgElement.length > 0) {
    //                         ASI.svgElement.forEach(function (arrObj) {
    //                             arrObj.grpObj.remove();
    //                             if (arrObj.txtObj) arrObj.txtObj.remove();
    //                         });

    //                         if (ASI.svgElement[0].seqObj) ASI.svgElement[0].seqObj.remove();
    //                         var sl = svg.getElementById("sl" + ASI.ASI);
    //                         if (sl) sl.remove();

    //                         var lockIcon = svgdoc.getElementById("lock" + ASI.ASI);
    //                         if (lockIcon) lockIcon.remove();
    //                     }

    //                     ASI.udcObjArr.forEach(function (udcItemArray) {
    //                         udcItemArray.udcObj.remove();
    //                     });

    //                     if (ASI.destObj) {
    //                         ASI.svgElement[0].destObj.grpObj.remove();
    //                     }
    //                 });
    //                 //Per il momento per comodità svuoto tutto l array.
    //                 ASIArray = ASIArray.filter(function (ASI) {
    //                     return ASI.PIANO != selectedFloor || ASI.PIANO == 0 || ASI.PIANO == null;
    //                 });

    //                 //Imposto la variabile del piano selezionato che verrà usata dalla query
    //                 selectedFloor = val;
    //                 //Aggiorno il testo del bottone.
    //                 flButton.innerHTML = "Livello: " + val;
    //                 //Rifaccio partire il timer.
    //                 logycalStateTimer = setTimeout(logicalStateFetch, lTimerInterval, logycalStateUrl + "/Scada/0/" + selectedFloor, svgdoc, Rotation, Scale, true);
    //             };

    //             flDivInt.appendChild(choiceButton);
    //         });

    //         contDiv.appendChild(flDiv);
    //     }
    // };

    // req.send();

    // var arrowDiv = document.createElement('div');
    // arrowDiv.setAttribute("class", "btn-group-toggle m-2 bg-white");
    // arrowDiv.setAttribute("data-toggle", "buttons");
    // arrowDiv.innerHTML = '<label class="btn btn-outline-primary w-100"><input type="checkbox" autocomplete="off">Show steps</label></div>'
    // arrowDiv.onclick = function (e) {
    //     arrowFlag = !(e.target.classList.contains('active'));
    // }
    // contDiv.appendChild(arrowDiv);


    
    var partitionChildren = [];
    var loadingUnitChildren = [];

    partitionChildren = arrayUnique(data, ['SORG']).map(d => { return (<Partition key={d.SORG} svg={d.svg} Scale={100} pos={d.SORG}></Partition>) });
    loadingUnitChildren = data.map(d => { return (<LoadingUnit key={d.Id_Udc} width={d.LARGHEZZA} height={d.PROFONDITA} Scale={100} pos={d.SORG}></LoadingUnit>) });
    
    return (
        <Suspense>
            <SvgLayout partition={partitionChildren} loadingunit={loadingUnitChildren} style={{display:'block'}} width="100%" height="100%"></SvgLayout>
        </Suspense>
    );
}

export default Layout
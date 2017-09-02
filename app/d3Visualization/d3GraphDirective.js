'use strict';

var myAppd3view = angular.module('myApp.d3view');

myAppd3view.directive('d3Graphvisualization', 
  ['d3Service', '$window', '$parse', 'queryDatasetService', '$rootScope', 'ContactSPARQLendpoint',
  function(d3Service, $window, $parse, queryDatasetService, $rootScope, ContactSPARQLendpoint) {
    return{
      //restrict:'E' --> <d3-visualization></d3-visualization>
      //restrict:'A' --> <div d3-visualization ></div>
      //restrict:'EA' --> entrambe le forme
      restrict:'E',
      //this is important,
      replace: false,
      //<d3-visualization graph="graph"></d3-visualization> --> $scope.graph

      //The @ symbol tells angular that this is a one-way bound value
      //The = symbol tells angular that this is a two-way bound value
      
      scope: {
          graph: "=",
          model: "=",
          selectedNodeLabel: "=",  // nella view: selected-node-label
          objectShape: "=",  // nella view: object-shape
          datatypeShape: "=",  // nella view: datatype-shape
          datainfo: "="

      },
      link: function(scope, elem, attrs){
        // quando invoco il provider d3Service viene richiamato this.$get
        d3Service.then(function(d3) {
          // now you can use d3 as usual!
       
          var width = "900";
          var height = "500";

          /* svg */
          var svg = d3.select(elem[0]).append("svg")
            .attr("height", "500")
            .attr("width", '100%');

          svg.append("rect")
            .attr("height", "500")
            .attr("width", '100%')
            .attr("fill", "rgb(251, 251, 251)")
            .attr("fill-opacity", "1")
            .call(d3.zoom()
                    .scaleExtent([1/2, 4])
                    .on("zoom", zoomed));

          /* svg > gzoom */
          var gzoom = svg.append("g");

          function zoomed() {
            gzoom.attr("transform", d3.event.transform);
          }

          function zoomFunction() {
            var transform = d3.zoomTransform(this);
            d3.select(elem[0])
            .attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")");
          }

          var color = d3.scaleOrdinal(d3.schemeCategory20);


          scope.$watch('datainfo', function (dataInfo) {
            if(dataInfo){
              console.log("changed datainfo" + dataInfo);
            }
          }, true); // deep object dirty checking

          //nota: tenere sempre tutte insieme queste linee di codice che stanno nel watch
          scope.$watch('graph', function (graph) {
            if(graph){ //Checking if the given value is not undefined

                clearAll();
                update();

                function update(){
                  var links = [];
                  var nodes = [];
                  var radius = 16;

                  graph.links.forEach(function(l) {
                    links.push({
                      source: l.source,
                      target: l.target,
                      type: l.type,
                      label: l.label
                    });
                  });

                  graph.linksToLiterals.forEach(function(l) {
                    links.push({
                      source: l.source,
                      target: l.target,
                      type: l.type,
                      label: l.label
                    });
                  });

                  graph.nodes.forEach(function(n) {
                    nodes.push({
                      id: n.id,
                      label: n.label,
                      type: n.type,
                      group: n.group,
                      photoUrl: n.customProperties[0].value,
                      shape: "circle",
                      radius: radius
                    });
                  });

                  graph.nodeLiteral.forEach(function(n) {
                    nodes.push({
                      id: n.id,
                      label: n.label,
                      type: n.type,
                      group: n.group,
                      photoUrl: " ",
                      shape: "rectangle"
                    });
                  });

                  /* directed force layout */
                  var simulation = d3.forceSimulation()
                    // replace force.linkStrength in d3v3
                    .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(100)) 
                    // replace force.charge of d3v3
                    .force("charge", d3.forceManyBody()) 
                    .force("center", d3.forceCenter(width / 2, height / 2));

                  simulation.nodes(nodes).on("tick", ticked);
                  simulation.force("link").links(links);

                  /* links (path)*/
                  var link = gzoom.append("g")
                    .attr("class", "links")
                    .selectAll("path")
                    .data(links) //.data(graph.links)
                    .enter().append("line") //.enter().append("path")
                      .attr("id",function(d,i) { return "linkId_" + i; })
                      .on("mouseover", function(d){
                        d3.select(this).style('stroke-width', 1.2);
                        node.style('stroke', function(n) {
                          if (n === d.source || n === d.target)
                            return color(n.group);
                          });
                      })
                      .on("mouseout", function(d){
                        d3.select(this).style('stroke-width', 1);
                        node.style('stroke', function(n) {
                          if (n === d.source || n === d.target)
                            return '#ffffff';
                          });
                      })
                      .attr("marker-end",function(d){  //frecce dei links
                        return "url(#"+ d.source.id + ")";
                      });

                  /* nodes */
                  var node = gzoom.append("g")
                    .attr("class", "nodes")
                    .selectAll("g")
                    .data(nodes) //.data(graph.nodes)
                    .enter().append("g")
                    .append(function(d){
                      if(d.shape=="circle")
                        {return document.createElementNS('http://www.w3.org/2000/svg', 'circle')}
                      if(d.shape=="rectangle")
                        {return document.createElementNS('http://www.w3.org/2000/svg', 'rect')}})
                        .attr("width", 50) // if rect
                        .attr("height", 8)  //if rect
                        .attr("r", function(d) { return d.radius; }) // i circle
                        .attr("fill", function(d) { return color(d.group); })
                        .call(d3.drag()
                            .on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended))
                        .on("mouseover", function(d){
                          d3.selectAll("circle").style("stroke", '#ffffff')
                          d3.select(this).style("stroke", color(d.group));
                          scope.$apply(function () {
                            $parse(attrs.selectedItem).assign(scope.$parent, d);
                          });
                        })
                        .on("mouseout", function(d){
                          d3.selectAll("circle").style("stroke", '#ffffff')
                        })
                        .on('dblclick', connectedNodes);

                  /* label dei nodi */
                  var label = gzoom.append("g")
                    .attr("class", "nodes")
                    .selectAll("g")
                    .data(nodes) //.data(graph.nodes)
                    .enter().append("g")
                      .append("text")
                      .text(function (d) { return d.label; })
                      .style("font-family", "Arial")
                      .style("font-size", 5);

                  /* iconcine dei nodi */
                  var image = gzoom.selectAll("image")
                    .data(nodes) //.data(graph.nodes)
                    .enter().append("image")
                      .attr("xlink:href", function (d) { return d.photoUrl; })
                      .attr("width", 12)
                      .attr("height", 12)
                      .call(d3.drag()
                          .on("start", dragstarted)
                          .on("drag", dragged)
                          .on("end", dragended))
                      .on("mouseover", function(d){
                        d3.selectAll("circle").style("stroke", '#ffffff')
                        d3.select(this).style("stroke", color(d.group));
                        scope.$apply(function () {
                          $parse(attrs.selectedItem).assign(scope.$parent, d);
                        });
                      })
                      .on("mouseout", function(d){
                        d3.selectAll("circle").style("stroke", '#ffffff')
                      });

                  /*rect e label */
                  var rect = gzoom.append("g")
                    .attr("class", "rectLabel")
                    .selectAll("g")
                    .data(links) //.data(graph.links)
                    .enter().append("g");

                  rect.append("rect")
                    .attr("id",function(d,i){return "linkId_" + i;})
                    .attr("x", "-8")
              	    .attr("y", "0")
                    .attr("width", "30")
              	    .attr("height", "5")
                    .attr("fill", "#9c6");

                  rect.append("text")
                    .text(function (d) { return d.label; })
                    .style("font-family", "Arial")
                    .style("font-size", 4)
                    .style("overflow", "hidden")
                    .style("background-color", "#9c6")
                    .style("text-overflow", "ellipsis")
                    .style("white-space", "nowrap")
                    .attr("id",function(d,i){return "linkId_" + i;})
                    //.attr("fill", "#000")
                    .attr("x", "-7")
                    .attr("y", "+4")
                    .attr("text-anchor", "start")
                    .append("title")
                      .text(function(d){return d.label;});

                  /* frecce dei nodo link nodo - markers to indicate that this is a directed graph 
                  gzoom.append("defs")
                    .selectAll("marker")
                    .data(links) //.data(graph.links)
                    .enter().append("marker")
                      .attr("id", function(d){return d.source.id;})
                      .attr("viewBox", "0 -5 10 10")
                      .attr("refX", 2*5+2*radius) // 2*markerHeight+2*radius (vale per i circle)
                      .attr("refY", 0)
                      .attr("markerWidth", 5)
                      .attr("markerHeight", 5)
                      .attr("orient", "auto")
                      .attr("fill", "#999")
                      .append("path") //shape of the arrow
                        .attr("d", "M0,-5L10,0L0,5");
                  */

                /* tooltip di nodi e link*/
                node.append("title").text(function(d) { return d.id; });
                link.append("title").text(function(d) { return d.label; });

                function ticked() {
                  link.attr("x1", function(d) { return d.source.x; })
                      .attr("y1", function(d) { return d.source.y; })
                      .attr("x2", function(d) { return d.target.x; })
                      .attr("y2", function(d) { return d.target.y; });
                  node.attr("cx", function(d) { return d.x; })
                      .attr("cy", function(d) { return d.y; }); // if circle
                  node.attr("x",  function(d) { return d.x - 30/2; })
                      .attr("y",  function(d) { return d.y - 5; }); // if rect
                  label.attr("x", function(d) { return d.x - 15; })
            			     .attr("y", function(d) { return d.y + 2; });
                  image.attr("x", function(d) { return d.x + 3; })
         			         .attr("y", function(d) { return d.y + 3;});
                  rect.attr("transform", function (d) {
                       return "translate(" + (d.source.x + d.target.x)/2 + ","
                                          + ((d.source.y + d.target.y)/2)+ ")"});
                }

                function dragstarted(d) {
                  // desired alpha (temperature) of the simulation: 1.5 in modo
                  // che non sia troppo lento . alpha puo' essere tra 0 e 1
                  if (!d3.event.active) simulation.alphaTarget(0.2).restart();
                  d.fx = d.x;
                  d.fy = d.y;
                }

                function dragged(d){
                  d.fx = d3.event.x;
                  d.fy = d3.event.y;
                }

                function dragended(d) {
                  // alla fine dell'interazione alpha a 0
                  // altrimenti il grafico continua a muoversi
                  if (!d3.event.active) simulation.alphaTarget(0);
                  d.fx = null;
                  d.fy = null;
                }

                //Toggle stores whether the highlighting is on
                var toggle = 0;
                //Create an array logging what is connected to what
                var linkedByIndex = {};
                for (var i = 0; i < nodes.length; i++) {
                    linkedByIndex[i + "," + i] = 1;
                };
                links.forEach(function (d) {
                    linkedByIndex[d.source.index + "," + d.target.index] = 1;
                });
                //This function looks up whether a pair are neighbours
                function neighboring(a, b) {
                    return linkedByIndex[a.index + "," + b.index];
                }
                function connectedNodes() {
                    if (toggle == 0) {
                        //Reduce the opacity of all but the neighbouring nodes
                        var d = d3.select(this).node().__data__;
                        node.style("opacity", function (o) {
                            return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
                        });
                        image.style("opacity", function (o) {
                            return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
                        });
                        label.style("opacity", function (o) {
                            return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
                        });
                        link.style("opacity", function (o) {
                            return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
                        });
                        rect.style("opacity", function (o) {
                            return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
                        });
                        //Reduce the op
                        toggle = 1;
                    } else {
                        //Put them back to opacity=1
                        node.style("opacity", 1);
                        image.style("opacity", 1);
                        label.style("opacity", 1);
                        link.style("opacity", 1);
                        rect.style("opacity", 1);
                        toggle = 0;
                    }
                }

                scope.$watch('selectedNodeLabel', function (selectedNodeLabel) {
                  if(selectedNodeLabel){
                    //var node = svg.selectAll(".node");
                    if (selectedNodeLabel == "none") {
                        node.style("stroke", "white").style("stroke-width", "1");
                    } else {
                        var selected = node.filter(function (d, i) {
                            return d.label != selectedNodeLabel;
                        });
                        selected.style("opacity", "0");
                        link.style("opacity", "0");
                        image.style("opacity", "0");
                        label.style("opacity", "0");
                        rect.style("opacity", "0");

                        //Put them back to opacity=1
                        node.transition().duration(5000).style("opacity", 1);
                        link.transition().duration(5000).style("opacity", 1);
                        image.transition().duration(5000).style("opacity", 1);
                        label.transition().duration(5000).style("opacity", 1);
                        rect.transition().duration(5000).style("opacity", 1);
                    }
                  } // if (selectedNodeLabel)
                }); // scope.$watch('selectedNodeLabel', function (selectedNodeLabel) {
              } //update()
              scope.$watch('objectShape', function (objectShape) {
                if(objectShape){
                  clearAll();
                  update();
                }
              });
              scope.$watch('datatypeShape', function (datatypeShape) {
                if(datatypeShape){
                  clearAll();
                  update();
                }
              });

              function clearAll() {
                d3.selectAll(".links").remove();
                d3.selectAll(".nodes").remove();
                d3.selectAll(".label").remove();
                d3.selectAll(".image").remove();
                d3.selectAll(".rectLabel").remove();
              }
            } // if(graph)
          }, true); // scope.$watch('graph', function (graph) { con  deep dirty checking
        }); // d3Service.then(function(d3) {
      } // link
    } // return
}]); //directive function

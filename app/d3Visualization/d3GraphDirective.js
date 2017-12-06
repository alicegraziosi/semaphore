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
          dataInfo: "=",
          showPhoto: "=",
          showLoader: "="

      },
      link: function(scope, elem, attrs){
        // quando invoco il provider d3Service viene richiamato this.$get
        d3Service.then(function(d3) {
          // now you can use d3 as usual!


        scope.$watch('dataInfo', function(newValue, oldValue) {
          console.log("I see a data change!");
        }, true);

        scope.$watch('showPhoto', function (showPhoto) {
          if(showPhoto.value=="false"){
            //d3.selectAll(".immagini").attr("visibility", "hidden");
            d3.selectAll("circle").attr("fill", function(d) { return colorOfNode(d.group)});
          } else {
            //d3.selectAll(".immagini").attr("visibility", "visible");
            d3.selectAll("circle").attr("fill", function(d, i) {
              if(d.photoUrl!=''){
                return ("url(#"+i+"-icon)");
              } else {
                return colorOfNode(d.group)};
              });
            }
          }, true);

          var width = 960,
             height = 800;

          /* svg */
          var svg = d3.select(elem[0]).append("svg")
            .attr("height", height)
            .attr("width", '100%');

          svg.append("rect")
            .attr("height", height)
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

          //nota: tenere sempre tutte insieme queste linee di codice che stanno nel watch
          scope.$watch('graph', function (graph) {
            if(graph){ //Checking if the given value is not undefined
                clearAll();
                update();


                function update(){
                  var links = [];
                  var nodes = [];
                  var radius = 20;

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
                      url: n.url,
                      group: n.group,
                      photoUrl: n.customProperties[0].value,
                      shape: n.shape,
                      radius: n.radius
                    });
                  });

                  graph.nodeLiteral.forEach(function(n) {
                    nodes.push({
                      id: n.id,
                      label: n.label,
                      type: n.type,
                      url: n.url,
                      group: n.group,
                      photoUrl: " ",
                      shape: n.shape
                    });
                  });


                  var forceCollide = d3.forceCollide()
                      .radius(function(d) { return d.radius + 10; })
                      .iterations(1);

                  /* directed force layout */
                  var simulation = d3.forceSimulation()
                    // replace force.linkStrength in d3v3
                    .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(100).strength(1))
                    // replace force.charge of d3v3
                    .force("collide", forceCollide)
                    .force("charge", d3.forceManyBody().strength(-30))
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
                            return colorOfNode(n.group);
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
                    .enter() //.append("g")
                    .append(function(d){
                      if(d.shape=="circle")
                        {return document.createElementNS('http://www.w3.org/2000/svg', 'circle')}
                      if(d.shape=="rectangle")
                        {return document.createElementNS('http://www.w3.org/2000/svg', 'rect')}})
                        .attr("height", 8)  //if rect
                        .attr("r", function(d) { return d.radius; }) // if circle
                        .attr("fill", function(d) { return colorOfNode(d.group)})
                        .attr("fill", function(d, i) {
                          if(d.shape=="circle" && d.photoUrl!='') {
                            return ("url(#"+i+"-icon)")
                          } else {
                            return colorOfNode(d.group)
                          }
                        })
                        .call(d3.drag()
                            .on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended))
                        .on("mouseover", function(d){
                          d3.select(this).style("stroke", '#ffffff');
                          d3.select(this).style("cursor", "pointer");
                          d3.select(this).style("stroke", colorOfNode(d.group));
                          scope.$apply(function () {
                            $parse(attrs.selectedItem).assign(scope.$parent, d);
                          });

                          div.transition()
                              .duration(200)
                              .style("opacity", .9);

                          div.style("left", d3.select(this).attr('cx') + "100px")
                             .style("top",  d3.select(this).attr('cy') + "50px");

                          tool_tip.show();
                        })
                        .on("mouseout", function(d){
                          d3.select(this).style("stroke", '#ffffff');
                          d3.select(this).style("cursor", "default");

                          div.transition()
                            .duration(500)
                            .style("opacity", 0);

                          tool_tip.hide;
                        })
                        .on('dblclick', connectedNodes);

                  var div =  d3.select(elem[0]).append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

                  /* label dei nodi */
                  var label = gzoom.append("g")
                    .attr("class", "nodesLabel")
                    .selectAll("g")
                    .data(nodes) //.data(graph.nodes)
                    .enter().append("g")
                      .append("text")
                      .text(function (d) { return d.label; })  // literal
                      .style("font-family", "Arial")
                      .style("font-size", 5)
                      .attr("x", "+2")
                      .attr("y", "0")
                      .each(function(d) {
                          var thisWidth = this.getBBox().width;
                          d.thisWidth = thisWidth;
                      });

                  node.attr("width", function(d){ return Math.max(15, d.thisWidth + 1)});

                  var img =
                    gzoom.append("g")
                    .attr("class", "nodesLabel")
                    .selectAll("g")
                    .data(nodes) //.data(graph.nodes)
                    .enter().append("g")
                    .append('defs')
                    .append('pattern')
                    .attr('id', function(d, i) { return (i+"-icon");})
                    .attr('width', 1)
                    .attr('height', 1)
                    .attr("x", "0")
                    .attr("y", "0")
                    .attr('patternContentUnits', 'objectBoundingBox')
                    .append("svg:image")
                        .attr("xlink:href", function(d) { return (d.photoUrl);})
                        .attr("height", 1)
                        .attr("width", 1)
                        .attr("x", "0")
                        .attr("y", "0")
                        .attr("preserveAspectRatio", "xMinYMin slice");

                  /* immagini dbpedia relative ai nodi*/
                  var image = gzoom.append("g")
                    .attr("class", "node")
                    .selectAll("g")
                    .data(nodes) //.data(graph.nodes)
                    .enter().append("g")
                      .append("image")
                      .attr("class", "immagini")
                      .attr("xlink:href", function (d) { return d.photoUrl; })
                      .attr("width", 12)
                      .attr("height", 12)
                      .attr("visibility", "hidden")
                      .call(d3.drag()
                          .on("start", dragstarted)
                          .on("drag", dragged)
                          .on("end", dragended))
                      .on("mouseover", function(d){
                        d3.selectAll("circle").style("stroke", '#ffffff');
                        d3.select(this).style("stroke", color(d.group));
                        d3.select(this).style("cursor", "pointer");
                        scope.$apply(function () {
                          $parse(attrs.selectedItem).assign(scope.$parent, d);
                        });
                      })
                      .on("mouseout", function(d){
                        d3.selectAll("circle").style("stroke", '#ffffff');
                        d3.select(this).style("cursor", "default");
                      });

                  /*rect e label */
                  var rect = gzoom.append("g")
                    .attr("class", "rectLabel")
                    .selectAll("g")
                    .data(links) //.data(graph.links)
                    .enter().append("g");

                  var rects = rect.append("rect")
                    .attr("id", function(d,i){return "linkId_" + i;})
                    .attr("x", "-9")
                    .attr("y", "-5")
                    .attr("height", "8")
                    .attr("fill", "#c0c1c2");

                  var text = rect.append("text")
                    .text(function (d) { return d.label; })
                    .style("font-family", "Arial")
                    .style("font-size", 4)
                    .style("overflow", "hidden")
                    .style("text-overflow", "ellipsis")
                    .style("white-space", "nowrap")
                    .attr("id", function(d,i){return "linkId_" + i;})
                    .attr("x", "-8")
                    .attr("y", "0")
                    .attr("text-anchor", "start")
                    .each(function(d) {
                        var thisWidth = this.getBBox().width;
                        d.thisWidth = thisWidth;
                    })
                    .append("title");

                  rects.attr("width", function(d){ return Math.max(15, d.thisWidth + 1)});

                //text.text(function(d){return d.label;});

                // tooltip (solo teso) di nodi e link
                node.append("title").text(function(d) { return d.id + "\nEntity " + d.label + " is instance of " + d.type; });
                link.append("title").text(function(d) { return d.label; });

                // Setup the tool tip.  Note that this is just one example, and that many styling options are available.
                // See original documentation for more details on styling: http://labratrevenge.com/d3-tip/
                var tool_tip = d3.tip()
                  .attr("class", "d3-tip")
                  .offset([-8, 0])
                  .html(function(d) { return "Radius: " + d; });

                d3.select("svg").call(tool_tip);

                function ticked() {
                  link.attr("x1", function(d) { return d.source.x; })
                      .attr("y1", function(d) { return d.source.y; })
                      .attr("x2", function(d) { return d.target.x; })
                      .attr("y2", function(d) { return d.target.y; });
                  //node.attr("cx", function(d) { return d.x; })
                    //  .attr("cy", function(d) { return d.y; }); // if circle

                  node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
                      .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

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

              function clearAll() {
                  //scope.showLoader = true;
                  d3.selectAll(".links").remove();
                  d3.selectAll(".nodes").remove();
                  d3.selectAll(".nodesLabel").remove();
                  d3.selectAll(".label").remove();
                  d3.selectAll(".image").remove();
                  d3.selectAll(".immagini").remove();
                  d3.selectAll(".rectLabel").remove();
              }

              // rimpiazza: var color = d3.scaleOrdinal(d3.schemeCategory10);
              function colorOfNode(group){
                  if(group==1) return '#1f77b4';
                  if(group==2) return '#ff7f0e';
                  if(group==3) return '#2ca02c';
                  if(group==4) return '#d62728';
                  if(group==5) return '#9467bd';
              };

            } // if(graph)
          }, true); // scope.$watch('graph', function (graph) { con  deep dirty checking
        }); // d3Service.then(function(d3) {
      } // link
    } // return
}]); //directive function

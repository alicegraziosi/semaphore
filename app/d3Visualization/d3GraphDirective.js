'use strict';

var myAppd3view = angular.module('myApp.d3view');

myAppd3view.directive('d3Graphvisualization', ['d3Service', '$window', '$parse', 'queryDatasetService',
  function(d3Service, $window, $parse, queryDatasetService) {
    return{
      //restrict:'E' --> <d3-visualization></d3-visualization>
      //restrict:'A' --> <div d3-visualization ></div>
      //restrict:'EA' --> entrambe le forme
      restrict:'E',
      //this is important,
      replace: false,
      //<d3-visualization graph="graph"></d3-visualization> --> $scope.graph
      scope: {
          graph: "=",
          model: "="
      },
      link: function(scope, elem, attrs){
        // quando invoco il provider d3Service viene richiamato this.$get
        d3Service.then(function(d3) {
          // now you can use d3 as usual!
          var d3 = $window.d3;
          var width = "900";
          var height = "600";

          /* svg */
          var svg = d3.select(elem[0]).append("svg")
            .attr("height", "600")
            .attr("width", '100%');

          svg.append("rect")
            .attr("height", "600")
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

          //nota: tenere sempre tutte insieme queste linee di codice che stanno nel watch
          scope.$watch('graph', function (graph) {
            if(graph){ //Checking if the given value is not undefined

                update();

                function update(){

                  var links = [];
                  var nodes = [];

                  graph.links.forEach(function(l) {
                    links.push({
                      source: l.source,
                      target: l.target,
                      label: l.label
                    });
                  });

                  graph.linkAttributo.forEach(function(l) {
                    links.push({
                      source: l.source,
                      target: l.target,
                      label: " "
                    });
                  });

                  graph.nodes.forEach(function(n) {
                    nodes.push({
                      id: n.id,
                      label: n.label,
                      group: n.group,
                      photoUrl: n.photoUrl,
                      shape: "circle"
                    });
                  });

                  graph.nodiAttributo.forEach(function(n) {
                    nodes.push({
                      id: n.id,
                      label: n.value,
                      group: n.group,
                      photoUrl: " ",
                      shape: "rectangle"
                    });
                  });

                  /* directed force layout */
                  var simulation = d3.forceSimulation()
                    .force("link", d3.forceLink().id(function (d) { return d.id; }))
                    .force("charge", d3.forceManyBody())
                    .force("center", d3.forceCenter(width / 2, height / 2));

                  //simulation.nodes(graph.nodes).on("tick", ticked);
                  //simulation.force("link").links(graph.links);
                  simulation.nodes(nodes).on("tick", ticked);
                  simulation.force("link").links(links);

                  /* links (path)*/
                  var link = gzoom.append("g")
                    .attr("class", "links")
                    .selectAll("line")
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
                    .selectAll("circle")
                    .data(nodes) //.data(graph.nodes)
                    .enter().append("g")
                      .append("circle")
                        .attr("r", "5")
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
                          link.style('stroke-width', function(l) {
                            if (d === l.source || d === l.target)
                              return 1.2;
                            });
                        })
                        .on("mouseout", function(d){
                          //d3.select(this).style("stroke", '#ffffff');
                          link.style('stroke-width', 1);
                        });
                        //.on('click', click);

                  /* label dei nodi */
                  var label = gzoom.selectAll("text")
                    .data(nodes) //.data(graph.nodes)
                    .enter().append("text")
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
                        link.style('stroke-width', function(l) {
                          if (d === l.source || d === l.target)
                            return 1.3;
                          });
                      })
                      .on("mouseout", function(d){
                        //d3.select(this).style("stroke", '#ffffff');
                        link.style('stroke-width', 1);
                      });

                  var rect = gzoom
                    .attr("class", "rectLable")
                    .selectAll("rectLable")
                    .data(links) //.data(graph.links)
                    .enter().append("g");

                  rect.append("rect")
                    .attr("id",function(d,i){return "linkId_" + i;})
                    .attr("x", "-8")
              	    .attr("y", "0")
                    .attr("width", "20")
              	    .attr("height", "5")
                    .attr("fill", "#9c6");

                  rect.append("text")
                    .text(function (d) { return d.label; })
                    .style("font-family", "Arial")
                    .style("font-size", 4)
                    .style("overflow", "hidden")
                    .style("text-overflow", "ellipsis")
                    .style("white-space", "nowrap")
                    .attr("id",function(d,i){return "linkId_" + i;})
                    .attr("fill", "#999")
                    .attr("x", "-7")
                    .attr("y", "+4")
                    .attr("text-anchor", "start")
                    .append("title")
                      .text(function(d){return d.label;});

                  /* frecce dei links - markers to indicate that this is a directed graph */
                  gzoom.append("defs")
                    .selectAll("marker")
                    .data(links) //.data(graph.links)
                    .enter().append("marker")
                      .attr("id", function(d){return d.source.id;})
                      .attr("viewBox", "0 -5 10 10")
                      .attr("refX", 20)
                      .attr("refY", 0)
                      .attr("markerWidth", 5)
                      .attr("markerHeight", 5)
                      .attr("orient", "auto")
                      .attr("fill", "#999")
                      .append("path") //shape of the arrow
                        .attr("d", "M0,-5L10,0L0,5");

                /* tooltip di nodi e link*/
                node.append("title").text(function(d) { return d.id; });
                link.append("title").text(function(d) { return d.label; });

                function ticked() {
                  link.attr("x1", function(d) { return d.source.x; })
                      .attr("y1", function(d) { return d.source.y; })
                      .attr("x2", function(d) { return d.target.x; })
                      .attr("y2", function(d) { return d.target.y; });
                  node.attr("cx", function(d) { return d.x; })
                      .attr("cy", function(d) { return d.y; });
                  label.attr("x", function(d){ return d.x + 6; })
            			     .attr("y", function (d) {return d.y + 2; });
                  image.attr("x", function(d){ return d.x + 3; })
         			         .attr("y", function (d) {return d.y + 3;});
                  rect.attr("transform", function (d) {
                       return "translate(" + (d.source.x + d.target.x)/2 + ","
                                          + ((d.source.y + d.target.y)/2)+ ")"});

                }

                function dragstarted(d) {
                  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                  d.fx = d.x;
                  d.fy = d.y;
                }

                function dragged(d) {
                  d.fx = d3.event.x;
                  d.fy = d3.event.y;
                }

                function dragended(d) {
                  if (!d3.event.active) simulation.alphaTarget(0);
                  d.fx = null;
                  d.fy = null;
                }
              } //update()
            } //if(graph)
          }); //scope.$watch('graph', function (graph) {
        }); // d3Service.then(function(d3) {
      } // link
    } // return
}]); //directive function

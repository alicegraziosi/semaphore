'use strict';

var myAppd3view = angular.module('myApp.d3view');

myAppd3view.directive('d3Clustervisualization', ['d3ServiceVersion3', '$window', '$parse', 'queryDatasetService',
  function(d3ServiceVersion3, $window, $parse, queryDatasetService) {
    return{

      //restrict:'E' --> <d3-visualization></d3-visualization>
      //restrict:'A' --> <div d3-visualization ></div>
      //restrict:'EA' --> entrambe le forme
      restrict:'E',

      //this is important,
      replace: false,

      //Use isolated scope
      //and two-way data binding ( "=" )
      //<d3-visualization graph="graph"></d3-visualization> --> $scope.graph
      scope: {
          graph: "=",
          model: "=",
          selectedNodeLabel: "=",  // nella view: selected-node-label
          selectedClusterOption: "=",  // nella view: selected-cluster-option
          info: "="  //two-way data binding
      },        
      link: function(scope, elem, attrs){
        // quando invoco il provider d3Service viene richiamato this.$get
        d3ServiceVersion3.then(function(d3v3) {
          var d3 = d3v3;
          // now you can use d3 as usual!
          // nota: tenere sempre tutte insieme queste linee di codice che stanno nel watch
        
          var width = 1024,
              height = 1000,
              padding = 2, // separation between same-color nodes
              clusterPadding = 150, // separation between different-color nodes
              maxRadius = 20, //radius nodo cluster
              radius = 15;

          var dataInfo = scope.info;

          scope.$watch('graph', function (graph) {  //Scope.$watch accepts as first parameter expression or function
            if(graph){ //Checking if the given value is not undefined;
            console.log("changed graph " + graph);


              scope.$watch('selectedClusterOption', function(selectedClusterOption) {
                if(selectedClusterOption){
                    $("svg").remove();
                      clusterBy(selectedClusterOption);      
                } // if (selectedClusterOption)
              }); // scope.$watch('selectedClusterOption', function(selectedClusterOption) {

              function clusterBy(selectedClusterOption){
                if(selectedClusterOption.type=="obj"){

                var nodi_cluster = [];
                graph.nodes.forEach(function(n) {
                  if(n.type==selectedClusterOption.label) {
                      nodi_cluster.push(n);
                    }
                });

                // nodi cluster unici, m numero
                var unique = nodi_cluster.filter(function(elem, index, self) {
                    return index == self.indexOf(elem);
                });

                var m = unique.length; //10; // number of distinct clusters
                var n = graph.nodes.length + m; //19 + 10, // total number of nodes

                var color = d3.scale.category20().domain(d3.range(m)); // m colori

                // The largest node for each cluster.
                var clusters = new Array(m);  //Array di 10 elementi

                // nodi centrali dei cluster aggiunti
                var nodi = [];
                unique.forEach(function(elem, index){
                  nodi.push({
                    label: elem.label,
                    value: elem.id,
                    cluster: index,
                    total: 1,
                    type: "cluster"
                  });
                });

                graph.nodes.forEach(function(n) {
                  var cluster = " ";

                  graph.links.forEach(function(la){
                
                    dataInfo.objPropHeadClass.forEach(function(prop){
                   
                    if(la.source == n.id && la.type==prop.uri){
                     
                      unique.forEach(function(elem, index){

                        if(la.target == elem.id){
                          cluster = index;
                        }
                      });
                        nodi.push({
                          label: n.label,
                          id: n.id,
                          cluster: cluster,
                          type: "node"
                        });
                      };
                    });
                  });
                });
                nodi.forEach(function(nodocluster){
                  if(nodocluster.type=="cluster"){
                    nodi.forEach(function(nodo){
                      if(nodo.cluster==nodocluster.cluster && nodo.type=="node"){
                        nodocluster.total++;
                      };
                    });
                  }  
                });
              } else {


                var nodi_cluster = [];
                graph.nodeLiteral.forEach(function(n) {
                  if(n.type==selectedClusterOption.label && n.label !="") nodi_cluster.push(n.label);

                });

                var unique = nodi_cluster.filter(function(elem, index, self) {
                    return index == self.indexOf(elem);
                });

                var m = unique.length; //10; // number of distinct clusters
                var n = graph.nodes.length + m; //19 + 10, // total number of nodes

                var color = d3.scale.category20().domain(d3.range(m)); // m colori

                // The largest node for each cluster.
                var clusters = new Array(m);  //Array di 10 elementi

                // nodi centrali dei cluster aggiunti
                var nodi = [];
                unique.forEach(function(elem, index){
                  nodi.push({
                    label: elem,
                    value: elem,
                    cluster: index,
                    total: 1,
                    type: "cluster"
                  });
                });

                graph.nodes.forEach(function(n) {
                  var propertyValue = " ";
                  var cluster = " ";

                  graph.linksToLiterals.forEach(function(la){
                    if(la.source == n.id && la.type==selectedClusterOption.label){
                      graph.nodeLiteral.forEach(function(na){
                        if(la.target == na.id){
                          propertyValue = na.label;
                          unique.forEach(function(elem, index){
                            if(na.label === elem){
                              cluster = index;
                            }
                          });
                          nodi.push({
                            label: n.label,
                            id: n.id,
                            value: propertyValue,
                            cluster: cluster,
                            type: "node"
                          });

                        };
                      });
                    };
                  });
                });
                nodi.forEach(function(nodocluster){
                  if(nodocluster.type=="cluster"){
                    nodi.forEach(function(nodo){
                      if(nodo.cluster==nodocluster.cluster && nodo.type=="node"){
                        nodocluster.total++;
                      };
                    });
                  }  
                });
              }


                var nodes = nodi.map(function(n) {
                  var i = n.cluster,
                      r = n.type=="cluster" ? maxRadius : radius,
                      d = {
                        id: n.id,
                        label: n.label,
                        value: n.value,
                        type: n.type,
                        cluster: i,
                        radius: r,
                        total: n.total,
                        x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
                        y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
                      };
                  if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
                  return d;
                });


                var force = d3.layout.force()
                    .nodes(nodes)
                    .size([width, height])
                    .gravity(.02)
                    .charge(0)
                    .on("tick", tick)
                    .start();

                var svg = d3.select(elem[0]).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .call(d3.behavior.zoom().on("zoom", function () {
                      svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
                    }));


                /*un rettangolo contenitore per ogni nodo cluster*/
                var nodirect = nodes.filter(function(elem, index, self) {
                    return elem.type=="cluster";
                });

                var rect = svg.selectAll("rect")
                  .data(nodirect)
                  .enter()
                  .append("rect")
                  .style("fill", function(d) { return color(d.cluster); })
                    .attr("opacity", "0.6")
                    .attr("width", function(d) { return 2*maxRadius + d.total*2*radius })
                    .attr("height", function(d) { return 2*maxRadius + d.total*2*radius; });

                var rectLabel = svg.append("g")
                  .attr("class", "rectLable")
                  .selectAll("g")
                  .data(nodirect)
                  .enter().append("g");

                rectLabel.append("rect")
                  .attr("id",function(d,i){return "rectLabelId" + i;})
                  .style("fill", function(d) { return color(d.cluster); })
                  .attr("opacity", "1")
                  .attr("width", function(d) { return 2*maxRadius + d.total*2*radius; })
                  .attr("height", "15");

                rectLabel.append("text")
                    .style("font-family", "Arial")
                    .style("fill", "#000")
                    .attr("y", "12")
                    .text(function(d) { return d.label; });

                var node = svg.selectAll("circle")
                  .data(nodes)
                  .enter()
                  .append("circle")
                    .style("fill", function(d) { return color(d.cluster); })
                    .call(force.drag);

                node.append("title").text(function(d) { return d.value; });
                /* label dei nodi */
                var label = svg.selectAll("nodeText")
                  .data(nodes) //.data(graph.nodes)
                  .enter().append("text")
                    .attr("text-anchor", "middle")
                    .style("font-family", "Arial")
                    .text(function(d) { if(d.type=="node") return d.label;});

                node.transition()
                    .duration(750)
                    .delay(function(d, i) { return i * 5; })
                    .attrTween("r", function(d) {
                      var i = d3.interpolate(0, d.radius);
                      return function(t) { return d.radius = i(t); };
                    });

                function tick(e) {
                  node.each(cluster(10 * e.alpha * e.alpha))
                      .each(collide(.5))
                      .attr("cx", function(d) { return d.x; })
                      .attr("cy", function(d) { return d.y; });
                  label.attr("x", function(d) { return d.x; })
                       .attr("y", function(d) {return d.y; });
                  
                  rect.attr("x", function(d){ return d.x - maxRadius - d.total*radius -d.total*padding; })
                      .attr("y", function (d) {return d.y - maxRadius - d.total*radius -d.total*padding; });



                  /*
                  rectLabel.attr("x", function(d){ return d.x - maxRadius - d.total*radius - d.total*padding; })
                           .attr("y", function (d) {return -15 + d.y - maxRadius - d.total*radius - d.total*padding; });
                  */
                  rectLabel.attr("transform", function (d) {
                      return "translate(" + (d.x - maxRadius - d.total*radius - d.total*padding) + ","
                                         + (-15 + d.y - maxRadius - d.total*radius - d.total*padding)+ ")"});

                }

                // Move d to be adjacent to the cluster node.
                function cluster(alpha) {
                  return function(d) {
                    var cluster = clusters[d.cluster];
                    if (cluster === d) return;
                    var x = d.x - cluster.x,
                        y = d.y - cluster.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + cluster.radius;
                    if (l != r) {
                      l = (l - r) / l * alpha;
                      d.x -= x *= l;
                      d.y -= y *= l;
                      cluster.x += x;
                      cluster.y += y;
                    }
                  };
                }

                // Resolves collisions between d and all other circles.
                function collide(alpha) {
                  var quadtree = d3.geom.quadtree(nodes);
                  return function(d) {
                    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                        nx1 = d.x - r,
                        nx2 = d.x + r,
                        ny1 = d.y - r,
                        ny2 = d.y + r;
                    quadtree.visit(function(quad, x1, y1, x2, y2) {
                      if (quad.point && (quad.point !== d)) {
                        var x = d.x - quad.point.x,
                            y = d.y - quad.point.y,
                            l = Math.sqrt(x * x + y * y),
                            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                        if (l < r) {
                          l = (l - r) / l * alpha;
                          d.x -= x *= l;
                          d.y -= y *= l;
                          quad.point.x += x;
                          quad.point.y += y;
                        }
                      }
                      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                    });
                  };
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
                      label.style("opacity", "0");
                      rect.style("opacity", "0");
                      rectLabel.style("opacity", "0");

                      //Put them back to opacity=1
                      node.transition().duration(5000).style("opacity", 1);
                      label.transition().duration(5000).style("opacity", 1);
                      rect.transition().duration(5000).style("opacity", 0.6);
                      rectLabel.transition().duration(5000).style("opacity", 1);
                    }
                  } // if (selectedNodeLabel)
                }); // scope.$watch('selectedNodeLabel', function (selectedNodeLabel) {
              } //update()
            } //if(graph)
          }, true); //scope.$watch('graph', function (graph) {   // true = deep object dirty checking
        }); // d3Service.then(function(d3) {
      } // link
    } // return
}]); //directive function
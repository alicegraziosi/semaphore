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
      //<d3-visualization graph="graph"></d3-visualization> --> $scope.graph
      scope: {
          graph: "=",
          model: "="
      },
      link: function(scope, elem, attrs){
        // quando invoco il provider d3Service viene richiamato this.$get
        d3ServiceVersion3.then(function(d3) {
          // now you can use d3 as usual!
          //nota: tenere sempre tutte insieme queste linee di codice che stanno nel watch

          var width = 960,
              height = 600,
              padding = 1.5, // separation between same-color nodes
              clusterPadding = 80, // separation between different-color nodes
              maxRadius = 25, //radius nodo cluster
              radius = 10;

          scope.$watch('graph', function (graph) {
            if(graph){ //Checking if the given value is not undefined

              var nodi_cluster = [];
              graph.nodiAttributo.forEach(function(n) {
                nodi_cluster.push(n.value);
              });

              var unique = nodi_cluster.filter(function(elem, index, self) {
                  return index == self.indexOf(elem);
              });


              var m = unique.length; //10; // number of distinct clusters
              var n = graph.nodes.length + m; //19 + 10, // total number of nodes

              var color = d3.scale.category20().domain(d3.range(m)); // m colori

              // The largest node for each cluster.
              var clusters = new Array(m);  //Array di 10 elementi

              var nodi = [];
              unique.forEach(function(elem, index){
                nodi.push({
                  value: elem,
                  cluster: index,
                  total: 1,
                  type: "cluster"
                });
              });

              graph.nodiAttributo.forEach(function(n) {
                var cluster = " ";
                unique.forEach(function(elem, index){
                  if(n.value === elem){
                    cluster = index;
                  }
                });
                nodi.push({
                  value: n.id,
                  cluster: cluster,
                  type: "node"
                });

                nodi.forEach(function(elem){
                  if(elem.cluster==cluster && elem.type=="cluster"){
                    elem.total = elem.total+1;
                  }
                });
              });

              var nodes = nodi.map(function(n) {
                var i = n.cluster,
                    r = n.type=="cluster" ? maxRadius : radius,
                    d = {
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
                  .attr("height", height);

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
                  .attr("width", function(d) { return 2*maxRadius + d.total*2*radius + d.total*2*padding; })
                  .attr("height", function(d) { return 2*maxRadius + d.total*2*radius + d.total*2*padding; });

              var node = svg.selectAll("circle")
                  .data(nodes)
                .enter()
                .append("circle")
                  .style("fill", function(d) { return color(d.cluster); })
                  .call(force.drag);

              node.append("title").text(function(d) { return d.value; });
              /* label dei nodi */
              var label = svg.selectAll("text")
                .data(nodes) //.data(graph.nodes)
                .enter().append("text")
                  .attr("text-anchor", "middle")
                  .style("font-family", "Arial")
                  .text(function(d) {
                    return d.value;
                  });

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
                label.attr("x", function(d){ return d.x; })
                     .attr("y", function (d) {return d.y; });
                rect.attr("x", function(d){ return d.x - maxRadius - d.total*radius - d.total*padding; })
                    .attr("y", function (d) {return d.y - maxRadius - d.total*radius - d.total*padding;; });
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
            } //if(graph)
          }); //scope.$watch('graph', function (graph) {
        }); // d3Service.then(function(d3) {
      } // link
    } // return
}]); //directive function

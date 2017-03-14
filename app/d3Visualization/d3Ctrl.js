'use strict';

angular.module('myApp.d3view', ['d3Module', 'getJSONfileModule'])

/* .config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/d3view', {
    templateUrl: 'd3view/d3view.html',
    controller: 'D3viewCtrl'
  });
}]) */
.controller('D3viewCtrl',
  function($rootScope, $scope, $http, queryDatasetService, GetJSONfileService) {
    $http.get('../alicegraph.json').success(function (data) {
      $scope.graph = data;
    });
    /*queryDatasetService.queryDataset()
      .then(function(response) {
        $scope.graph = GetJSONfileService.createJsonFile(response);
      });
    */
    $scope.selected = " ";
})

.directive('d3Visualization', ['d3Service', '$window', '$parse', 'queryDatasetService',
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

          var width = 960,
              height = 600;
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
                    .scaleExtent([1 / 2, 4])
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

          //nota: tenere sempre tutto insieme queste robe che stanno nel watch
          scope.$watch('graph', function (graph) {

            /* directed force layout */
            var simulation = d3.forceSimulation()
              .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(50))
              .force("charge", d3.forceManyBody())
              .force("center", d3.forceCenter(width / 2, height / 2));

            simulation.nodes(graph.nodes).on("tick", ticked);
            simulation.force("link").links(graph.links);

            graph.links.forEach(function(link){

              if (!link.source["linkCount"]) link.source["linkCount"] = 0;
              if (!link.target["linkCount"]) link.target["linkCount"] = 0;

              link.source["linkCount"]++;
              link.target["linkCount"]++;

            });

            /* frecce dei links - markers to indicate that this is a directed graph */
            gzoom.append("defs")
              .selectAll("marker")
              .data(graph.links)
              .enter().append("marker")
              .attr("id", function(d) { return d.source.id; })
              .attr("viewBox", "0 -5 10 10")
              .attr("refX", 16)
              .attr("refY", 0)
              .attr("markerWidth", 6)
              .attr("markerHeight", 6)
              .attr("orient", "auto")
              .attr("fill", "#999")
              .attr("fill-opacity", "0.6")
              .append("path")
              .attr("d", "M0,-5L10,0L0,5");

            /* links (path)*/
            var link = gzoom.append("g")
              .attr("class", "links")
              .selectAll("line")
              .data(graph.links)
              .enter().append("path") // .enter().append("line") --> no path
              .attr("id",function(d,i) { return "linkId_" + i; })
              .on("mouseover", function(d){
                d3.select(this).style('stroke-width', 1.3);
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
              .data(graph.nodes)
              .enter().append("g")
              .append("circle")
                .attr("r", function(d){
                  return d.linkCount>1 ? (d.linkCount+3) : 5;
                })
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
                      return 1.3;
                    });
                })
                .on("mouseout", function(d){
                  //d3.select(this).style("stroke", '#ffffff');
                  link.style('stroke-width', 1);
                });

            /* label dei nodi */
            var label = gzoom.selectAll("text")
              .data(graph.nodes)
              .enter()
              .append("text")
              .text(function (d) { return d.label; })
              .attr("fill", "#999")
              .style("font-family", "Arial")
              .style("font-size", 8);

            /* iconcine dei nodi */
            var image = gzoom.selectAll("image")
              .data(graph.nodes)
              .enter()
              .append("image")
              //.attr("xlink:href", "https://github.com/favicon.ico")
              //.attr("xlink:href", "https://upload.wikimedia.org/wikipedia/commons/5/56/Henry_McCullough_in_the_studio_in_2008.jpg")
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
                    return 1.5;
                  });
              })
              .on("mouseout", function(d){
                //d3.select(this).style("stroke", '#ffffff');
                link.style('stroke-width', 1);
              });


            var linktext = gzoom.append("g").selectAll("g.linklabelholder").data(graph.links);
            linktext.enter().append("g").attr("class", "linklabelholder")
            .append("text")
            .attr("class", "linklabel")
            .attr("x", "10")
      	    .attr("y", "10")
            .attr("text-anchor", "start")
      	    .append("textPath")
            .attr("xlink:href",function(d,i) { return "#linkId_" + i;})
            .text(function(d) {
      	      return d.label;
      	    });

            /* tooltip di nodi e link*/
            node.append("title").text(function(d) { return d.id; });
            link.append("title").text(function(d) { return d.label; });

            function ticked() {
              /*
              link.attr("x1", function(d) { return d.source.x; })
                  .attr("y1", function(d) { return d.source.y; })
                  .attr("x2", function(d) { return d.target.x; })
                  .attr("y2", function(d) { return d.target.y; });*/

              link.attr("d", function(d) {
                 var dx = d.target.x - d.source.x,
                       dy = d.target.y - d.source.y,
                       dr = Math.sqrt(dx * dx + dy * dy);
                       return   "M" + d.source.x + ","
                        + d.source.y
                        + "A" + dr + ","
                        + dr + " 0 0,1 "
                        + d.target.x + ","
                        + d.target.y;
              });
              node.attr("cx", function(d) { return d.x; })
                  .attr("cy", function(d) { return d.y; });
              label.attr("x", function(d){ return d.x + 6; })
        			     .attr("y", function (d) {return d.y + 2; });
              image.attr("x", function(d){ return d.x + 3; })
     			         .attr("y", function (d) {return d.y + 3;});

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

          }); //scope.$watch('graph', function (graph) {
        }); // d3Service.then(function(d3) {
      } // link
    } // return
}]); //directive function

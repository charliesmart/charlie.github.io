var electionResults;
var stateShapes;

var svg = d3.select('#map-svg');
var electionColored = false;


d3.queue()
  .defer(d3.json, 'projects/maps/data/states.json')
  .defer(d3.csv, 'projects/maps/data/election.csv')
  .await(readyMap);

function readyMap(error, states, election) {
  if (error) throw error;

  electionResults = election;
  stateShapes = states;
  var projection = d3.geoAlbersUsa().fitSize([svg.node().getBoundingClientRect().width, svg.node().getBoundingClientRect().height], states)
  var path = d3.geoPath().projection(projection);

  svg.append("g")
    .attr("class", "states")
    .selectAll("path")
    .data(states.features)
    .enter().append("path")
    .attr('stroke', '#f0f0f0')
    .attr('stroke-width', 1)
    .attr('fill', '#ddd')
    .attr("d", path);

  $('#map').on('resize', function() {
    resizeMap(states);
  })
}

function resizeMap(states) {
  var projection = d3.geoAlbersUsa().fitSize([svg.node().getBoundingClientRect().width, svg.node().getBoundingClientRect().height], states)
  var path = d3.geoPath().projection(projection);
  svg.selectAll('.states path')
    .attr("d", path);
}



$(document).on('scroll', function() {

  if ($(document).scrollTop() > $('#map').offset().top) {
  }

  console.log($('#viz')[0].getBoundingClientRect().top);
  // Color map when it scrolls halway onto the screen
  if ($('#viz')[0].getBoundingClientRect().top < window.innerHeight / 2 && electionColored == false) {
    electionColored = true;

    d3.selectAll('.states path')
      .transition()
      .duration(500)
      .attr('fill', function(d) {
        var code = d.properties.STUSPS;
        for (var i = 0; i < electionResults.length; i++) {
          if (code === electionResults[i].State) {
            if (+electionResults[i].D > 0.5) {
              return '#328de6';
            } else {
              return '#c73a30';
            }
            break;
          }
        }
      });
  } else if ($('#viz')[0].getBoundingClientRect().top > window.innerHeight / 2 && electionColored == true) {
    electionColored = false;
    d3.selectAll('.states path')
      .transition()
      .duration(500)
      .attr('fill', '#ddd');
  }
})

var width = d3.select('#chart').node().getBoundingClientRect().width;
var margin = {top: 15, right: 30, bottom: 53, left: 65};
width = width - margin.left - margin.right;
var height = 400 - margin.left - margin.right;

var multipliers = {
  'num_0_4': 0.9712,
  'num_5': 0.0288,
  'num_10': 0.007,
  'num_15': 0.003,
  'num_20': 0.002
}

var currentSelection = 'num_5';

function colorScale(x, y) {
  var expectedY = x * multipliers[currentSelection];
  var dif = y - expectedY;
  var t = Math.min(Math.max((dif + 80) / (160), 0), 1);
  return d3.interpolateRdYlGn(t);
}

var svg = d3.select('#chart_svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.bottom + margin.top);

var g = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var x = d3.scaleLinear()
  .range([0, width]);

var y = d3.scaleLinear()
  .range([height, 0]);

var selectCircle;

var xAxis,
  yAxis,
  xAxisGroup,
  yAxisGroup,
  stateLine,
  stateAvgLabel;

var voronoi;

var data, towns;

var highlightFill = 'red',
  normalFill = 'black';
  
var searched = false;

function mouseMoveHandler() {
  const [mx, my] = d3.mouse(this);
  const site = voronoi.find(mx, my, 15);
  selectDot(site && site.data);
}

d3.csv('data.csv', function(d) {
  data = d;

  towns = d.map(function(e) {
    return e.town;
  })

  $('#search-wrap #town-search').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'towns',
    source: substringMatcher(towns)
  });

  $('#search-wrap #town-search').bind('typeahead:select', function(ev, town) {
    searchTown(town);
  })

  var xMax = d3.max(d.map(function(e) {
    return +e.num_tested;
  }))

  var yMax = d3.max(d.map(function(e) {
    return +e[currentSelection];
  }))

  x.domain([0, xMax]);
  y.domain([0, yMax]);

  voronoi = d3.voronoi()
    .x(d => x(d.num_tested))
    .y(d => y(d[currentSelection]))
    .size([width, height])(data);

  xAxis = d3.axisBottom(x)
    .tickSize(-height)
    .tickSizeOuter(0)
    .tickPadding(10);

  yAxis = d3.axisLeft(y)
    .tickSize(-width)
    .tickSizeOuter(0)
    .tickPadding(10);

  yAxisGroup = g.append('g')
    .attr('class', 'axis y')
    .call(yAxis);

  xAxisGroup = g.append('g')
    .attr('class', 'axis x')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(xAxis);
    
  stateLine = g.append('line')
    .attr('class', 'state-line')
    .attr('id', 'text-path')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', height)
    .attr('y2', y(xMax * multipliers.num_5));
  
  stateAvgLabel = g.append('text')
    .attr('class', 'state-label')
    .style('text-anchor', 'end')
    .attr('x', x(xMax) + 5)
    .attr('y', function() {
      return y(xMax * multipliers.num_5) + 5;
    })
    .text('STATE AVG');
    
    
  g.append('text')
    .append("textPath")
    .attr("xlink:href", "#text-path")
    .text("STATE AVERAGE");

  g.selectAll('.town-dot')
    .data(d)
    .enter()
    .append('circle')
    .attr('class', 'town-dot')
    .attr('r', 5)
    .attr('cx', function(d) {
      return x(d.num_tested);
    })
    .attr('cy', function(d) {
      return y(d.num_5);
    })
    .style('fill', '#6C8DCC')
    .style('opacity', 0.5);

  selectCircle = g.append('circle')
    .attr('r', 7)
    .style('fill', 'none')
    .style('stroke', 'black')
    .style('display', 'none')
    .style('stroke-width', 2);

  g.append('rect')
    .attr('class', 'overlay')
    .attr('width', width)
    .attr('height', height)
    .style('fill', '#f00')
    .style('opacity', 0)
    .on('mousemove', mouseMoveHandler)
    
  svg.append("text")
      .attr('class', 'axis-label x')
      .attr("transform", "translate(" + ((width/2) + 20) + " ," + (height + margin.top + 45) + ")")
      .style("text-anchor", "middle")
      .text("Number of children tested for lead");
  
  svg.append("text")
      .attr('class', 'axis-label y')
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", 0 - ((height / 2) + 25))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .html("Num. children with 5 &#181;g/dL of lead or more");

  resize();
})

var $buttons = d3.selectAll('.button');
var $tooltip = d3.select('#tooltip');

var currentTown = null;

function searchTown(town) {
  ga('send', 'event', 'interaction', 'search', town);
  currentTown = town;
  d3.selectAll('.town-dot')
    .each(function(d) {
      if (d.town === town) {
        selectDot(d);
        searched = true;
      }
    });
}

function selectDot(d) {
  var chartOffset = svg.node().getBoundingClientRect();
  if (!!d) {
    searched = false;
    d3.select('#tooltip h4').text(d.town);
    d3.select('#tested-num').text(d.num_tested);
    d3.select('#found-num').text(d[currentSelection]);
    d3.select('#cutoff-level').html(function() {
      if (currentSelection == 'num_0_4') {
        return '0-4 &#181;g/dL';
      } else if (currentSelection == 'num_5') {
        return 'more than 5 &#181;g/dL';
      } else if (currentSelection == 'num_10') {
        return 'more than 10 &#181;g/dL';
      } else if (currentSelection == 'num_15') {
        return 'more than 15 &#181;g/dL';
      } else if (currentSelection == 'num_20') {
        return 'more than 20 &#181;g/dL';
      } else {
        return ''
      }
    })
    
    $tooltip.style('left', x(d.num_tested) + (chartOffset.left - margin.left - margin.right) + 'px')
      .style('top', y(d[currentSelection]) + chartOffset.top + 'px')
      .style('display', 'block')
      
    selectCircle.style('display', 'block')
      .attr('cx', x(d.num_tested))
      .attr('cy', y(d[currentSelection]));
  } else {
    if (!searched) {
      selectCircle.style('display', 'none');
      $tooltip.style('display', 'none');
    }
  }

}

$buttons.on('click', function() {
    currentSelection = d3.select(this).attr('id');
    
    ga('send', 'event', 'interaction', 'toggle', currentSelection);
    
    d3.select('.axis-label.y').html(function() {
      var text = 'Num. children with '
      if (currentSelection == 'num_0_4') {
        text += '0-4 &#181;g/dL of lead';
      } else if (currentSelection == 'num_5') {
        text += '5 &#181;g/dL of lead or more';
      } else if (currentSelection == 'num_10') {
        text += '10 &#181;g/dL of lead or more';
      } else if (currentSelection == 'num_15') {
        text += '15 &#181;g/dL of lead or more';
      } else if (currentSelection == 'num_20') {
        text += '20 &#181;g/dL of lead or more';
      } else {
        text += ''
      }
      return text;
    })
    $buttons.classed('active', function() {
      return currentSelection === d3.select(this).attr('id');
    });

    var xMax = d3.max(data.map(function(e) {
      return +e.num_tested;
    }))

    var yMax = d3.max(data.map(function(e) {
      return +e[currentSelection];
    }))

    y.domain([0, yMax]);
    
    searchTown(currentTown);
    
    voronoi = d3.voronoi()
      .x(d => x(d.num_tested))
      .y(d => y(d[currentSelection]))
      .size([width, height])(data);
      
    stateAvgLabel.transition()
      .duration(300)
      .attr('x', x(xMax) + 5)
      .attr('y', function() {
        return y(xMax * multipliers[currentSelection]) + 5;
      })

    stateLine.transition()
      .duration(300)
      .attr('x2', width)
      .attr('y2', y(xMax * multipliers[currentSelection]));

    yAxisGroup.transition()
      .duration(300)
      .call(yAxis);

    g.selectAll('.town-dot')
      .transition()
      .duration(300)
      .attr('cy', function(d) {
        return y(+d[currentSelection]);
      })
  })
  
function resize() {
  width = Math.min(768, +window.innerWidth) - margin.left - margin.right;
  
  d3.select('.source').text(function() {
    return width > 500 ? 'SOURCE: CONNECTICUT DEPARTMENT OF PUBLIC HEALTH' : 'SOURCE: CT DEPT. OF PUBLIC HEALTH'
  }) 
  
  svg.attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.left + margin.right);
  
    var xMax = d3.max(data.map(function(e) {
      return +e.num_tested;
    }))
  
  x.range([0, width]);
  
  voronoi = d3.voronoi()
    .x(d => x(d.num_tested))
    .y(d => y(d[currentSelection]))
    .size([width, height])(data);

  var numTicks = width > 500 ? 10 : 4;

  xAxis = d3.axisBottom(x)
    .ticks(numTicks)
    .tickSize(-height)
    .tickSizeOuter(0)
    .tickPadding(10);
    
  yAxis.tickSize(-width)
    .tickSizeOuter(0);
    
  stateAvgLabel.attr('x', x(xMax) + 5)
    .attr('y', function() {
      return y(xMax * multipliers[currentSelection]) + 5;
    })
  
  d3.select('.axis.x')
      .call(xAxis);
  
  d3.select('.axis.y')
      .call(yAxis);
  
  g.selectAll('.town-dot')
    .attr('cx', function(d) {
      return x(+d.num_tested);
    })
    
  stateLine.attr('x2', width);
  
  d3.select('.axis-label.x')
  .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 45) + ")")
}

window.onresize = resize;

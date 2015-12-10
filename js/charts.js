function draw_cloud(pl) {
  "use strict";
  var pl = pl.filter(function(d) {
    return d["ProsperRating (numeric)"] != "";});
  var total_width = 850,
      total_height = 450,
      margin = {top:100, right:10, bottom:50, left:100},
      width = total_width - margin.left - margin.right,
      height = total_height - margin.top - margin.bottom;
  var cloud = d3.select("#cloud")
    .append("svg")
      //.attr("xmlns", "http://www.w3.org/2000/svg")
      //.attr("version", "1.1")
      //.attr("viewBox", "0 0 " + total_width + " " + total_height)
      //.attr("preserveAspectRatio", "xMidYMid meet")
      .attr("width", total_width)
      .attr("height", total_height)
    .append("g")
      .attr("class", "cloud");
  var xScale = d3.scale.linear()
    .range([margin.left, margin.left + width])
    .domain([0.0, pl.length]);
  var yScale = d3.scale.linear()
    .range([margin.top, margin.top + height])
    .domain([0.5, 0.0]);
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .tickFormat(d3.format(".0%"))
    .tickSize(1)
    .tickPadding(10)
    .outerTickSize(1)
    .innerTickSize(-width);
  cloud.append("g")
    .attr("class", "axis yaxis")
    .attr("transform", "translate(" + 0.95 * margin.left + ", 0)")
    .call(yAxis);
  cloud.append("text")
    .attr("class", "axis yaxis text")
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (margin.left/2) +","+(height/2+margin.top)+")rotate(-90)")
    .text("Borrower APR");
  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0); 
  var n = 0;
  var points = cloud.selectAll("circle")
      .data(pl)
    .enter()
      .append("circle")
      .attr("r", 3)
      .attr("cx", function(d, n) {return xScale(n++);})
      .attr("cy", function(d) {return yScale(d.BorrowerAPR);})
      .attr("container", "body")
      .attr("title", function(d) {
        return "Borrower APR: " + d3.format(".1%")(d.BorrowerAPR) +
        "\n Credit Score: " + d.CreditScoreRangeUpper
        });

  $("svg circle").tooltip({"data-toggle": "tooltip", "container": "body"});
  
  points.call(draw_box, yScale);

/*
  var filtered = points.filter(function(d) {
    return (d.CreditScoreRangeUpper >= 800) && (d.CreditScoreRangeUpper <= 1000);
  });

  var filtered = points.filter(function(d) {
    return (d.Term == 60);
  });
  debugger;

  filtered.attr("class", "filtered");
  filtered.call(draw_box, yScale);
*/
/*
  filtered.call(draw_box, yScale);
  filtered.call(draw_box, yScale);
  filtered.call(draw_box, yScale);
  filtered.call(draw_box, yScale);
*/
}

function draw_box(a, yScale){
  "use strict";
  var rates = [];
  a[0].forEach(
        function(d){rates.push(+d.__data__.BorrowerAPR);});
  rates = rates.sort();
  var q1 = d3.quantile(rates, 0.25),
      q2 = d3.quantile(rates, 0.50),
      q3 = d3.quantile(rates, 0.75),
      mean = d3.mean(rates),
      iqr = q3 - q1,
      w1 = q1 - 1.5 * iqr,
      w3 = q3 + 1.5 * iqr,
      min_ = d3.min(rates),
      max_ = d3.max(rates);

  w1 = w1 < min_ ? min_ : w1;
  w3 = w3 > max_ ? max_ : w3;
  var outliers = rates.filter(function(d,i) {return (d > w3 || d < w1);});
  var total_width = 45,
      total_height = 400,
      margin = {top:100, right:10, bottom:10, left:10},
      width = total_width - margin.left - margin.right,
      height = total_height - margin.top - margin.bottom;

  var boxplot = d3.select("#boxplots")
    .append("svg")
      //.attr("xmlns", "http://www.w3.org/2000/svg")
      //.attr("version", "1.1")
      //.attr("viewBox", "0 0 " + total_width + " " + total_height)
      //.attr("preserveAspectRatio", "xMidYMid meet")
      .attr("width", total_width)
      .attr("height", total_height)
    .append("g")
      .attr("class", "boxplot");

  boxplot.selectAll("line.whisker")
      .data([w1, w3])
    .enter()
      .append("line")
      .attr("x1", margin.left)
      .attr("y1", function(d) {return yScale(d);})
      .attr("x2", width + margin.left)
      .attr("y2", function(d) {return yScale(d);})
      .attr("class", "whisker")
      .attr("container", "body")
      .attr("title", function(d) {return d3.format(".1%")(d)});

  boxplot.selectAll("rect.box")
      .data([[q3,q1]])
    .enter()
      .append("rect")
      .attr("x", 1.5 * margin.left)
      .attr("y", function(d) {return yScale(d[0]);})
      .attr("width", width - margin.left)
      .attr("height", function(d) {return yScale(d[1]) - yScale(d[0]);})
      .attr("class", "box")
      .attr("container", "body")
      .attr("title", function(d) {
        return d3.format(".1%")(d[1]) + " - " +
               d3.format(".1%")(d[0]) } );
            
  boxplot.selectAll("line.center")
      .data([[w1, w3]])
    .enter()
      .append("line")
      .attr("x1", total_width / 2)
      .attr("y1", function(d) {return yScale(d[0]);})
      .attr("x2", total_width / 2)
      .attr("y2", function(d) {return yScale(d[1]);})
      .attr("class", "center");

  boxplot.selectAll("line.median")
      .data([q2])
    .enter()
      .append("line")
      .attr("x1", 1.5 * margin.left)
      .attr("y1", function(d) {return yScale(d);})
      .attr("x2", width + 0.5 * margin.left)
      .attr("y2", function(d) {return yScale(d);})
      .attr("class", "median")
      .attr("container", "body")
      .attr("title", function(d) {return d3.format(".1%")(d)});
      
  boxplot.selectAll("circle.outlier")
      .data(outliers)
    .enter()
      .append("circle")
      .attr("class", "outlier")
      .attr("r", 3)
      .attr("cx", total_width / 2)
      .attr("cy", function(d) { return yScale(d);});

  $("svg line").tooltip({"data-toggle": "tooltip", "container": "body"});
  $("svg rect").tooltip({"data-toggle": "tooltip", "container": "body"});

}

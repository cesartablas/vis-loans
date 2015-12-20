function draw_cloud(loan_data) {
  
  "use strict";
  
  $("#spinner").remove();

  /*
    window.pl = loan_data.filter(function(d) {
    return d["ProsperRating (numeric)"] != "";});
  */
  window.pl = loan_data;
  
  var total_width = 850,
      total_height = 350,
      margin = {top:10, right:10, bottom:10, left:100},
      width = total_width - margin.left - margin.right,
      height = total_height - margin.top - margin.bottom;

  var cloud = d3.select("#cloud")
    .append("svg")
      .attr("width", total_width)
      .attr("height", total_height)
    .append("g")
      .attr("class", "cloud");

  var xScale = d3.scale.linear()
    .range([margin.left, margin.left + width])
    .domain([0.0, pl.length]);

  window.yScale = d3.scale.linear()
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
    .text("Borrower Interest Rate");

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0); 

  var n = 0;

  window.points = cloud.selectAll("circle")
      .data(pl)
    .enter()
      .append("circle")
      .attr("r", 3)
      .attr("cx", function(d, n) {return xScale(n++);})
      .attr("cy", function(d) {return yScale(d.BorrowerAPR);})
      .attr("container", "body")
      .attr("title", function(d) {
        return "Interest Rate: " + d3.format(".1%")(d.BorrowerAPR)
        /* +
        "<hr/>\n Credit Score: " + d3.format(".0f")(d.CreditScoreRangeUpper) +
        "\n Inquiries: " + d3.format(".0f")(d.TotalInquiries) +
        "\n Debt to Income Ratio: " + d3.format(".1f")(d.DebtToIncomeRatio) +
        "\n Bankcard Utilization: " + d3.format(".1f")(d.BankcardUtilization) +
        "\n Credit Lines: " + d3.format(".0f")(d.CurrentCreditLines)*/
        });

  $("svg circle").tooltip({"data-toggle": "tooltip", "container": "body"});

  page_0();

}


function draw_box(a, yScale, val, id){
  
  "use strict";
  
  $("#" + id).html("");
  
  var total_width = 90,
      total_height = 350,
      margin = {top:10, right:25, bottom:10, left:25},
      width = total_width - margin.left - margin.right,
      height = total_height - margin.top - margin.bottom;

  var boxplot = d3.select("#" + id)
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
      .data([val.w1, val.w3])
    .enter()
      .append("line")
      .attr("x1", margin.left)
      .attr("y1", function(d) {return yScale(d);})
      .attr("x2", width + margin.left)
      .attr("y2", function(d) {return yScale(d);})
      .attr("class", "whisker")
      .attr("class", "whisker")
      .attr("container", "body")
      .attr("title", function(d) {return d3.format(".1%")(d)});

  boxplot.selectAll("rect.box")
      .data([[val.q3, val.q1]])
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
      .data([[val.w1, val.w3]])
    .enter()
      .append("line")
      .attr("x1", total_width / 2)
      .attr("y1", function(d) {return yScale(d[0]);})
      .attr("x2", total_width / 2)
      .attr("y2", function(d) {return yScale(d[1]);})
      .attr("class", "center");

  boxplot.selectAll("line.median")
      .data([val.q2])
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
      .data(val.outliers)
    .enter()
      .append("circle")
      .attr("class", "outlier")
      .attr("r", 3)
      .attr("cx", total_width / 2)
      .attr("cy", function(d) { return yScale(d);});

  boxplot.append("text")
    .attr("class", "median text")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (total_width - 13) + "," + (yScale(val.q2) + 5) + ")")
    .text(d3.format(".0%")(val.q2));

  $("svg line").tooltip({"data-toggle": "tooltip", "container": "body"});
  $("svg rect").tooltip({"data-toggle": "tooltip", "container": "body"});

}


function draw_hist(values, label) {
  
  "use strict";
  
  $("#facts").html("");
  
  var total_width = 300,
      total_height = 200,
      margin = {top:20, right:25, bottom:50, left:25},
      width = total_width - margin.left - margin.right,
      height = total_height - margin.top - margin.bottom;

  var x = d3.scale.linear()
    .domain([d3.min(values), d3.max(values)])
    .range([0, width])
    .nice();

  var data = d3.layout.histogram()
    .bins(x.ticks(10))(values);

  var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.y; })])
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(6)
    .tickSize(1);

  var hist = d3.select("#facts").append("svg")
      .attr("width", total_width)
      .attr("height", total_height)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  hist.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  hist.append("text")
    .attr("class", "label label-default text")
    .attr("text-anchor", "left")
    .attr("transform", "translate(125,5)")
    .text("Click on the bar to explore");
  
  hist.append("text")
    .attr("class", "axis xaxis text")
    .attr("text-anchor", "left")
    .attr("transform", "translate(75,160)")
    .text(label);

  var bar = hist.selectAll(".bar")
      .data(data)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
      
  bar.append("rect")
    .attr("x", 1)
    .attr("width", (x(data[1].x) - x(data[0].x)) - 1)
    .attr("height", function(d) { return height - y(d.y); })
    .on("click", filter_);


  return data;

}


function page_0() {

  "use strict";

  $("#box1").html("");
 
  var val = summary(points),
      term = [1, 3, 5],
      total_payments = [];
      
  term.forEach(function(t, i) {
    total_payments.push({});
    for (var v in val) {
      total_payments[i][v] = total_payment(val[v] ,t);
    }
  });

  points.call(draw_box, yScale, val, "box0");
  
  $("#tale").html("Using someone else's money can be expensive. The cost of borrowing is different for every person according to how much risk they pose of not paying back the loan on time.<br><br><span class='punchline'>A high interest rate can result in a person paying more than double what they borrowed !</span>");

  $("#facts").html("<table class='table-condensed'>" +
  "<h5>Total payment by rate and term</h5>"+
  "<thead>"+
    "<tr><th class='stat'>stat</th><th>rate</th><th>1 year</th><th>3 years</th><th>5 years</th></tr>"+
  "</thead>"+
  "<tbody>"+
    "<tr>" +
      "<td class='row-label stat'>" + "max" + "</td>" +
      "<td class='row-label'>" + d3.format(".1%")(val["max"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[0]["max"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[1]["max"]) + "</td>" +
      "<td class='notice'>" + d3.format(".0%")(total_payments[2]["max"]) + "</td>" +
    "</tr>" +
    "<tr>" +
      "<td class='row-label stat'>" + "Q3" + "</td>" +
      "<td class='row-label'>" + d3.format(".1%")(val["q3"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[0]["q3"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[1]["q3"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[2]["q3"]) + "</td>" +
    "</tr>" +
    "<tr>" +
      "<td class='row-label stat'>" + "median" + "</td>" +
      "<td class='row-label'>" + d3.format(".1%")(val["q2"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[0]["q2"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[1]["q2"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[2]["q2"]) + "</td>" +
    "</tr>" +
    "<tr>" +
      "<td class='row-label stat'>" + "Q1" + "</td>" +
      "<td class='row-label'>" + d3.format(".1%")(val["q1"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[0]["q1"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[1]["q1"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[2]["q1"]) + "</td>" +
    "</tr>" +
    "<tr>" +
      "<td class='row-label stat'>" + "min" + "</td>" +
      "<td class='row-label'>" + d3.format(".1%")(val["min"]) + "</td>" +
      "<td class='notice'>" + d3.format(".0%")(total_payments[0]["min"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[1]["min"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[2]["min"]) + "</td>" +
    "</tr>" +
  "</tbody>"+
  "</table>");

  $("nav ul").html("<li class='next'><button class='btn btn-default' type='button' onclick='page_1()'><span aria-hidden='true'></span>Next  &rarr;</button></li>");

  $("#dataset").attr("data-content",
  "<a target='_blank' href='http://www.prosper.com/'>Prosper Marketplace Inc.</a> is an intermediary of peer to peer lending in the US.<br>In this financing model, the borrower submits a loan application, the investors<br>fund the loan, and the intermediary conducts the process of loaning and<br>collecting the money which is paid back to the investors.<br><br>This dataset contains 114K datapoints about Prosper loans given between<br>Nov 2005 and Mar 2014. Each datapoint has 81 variables.<br><br>For this visualization the dataset has been truncated to about 83K datapoints<br>that use the new Prosper Rating (2009), and to only the 6 variables used.");

  $("#references").attr("data-content", "<ul><li>César Tablas: <a target='_blank' href='https://cesartablas.github.io/eda-loans/'>Exploratory Data Analysis</a> of Prosper Loans</li><li>Reader's Digest: <a target='_blank' href='http://www.rd.com/advice/saving-money/your-credit-score-the-magic-money-number-explained/'>Your Credit Score: The Magic Number Explained</a></li></ul>");

  $("#insights").attr("data-content", "<ul><li class='insights page-0'>A lower Interest Rate means less money paid back.</li><li class='insights page-0'>A shorter Term translates into less money paid back.</li><li class='insights page-0'>A shorter Term requires higher payments.</li></ul>");
  
}


function page_1() {

  "use strict";
  
  $("#tale").html("The Credit Score represents a person's creditworthiness &mdash;their likelihood to pay on time. And it's used by lenders to determine if someone qualifies for credit, and if so, how much interest they will charge them to compensate for the risk.<br><br><span class='punchline'>Explore how Credit Score and other variables influence the Interest Rate.</span>");

  $("#facts").append("<h4 class='label label-default'>Explore by clicking on the bars</h4>");

  $("#dataset").attr("data-content",
  "Prosper uses its own rating scale to assess the lenders. This dataset contains<br>only the datapoints using the new scale introduced on July 2009 that ranges<br>from 1 (worse) to 7 (best).<br><br>However, for this visualization, the Credit Score used is the one reported<br>by credit bureaus using the FICO scale (from 300-worst to 850-best), that<br>is the score submitted by the lender during the loan application.<br><br>The general trend, as seen on the plot below, is that as the Credit Score<br>increases, the Interest Rate decreases.<br><br>Interest Rate vs. Credit Score<img src='img/Credit-Score.png' alt='Interest Rate vs. Credit Score' height='150' width='300'>");
  
  $("#references").attr("data-content", "César Tablas: <a target='_blank' href='https://cesartablas.github.io/eda-loans/'>Exploratory Data Analysis</a> of Prosper Loans\nReader's Digest: <a target='_blank' href='http://www.rd.com/advice/saving-money/your-credit-score-the-magic-money-number-explained/'>Your Credit Score: The Magic Number Explained</a>");

  $("#insights").attr("data-content", "<ul><li class='insights page-0'>A lower Interest Rate means less money paid back.</li><li class='insights page-0'>A shorter Term translates into less money paid back.</li><li class='insights page-0'>A shorter Term requires higher payments.</li><li class='insights page-1'>A higher Credit Score awards a lower Interest Rate.</li></ul>");
  

  $("#references").attr("data-content", "My previous <a target='_blank' href='https://cesartablas.github.io/eda-loans/'>Exploratory Data Analysis</a>\n Reader's Digest <a target='_blank' href='http://www.rd.com/advice/saving-money/your-credit-score-the-magic-money-number-explained/'>Your Credit Score: The Magic Number Explained</a>");

  $("nav ul").html("<li class='previous'><button class='btn btn-default' type='button' onclick='page_0()'><span aria-hidden='true'></span>&larr; Previous</button></li> <li class='next'><button class='btn btn-default' type='button' onclick='page_3()'><span aria-hidden='true'></span>Next &rarr;</button></li>");

  var creditScores = pl.map(function(d) {return +d.CreditScoreRangeUpper;});

  var data = draw_hist(creditScores, "Credit Scores");

  $("g.bar :first").d3Click();

}


function total_payment(R, N) {
  /**
   * calculate the total ammount paid
   * given a PV=1, and FV=0, payments once a month,
   * and the given annual interest rate (R) and term in years (N)
   * 
   * parameters:
   * R: Annual interest rate
   * N: Number of years to pay PV
   * 
   * returns:
   * total payment as percentage 
   */

  "use strict";

  var PV = 1,
       r = R / 12,
       n = N * 12;
   var P = r * PV / (1 - Math.pow(1 + r, -n));
   return P * n;
}


function summary(a) {
  /**
   * calculate the summary statistics of the BorrowerAPR
   * in an array of points. 
   *
   */
  
  "use strict";
    
  var rates = a[0].map(function(d) {return +d.__data__.BorrowerAPR;});

  rates = rates.sort();

  var q1 = d3.quantile(rates, 0.25),
      q2 = d3.quantile(rates, 0.50),
      q3 = d3.quantile(rates, 0.75),
      iqr = q3 - q1,
      w1 = q1 - 1.5 * iqr,
      w3 = q3 + 1.5 * iqr,
      min_ = d3.min(rates),
      max_ = d3.max(rates);

  w1 = w1 < min_ ? min_ : w1;
  w3 = w3 > max_ ? max_ : w3;

  var outliers = rates.filter(function(d, i) {return (d > w3 || d < w1);});

  return {"q1": q1, "q2": q2, "q3": q3,
          "w1": w1, "w3": w3,
          "min": min_, "max": max_,
          "outliers": outliers};
}


function filter_() {
  
  d3.selectAll("circle")
    .classed("filtered", false)

  d3.selectAll("g.bar.filtered")
    .classed("filtered", false);

  var bar = this.parentElement.__data__;
  
    var lower_limit = bar.x,
        upper_limit = lower_limit + bar.dx;

    var filtered = points.filter(function(d) {
      return  (d.CreditScoreRangeUpper >= lower_limit) &&
              (d.CreditScoreRangeUpper <= upper_limit);
    });

    var val = summary(filtered);
    
    filtered.attr("class", "filtered");
    filtered.call(draw_box, yScale, val, "box1");

    this.parentElement.setAttribute("class", "bar filtered");

}


jQuery.fn.d3Click = function () {
  /*http://stackoverflow.com/a/11180172*/
  this.each(function (i, e) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    e.dispatchEvent(evt);
  });
};

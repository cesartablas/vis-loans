/**
 * Visualization: Insights from a Cloud of Loans
 *
 * by Cesar Tabalas
 * December 2015
 *
 * */

function draw_cloud(loan_data) {
  
  "use strict";
  
  $("#spinner").remove();

  window.pl = loan_data.filter(function(d) {
    return d["ProsperRating (numeric)"] != "";});

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
    .text("Borrower APR");

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
        return "Borrower APR: " + d3.format(".1%")(d.BorrowerAPR) +
        "\n Credit Score: " + d.CreditScoreRangeUpper
        });

  $("svg circle").tooltip({"data-toggle": "tooltip", "container": "body"});

  page_0();

}


function draw_box(a, yScale, val, id, fmt){

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

  if (fmt) {
    var bar = d3.select("g.bar.filtered")[0][0];

    var lower_limit = bar.__data__.x,
        upper_limit = lower_limit + bar.__data__.dx;

    d3.select("#box1>svg>g").append("text")
      .attr("id", "var-range")
      .attr("class", "var-range text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate("+ total_width/2 + ",20)")
      .text(d3.format(fmt)(lower_limit) + " - " + d3.format(fmt)(upper_limit));
  }

  $("svg line").tooltip({"data-toggle": "tooltip", "container": "body"});
  $("svg rect").tooltip({"data-toggle": "tooltip", "container": "body"});

}


function draw_hist(vals, label, range) {
  
  "use strict";
  
  $("#facts").html("");
  
  var total_width = 300,
      total_height = 200,
      margin = {top:20, right:25, bottom:50, left:25},
      width = total_width - margin.left - margin.right,
      height = total_height - margin.top - margin.bottom;

  if (range) {
    vals = vals.filter(function(d) {
      return d>=range[0] && d<=range[1]});
  }

  var x = d3.scale.linear()
    .domain([d3.min(vals), d3.max(vals)])
    .range([0, width])
    .nice();

  var data = d3.layout.histogram()
    .bins(x.ticks(10))(vals);

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
    .text("Click on the bar to explore")
    .style("font-size", "10px;");
  
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
    .on("click", filter_selected);

    return data;

}


function page_0() {

  "use strict";

  $("#box1").html("");
  d3.selectAll(".filtered").classed("filtered", false);

 
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

  $("#tale").html("a high interest rate (and the term) on a loan make the difference between paying back " +
  d3.format(".0%")(total_payments[0]["min"]) + " or " + d3.format(".0%")(total_payments[2]["max"]) +
  " of the money borrowed<br><span class='punchline'>what drives interest rates up or down ?</span>");

  $("#facts").html("<table class='table-condensed'>" +
  "<h5>Total payment by rate and term</h5>"+
  "<thead>"+
    "<tr><th>stat</th><th>rate</th><th>1 year</th><th>3 years</th><th>5 years</th></tr>"+
  "</thead>"+
  "<tbody>"+
    "<tr>" +
      "<td>" + "max" + "</td>" +
      "<td>" + d3.format(".1%")(val["max"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[0]["max"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[1]["max"]) + "</td>" +
      "<td class='notice'>" + d3.format(".0%")(total_payments[2]["max"]) + "</td>" +
    "</tr>" +
    "<tr>" +
      "<td>" + "Q3" + "</td>" +
      "<td>" + d3.format(".1%")(val["q3"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[0]["q3"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[1]["q3"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[2]["q3"]) + "</td>" +
    "</tr>" +
    "<tr>" +
      "<td>" + "median" + "</td>" +
      "<td>" + d3.format(".1%")(val["q2"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[0]["q2"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[1]["q2"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[2]["q2"]) + "</td>" +
    "</tr>" +
    "<tr>" +
      "<td>" + "Q1" + "</td>" +
      "<td>" + d3.format(".1%")(val["q1"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[0]["q1"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[1]["q1"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[2]["q1"]) + "</td>" +
    "</tr>" +
    "<tr>" +
      "<td>" + "min" + "</td>" +
      "<td>" + d3.format(".1%")(val["min"]) + "</td>" +
      "<td class='notice'>" + d3.format(".0%")(total_payments[0]["min"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[1]["min"]) + "</td>" +
      "<td>" + d3.format(".0%")(total_payments[2]["min"]) + "</td>" +
    "</tr>" +
  "</tbody>"+
  "</table>");

  $("nav ul").html("<li class='next'><button class='btn btn-default' type='button' onclick='page_1()'><span aria-hidden='true'></span>next &rarr;</button></li>");

  $("#strategies").attr("data-content", "&bull; shorter term requires higher payments\n&bull; shorter term translates into less money paid back\n&bull; lower rate means less money paid back");
  
  $("#dataset").attr("data-content",
  "Prosper Marketplace Inc. is an intermediary\nof peer to peer lending in the US.\n\nThe dataset contains 114K observations about\nProsper loans, each with 81 variables.\n\nFor this visualization the dataset has been\ntruncated to only the datapoints with the\nnew Prosper rating and the variables used.");

  $("#references").attr("data-content", "my own <a target='_blank' href='https://cesartablas.github.io/eda-loans/'>exploratory data analysis</a>\n");

}


function page_1() {

  "use strict";

  $("#tale").html("the credit score represents a lender's creditworthiness and the interest rate is a reward for the risk of lending him the money<br><span class='punchline'>what strategies can we use to increase our credit score ?</span>");

  $("#facts").append("<h4 class='label label-default'>Explore by clicking on the bars</h4>");

  $("#strategies").attr("data-content", "&bull; the higher the credit scores the lower the interest rate");
  
  $("#dataset").attr("data-content",
  "Distribution of Credit Scores<br><img src='Rplot01.png' alt='Credit Scores Histogram' height='100' width='200'><br>Prosper has their own Rating based on the\ncredit scores reported by the different agencies.\n\nFor this visualization I chose the variable\nCreditScoreRangeUpper as the Credit Score");

  $("#references").attr("data-content", "My previous <a target='_blank' href='https://cesartablas.github.io/eda-loans/'>Exploratory Data Analysis</a>\n");

  $("nav ul").html("<li class='previous'><button class='btn btn-default' type='button' onclick='page_0()'><span aria-hidden='true'></span>&larr; previous</button></li><li class='next'><button class='btn btn-default' type='button' onclick='page_2()'><span aria-hidden='true'></span>next &rarr;</button></li>");

  window.var_name = "CreditScoreRangeUpper";

  var creditScores = pl.map(function(d) {return +d[var_name];});
  
  var data = draw_hist(creditScores, "Credit Scores");

  $("g.bar :eq(2)").d3Click();

}


function page_2() {

  "use strict";

  $("#box1").html("");
  d3.selectAll(".filtered").classed("filtered", false);

  $("#tale").html("the credit score represents a lender's creditworthiness and the interest rate is a reward for the risk of lending him the money<br><span class='punchline'>what strategies can we use to increase our credit score ?</span>");

  $("#facts").append("<h4 class='label label-default'>Explore by clicking on the bars</h4>");

  $("#strategies").attr("data-content", "&bull; the higher the credit scores the lower the interest rate");
  
  $("#dataset").attr("data-content",
  "Distribution of Credit Scores<br><img src='Rplot01.png' alt='Credit Scores Histogram' height='100' width='200'><br>Prosper has their own Rating based on the\ncredit scores reported by the different agencies.\n\nFor this visualization I chose the variable\nCreditScoreRangeUpper as the Credit Score");

  $("#references").attr("data-content", "My previous <a target='_blank' href='https://cesartablas.github.io/eda-loans/'>Exploratory Data Analysis</a>\n");

  $("nav ul").html("<li class='previous'><button class='btn btn-default' type='button' onclick='page_1()'><span aria-hidden='true'></span>&larr; previous</button></li><li class='next'><button class='btn btn-default' type='button' onclick='page_3()'><span aria-hidden='true'></span>next &rarr;</button></li>");

  window.var_name = "DebtToIncomeRatio";

  var ratio = pl.map(function(d) {return +d[var_name];});

  var data = draw_hist(ratio, "Debt to Income Ratio", [0, 1]);

  $("g.bar :eq(0)").d3Click();

}


function page_3() {

  "use strict";

  $("#box1").html("");
  d3.selectAll(".filtered").classed("filtered", false);

  $("#tale").html("the credit score represents a lender's creditworthiness and the interest rate is a reward for the risk of lending him the money<br><span class='punchline'>what strategies can we use to increase our credit score ?</span>");

  $("#facts").append("<h4 class='label label-default'>Explore by clicking on the bars</h4>");

  $("#strategies").attr("data-content", "&bull; the higher the credit scores the lower the interest rate");
  
  $("#dataset").attr("data-content",
  "Distribution of Credit Scores<br><img src='Rplot01.png' alt='Credit Scores Histogram' height='100' width='200'><br>Prosper has their own Rating based on the\ncredit scores reported by the different agencies.\n\nFor this visualization I chose the variable\nCreditScoreRangeUpper as the Credit Score");

  $("#references").attr("data-content", "My previous <a target='_blank' href='https://cesartablas.github.io/eda-loans/'>Exploratory Data Analysis</a>\n");

  $("nav ul").html("<li class='previous'><button class='btn btn-default' type='button' onclick='page_2()'><span aria-hidden='true'></span>&larr; previous</button></li><li class='next'><button class='btn btn-default' type='button' onclick='page_4()'><span aria-hidden='true'></span>next &rarr;</button></li>");

  window.var_name = "TotalInquiries";

  var ratio = pl.map(function(d) {return +d[var_name];});

  var data = draw_hist(ratio, "Total Inquiries", [0, 20]);

  $("g.bar :eq(5)").d3Click();

}


function page_4() {

  "use strict";

  $("#box1").html("");
  d3.selectAll(".filtered").classed("filtered", false);

  $("#tale").html("the credit score represents a lender's creditworthiness and the interest rate is a reward for the risk of lending him the money<br><span class='punchline'>what strategies can we use to increase our credit score ?</span>");

  $("#facts").append("<h4 class='label label-default'>Explore by clicking on the bars</h4>");

  $("#strategies").attr("data-content", "&bull; the higher the credit scores the lower the interest rate");
  
  $("#dataset").attr("data-content",
  "Distribution of Credit Scores<br><img src='Rplot01.png' alt='Credit Scores Histogram' height='100' width='200'><br>Prosper has their own Rating based on the\ncredit scores reported by the different agencies.\n\nFor this visualization I chose the variable\nCreditScoreRangeUpper as the Credit Score");

  $("#references").attr("data-content", "My previous <a target='_blank' href='https://cesartablas.github.io/eda-loans/'>Exploratory Data Analysis</a>\n");

  $("nav ul").html("<li class='previous'><button class='btn btn-default' type='button' onclick='page_3()'><span aria-hidden='true'></span>&larr; previous</button></li><li class='next'><button class='btn btn-default' type='button' onclick='page_5()'><span aria-hidden='true'></span>next &rarr;</button></li>");

  window.var_name = "BankcardUtilization";

  var ratio = pl.map(function(d) {return +d[var_name];});

  var data = draw_hist(ratio, "Bankcard Utilization", [0, 1]);

  $("g.bar :eq(2)").d3Click();

}


function page_5() {

  "use strict";

  $("#box1").html("");
  d3.selectAll(".filtered").classed("filtered", false);

  $("#tale").html("the credit score represents a lender's creditworthiness and the interest rate is a reward for the risk of lending him the money<br><span class='punchline'>what strategies can we use to increase our credit score ?</span>");

  $("#facts").append("<h4 class='label label-default'>Explore by clicking on the bars</h4>");

  $("#strategies").attr("data-content", "&bull; the higher the credit scores the lower the interest rate");
  
  $("#dataset").attr("data-content",
  "Distribution of Credit Scores<br><img src='Rplot01.png' alt='Credit Scores Histogram' height='100' width='200'><br>Prosper has their own Rating based on the\ncredit scores reported by the different agencies.\n\nFor this visualization I chose the variable\nCreditScoreRangeUpper as the Credit Score");

  $("#references").attr("data-content", "My previous <a target='_blank' href='https://cesartablas.github.io/eda-loans/'>Exploratory Data Analysis</a>\n");

  $("nav ul").html("<li class='previous'><button class='btn btn-default' type='button' onclick='page_4()'><span aria-hidden='true'></span>&larr; previous</button></li><li class='next'><button class='btn btn-default' type='button' onclick='page_6()'><span aria-hidden='true'></span>next &rarr;</button></li>");

  window.var_name = "CurrentCreditLines";

  var ratio = pl.map(function(d) {return +d[var_name];});

  var data = draw_hist(ratio, "Credit Lines", [0, 30]);

  $("g.bar :eq(0)").d3Click();

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


function filter_selected() {
  
  d3.selectAll("circle")
    .classed("filtered", false)

  d3.selectAll("g.bar.filtered")
    .classed("filtered", false);


  var bar = this.parentElement.__data__;
  
  var lower_limit = bar.x,
      dx = bar.dx,
      upper_limit = lower_limit + dx,
      fmt = dx > 1 ? ".0f" : ".2f";

  var filtered = points.filter(function(d) {
    return  (d[var_name] >= lower_limit) &&
            (d[var_name] <= upper_limit);
  });

  var val = summary(filtered);
  
  filtered.attr("class", "filtered");

  this.parentElement.setAttribute("class", "bar filtered");
  
  filtered.call(draw_box, yScale, val, "box1", fmt);

}


jQuery.fn.d3Click = function () {
  /**
   * function to simulate a click event on a d3 element
   * http://stackoverflow.com/a/11180172
   * */
  this.each(function (i, e) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    e.dispatchEvent(evt);
  });
};

/**
 * Visualization: Interaction with a Cloud of Loans
 *
 * by César Tablas
 * December 2015 - January 2016
 *
 * */


function draw_cloud(loan_data) {
  
  "use strict";
  
  $("#spinner").remove();

  window.pl = loan_data;
  
  var total_width = 850,
      total_height = 350,
      margin = {top:10, right:10, bottom:10, left:100},
      width = total_width - margin.left - margin.right,
      height = total_height - margin.top - margin.bottom;

  window.cloud = d3.select("#cloud")
    .append("svg")
      .attr("width", total_width)
      .attr("height", total_height)
    .append("g")
      .attr("class", "cloud");

  window.xScale = d3.scale.linear()
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

  var n = 0;

  window.points = cloud.selectAll("circle")
      .data(pl)
    .enter()
      .append("circle")
      .attr("r", 3)
      .attr("cx", function(d, n) {return xScale(n++);})
      .attr("cy", function(d) {return yScale(d.BorrowerAPR);});

  window.explored = [0,0,0,0,0];

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
    .attr("transform", "translate(130,0)")
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
    .on("click", filter_selected);

  bar.append("text")
    .attr("class", "label label-default text frequency")
    .attr("text-anchor", "left")
    .attr("transform", "translate(2,-2)")
    .text(function(d) {return d3.format(".0%")(d.length / vals.length)});
    
  return data;

}


function page_0() {

  "use strict";

  $("#box1").html("");
  d3.selectAll(".filtered").classed("filtered", false);

  $("#dropdown").html("");

 
  var val = summary(points),
      term = [1, 3, 5],
      total_payments = [];
      
  term.forEach(function(t, i) {
    total_payments.push({});
    for (var v in val) {
      total_payments[i][v] = total_payment(val[v], t);
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

  $("#pager").html("<li class='next'><button class='col-md-4 col-md-offset-4 btn btn-default' type='button' onclick='page_1()'><span aria-hidden='true'></span>Next</button></li>");

  $("#dataset").attr("data-content",
  "Prosper Marketplace Inc. is an intermediary of peer to peer lending in the US.<br>In this financing model, the borrower submits a loan application, the investors<br>fund the loan, and the intermediary conducts the process of loaning and<br>collecting the money which is paid back to the investors.<br><br>This dataset contains 114K datapoints about Prosper loans given between<br>Nov 2005 and Mar 2014. Each datapoint has 81 variables.<br><br>For this visualization the dataset has been truncated to about 83K datapoints<br>that use the new Prosper Rating (2009), and to only the 6 variables used.");

  $("#references").attr("data-content", "<ul><li>César Tablas: <a target='_blank' href='https://cesartablas.github.io/eda-loans/'>Exploratory Data Analysis</a> of Prosper Loans</li><li>Reader's Digest: <a target='_blank' href='http://www.rd.com/advice/saving-money/your-credit-score-the-magic-money-number-explained/'>Your Credit Score: The Magic Number Explained</a></li></ul>");

  $("#insights").attr("data-content", highlight_insights("page0"));

}


function page_1() {

  "use strict";

  explored[0] = 1;
  
  $("#tale").html("The Credit Score represents how likely a person is to pay back on time. It is used by lenders to determine if someone qualifies for credit and how much interest they will charge them.<br><br><span class='punchline'>Explore how Credit Score and other variables influence the Interest Rate.</span>");

  $("#facts").append("<h4 class='label label-default'>Explore by clicking on the bars</h4>");

  $("#dataset").attr("data-content",
  "Prosper uses its own rating scale to assess the lenders. This dataset contains<br>only the datapoints using the new scale introduced on July 2009 that ranges<br>from 1 (worst) to 7 (best).<br><br>However, for this visualization, the Credit Score used is the one reported<br>by credit bureaus using the FICO scale &mdash; from 300 (worst) to 850 (best), which<br>is the score submitted by the lender during the loan application.<br><br>The general trend, as seen on the plot below, is that the Interest Rate<br>decreases with an increase in Credit Score.<br><br>Interest Rate vs. Credit Score<img src='img/Credit-Score.png' alt='Interest Rate vs. Credit Score' height='150' width='300'>");
  
  $("#insights").attr("data-content", highlight_insights("credit-score"));

  $("#pager").html("<li class='previous'><button class='col-md-4 col-md-offset-4 btn btn-default' type='button' onclick='page_0()'><span aria-hidden='true'></span>Previous</button></li>");

  $("#dropdown").html("<button id='dLabel' class='btn btn-default btn-sm'type='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Explore Interaction with Other Variables <span class='caret'> </span></button><ul id='explore' class='dropdown-menu' aria-labelledby='dLabel'></ul>");
 
  $("#explore").html("<li><a onclick='page_1()'>Credit Score</a></li><li class='divider'></li><li><a onclick='totalInquiries()'>Inquiries to Your Account</a></li><li><a onclick='debtToIncomeRatio()'>Debt to Income Ratio</a></li></li><li class='divider'></li><li><a onclick='currentCreditLines()'>Number of Credit Lines</a></li><li><a onclick='bankcardUtilization()'>Bank Card Utilization</a></li>");

  window.var_name = "CreditScoreRangeUpper";

  var creditScores = pl.map(function(d) {return +d[var_name];});
  
  var data = draw_hist(creditScores, "Credit Scores", [600,880]);

  $("g.bar :eq(0)").d3Click();

  if (d3.sum(explored) >= 3) {
    $("#wrapup").css("display", "inline-block");
  }
  else {
    $("#wrapup").css("display", "none");
  }


}


function currentCreditLines() {

  "use strict";

  explored[1] = 1;

  $("#box1").html("");
  d3.selectAll(".filtered").classed("filtered", false);

  $("#tale").html("The number of Credit Lines that a borrower has, affects their Credit Score. Counterintuitively, the more Credit Lines a person has, the lower their Interest Rate.<br><br><span class='punchline'>Explore how more than 10 Credit Lines is better than having 0.</span>");

  //$("#insights").attr("data-content", "<ul><li class='insights page0'>A lower Interest Rate means less money paid back.</li><li class='insights page0'>A shorter Term translates into less money paid back.</li><li class='insights page0'>A shorter Term requires higher payments.</li><li class='insights credit-score'>A higher Credit Score awards a lower Interest Rate.</li><li class='insights credit-lines'>More Credit Lines is better than None.</li></ul>");
  $("#insights").attr("data-content", highlight_insights("credit-lines"));
  
  $("#dataset").attr("data-content",
  "Prosper records many variables related to Credit Lines:<br><ul><li>First recorded credit line</li><li>Current credit lines</li><li>Open credit lines</li><li>Total credit lines past 7 years</li><li>Open revolving accounts</li><li>Open revolving monthly payment</li></ul> <br>That indicates that they give great importance to the number of credit lines.<br><br>Interest Rate vs. Credit Lines<img src='img/Credit-Lines.png' alt='Interest Rate vs. Credit Lines' height='150' width='300'>");

  window.var_name = "CurrentCreditLines";

  var ratio = pl.map(function(d) {return +d[var_name];});

  var data = draw_hist(ratio, "Credit Lines", [0, 20]);

  $("g.bar :eq(0)").d3Click();

  if (d3.sum(explored) >= 3) {
    $("#wrapup").css("display", "inline-block");
  }
  else {
    $("#wrapup").css("display", "none");
  }


}


function debtToIncomeRatio() {

  "use strict";

  explored[2] = 1;

  $("#box1").html("");
  d3.selectAll(".filtered").classed("filtered", false);
  d3.selectAll(".insights").classed("notice", false)

  $("#tale").html("The more a person's take home money goes into paying their debt, the higher their Interest Rate will be.<br><br><span class='punchline'>Explore how more than 20-30% of your income going into paying debt increases the Interest Rate.</span>");

  $("#insights").attr("data-content", highlight_insights("debt-to-imcome-ratio"));
  
  $("#dataset").attr("data-content",
  "Prosper records many variables related to a lender's income:<br><ul><li>Employment status</li><li>Employment status duration</li><li>Occupation</li><li>Debt to income ratio</li><li>Income range</li><li>Income verifiable</li><li>Stated monthly income</li></ul><br><br>The rate seems fairly constant in the range of 0-40%.<br>After 40% the Interest tends to increase.<br><br>Interest Rate vs. Debt to Income Ratio<img src='img/Debt-To-Income-Ratio.png' alt='Interest Rate vs. Debt to Income Ratio' height='150' width='300'>");

  window.var_name = "DebtToIncomeRatio";

  var ratio = pl.map(function(d) {return +d[var_name];});

  var data = draw_hist(ratio, "Debt to Income Ratio", [0, 1]);

  $("g.bar :eq(0)").d3Click();

  d3.selectAll(".insights.page-0").classed("notice", true);

  if (d3.sum(explored) >= 3) {
    $("#wrapup").css("display", "inline-block");
  }
  else {
    $("#wrapup").css("display", "none");
  }


}


function totalInquiries() {

  "use strict";

  explored[3] = 1;

  $("#box1").html("");
  d3.selectAll(".filtered").classed("filtered", false);

  $("#tale").html("Every time anyone (credit card, phone company, department store, landlord, etc.) checks someone's Credit Score, it increases their Interest Rate.<br><br><span class='punchline'>Explore how Interest Rate mostly increases with the number of Inquiries.</span>");

  $("#insights").attr("data-content", highlight_insights("total-inquiries"));
  
  $("#dataset").attr("data-content",
  "Prosper records current and past Inquiries and Delinquencies.<br><br>The Interset Rate tends to increase with more Inquiries.<br><br>Interest Rate vs. Total Inquiries<img src='img/Total-Inquiries.png' alt='Interest Rate vs. Total Inquiries' height='150' width='300'>");

  window.var_name = "TotalInquiries";

  var ratio = pl.map(function(d) {return +d[var_name];});

  var data = draw_hist(ratio, "Total Inquiries", [0, 20]);

  $("g.bar :eq(0)").d3Click();

  if (d3.sum(explored) >= 3) {
    $("#wrapup").css("display", "inline-block");
  }
  else {
    $("#wrapup").css("display", "none");
  }


}


function bankcardUtilization() {

  "use strict";

  explored[4] = 1;

  $("#box1").html("");
  d3.selectAll(".filtered").classed("filtered", false);

  $("#tale").html("The used fraction of a borrower's available credit is considered by lenders to determine the interest rate.<br><br><span class='punchline'>See how 0% or more than 50% utilization increases the Interest Rate</span>");

  $("#dataset").attr("data-content",
  "Prosper pays attention to the fraction of used credit using these variables:<br><ul><li>Revolving credit balance</li><li>Bank card utilization</li><li>Available bank card credit</li></ul><br><br>The trend is curious: The Interest Rate is greater for ratios less than 10%<br>or greater than 40%. The optimum range seems to be in the range of 10-40%<br>Interest Rate vs. Bankcard Utilization<br><br><img src='img/Bankcard-Utilization.png' alt='Interest Rates vs. Bankcard Utilization' height='150' width='300'>");

  $("#insights").attr("data-content", highlight_insights("bankcard-utilization"));

  window.var_name = "BankcardUtilization";

  var ratio = pl.map(function(d) {return +d[var_name];});

  var data = draw_hist(ratio, "Bankcard Utilization", [0, 1]);

  $("g.bar :eq(0)").d3Click();

  if (d3.sum(explored) >= 3) {
    $("#wrapup").css("display", "inline-block");
  }
  else {
    $("#wrapup").css("display", "none");
  }

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
  "use strict";
  /**
   * calculate the summary statistics of the BorrowerAPR
   * in an array of points. 
   *
   */

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
  "use strict";
  /**
   * following a "click" event on a histogram's bar,
   * filter the points and the clicked bar
   * to change its class
   **/
  
  d3.selectAll("circle")
    .classed("filtered", false)

  d3.selectAll("g.bar.filtered")
    .classed("filtered", false);

  this.parentElement.setAttribute("class", "bar filtered");

  var bar = this.parentElement.__data__;
  
  var lower_limit = bar.x,
      dx = bar.dx,
      upper_limit = lower_limit + dx,
      fmt = dx > 1 ? ".0f" : ".1f";

  var filtered = points.filter(function(d) {
    return  (d[var_name] >= lower_limit) &&
            (d[var_name] <= upper_limit);
  });

  var val = summary(filtered);

  this.parentElement.setAttribute("class", "bar filtered");
  
  filtered.attr("class", "filtered");
 
  filtered.call(draw_box, yScale, val, "box1", fmt);

  d3.select("g.bar.filtered text")
    .classed("filtered", true);


}


jQuery.fn.d3Click = function () {
  "use strict";
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


function highlight_insights(page) {
  "use strict"
  
  var insights = [
    {"class": "page0", "insight": "A lower Interest Rate means less money paid back."},
    {"class": "page0", "insight": "A shorter Term translates into less money paid back,<br>but consider: A shorter Term requires higher payments."},
    //{"class": "page0", "insight": "A shorter Term requires higher payments."},
    {"class": "credit-score", "insight": "A higher Credit Score awards a lower Interest Rate."},
    {"class": "total-inquiries", "insight": "More Inquiries to your account contributes to a higher Interest Rate."},
    {"class": "debt-to-imcome-ratio", "insight": "Debt greater than 20-30% the Income increases the Interest Rate."},
    {"class": "credit-lines", "insight": "More Credit Lines is better than None."},
    {"class": "bankcard-utilization", "insight": "Owing 10-40% of the available credit limit yields lower interests."}
  ];

  var html = "<ul>",
      seen = true;

  insights.forEach(function(e, i) {
    html = html.concat("<li class='insights");
    if (e.class == page) {
      html = html.concat(" notice");
      seen = false;
    }
    if (seen) {html = html.concat(" seen")};
    html = html.concat("'>", e.insight, "</li>");
  });

  html = html.concat("</ul>");

  return html;
}


function wrapup() {
  
}



/**
 * Visualization: Interacting with a Cloud of Loans
 *
 * by Cesar Tablas
 * January 2016
 * */


function draw_cloud(loan_data) {
  "use strict";
  /**
   * This function is the main entry point for the visualization.
   * It is called by the script in index.html that loads the data
   * from the csv file.
   *
   * Establishes the main graph dimensions, scales and draws
   * the cloud of points
   * */

  //Remove the "Loading Dataset" message  
  $("#spinner").remove();

  //Data and Dimensions
  window.pl = loan_data;
  var total_width = 850,
      total_height = 350,
      margin = {top:10, right:10, bottom:10, left:100},
      width = total_width - margin.left - margin.right,
      height = total_height - margin.top - margin.bottom;

  //Draw the "cloud" of points, which will be common to all pages
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

  cloud.append("text")
    .attr("class", "axis xaxis text")
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (width/2+margin.left) +","+(height-margin.top*1)+")")
    .text("");

  //A counter to use in the x-scale that only serves to spread
  //the points horizontally. n is incrementes after drawing each circle
  var n = 0;

  window.points = cloud.selectAll("circle")
      .data(pl)
    .enter()
      .append("circle")
      .attr("r", 3)
      .attr("cx", function(d, n) {return xScale(n++);})
      .attr("cy", function(d) {return yScale(d.BorrowerAPR);});

  //A counter to flag which variables have been explored
  //Used to decide when to display the "Wrap-Up" button and content
  window.explored = [0,0,0,0,0];
  
  //Draw content of Page 0
  page_0();

}


function draw_box(a, yScale, val, id, fmt){
  "use strict";
  /**
   * Draw a boxplot from a d3 array of points.
   * 
   * Adapted from http://bl.ocks.org/mbostock/4061502
   *
   * parameters:
   * a:       d3 array of points (all the points or only the filtered ones)
   * yScale:  d3 scale defined in draw_cloud()
   * val:     an object containing summary statistics: summary(a)
   * id:      "#box0" or "#box1", the id of where to place the boxplot
   * fmt:     format specification for the variable range text above the boxplot
   * */

  //Clear the previous content of either #box0 or #box1
  $("#" + id).html("");

  //Dimensions
  var total_width = 90,
      total_height = 350,
      margin = {top:10, right:25, bottom:10, left:25},
      width = total_width - margin.left - margin.right,
      height = total_height - margin.top - margin.bottom;

  //Draw the boxplot
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

  /**
   * #box1 is drawn many times with different types of data:
   * integers like the CreditScore, and
   * fractions like the Debt to Income Ratio.
   *
   * This variable controls how to format the range of the variable
   * that appears above the boxplot. This range corresponds to the
   * clicked bar that is highlighted in the histogram.
   * */
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

  //Add the tooltip for median and whiskers
  $("svg line").tooltip({"data-toggle": "tooltip", "container": "body"});
  //Add the tooltip for Q1 and Q3 (rectangle)
  $("svg rect").tooltip({"data-toggle": "tooltip", "container": "body"});

}


function draw_hist(vals, label, range) {
  "use strict";
  /**
   * Draw a histogram for the variable in consideration.
   * 
   * Adapted from http://bl.ocks.org/mbostock/3048450
   *
   * parameters:
   * vals:    an array with the values of the variable
   * label:   X-axis text to display
   * range:   an array of [lower_limit, upper_limit] for the histogram
   *          if needed to override the default one
   * */

  //Clear the previous content of #facts, where a table or histogram
  //are displayed
  $("#facts").html("");

  //Dimensions  
  var total_width = 300,
      total_height = 200,
      margin = {top:20, right:25, bottom:50, left:25},
      width = total_width - margin.left - margin.right,
      height = total_height - margin.top - margin.bottom;

  //If `range` variable is used when calling the function,
  //override the default range of d3.layout.histogram.
  if (range) {
    vals = vals.filter(function(d) {
      return d>=range[0] && d<=range[1]});
  }

  //Draw the histogram
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

  //Draw the frequency value placed on top of each bar, hiding all of
  //them  and revealing only the "filtered" bar using css opacity
  bar.append("text")
    .attr("class", "label label-default text frequency")
    .attr("text-anchor", "left")
    .attr("transform", "translate(2,-2)")
    .text(function(d) {return d3.format(".0%")(d.length / vals.length)});

}


function page_0() {
  "use strict";
  /**
   * Define and display the main elements to complete the first page
   * of the visualization.
   *
   * These elements are: the storyline, table, boxplot, navigation
   * and buttons.
   * */

  //Clear previous content and classes (when navigating back to page 0)
  $("#box1").html("");
  d3.selectAll(".filtered").classed("filtered", false);
  $("#dropdown").html("");
  d3.select("#cloud > svg > g > text.axis.xaxis.text").text("The position in the X-Axis is assigned randomly, used only to spread out the points and create the effect of a cloud of points.");


  //Calculate summary statistics of all points in dataset
  //and the data for the table of total payments
  var val = summary(points),
      term = [1, 3, 5],
      total_payments = [];

  term.forEach(function(t, i) {
    total_payments.push({});
    for (var v in val) {
      total_payments[i][v] = total_payment(val[v], t);
    }
  });

  //Draw the boxplot of all the points in dataset, place it in #box0
  points.call(draw_box, yScale, val, "box0");

  //Fill the content for each section of Page 0 
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

  $("#insights").attr("data-content", highlight_insights("page0"));

}


function page_1() {
  "use strict";
  /**
   * Define and display the main elements of the second page
   * of the visualization and Draw the histogram for the
   * first variable: Credit Scores.
   * */

  //Clear previous content
  d3.select("#cloud > svg > g > text.axis.xaxis.text").text("");
  //Flag this variable as explored, to decide if "Wrap-Up" button is revealed  
  explored[0] = 1;
  $("#wrapup").css("display", d3.sum(explored) >= 3 ? "inline-block" : "none");

  //Fill the content for each section of Page 1 common to all variables 

  $("#facts").append("<h4 class='label label-default'>Explore by clicking on the bars</h4>");

  $("#pager").html("<li class='previous'><button class='col-md-4 col-md-offset-4 btn btn-default' type='button' onclick='page_0()'><span aria-hidden='true'></span>Previous</button></li>");

  $("#dropdown").html("<button id='dLabel' class='btn btn-default btn-sm'type='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Explore Interacting with Other Variables <span class='caret'> </span></button><ul id='explore' class='dropdown-menu' aria-labelledby='dLabel'></ul>");
 
  $("#explore").html("<li><a onclick='detailVar(0)'>Credit Score</a></li><li class='divider'></li><li><a onclick='detailVar(1)'>Inquiries to Your Account</a></li><li><a onclick='detailVar(2)'>Debt to Income Ratio</a></li></li><li class='divider'></li><li><a onclick='detailVar(3)'>Number of Credit Lines</a></li><li><a onclick='detailVar(4)'>Bank Card Utilization</a></li>");

  //Display the content of the first varieble to explore
  detailVar(0);

}


function detailVar(pos) {
  "use strict";
  /**
   * Draw histogram and change page content for a variable
   *
   * parameters:
   * pos: an integer from 0 to 4. serves as index of variables[pos]
   *      and keeps the order of the variables in the dropdown menu
   * */

  //Define the variables contents
  var variables = [
    { name : "CreditScoreRangeUpper",
      text : "Credit Scores",
      class : "credit-score",
      range : [600,880],
      tale : "The Credit Score represents how likely a person is to pay back on time. It is used by lenders to determine if someone qualifies for credit and how much interest they will charge them.<br><br><span class='punchline'>Explore how Credit Score and other variables influence the Interest Rate.</span>",
      dataset : "Prosper uses its own rating scale to assess the lenders. This dataset contains<br>only the datapoints using the new scale introduced on July 2009 that ranges<br>from 1 (worst) to 7 (best).<br><br>However, for this visualization, the Credit Score used is the one reported<br>by credit bureaus using the FICO scale &mdash; from 300 (worst) to 850 (best), which<br>is the score submitted by the lender during the loan application.<br><br>The general trend, as seen on the plot below, is that the Interest Rate<br>decreases with an increase in Credit Score.<br><br>Interest Rate vs. Credit Score<img src='img/Credit-Score.png' alt='Interest Rate vs. Credit Score' height='150' width='300'>"
    },
    { name : "TotalInquiries",
      text : "Total Inquiries",
      class : "total-inquiries",
      range : [0, 20],
      tale : "Every time anyone (credit card, phone company, department store, landlord, etc.) checks someone's Credit Score, it increases their Interest Rate.<br><br><span class='punchline'>Explore how Interest Rate mostly increases with the number of Inquiries.</span>",
      dataset : "Prosper records current and past Inquiries and Delinquencies.<br><br>The Interset Rate tends to increase with more Inquiries.<br><br>Interest Rate vs. Total Inquiries<img src='img/Total-Inquiries.png' alt='Interest Rate vs. Total Inquiries' height='150' width='300'>"
    },
    { name : "DebtToIncomeRatio",
      text : "Debt to Income Ratio",
      class : "debt-to-imcome-ratio",
      range : [0, 1],
      tale : "The more a person's take home money goes into paying their debt, the higher their Interest Rate will be.<br><br><span class='punchline'>Explore how more than 20-30% of your income going into paying debt increases the Interest Rate.</span>",
      dataset : "Prosper records many variables related to a lender's income:<br><ul><li>Employment status</li><li>Employment status duration</li><li>Occupation</li><li>Debt to income ratio</li><li>Income range</li><li>Income verifiable</li><li>Stated monthly income</li></ul><br><br>The rate seems fairly constant in the range of 0-40%.<br>After 40% the Interest tends to increase.<br><br>Interest Rate vs. Debt to Income Ratio<img src='img/Debt-To-Income-Ratio.png' alt='Interest Rate vs. Debt to Income Ratio' height='150' width='300'>"
    },
    { name : "CurrentCreditLines",
      text : "Credit Lines",
      class : "credit-lines",
      range : [0, 20],
      tale : "The number of Credit Lines that a borrower has, affects their Credit Score. Counterintuitively, the more Credit Lines a person has, the lower their Interest Rate.<br><br><span class='punchline'>Explore how more than 10 Credit Lines is better than having 0.</span>",
      dataset : "Prosper records many variables related to Credit Lines:<br><ul><li>First recorded credit line</li><li>Current credit lines</li><li>Open credit lines</li><li>Total credit lines past 7 years</li><li>Open revolving accounts</li><li>Open revolving monthly payment</li></ul> <br>That indicates that they give great importance to the number of credit lines.<br><br>Interest Rate vs. Credit Lines<img src='img/Credit-Lines.png' alt='Interest Rate vs. Credit Lines' height='150' width='300'>"
    },
    { name : "BankcardUtilization",
      text : "Bankcard Utilization",
      class : "bankcard-utilization",
      range : [0, 1],
      tale : "The used fraction of a borrower's available credit is considered by lenders to determine the interest rate.<br><br><span class='punchline'>See how 0% or more than 50% utilization increases the Interest Rate</span>",
      dataset : "Prosper pays attention to the fraction of used credit using these variables:<br><ul><li>Revolving credit balance</li><li>Bank card utilization</li><li>Available bank card credit</li></ul><br><br>The trend is curious: The Interest Rate is greater for ratios less than 10%<br>or greater than 40%. The optimum range seems to be in the range of 10-40%<br>Interest Rate vs. Bankcard Utilization<br><br><img src='img/Bankcard-Utilization.png' alt='Interest Rates vs. Bankcard Utilization' height='150' width='300'>"
    },
    
  ];
  
  //Choose the variable to display
  var v = variables[pos];

  //Clear previous content and classes
  $("#box1").html("");
  d3.selectAll(".filtered").classed("filtered", false);

  //Flag this variable as explored, to decide if "Wrap-Up" button is revealed  
  explored[pos] = 1;
  $("#wrapup").css("display", d3.sum(explored) >= 3 ? "inline-block" : "none");

  //Fill the content that changes for this variable  
  $("#tale").html(v.tale);

  $("#dataset").attr("data-content", v.dataset);


  $("#insights").attr("data-content", highlight_insights(v.class));

  //Get the values
  window.var_name = v.name;
  var vals = pl.map(function(d) {return +d[var_name];});

  //Draw the histogram
  var data = draw_hist(vals, v.text, v.range);

  //Click the first bar
  $("g.bar :eq(0)").d3Click();

}


function highlight_insights(page) {
  "use strict"
  /**
   * Define the text that comes up in the "insights" popover
   * and its classes
   *
   * parameters:
   * page: the page where the "insight" button was clicked
   *
   * returns:
   * html: a string containing the html to display in the popover
   * */
  
  //An array of all the insights with a class indicating which page it belongs to
  var insights = [
    {"class": "page0", "insight": "A lower Interest Rate means less money paid back."},
    {"class": "page0", "insight": "A shorter Term translates into less money paid back,<br>but consider: A shorter Term requires higher payments."},
    {"class": "credit-score", "insight": "A higher Credit Score awards a lower Interest Rate."},
    {"class": "total-inquiries", "insight": "More Inquiries to your account contributes to a higher Interest Rate."},
    {"class": "debt-to-imcome-ratio", "insight": "Debt greater than 20-30% the Income increases the Interest Rate."},
    {"class": "credit-lines", "insight": "More Credit Lines is better than None."},
    {"class": "bankcard-utilization", "insight": "Owing 10-40% of the available credit limit yields lower interests."}
  ];

  //Build the html string that will populate the "insights" popover
  var html = "<ul>";
  window.seen = [1,1].concat(explored);

  insights.forEach(function(e, i) {
    html = html.concat("<li class='insights");
    if (e.class == page) {
      html = html.concat(" notice");
    }
    if (seen[i] == 1) {html = html.concat(" seen");};
    html = html.concat("'>", e.insight, "</li>");
  });

  html = html.concat("</ul>");

  return html;

}


function total_payment(R, N) {
  "use strict";
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
   * */

  var PV = 1,        //Present Value, or ammount loaned
       r = R / 12,   //r: monthly rate, calculated from R: annual rate
       n = N * 12;   //n: total number of paymens, N: term in years times 12

  //Calculate the monthly payment
  var P = r * PV / (1 - Math.pow(1 + r, -n));

  //Return the total payment, or n times the monthly payment   
  return P * n;

}


function summary(a) {
  "use strict";
  /**
   * calculate the summary statistics of the BorrowerAPR
   * in an array of points.
   *
   * parameters:
   * a: a d3 array of points
   *
   * returns:
   * an object containing the summary statistics
   * */

  //Prepare an array of interest rates from the array of points `a`
  //using the variable BorrowerAPR
  var rates = a[0].map(function(d) {return +d.__data__.BorrowerAPR;});

  //Summary statistics
  rates = rates.sort();
  var q1 = d3.quantile(rates, 0.25),
      q2 = d3.quantile(rates, 0.50),
      q3 = d3.quantile(rates, 0.75),
      iqr = q3 - q1,
      w1 = q1 - 1.5 * iqr,
      w3 = q3 + 1.5 * iqr,
      min_ = d3.min(rates),
      max_ = d3.max(rates);

  //The whiskers will be at 1.5 IQR from Q1 and Q3,
  //or at MIN and MAX values.
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
   * */

  //Reset all previously filtered items 
  d3.selectAll("circle")
    .classed("filtered", false)

  d3.selectAll("g.bar.filtered")
    .classed("filtered", false);

  //Add the class to the clicked bar, and obtain the data from it
  this.parentElement.setAttribute("class", "bar filtered");

  var bar = this.parentElement.__data__;
  
  var lower_limit = bar.x,
      dx = bar.dx,
      upper_limit = lower_limit + dx,
      fmt = dx > 1 ? ".0f" : ".1f";

  //Select the points that belong to the clicked bar's interval,
  //calculate summary statistics, drqw boxplot, and
  //add "filtered" class to points
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

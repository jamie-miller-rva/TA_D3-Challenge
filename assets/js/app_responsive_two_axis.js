/* Assignment: Create a scatter plot to examine the relationship between Poverty, Income and Age (x axis) on Access to Healthcare (y axis)
    The scatter plot represents a circle for each state (and Washington DC). 
    Data is pulled from the data.csv file provided in the data folder (uses relative path from index.html file).
    Includes state abbreviations in the circles.
    Creates and situates axes and labels to the left and bottom of the chart (to account for margins).

    Note: the Visual Studio Code extention: Live Server is used to serve the visualization at localhost:5501 in default web browser.
*/

// Make responsive using D3 - Extra_Responsive_Chart example from Day 2:
d3.select(window).on("resize", handleResize);

// When the browser loads, loadChart() is called
loadChart();

function handleResize() {
    var svgArea = d3.select("svg");

    // If there is already an svg container on the page, remove it and reload the chart
    if (!svgArea.empty()) {
        svgArea.remove();
        loadChart(); // call loadChart function below
    }
}

/* Outline of functions created and when they are called in reference to loading the data
function loadChart()
    // Create functions for use after data is loaded:
    function xScale(data, chosenXAxis)
    function renderAxes(newXScale, xAxis) -- includes transition
    function renderCircles(circlesGroup, newXScale, chosenXAxis) -- includes transition
    function renderStateText(textGroup, newXScale, chosenXAxis) -- includes transition
    function updateToolTip(chosenXAxis, circlesGroup) -- uses class "d3-tip" to match d3Style.css

    Load data =============================================================
    // Format the data from string to number
    // Create the x axis scale for the chart using xScale(data, chosenXAxis)
    // Create a y scale function 
    // Create inial axis functions (bottomAxis and leftAxis)
    // Append x axis (xAxis) to the chartGroup
    // Append y axis to chartGroup
    // Append inital circles to chartGroup
    // Append inital text to chartGroup
    // Create x axis labels (for poverty and income)
    // Append y axis label to chartGroup (healthcare)
    // Update toolTip using the updateToolTip(chosenXAxis, circlesGroup) inial chosenXAxis is "poverty"
    // Create Event Listners for x axis labels
        // When x axis labelsGroup text is selected            
            // get value of selection (axis label)
            // replace chosenXAxis with value of selection
            // Update xScale for new "value" / data using xScale(data, chosenXAxis)
            // Update x axis with transition using renderAxes(xLinearScale, xAxis)
            // Update circles with new x values using renderCircles(circlesGroup, xLinearScale, chosenXAxis)
            // Update tooltips with new info using updateToolTip(chosenXAxis, circlesGroup)
            // Update the x label class (active vs. inactive) to change x label text to/from bold
*/

function loadChart() {

    // Grab the width of the containing box
    var width = parseInt(d3.select("#scatter").style("width"));

    // Designate the height of the graph in terms of the width
    var height = width - width / 3.9;    

    // Margin spacing for graph
    var margin = {
        top: 30,
        right: 20,
        bottom: 60,
        left: 80
    };

    // space for placing words
    var labelArea = 110;

    // padding to adjust the axis lables
    var textPadBot = 40;
    var textPadLeft = 20;   

    // Create an SVG wrapper
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Create a variable chartGroup and append with an <g> tag that will hold the chart,
    // Shift the chartGroup by left and top margins (and add class chart to link to d3Style.css)   
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.bottom - labelArea - textPadBot})`)
        .attr("class", "chart");

    // Prior to loading Data Set inital Parameter(s) for chosenXAxis for inital loading of page
    var chosenXAxis = "poverty";

    // Create functions to be used after data is loaded
    // xScale function: used for updating xScale var upon click on axis label
    function xScale(data, chosenXAxis) {
        // create scales dependent on the data (d[chosenXAxis]) 
        var xLinearScale = d3.scaleLinear()
            .domain([
                d3.min(data, d => d[chosenXAxis]) * 0.8, // adjust as needed
                d3.max(data, d => d[chosenXAxis]) * 1.2  // adjust as needed
            ])
            .range([0, width]);
        return xLinearScale;
    }

    // renderAxes function: used for updating xScale var upon click on axis label (includes transition)
    function renderAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);
        return xAxis;
    }

    // renderCircles function: used to update circlesgroup, includes a transition to new circles
    function renderCircles(circlesGroup, newXScale, chosenXAxis) {
        circlesGroup
            .transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[chosenXAxis]));
        return circlesGroup;
    }

    // renderText function: used to update circlesgroup, includes a transition to new circles
    function renderText(textGroup, newXScale, chosenXAxis) {
        textGroup
            .transition()
            .duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]));
        return textGroup;
    }

    // updateToolTip function: used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, circlesGroup) {

        var label;

        if (chosenXAxis === "poverty") {
            label = "Poverty";
        }
        else if (chosenXAxis === "income") {
            label = "Income";
        }
        else {
            label = "Age";
        }

        var toolTip = d3.tip()
            .attr("class", "d3-tip") // uses d3-tip to match d3Style.css
            .offset([80, 60]) // to the bottom and right
            .html(function (d) {
                return (`${d.state}<br>${label}: ${d[chosenXAxis]}<br>Healthcare: ${d.healthcare}%`);
            });

        // .call() invokes a callback function on the selection itself:
        circlesGroup.call(toolTip);        

        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
            // onmouseout event
            .on("mouseout", function(data) {
                toolTip.hide(data);
            });
        return circlesGroup;
    }

    // Import data from the data.csv file    
    // ========================================================================================================
    d3.csv("assets/data/data.csv").then(function (data, error) {
        if (error) throw (error);
        console.log(data);

        // Format the data from string to number
        data.forEach(function (data) {
            data.poverty = +data.poverty;
            data.income = +data.income;
            data.age = +data.age;
            data.healthcare = +data.healthcare;
        });

        // Create the x scale for the chart using the xScale function above       
        var xLinearScale = xScale(data, chosenXAxis);

        // Create a y scale function
        var yLinearScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.healthcare))
            .range([height, 0]);

        // Create inital axis function
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append xAxis to the chartGroup
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr(
                "transform",
                `translate(0, ${height} )`)
            .call(bottomAxis);

        // Append y axis to chartgroup
        chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);

        // Append inital circles
        var circlesGroup = chartGroup.append("g")
            .classed("circlesGroup", true)
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", 15)
            .attr("class", "stateCircle");

        // Append inital text
        var textGroup = chartGroup.append("g")
            .attr("class", "stateText")
            .selectAll("texts")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d.poverty) - 0.5) // the subtraction of 0.5 is for positioning of stateText within the circle
            .attr("y", d => yLinearScale(d.healthcare) + 5) // the addition of 5 is for positioning of stateText within the circle
            .html(function (d) {
                return (`${d.abbr}`)        
            });

        // Create x axis labels (poverty and income)       
        var labelsGroup = chartGroup.append("g")
            .attr("class", "xLabels")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`);

        var povertyLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", -10)
            .attr("value", "poverty") // value to grab for event listner
            .classed("active", true)
            .text("Poverty (%)");

        var incomeLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 10) // add 25 to drop down below poverty label
            .attr("value", "income") // value to grab for event listner
            .classed("inactive", true)
            .text("Household Income (Median)");

        var ageLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 30) // add 25 to drop down below poverty label
            .attr("value", "age") // value to grab for event listner
            .classed("inactive", true)
            .text("Age (Median)");

        // Append y axis label (healthcare)
        chartGroup.append("g")
            .classed("yLabels", true)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + textPadLeft)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .classed("axisText active", true)
            .text("Without Access to Healthcare (%)");

        // Update textGroup with toolTip (when textGroup is selected) using updateToolTip from above
        textGroup = updateToolTip(chosenXAxis, textGroup);
        
        // Create Event Listners for x axis labels
        // When labelsGroup text is selected
        labelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection  (axis label)
                var value = d3.select(this).attr("value");
                // console.log(value);
                if (value !== chosenXAxis) {

                    // replace chosenXAxis with value
                    chosenXAxis = value;
                    // console.log(chosenXAxis);

                    // Update xScale for new "value" / data
                    xLinearScale = xScale(data, chosenXAxis);

                    // Update x axis with transition
                    xAxis = renderAxes(xLinearScale, xAxis);

                    // Update circles with new x values
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                    // Update text with new x values
                    textGroup = renderText(textGroup, xLinearScale, chosenXAxis);

                    // Update tooltips with new info
                    textGroup = updateToolTip(chosenXAxis, textGroup);

                    // Update class active vs. inactive to change x label text to/from bold
                    if (chosenXAxis === "income") {
                        incomeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);

                    } else if(chosenXAxis === "age") {
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ageLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                    else {
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        povertyLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);                
                    }
                }
            });
    });
}


/* Create a scatter plot using D3 techniques between two of the data variables Poverty (x axis) vs. Healthcare (y axis)
The scatter plot must represent each state (and Washington DC) with circle elements. 
Data will be pulled from the data.csv file provided in the data folder.
Include state abbreviations in the circles.
Create and situate your axes and labels to the left and bottom of the chart.
Note: You'll need to the VS Code Live Server extension to run the visualization. This will host the page at localhost:5501 in your web browser.
*/

// Step 1: Set up our chart area
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 30,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
console.log(`Width: ${width}`);
var height = svgHeight - margin.top - margin.bottom;
console.log(`Height: ${height}`);

// Step 2: Create an SVG wrapper,
// Create a variable to hold the chartGroup and append with an SVG <g> tag that will hold the chart,
// Shift the chartGroup by left and top margins (and add class chart to link to d3Style.css)
// =================================
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("class", "chart");

// Step 3 & 4:
// Import data from the data.csv file in our data folder
// Parse the data
// =================================
d3.csv("assets/data/data.csv").then(function (data) {
    console.log(data);

    // Format the data
    data.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // Step 5: Create the y and x scales for the chart
    // =================================
    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);

    // Step 6: Create the axes
    // =================================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 8: Append the axes to the chartGroup
    // ==============================================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Step 9: Create axes labels
    //  =============================================
    // Bottom axis
    chartGroup.append("g")
        .attr("class", "bottomAxis")
        .append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .attr("class", "axisText")
        .text("In Poverty (%)")
        .attr("class", "active");

    // Left axis
    chartGroup.append("g")
        .attr("class", "leftAxis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Without Access to Healthcare (%)")
        .attr("class", "active");



    // Step 9: Create Circles and State Text
    // ===========================================
    var circlesGroup = chartGroup.append("g")
        .attr("class", "circles")
        .selectAll("circles")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("class", "stateCircle");

    chartGroup.append("g")
        .attr("class", "stateText")
        .selectAll("texts")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty) - 0.5) // the subtraction of 0.5 is for positioning of stateText within the circle
        .attr("y", d => yLinearScale(d.healthcare) + 5) // the addition of 5 is for positioning of stateText within the circle
        .attr("class", "stateText")
        .html(function (d) {
            return (`${d.abbr}`)        
        });

    // Step 10 Inialize Tool Tip
    //  ===========================
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .html(function (d) {
            return (`${d.state}<br>Poverty: ${d.poverty}%<br> Without Healthcare: ${d.healthcare}%`);
        });

    // Step 11 Create tooltip in chart
    chartGroup.call(toolTip);

    // Create event listner 
    circlesGroup.on("click", function (data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function (data) {
            toolTip.hide(data);
        });

    
});
/* Assignment: Create a scatter plot using two of the data variables - Poverty (x axis) vs. Healthcare (y axis)
    The scatter plot must represent a circle for each state (and Washington DC). 
    Data will be pulled from the data.csv file provided in the data folder (use relative path from index.html file).
    Include state abbreviations in the circles.
    Create and situate the axes and labels to the left and bottom of the chart (to account for margins).

    Note: the VS Code Live Server extension is used to run the visualization. This will host the page at localhost:5501 in your web browser.

    Day 3 Activity 01 was referenced for Steps for psuedo code
    Day 3 Activity 09 was referenced for simple scatter plot

    Day 2 Extra Content Extra_Responsive_Chart was referenced for responsive webpage

    Day 3 Activity 12 was referenced for multi-choice axis 
*/

// *******************************************************************************
// * Step 12: Make responsive using Day 2: Extra Content Extra_Responsive_Chart: *
// *******************************************************************************
// use the window innerWidth and innerHeight to determine svgWidth and svgHeight
// then wrap the app.js work in a loadChart function
d3.select(window).on("resize", handleResize);

// When the browser loads, loadChart() is called
loadChart();

function handleResize() {
    var svgArea = d3.select("svg");

    // If there is already an svg container on the page, remove it and reload the chart
    if (!svgArea.empty()) {
        svgArea.remove();
        loadChart();
    }
}

function loadChart() {
    var svgWidth = window.innerWidth - window.innerWidth / 3;
    var svgHeight = window.innerHeight - window.innerHeight / 2;

    // Step 1: Set up the chart area
    //= ================================
    // var svgWidth = 960;
    // var svgHeight = 500;

    var margin = {
        top: 30,
        right: 20,
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
    // Import and Parse the data from the data.csv file in our data folder
    // =================================
    d3.csv("assets/data/data.csv").then(function (data) {
        console.log(data);

        // Format the data
        data.forEach(function (data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
        });

        // Step 5: Create the y and x scales for the chart
        // Note for this "responsive version I used extent to get the min and max for domain"
        // =================================
        var xLinearScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.poverty))
            .range([(0), width]);

        var yLinearScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.healthcare))
            .range([height, 0]);

        // Step 6: Create the axes
        // =================================
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Step 8: Append the axes to the chartGroup (move to bottom and left)
        // ==============================================
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        // Step 9: Create axes labels (place within a group tag for better DOM visability)
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

        // Step 9: Create Circles and State Text (place within a group tag for better DOM visability)
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

        // Add a textGroup to place state abbr within the circles created in the circlesGroup
        var textGroup = chartGroup.append("g")
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
        textGroup.on("mouseover", function (data) {
            toolTip.show(data, this);
        })
            // onmouseout event
            .on("mouseout", function (data) {
                toolTip.hide(data);
            });
    });
}    
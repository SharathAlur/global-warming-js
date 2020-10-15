import * as d3 from 'd3';
import { convertToText } from './helpers/dataUtils';
import { getMaxValue } from './helpers/axis';
import styles from './styles/styles';
import emissionData from './data/CO2-Emissions-Country-Wise.csv';

const chartSettings = {
    marginTop: 10,
    marginLeft: 80,
    marginBottom: 30,
    marginRight: 30,
    width: 1000,
    height: 400,
}

chartSettings.innerWidth = chartSettings.width - chartSettings.marginLeft - chartSettings.marginRight;
chartSettings.innerHeight = chartSettings.height - chartSettings.marginTop - chartSettings.marginBottom;

/**
 * Sets y-axis scale based on the upper limit
 *
 * @param {number} upperLimit upper limit value for the y-axis
 * 
 * @returns {Function} y-axis scale
 */
const yScale = (upperLimit) => d3.scaleLinear().domain([0, upperLimit]).range([ chartSettings.innerHeight, 0 ]);

// Add X axis
const xScale = d3.scaleTime()
    .domain([d3.timeParse("%Y")(1751), d3.timeParse("%Y")(2020)])
    .range([ 0, chartSettings.innerWidth ]);

/**
 * Creates Initial line chart
 *
 * @param {string} bindId selector to create line chart
 * @param {string} countryName country name to display on chart
 * 
 * @returns {d3.Selection} line chart svg
 */
const createBasicGraph = (bindId, countryName) => {
    const { width, height, marginLeft, innerHeight } = chartSettings;
    const chartContainer = d3.select(bindId)
        .append("svg")
        .classed(styles.lineChartSvg, true)
        .attr("width", width)
        .attr("height", height);
    createTitle(chartContainer, countryName);
    const lineChartSvg = chartContainer.append("g")
            .attr("transform",
                `translate(${  marginLeft  }, 50)`);

    lineChartSvg.append("g")
        .classed(styles.lineChartXaxis, true)
        .attr("transform", `translate(0,${  innerHeight  })`)
        .call(d3.axisBottom(xScale));
    
    lineChartSvg.append("g")			
        .classed(styles.lineChartYaxis, true);
    return lineChartSvg;
}
/**
 * Creates title for the line graph
 *
 * @param {d3.Selection} div The text added in
 * @param {string} countryName Country name to display
 * 
 * @returns {d3.Selection} the title node
 */
const createTitle = (div, countryName) => (div.append('text')
    .classed(styles.lineChartTitle, true)
    .text(countryName)
    .attr('x', chartSettings.innerWidth/2)
    .attr('y', 20));
/**
 * Creates line chart. One can add as many line as they want by calling draw line method
 */
export default class LineChart {
    constructor(bindId, countryName) {
        this.svg = createBasicGraph(bindId, countryName);
        this.upperLimit = 1000;
    }

    // Update Y axis
    updateYAxis() {
                
    }

    drawLine(country) {
        const data = emissionData.filter(({ Entity }) => country.includes(Entity))
        // Find upper limit for the Y axis based on the data
        this.upperLimit = getMaxValue(data, this.upperLimit);

        const y = yScale(this.upperLimit);

        // add the Y gridlines
        this.svg.select(`.${styles.lineChartYaxis}`)
            .style('color', '#D3D3D3')
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickSize(-chartSettings.innerWidth)
                .tickFormat((d) => convertToText(d)));
        // Add the line
        this.svg.append("path")
            .classed(styles.lineChart, true)
            .datum(data)
            .attr("d", d3.line()
                .x((d) => xScale(d3.timeParse("%Y")(d.Year)))
                .y((d) => yScale(this.upperLimit)(d['Annual CO2']))
            );
    }
}

import * as d3 from 'd3';
import data from './data/CO2-Emissions-Country-Wise.csv';
import {convertToText} from './helpers/dataUtils';
import { getMaxValue } from './helpers/axis';
import styles from './styles/styles';
import emissionData from './data/CO2-Emissions-Country-Wise.csv';

const margin = {top: 10, right: 30, bottom: 30, left: 120};
const width = 1000 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// y axis scale
const yAxis = upperLimit => d3.scaleLinear().domain([0, upperLimit]).range([ height, 0 ]);

// Creates basic graph
const createBasicGraph = (bindId) => {
    const lineChartSvg = d3.select(bindId)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("position", 'absolute')
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    // Add X axis
    const x = d3.scaleTime()
        .domain([d3.timeParse("%Y")(d3.min(data, d => d.Year)), d3.timeParse("%Y")(2020)])
        .range([ 0, width ]);
    lineChartSvg.append("g")
        .classed('x-axis', true)
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    
    // add Y axis
    lineChartSvg.append("g")
        .classed('y-axis', true);
    // add Y gridlines
    lineChartSvg.append("g")			
        .classed("y-axis-grid", true);
    return lineChartSvg;
}
/**
 * Creates line chart. One can add as many line as they want by calling draw line method
 */
export default class LineChart {
    constructor(bindId) {
        this.svg = createBasicGraph(bindId);
        this.upperLimit = 0;
    }

    // Update Y axis
    updateYAxis() {
        const y = yAxis(this.upperLimit);
        this.svg.select('.y-axis')
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickFormat(d => convertToText(d)));

        // add the Y gridlines
        this.svg.select(".y-axis-grid")
            .style('color', '#D3D3D3')
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickSize(-width));
                
    }

    drawLine(country) {
        const data = emissionData.filter(({Entity}) => country.includes(Entity))
        // Find upper limit for the Y axis based on the data
        this.upperLimit = getMaxValue(data, this.updateYAxis);
        this.updateYAxis();
        // Add the line
        lineChartSvg.append("path")
            .classed(styles.lineChart, true)
            .datum(data)
            .attr("d", d3.line()
                .x(d => x(d3.timeParse("%Y")(d.Year)))
                .y(d => y(d['Annual CO2']))
            );
    }
}

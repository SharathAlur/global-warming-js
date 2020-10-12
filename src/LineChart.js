import * as d3 from 'd3';
import data from './data/CO2-Emissions-Country-Wise.csv';
import {ranges, getLevel, convertToText} from './helpers/dataUtils';
import { getMaxValue, getTickValues } from './helpers/axis';

const margin = {top: 10, right: 30, bottom: 30, left: 120};
const width = 1000 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const yAxis = upperLimit => d3.scaleLinear().domain([0, upperLimit]).range([ height, 0 ]);

const createBasicGraph = () => {
    const lineChartSvg = d3.select("#app")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("position", 'absolute')
            .style("opacity", 1)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    
    const x = d3.scaleTime()
        .domain([d3.timeParse("%Y")(d3.min(data, d => d.Year)), d3.timeParse("%Y")(2020)])
        .range([ 0, width ]);
    lineChartSvg.append("g")
        .classed('x-axis', true)
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    
    lineChartSvg.append("g")
        .classed('y-axis', true);
    // add the Y gridlines
    lineChartSvg.append("g")			
        .classed("y-axis-grid", true);
    return lineChartSvg;
}

export default class LineChart {
    constructor() {
        this.svg = createBasicGraph();
    }

    updateYAxis(upperLimit) {
        const y = yAxis(upperLimit);
        this.svg.select('.y-axis')
            .call(d3.axisLeft(y)
                .tickValues(getTickValues(upperLimit))
                .tickFormat(d => convertToText(d)));

        // add the Y gridlines
        this.svg.select(".y-axis-grid")
            .style('color', '#D3D3D3')
            .call(d3.axisLeft(y)
                .tickValues(getTickValues(upperLimit))
                .tickSize(-width));
    }

    drawLine(data) {
        const upperLimit = getMaxValue(data);
        this.updateYAxis(upperLimit);
        // Add the line
        lineChartSvg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", '2px')
            .attr("d", d3.line()
                .x(d => x(d3.timeParse("%Y")(d.Year)))
                .y(d => y(d['Annual CO2']))
            );
    }
}

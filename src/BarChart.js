import * as d3 from "d3";
import styles from "./styles/styles";
import emissionData from './data/CO2-Emissions-Country-Wise.csv'
import { getMaxValue } from "./helpers/axis";
import { convertToText } from "./helpers/dataUtils";

// Bar chart settings
const chartSettings = {
    width: 700,
    height: 500,
    padding: 40,
    titlePadding: 5,
    columnPadding: 0.9,
    ticksInXAxis: 5,
    duration: 300,
};

chartSettings.innerWidth = chartSettings.width - chartSettings.padding * 2;
chartSettings.innerHeight = chartSettings.height - chartSettings.padding * 2;

const xAxisScale = d3.scaleLinear()
    .range([0, chartSettings.innerWidth]);

const yAxisScale = d3.scaleBand()
    .range([0, chartSettings.innerHeight])
    .padding(chartSettings.columnPadding);

/**
 * Class for bar chart
 */
export default class BarChart {
    constructor(svg) {
        this.upperlimit = 0;
        this.svg = svg.append('svg')
            .classed(styles.barChartContainer, true)
            .attr("width", chartSettings.width)
            .attr("height", chartSettings.height);
        this.xAxisContainer = this.svg.append('g').classed(styles.barChartXaxis, true);
        this.yAxisContainer = this.svg.append('g').classed(styles.barChartYaxis, true);
        this.barGroup = this.svg.append('g').classed(styles.barGroup, true);

        this.svg.attr(
            "transform",
            `translate(${chartSettings.padding} ${chartSettings.padding})`
        );
    }

    /**
     * Draws the bars for the emission of the top 10 countries
     * 
     * @param {number} currentYear Current year data tobe displayed
     */
    draw(currentYear) {
        const transition = this.svg
            .transition()
            .duration(300)
            .ease(d3.easeLinear)
        const elapsedTime = chartSettings.duration;
        const { innerHeight, ticksInXAxis, titlePadding } = chartSettings;
        const dataDecendingOrder = emissionData
            .filter((item) => (item.Year===currentYear
                && !item.Entity.includes('World')
                && item.Code))
            .sort((a,b) => b['Annual CO2']-a['Annual CO2']).slice(0, 10);

        this.upperlimit = getMaxValue(dataDecendingOrder, this.upperlimit);
        xAxisScale.domain([0, dataDecendingOrder[0]['Annual CO2']]);
        yAxisScale.domain(dataDecendingOrder.map(({ Entity }) => Entity));
        
        this.xAxisContainer.transition(transition)
            .attr("transform", `translate(0,10)`)
            .call(
                d3
                .axisTop(xAxisScale)
                .ticks(ticksInXAxis)
                .tickSize(-innerHeight)
                .tickFormat((d) => convertToText(d))
            );
        
        this.yAxisContainer
            .transition(transition)
            .call(d3.axisLeft(yAxisScale).tickSize(0));
        
        // Data Binding
        const barGroups = this.barGroup
            .selectAll(`.${styles.barContainer}`)
            .data(dataDecendingOrder, ({ Entity }) => Entity);

        // Enter selection - Adds new data to the bar chart
        const barGroupsEnter = barGroups
            .enter()
            .append("g")
            .classed(styles.barContainer, true)
            .attr("transform", `translate(0,0)`);

        barGroupsEnter
            .append("rect")
            .classed(styles.barRect, true)
            .attr("width", 0)
            .attr("height", '18px');

        barGroupsEnter
            .append("text")
            .classed(styles.barTitle, true)
            .attr("y", '13')
            .attr("x", -titlePadding)
            .text( ({ Entity }) => Entity);

        barGroupsEnter
            .append("text")
            .classed(styles.barValue, true)
            .attr("y", '13')
            .attr("x", titlePadding);


        // Update selection
        const barUpdate = barGroupsEnter.merge(barGroups);

        barUpdate
            .transition(transition)
            .attr("transform", ({ Entity }) => `translate(0,${yAxisScale(Entity)})`)
            .attr("fill", "normal");

        barUpdate
            .select(`.${styles.barRect}`)
            .transition(transition)
            .attr("width", (d) => xAxisScale(d['Annual CO2']));

        barUpdate
            .select(`.${styles.barTitle}`)
            .transition(transition)
            .attr("x", (d) => xAxisScale(d['Annual CO2']) - titlePadding);

        barUpdate
            .select(`.${styles.barValue}`)
            .transition(transition)
            .attr("x", (d) => xAxisScale(d['Annual CO2']) + titlePadding)
            .tween("text", (d) => {
                const interpolateStartValue =
                elapsedTime === chartSettings.duration
                    ? this.currentValue || 0
                    : +this.innerHTML;

                const interpolate = d3.interpolate(interpolateStartValue, d['Annual CO2']);
                this.currentValue = d['Annual CO2'];

                return function(t) {
                d3.select(this).text(convertToText(interpolate(t)));
                };
            });
        
        // Exit selection - Works on element whose data is not binded anymore
        const bodyExit = barGroups.exit();

        bodyExit
            .transition(transition)
            .attr("transform", `translate(0,${innerHeight})`)
            .on("end", function() {
                d3.select(this).attr("fill", "none");
            });

        bodyExit
            .select(".column-title")
            .transition(transition)
            .attr("x", 0);

        bodyExit
            .select(".column-rect")
            .transition(transition)
            .attr("width", 0);

        bodyExit
            .select(".column-value")
            .transition(transition)
            .attr("x", titlePadding)
            .tween("text", function() {
                const interpolate = d3.interpolate(this.currentValue, 0);
                this.currentValue = 0;

                return function(t) {
                    d3.select(this).text(Math.ceil(interpolate(t)));
                };
            });

    }
}

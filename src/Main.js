"use strict";
import * as d3 from 'd3';
import styles from './styles/styles';
import Map from './Map';
import ColorCodes from './ColorCodes';
import Progress from './Progress';
import BarChart from './BarChart';

const initiate = (config) => {
    config.svg = null;
    config.headerSvg = null;
    config.map = null;
    config.progressBarSvg = null;
}

const loadHeader = (svg) => {
    const headerSvg = svg.append("svg")
        .classed(styles.header, true)
        .append('text')
        .attr('x', 10)
        .attr('y', 25)
        .attr('width', '100%')
        .text('Cummulative CO2 emissions, 2017');
    return headerSvg;
}

/**
 * The main class, which will be loaded at application launch
 */
export default class Main {
    constructor() {
        initiate(this);
        this.generateView = this.generateView.bind(this);
        this.setYear = this.setYear.bind(this);

        this.generateView();
    }

    generateView() {
        this.svg = d3.select('#app')
            .append('div')
            .attr('width', '100%')
            .classed('base-style', true);

            d3.select('#app').append('div').classed(styles.mapToolTip, true);
        this.headerSvg = loadHeader(this.svg);

        const visualContainer = this.svg.append('div').classed(styles.visualContainer, true);

        // Create Map
        this.map = new Map(visualContainer);

        // Add color ranges
        ColorCodes(this.svg, this.map.highlightLevel);
        this.progressBarSvg = new Progress(this.svg, this.setYear);

        this.barChart = new BarChart(visualContainer);
        // setTimeout(this.barChart.draw(2017), 200000)

    }

    setYear(year) {
        // Load data for the year
        this.headerSvg.transition().text(`Cummulative CO2 emissions, ${year}`)
        this.map.loadDataForYear(year);
        this.barChart.draw(year);
    }
}
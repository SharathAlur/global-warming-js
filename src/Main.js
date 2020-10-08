"use strict";
import * as d3 from 'd3';
import styles from './styles/styles';
import Map from './Map';
import data from './data/CO2-Emissions-Country-Wise.csv';

// console.log('--------', csvfile)
const initiate = (config) => {
    config.svg = null;
    config.headerSvg = null;
    config.map = null;
    config.warmSvg = null;
    config.progressBarSvg = null;
}

const loadHeader = (svg) => {
    const headerSvg = svg.append("g")
        .classed(styles.header, true)
        .append('text');
        // .html("<span>Cummulative CO<sub>2</sub> emissions, 2017</span>");
    headerSvg
        .attr('x', 10)
        .attr('y', 25)
        .text('Cummulative CO2 emissions, 2017');
    return headerSvg;
}

export default class Main {
    constructor() {
        initiate(this);
        this.generateView();
    }

    generateView() {
        this.svg = d3.select('#app')
            .append('svg')
            .attr('height', 700)
            .attr('width', '100%')
            .attr('dx',10)
            .classed('base-style', true);
        this.headerSvg = loadHeader(this.svg);
        this.map = new Map(data);
        this.map.loadMap(this.svg);
    }
}
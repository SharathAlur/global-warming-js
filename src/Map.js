"use strict";
import * as d3 from 'd3';
import * as topojson from 'topojson';
import emissionData from './data/CO2-Emissions-Country-Wise.csv';
import styles from './styles/styles';
import { getEmissionLevel, getEmissionValue } from './helpers/dataUtils';
import { mouseEnter, mouseExit, mouseMove} from './helpers/tooltip';
import LineChart from './LineChart';
import { openPopup } from './helpers/popup';

const initialize = (config) => {
    config.svg = null;
    config.countriesSvg = {};
}
const projection = d3.geoMercator().translate([400, 350]).scale(120);

/**
 * Creates Global Map.
 * Has helper functions to load the emission data to the map.
 */
export default class Map {
    constructor(svg) {
        initialize(this);
        this.loadMap = this.loadMap.bind(this);
        this.drawMap = this.drawMap.bind(this);
        this.loadDataForYear = this.loadDataForYear.bind(this);
        this.highlightLevel = this.highlightLevel.bind(this);

        this.loadMap(svg);
    }

    /**
     * Loads the map on the view
     * 
     * @param {d3.Selection} svg The map to load on
     */
    loadMap(svg) {
        this.svg = svg
            .append('svg')
            .classed(styles.map, true);
        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
            .then(this.drawMap);
    }

    /**
     * Draws the map using the topojson passed in
     * 
     * @param {Object} data Topojson object for the world map
     */
    drawMap(data) {
        const countries = topojson.feature(data, data.objects.countries).features;
        this.svg.selectAll(`.${styles.mapCountry}`)
            .data(countries)
            .enter()
            .append("path")
            .attr('aria-label', country => country.properties.name)
            .attr('aria-selected', false)
            .attr('aria-level', 0)
            .attr('aria-valuenow', undefined)
            .classed(styles.mapCountry, true)
            .attr('d', d3.geoPath().projection(projection))
            .on('click', openPopup)
            .on('mouseenter', mouseEnter)
            .on('mouseleave',mouseExit)
            .on('mousemove',mouseMove);
    }

    /**
     * Loads data for the year
     * @param {Number} year
     */
    loadDataForYear(year) {
        const filteredData = emissionData.filter(item => item.Year===year);

        d3.selectAll(`.${styles.mapCountry}`)
            .transition()
            .duration(50)
            .attr('aria-level', 
                getEmissionLevel(filteredData)
            )
            .attr('aria-valuenow', getEmissionValue(filteredData));
    }

    /**
     * Highlights the countries in pertucular level of emission
     * 
     * @param {Number} level to be highlighted
     */
    highlightLevel(level) {
        this.svg.selectAll(`.${styles.mapCountry}`).attr('aria-selected', false);
        this.svg.selectAll(`path[aria-level="${level}"]`).attr('aria-selected', true);
    }
}
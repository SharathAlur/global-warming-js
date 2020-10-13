"use strict";
import * as d3 from 'd3';
import * as topojson from 'topojson';
import emissionData from './data/CO2-Emissions-Country-Wise.csv';
import styles from './styles/styles';
import { getEmissionLevel, getEmissionValue } from './helpers/dataUtils';
import { mouseEnter, mouseExit, mouseMove} from './helpers/tooltip';

const initialize = (config, mapLoaded) => {
    config.svg = null;
    config.countriesSvg = {};
    config.mapLoaded = mapLoaded;
}
const projection = d3.geoMercator().translate([400, 350]).scale(120);

/**
 * Creates Global Map.
 * Has helper functions to load the emission data to the map.
 */
export default class Map {
    constructor(svg, mapLoaded) {
        initialize(this, mapLoaded);
        this.loadMap = this.loadMap.bind(this);
        this.drawMap = this.drawMap.bind(this);
        this.loadDataForYear = this.loadDataForYear.bind(this);
        this.highlightLevel = this.highlightLevel.bind(this);

        this.loadMap(svg);
    }

    // Load initial map
    loadMap(svg) {
        const mapSvg = svg
            .append('svg')
            .classed(styles.map, true)
            .attr('y', 30)
        this.svg = mapSvg;
        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
            .then(this.drawMap);
    }

    // Draws map
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
            .on('mouseenter', mouseEnter)
            .on('mouseleave',mouseExit)
            .on('mousemove',mouseMove)
        this.mapLoaded();
    }

    // Loads the data for the year passed as argument
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

    // Highlights the selected emission level
    highlightLevel(level) {
        this.svg.selectAll(`.${styles.mapCountry}`).attr('aria-selected', false);
        this.svg.selectAll(`path[aria-level="${level}"]`).attr('aria-selected', true);
    }
}
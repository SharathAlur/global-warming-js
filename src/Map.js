"use strict";
import * as d3 from 'd3';
import * as topojson from 'topojson';
import styles from './styles/styles';
import { getEmissionLevel, getEmissionValue } from './helpers/dataUtils';
import { mouseEnter, mouseExit, mouseMove} from './helpers/tooltip';

const initialize = (config, data, mapLoaded) => {
    config.svg = null;
    config.countriesSvg = {};
    config.emissionData = data;
    config.mapLoaded = mapLoaded;
}
const projection = d3.geoMercator().translate([400, 350]).scale(120);

export default class Map {
    constructor(svg, data, mapLoaded) {
        initialize(this, data, mapLoaded);
        this.loadMap = this.loadMap.bind(this);
        this.drawMap = this.drawMap.bind(this);
        this.loadDataForYear = this.loadDataForYear.bind(this);
        this.highlightLevel = this.highlightLevel.bind(this);

        this.loadMap(svg);
    }

    loadMap(svg) {
        const mapSvg = svg
            .append('svg')
            .classed(styles.map, true)
            .attr('y', 30)
        this.svg = mapSvg;
        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
            .then(this.drawMap);
    }

    drawMap(data) {
        const countries = topojson.feature(data, data.objects.countries).features;
        this.svg.selectAll('.country')
            .data(countries)
            .enter()
            .append("path")
            .attr('aria-label', country => country.properties.name)
            .attr('aria-selected', false)
            .attr('aria-level', 0)
            .classed(styles.mapCountry, true)
            .attr('d', d3.geoPath().projection(projection))
            .on('mouseenter', mouseEnter)
            .on('mouseleave',mouseExit)
            .on('mousemove',mouseMove)
        this.mapLoaded();
    }

    loadDataForYear(year) {
        console.log(this.svg.popup())
        const filteredData = this.emissionData.filter(item => item.Year===year);

        d3.selectAll(`.${styles.mapCountry}`)
            .transition()
            .duration(50)
            .attr('aria-level', 
                getEmissionLevel(filteredData)
            )
            .attr('aria-valuenow', getEmissionValue(filteredData));
    }

    highlightLevel(level) {
        this.svg.selectAll(`.${styles.mapCountry}`).attr('aria-selected', false);
        this.svg.selectAll(`path[aria-level="${level}"]`).attr('aria-selected', true);
    }
}
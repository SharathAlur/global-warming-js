"use strict";
import * as d3 from 'd3';
import * as topojson from 'topojson';
import styles from './styles/styles';

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
        this.getEmissionLevel = this.getEmissionLevel.bind(this);
        this.highlightLevel = this.highlightLevel.bind(this);

        this.loadMap(svg);
    }

    getEmissionLevel(filteredData) {
        return ((d) => {
            const countryEmission = filteredData.find(data => d.properties.name === data.Entity);
            let emissionStatusColor;
            if (!countryEmission) {
                emissionStatusColor = 0;
            } else if (countryEmission['Annual CO2'] < 50000000) {
                emissionStatusColor = 1;
            } else if (countryEmission['Annual CO2'] < 500000000) {
                emissionStatusColor = 2;
            } else if (countryEmission['Annual CO2'] < 5000000000) {
                emissionStatusColor = 3;
            } else if (countryEmission['Annual CO2'] < 50000000000) {
                emissionStatusColor = 4;
            } else if (countryEmission['Annual CO2'] < 10000000000) {
                emissionStatusColor = 5;
            } else if (countryEmission['Annual CO2'] < 25000000000) {
                emissionStatusColor = 6;
            } else if (countryEmission['Annual CO2'] < 40000000000) {
                emissionStatusColor = 7;
            }
            return emissionStatusColor;
        })
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
            .on('mouseenter', d => d3.select(d.path[0]).attr('aria-selected', true))
            .on('mouseleave', d => d3.select(d.path[0]).attr('aria-selected', false));
        this.mapLoaded();
    }

    loadDataForYear(year) {
        const filteredData = this.emissionData.filter(item => item.Year===year);

        d3.selectAll(`.${styles.mapCountry}`)
            .transition()
            .duration(50)
            .attr('aria-level', 
                this.getEmissionLevel(filteredData)
            );
    }

    highlightLevel(level) {
        this.svg.selectAll(`.${styles.mapCountry}`).attr('aria-selected', false);
        this.svg.selectAll(`path[aria-level="${level}"]`).attr('aria-selected', true);
    }
}
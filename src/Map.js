"use strict";
import * as d3 from 'd3';
import * as topojson from 'topojson';
import styles from './styles/styles';
import { getEmissionLevel, getEmissionValue, convertToText } from './helper';

const initialize = (config, data, mapLoaded) => {
    config.svg = null;
    config.countriesSvg = {};
    config.emissionData = data;
    config.mapLoaded = mapLoaded;
}
const projection = d3.geoMercator().translate([400, 350]).scale(120);

const mouseEnter = (d) => {
    const countrySvg = d.path[0];
    const country = countrySvg.getAttribute('aria-label');
    const emission = countrySvg.getAttribute('aria-valuenow') ;
    d3.select(countrySvg).attr('aria-selected', true);
    const tooltip = d3.select(`.${styles.mapToolTip}`)
        .style('opacity', '0.9')
        .style('left',`${d.pageX}px`)
        .style('top',`${d.pageY}px`);
        
    tooltip.append('text')
        .style('width', '100%')
        .text(country);

    tooltip.append('text')
        .text(convertToText(emission))
        .style('margin-top', '10px')
        .style('font-size', '12px')
        .attr('y', '1rem');
}

const mouseExit = (d) => {
    d3.select(d.path[0]).attr('aria-selected', false);
    d3.select(`.${styles.mapToolTip}`)
        .style('opacity', '0')
        .selectAll('*')
        .remove();

}

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
        this.mapLoaded();
    }

    loadDataForYear(year) {
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
import * as d3 from 'd3';
import * as topojson from 'topojson';
import styles from './styles/styles';
import { CRITICAL_COLORS } from './constants';

const initialize = (config, data) => {
    config.svg = null;
    config.countriesSvg = {};
    config.emissionData = data;
}
const projection = d3.geoMercator().translate([400, 350]).scale(120);
    
const selectCountry = path => d3.select(path).classed(styles.selected, true);

const deselectCountry = path => d3.select(path).classed(styles.selected, false);


export default class Map {
    constructor(data) {
        initialize(this, data);
        this.drawMap = this.drawMap.bind(this);
        this.loadDataForYear = this.loadDataForYear.bind(this);
        this.getEmissionColor = this.getEmissionColor.bind(this);
    }

    getEmissionColor(filteredData) {
        return ((d) => {
            const countryEmission = filteredData.find(data => d.properties.name === data.Entity);
            let emissionStatusColor = CRITICAL_COLORS.LEVEL0;
            if (!countryEmission) {
                emissionStatusColor = CRITICAL_COLORS.LEVEL0;
            } else if (countryEmission['Annual CO2'] < 50000000) {
                emissionStatusColor = CRITICAL_COLORS.LEVEL1;
            } else if (countryEmission['Annual CO2'] < 500000000) {
                emissionStatusColor = CRITICAL_COLORS.LEVEL2;
            } else if (countryEmission['Annual CO2'] < 5000000000) {
                emissionStatusColor = CRITICAL_COLORS.LEVEL3;
            } else if (countryEmission['Annual CO2'] < 50000000000) {
                emissionStatusColor = CRITICAL_COLORS.LEVEL4;
            } else if (countryEmission['Annual CO2'] < 10000000000) {
                emissionStatusColor = CRITICAL_COLORS.LEVEL2;
            } else if (countryEmission['Annual CO2'] < 25000000000) {
                emissionStatusColor = CRITICAL_COLORS.LEVEL6;
            } else if (countryEmission['Annual CO2'] < 40000000000) {
                emissionStatusColor = CRITICAL_COLORS.LEVEL7;
            }
            return emissionStatusColor;
        })
    }

    loadMap(svg) {
        const mapSvg = svg
            .append('g')
            .classed(styles.map, true)
            .append('svg')
            .attr('y', 30)
            .attr('height', 500);
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
            .classed(styles.mapCountry, true)
            .attr('d', d3.geoPath().projection(projection))
            .on('mouseenter', d => selectCountry(d.path[0]))
            .on('mouseleave', d => deselectCountry(d.path[0]));
            this.loadDataForYear(2001);
    }

    loadDataForYear(year) {
        const filteredData = this.emissionData.filter(item => item.Year===year);
        console.log(filteredData.find(item => {console.log(item);return item.Entity === "india";}))
        const temp = d3.selectAll(`.${styles.mapCountry}`)//.each((item, b) => console.log('******',item))

        temp.transition().style('fill', this.getEmissionColor(filteredData));
        // temp.each(tester)
        // .data(filteredData)
        // .enter()
        // .attr('aria-level', (row) => {console.log(row); return 1});
    }
}
import * as d3 from 'd3';

/**
 * Finds the upper limit for the data provided
 * 
 * @param {Array} data Data to be parsed
 * @param {Number} prev Previous max value
 * 
 * @returns {Number} upper limit
 */
export const getMaxValue = (data, prev = 0) => {
    console.log(d3.max(data, d => d['Annual CO2']))
    const [min, max] = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d['Annual CO2'])])
        .nice()
        .domain();
        console.log(d3.max(data, d => d['Annual CO2']), min, max, prev, Math.max(prev, max))
    return Math.max(prev, max);
}
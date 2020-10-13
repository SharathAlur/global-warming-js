import * as d3 from 'd3';

export const getMaxValue = (data, prev = 0) => {
    const [min, max] = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d['Annual CO2'])])
        .nice()
        .domain();
    return Math.max(prev, max);
}

export const getTickValues = (max) => {
    const tickValues = [];
    const interval = max / 10;

    for (let index = 0; index <= 10; index++) {
        tickValues.push(interval * index);
    }

    return tickValues;
}
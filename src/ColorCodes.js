import * as d3 from 'd3';
import styles from './styles/styles';
import { ranges, convertToText } from './helpers/dataUtils';

/**
 * Creates the color code for the emission criticality
 * 
 * @param {d3.selection} svg Node in which, the color code to be drawn
 * @param {Function} highlightLevel Call back function to highlight the level on mouse hover
 */
const colorCodes = (svg, highlightLevel) => {
    const local = svg.append('div').classed(styles.colorCodeDiv, true);

    // Add range text
    const colorRanges = ['no data', ...ranges]
    const textSvg = local.append('ul').classed(styles.colorCodeUl, true);
    textSvg.selectAll(styles.rangeLabel)
        .data(colorRanges)
        .enter()
        .append('li').classed(styles.colorCodeli, true)
        .append('text')
        .classed(styles.rangeLabel, true)
        .classed(styles.noDataLabel, (d) => d === 'no data')
        .text( (d) => convertToText(d));

    // Add color ranges
    const colorsSvg = local.append('ul').classed(styles.colorCodeUl, true);
    d3.range(0, 8, 1).map((value) => (
        colorsSvg.append('li')
        .classed(styles.colorCodeli, true)
        .append('div')
        .classed(styles.colorBox, true)
        .attr('width', 100)
        .attr('height', 10)
        .attr('x', 0)
        .attr('y', 0)
        .attr('aria-level', value)
        .on('mouseenter', (d) => highlightLevel(d.path[0].getAttribute('aria-level')))
        .on('mouseleave', (d) => highlightLevel(-1))
    ));
}

export default colorCodes;
import * as d3 from 'd3';
import styles from './styles/styles';

export default class ColorCodes {
    constructor(svg, highlightLevel) {
        this.highlightLevel = highlightLevel;
        this.createColorCode = this.createColorCode.bind(this);
        this.createColorCode(svg);
    }

    createColorCode(svg) {
        const local = svg.append('div').classed(styles.colorCodeDiv, true);

        const ranges = ['no data','0 t', '50 million t', '500 million t', '5 billion t', '50 billion t', '100 billion t', '250 billion t', '400 billion t']
        this.textSvg = local.append('ul').classed(styles.colorCodeUl, true);
        this.textSvg.selectAll(styles.rangeLabel)
            .data(ranges)
            .enter()
            .append('li').classed(styles.colorCodeli, true)
            .append('text')
            .classed(styles.rangeLabel, true)
            .classed(styles.noDataLabel, d => d === 'no data')
            .text( d => d);

        this.colorsSvg = local.append('ul').classed(styles.colorCodeUl, true);
        d3.range(0, 8, 1).map((value) => {
            this.colorsSvg.append('li').classed(styles.colorCodeli, true).append('div')
            .classed(styles.colorBox, true)
            .attr('width', 100)
            .attr('height', 10)
            .attr('x', 0)
            .attr('y', 0)
            .attr('aria-level', value)
            .on('mouseenter', d => this.highlightLevel(d.path[0].getAttribute('aria-level')))
            .on('mouseleave', d => this.highlightLevel(-1));
        });
    }
}
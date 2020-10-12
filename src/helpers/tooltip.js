import * as d3 from 'd3';
import { convertToText } from './dataUtils';
import styles from '../styles/styles';

export const mouseEnter = (d) => {
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

export const mouseExit = (d) => {
    d3.select(d.path[0]).attr('aria-selected', false);
    d3.select(`.${styles.mapToolTip}`)
        .style('opacity', '0')
        .selectAll('*')
        .remove();

}

export const mouseMove = (d) => {
    d3.select(`.${styles.mapToolTip}`)
        .style('left',`${d.pageX}px`)
        .style('top',`${d.pageY}px`);
}
"use strict";
import * as d3 from 'd3';
import LineChart from '../LineChart';
import styles from '../styles/styles';

/**
 * Opens the popup with line chart for the country
 * 
 * @param {object} d Mouse click event
 */
export const openPopup = (d) => {
    d3.select('.modal').transition().style('display', 'block');
    d3.select('.close').on('click', closePopup);
    const line = new LineChart('.modal-content', d.path[0].getAttribute('aria-label'));
    line.drawLine(d.path[0].getAttribute('aria-label'));
}
/**
 * Closes the popup opened
 */
export const closePopup = () => {
    d3.select('#modal').transition().style('display', 'none');
    d3.select(`.${styles.lineChartSvg}`).remove();
}
/**
 * When the user clicks anywhere outside of the modal, close it
 *
 * @param {object} event Mouse click event
 */
window.onclick = (event) => {
    if (event.target === 'modal') {
        closePopup();
    }
  }
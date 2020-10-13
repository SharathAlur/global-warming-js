"use strict";
import sinon from "sinon";
import Map from '../src/Map';
import styles from '../src/styles/styles';
import * as d3 from 'd3';
import { fetchAllElementsByClass, fetchElementByClass } from './helper';

describe('Map', () => {
    let mapContainer = null;
    let temp = null;
    beforeEach(() => {
        mapContainer = document.createElement("div");
        mapContainer.id = "test_code";
        mapContainer.setAttribute(
            "style",
            "width: 1024px; height: 400px;"
        );
        mapContainer.setAttribute(
            "class",
            "test_code"
        );
        document.body.appendChild(mapContainer);
        temp = d3.select('#test_code')
            .append('svg')
            .classed('tester', true);
    })
    afterEach(() => {
        document.body.innerHTML = "";
    });
    it('should create a map containing multiple countries', () => {
        const onMapLoadedCallBack = sinon.spy();
        const mapObj = new Map(temp, onMapLoadedCallBack);

        const map  = fetchElementByClass(document, styles.map);
        expect(map).not.toBe(null);
    });
});
"use strict";
import sinon from "sinon";
import ColorCode from '../src/ColorCodes';
import styles from '../src/styles/styles';
import * as d3 from 'd3';
import { fetchAllElementsByClass, triggerEvent } from './helper';

describe('Color codes', () => {
    let colorCodeContainer = null;
    let temp = null;
    beforeEach(() => {
        colorCodeContainer = document.createElement("div");
        colorCodeContainer.id = "test_code";
        colorCodeContainer.setAttribute(
            "style",
            "width: 1024px; height: 400px;"
        );
        colorCodeContainer.setAttribute(
            "class",
            "test_code"
        );
        document.body.appendChild(colorCodeContainer);
        temp = d3.select('#test_code')
            .append('svg')
            .classed('tester', true);
    })
    afterEach(() => {
        document.body.innerHTML = "";
    });
    it('should have 7 color codes along with no data', () => {
        ColorCode(temp);

        const colorCodeList = fetchAllElementsByClass(document,styles.colorCodeUl)[1];
        const colorBoxList = fetchAllElementsByClass(colorCodeList, styles.colorBox);
        
        expect(colorBoxList.length).toBe(8);
        for(let i = 0; i < colorBoxList.length; i++) {
            expect(colorBoxList[i].getAttribute("aria-level")).toBe(`${i}`)
        }
    });
    it('should invoke hightlightLevel menthod on hover of a color box', () => {
        const highlightLevel = sinon.spy();
        const level = 2;
        ColorCode(temp, highlightLevel);

        const colorBox = fetchAllElementsByClass(
            fetchAllElementsByClass(document,styles.colorCodeUl)[1],
            styles.colorBox
        )[level];
        triggerEvent(colorBox, "mouseenter", () => {
            expect(highlightLevel).toHaveBeenCalled();
            done();
        });
    })
})
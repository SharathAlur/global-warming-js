"use strict";
import sinon from "sinon";
import Progress from '../src/Progress';
import styles from '../src/styles/styles';
import * as d3 from 'd3';
import { fetchElementByClass, triggerEvent } from "./helper";

describe('Progress bar', () => {
    let progressBarContainer = null;
    let temp = null;
    beforeEach(() => {
        progressBarContainer = document.createElement("div");
        progressBarContainer.id = "test_code";
        // progressBarContainer.classed('test_color_code', true);
        progressBarContainer.setAttribute(
            "style",
            "width: 1024px; height: 400px;"
        );
        progressBarContainer.setAttribute(
            "class",
            "test_code"
        );
        document.body.appendChild(progressBarContainer);
        temp = d3.select('#test_code')
            .append('svg')
            .classed('tester', true);
    })
    afterEach(() => {
        document.body.innerHTML = "";
    });
    it('should create a progress bar and play/pause button', () => {
        const progress = new Progress(temp);

        const playPauseBtn  = fetchElementByClass(document, styles.progressButton);
        expect(playPauseBtn).not.toBe(null);

        const progressBar  = fetchElementByClass(document, styles.progressBar);
        expect(progressBar).not.toBe(null);
    });
    it('should start timer on click of play button and calls setYearCallBack on every tick', () => {
        const setYearCallBack = sinon.spy();
        const progress = new Progress(temp, setYearCallBack);

        const playPauseBtn  = fetchElementByClass(document, styles.progressButton);
        triggerEvent(playPauseBtn, 'click', () => {
            expect(progress.timer).not.toBe(null);
            expect(setYearCallBack).toHaveBeenCalled();
        });
    });
    it('should stop timer on second click of play/pause button', () => {
        const setYearCallBack = sinon.spy();
        const progress = new Progress(temp, setYearCallBack);

        const playPauseBtn  = fetchElementByClass(document, styles.progressButton);
        triggerEvent(playPauseBtn, 'click');
        triggerEvent(playPauseBtn, 'click', () => {
            expect(progress.timer).toBe(null);
        });
    });
    it('should stop timer when the year count reaches 2018', () => {
        const setYearCallBack = sinon.spy();
        const progress = new Progress(temp, setYearCallBack);
        progress.yearCounter = 2017;

        const playPauseBtn  = fetchElementByClass(document, styles.progressButton);
        triggerEvent(playPauseBtn, 'click', () => {
            expect(progress.timer).toBe(null);
        });
    });
})
import { IGaugeOptions } from './gaugeOptions';
import { Utils2 } from './utls';
import { Needle } from './needle';

import {
    AfterViewInit,
    Component,
    DoCheck,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'color-band-gauge',
    template: `<div style="height:100%;width:100%;" #container></div>`
})
export class GuageWithColorBandComponent implements AfterViewInit, OnInit, OnChanges, DoCheck {
    private svgHeight: number;
    private margin = {
        top: 20,
        right: 20,
        bottom: 40,
        left: 20
    };
    private needle: any;
    private valueLabel: any;
    private numSections: number;
    private chart: any;
    private barWidth: number;
    private gaugeInitDone: boolean = false;
    private needleLength: number;
    private needleCircleSize: number;
    private oldGaugeValue: number = 0;

    @ViewChild('container') container: ElementRef;
    @Input() options: IGaugeOptions;

    public ngAfterViewInit(): void {
        this.initGauge();
    }

    public ngOnInit(): void {
        this.checkInput();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        // if (this.gaugeInitDone) {
        //     if (changes['options'].currentValue) {
        //         this.drawNeedle(this.options.valuePercent);
        //     }
        // }
    }

    public ngDoCheck(): void {
        if (this.gaugeInitDone) {
            if (this.oldGaugeValue !== this.options.valuePercent) {
                this.drawNeedle(this.oldGaugeValue, this.options.valuePercent);
                this.oldGaugeValue = this.options.valuePercent;
            }
        }
    }



    private checkInput(): void {
        if (!this.options) {
            throw 'You must provide gauge options';
        }
        if (this.options.bandColor && this.options.bandPercent) {
            if (this.options.bandColor.length !== this.options.bandPercent.length) {
                throw 'The number of elements in band colors must match the number of elements in band values';
            }
        }
        if (!this.options.bandPercent || this.options.bandPercent.length == 0) {
            throw 'You must provide an array of percentage values';
        }
    }

    private animateLabel(prevValue: number, targetValue: number): void {
        if (this.valueLabel) {
            this.valueLabel.transition()
                .delay(500)
                .ease(d3.easeExpOut)
                .duration(2000)
                .tween('text', () => {
                    let i = d3.interpolate(prevValue, targetValue);
                    return (t => {
                        this.valueLabel.text(i(t).toFixed(0));
                    });

                });
        }
    }

    private initNeedle(): void {
        this.needleLength = (this.svgHeight - this.margin.left - this.margin.right - this.barWidth) - 55;
        this.needleCircleSize = this.svgHeight * 0.07;
        if (!this.needle) {
            this.needle = new Needle(this.needleLength, this.needleCircleSize);
        }
    }

    private resetNeedle(): void {
        this.needle.DrawOn(this.chart, 0);
    }
    private drawNeedle(lastPercent: number, currPercent: number): void {
        if (this.valueLabel) {
            const currValue = currPercent * this.options.maxValue;
            const lastValue = lastPercent * this.options.maxValue;
            this.animateLabel(lastValue, currValue);
        }
        this.needle.AnimatedOn(this.chart, lastPercent, currPercent, this.numSections);

    }

    private initGauge(): void {
        let arc, arcEndRad, arcStartRad, chartInset, el, endPadRad, height;
        let i, padRad, radius, ref, sectionIndx;
        let sectionPerc, startPadRad, svg, totalPercent, width;


        this.numSections = this.options.bandPercent.length;
        sectionPerc = 1 / this.numSections / 2;
        padRad = 0.05;
        chartInset = 10;
        totalPercent = .75;
        el = d3.select(this.container.nativeElement);

        width = this.container.nativeElement.offsetWidth - this.margin.left - this.margin.right;
        height = width;
        radius = Math.min(width, height) / 2;
        this.svgHeight = height / 2 + this.margin.top + this.margin.bottom;
        svg = el.append('svg').attr('width', width + this.margin.left + this.margin.right).attr('height', this.svgHeight);
        this.chart = svg.append('g')
            .attr('transform', 'translate(' + ((width + this.margin.left) / 2) + ', ' + ((height + this.margin.top) / 2) + ')');
        this.barWidth = (this.svgHeight - this.margin.top - this.margin.bottom) * .3; // 40;

        for (sectionIndx = i = 1, ref = this.numSections; 1 <= ref ? i <= ref : i >= ref; sectionIndx = 1 <= ref ? ++i : --i) {
            arcStartRad = Utils2.percToRad(totalPercent);
            arcEndRad = arcStartRad + Utils2.percToRad(sectionPerc);
            totalPercent += sectionPerc;
            startPadRad = sectionIndx === 0 ? 0 : padRad / 2;
            endPadRad = sectionIndx === this.numSections ? 0 : padRad / 2;
            arc = d3.arc()
                .outerRadius(radius - chartInset)
                .innerRadius(radius - chartInset - this.barWidth)
                .startAngle(arcStartRad + startPadRad)
                .endAngle(arcEndRad - endPadRad);
            let color = this.options.bandColor[sectionIndx - 1];
            this.chart.append('path').style('fill', color).attr('d', arc);
        }
        this.initNeedle();
        this.gaugeInitDone = true;
        this.resetNeedle();
        this.drawNeedle(0, this.options.valuePercent);

        const labelY = this.svgHeight - this.margin.top;

        if (this.options.minValue != null && this.options.minValue !== undefined) {
            svg.append('text')
                .attr('x', this.margin.left)
                .attr('y', labelY)
                .text(this.options.minValue);
        }
        if (this.options.maxValue != null && this.options.maxValue !== undefined) {
            svg.append('text')
                .attr('x', width - this.margin.right - this.margin.left)
                .attr('y', labelY)
                .text(this.options.maxValue);
        }
        if (this.options.unit != null && this.options.unit !== undefined) {
            this.valueLabel = svg.append('text')
                .attr('x', width / 2)
                .attr('y', labelY)
                .text(this.options.maxValue * this.options.valuePercent);
        }
    }



}
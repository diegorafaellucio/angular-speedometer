import {Utils2} from './utls';
import * as d3 from 'd3';

export class Needle {
    private length: number;
    private radius: number;

    // private lastValue: number;
    constructor(len: number, radius: number) {
        this.length = len;
        this.radius = radius;
        // this.lastValue = 0;
    }

    public DrawOn(el, perc): void {
        el.append('circle')
            .attr('class', 'needle-center')
            .attr('cx', 0).attr('cy', 0)
            .attr('r', this.radius);
        return el.append('path').attr('class', 'needle').attr('d', this.mkCmd(perc));
    }

    /// currValue in percentage
    public AnimatedOn(el, lastValue, currValue, sectionCount): void {
        let self;
        let valueChange = 0;
        if (lastValue !== currValue) {
            valueChange = currValue - lastValue;
        }
        if (valueChange === 0) {
            return;
        }

        self = this;
        let needleEle = el._groups[0][0].children[sectionCount + 1];
        return el.transition()
            .delay(500)
            .ease(d3.easeExpOut)
            .duration(2000)
            .selectAll('.needle')
            .tween('progress', () => {
                return (percentOfPercent) => {
                    let currFrameValue = lastValue + percentOfPercent * valueChange;
                    return d3.select(needleEle).attr('d', this.mkCmd(currFrameValue));
                };
            });
    }

    private mkCmd(perc) {
        let centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
        thetaRad = Utils2.percToRad(perc / 2);
        centerX = 0;
        centerY = 0;
        topX = centerX - this.length * Math.cos(thetaRad);
        topY = centerY - this.length * Math.sin(thetaRad);
        leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
        leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
        rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
        rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);

        return `M${leftX} ${leftY} L ${topX} ${topY} L ${rightX} ${rightY}`;


    }

}
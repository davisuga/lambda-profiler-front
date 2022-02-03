import React, { useState } from "react";
import { extent, max } from "d3-array";
import * as allCurves from "@visx/curve";
import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { scaleTime, scaleLinear } from "@visx/scale";
import {
  MarkerArrow,
  MarkerCross,
  MarkerX,
  MarkerCircle,
  MarkerLine
} from "@visx/marker";
import generateDateValue, {
  DateValue
} from "@visx/mock-data/lib/generators/genDateValue";

type CurveType = keyof typeof allCurves;

const lineCount = 3;
const series = new Array(lineCount).fill(null).map((_, i) =>
  // vary each series value deterministically
  generateDateValue(25, /* seed= */ i / 2).sort(
    (a: DateValue, b: DateValue) => a.date.getTime() - b.date.getTime()
  )
);
const allData = series.reduce((rec, d) => rec.concat(d), []);

// data accessors
const getX = (d: DateValue) => d.date;
const getY = (d: DateValue) => d.value;

// scales
const xScale = scaleTime<number>({
  domain: extent(allData, getX) as [Date, Date]
});
const yScale = scaleLinear<number>({
  domain: [0, max(allData, getY) as number]
});

export type CurveProps = {
  width: number;
  height: number;
  showControls?: boolean;
};

export default function Example({
  width,
  height,
  showControls = true
}: CurveProps) {
  const svgHeight = showControls ? height - 40 : height;
  const lineHeight = svgHeight / lineCount;

  // update scale output ranges
  xScale.range([0, width - 50]);
  yScale.range([lineHeight - 100, 0]);

  return (
    <div className="visx-curves-demo">
      <svg width={width} height={svgHeight}>
        <MarkerCircle id="marker-circle" fill="#333" size={2} refX={2} />
        {
          series.map((lineData, i) => {
            const even = i % 2 === 0;
            return (
              <Group key={`lines-${i}`} top={i * lineHeight} left={13}>
                {lineData.map((d, j) => (
                  <circle
                    key={i + j}
                    r={3}
                    cx={xScale(getX(d))}
                    cy={yScale(getY(d))}
                    stroke="rgba(33,33,33,0.5)"
                  />
                ))}
                <LinePath<DateValue>
                  curve={allCurves.curveNatural}
                  data={lineData}
                  x={(d) => xScale(getX(d)) ?? 0}
                  y={(d) => yScale(getY(d)) ?? 0}
                  stroke="#333"
                  strokeWidth={even ? 2 : 1}
                  strokeOpacity={even ? 0.6 : 1}
                  shapeRendering="geometricPrecision"
                  markerMid="url(#marker-circle)"
                />
              </Group>
            );
          })}
      </svg>
      <style jsx>{`
        .visx-curves-demo label {
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}

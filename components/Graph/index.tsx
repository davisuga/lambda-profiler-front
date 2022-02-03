import { ReactNode, useEffect, useState } from "react";
import * as Curve from "@visx/curve";

import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { LegendOrdinal } from "@visx/legend";

const purple1 = "#6c5efb";
const purple2 = "#c998ff";
const purple3 = "#a44afe";
const background = "#eaedff";
const defaultMargin = { top: 40, right: 0, bottom: 0, left: 0 };
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white",
};

import { Container } from "./styles";
import { LogContents, Logs } from "../../types/domain";
import { extent, max, min } from "d3-array";
import * as allCurves from "@visx/curve";
import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { scaleTime, scaleLinear } from "@visx/scale";
interface GraphProps {
  children?: ReactNode;
  data?: Logs;
  width?: number;
  height?: number;
} // data accessors
import generateDateValue, {
  DateValue,
} from "@visx/mock-data/lib/generators/genDateValue";

import { MarkerCircle } from "@visx/marker";
import { List } from "../../utils/data-structures";
// data accessors
const getX = (d: DateValue) => d;
const getY = (d: DateValue) => d;

// scales
const makeXScale = (data) =>
  scaleTime<number>({
    domain: [new Date(data?.get(0)), new Date(data?.get(-1))],
  });

const makeYScale = (data) =>
  scaleLinear<number>({
    domain: [5, max(data, getY) as number],
  });

let y = makeYScale(List());
let x = makeXScale(List());

type ScaleLinear = typeof y;
type ScaleTime = typeof x;

const getByIndex =
  (index: number) =>
  <A extends unknown>(arr: { get: (index: number) => A }) =>
    arr.get(index);

const fst = getByIndex(0);
const snd = getByIndex(1);

const thrd = getByIndex(2);

function Graph({ children, data, width, height }: GraphProps) {
  const [times, setTimes] = useState<List<number> | undefined>();
  const [resourceValues, setResourceValues] = useState<
    List<number> | undefined
  >();
  const [scales, setScales] = useState<{
    xScale: ScaleTime;
    yScale: ScaleLinear;
  }>();
  const { containerRef, TooltipInPortal } = useTooltipInPortal();
  const {
    tooltipOpen,
    tooltipTop,
    tooltipLeft,
    hideTooltip,
    showTooltip,
    tooltipData,
  } = useTooltip();
  useEffect(() => {
    if (!data) {
      return;
    }
    const xAxis = data.map(fst) as List<number>;
    setTimes(xAxis);
    const yAxis = data.map(thrd) as List<number>;
    setResourceValues(yAxis);
    const xScale = data && makeXScale(xAxis);
    const yScale = data && makeYScale(yAxis);

    // update scale output ranges
    xScale?.range([5, width]);
    yScale?.range([height, 5]);
    setScales({ xScale, yScale });
  }, [data]);

  return (
    <Container>
      <h1>Graph</h1>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div style={{ color: purple2 }}>
            <strong>{tooltipData.resource}</strong>
          </div>
          <div>{tooltipData.log}</div>
          <div>{tooltipData.time}</div>
        </TooltipInPortal>
      )}
      <svg ref={containerRef} width={width} 
          fill={purple1}
      
      height={height}>
        <MarkerCircle id="marker-circle" fill="#333" size={2} refX={2} />
        <Group>
          {scales &&
            resourceValues?.map((resourceVal, index) => {
              const info = {
                resourceVal: {
                  val: resourceVal,
                  scaled: scales.yScale(resourceVal),
                },
                index,
                time: {
                  val: times.get(index),
                  scaled: scales.xScale(times.get(index)),
                },
                currData: snd(data.get(index)),
              };
              return (
                <circle
                  key={index}
                  r={3}
                  cx={index * (width / resourceValues.size)}
                  cy={scales.yScale(resourceVal)}
                  stroke="rgba(255, 255, 255,0.5)"
                  onMouseEnter={(event) => {
                    hideTooltip();
                    console.log("mouse enter");
                    showTooltip({
                      tooltipTop: event.clientY ,
                      tooltipLeft: index * (width / resourceValues.size),
                      tooltipData: {
                        resource:
                          (info.resourceVal.val / 1024).toFixed(2) + " kB",
                        log: info.currData,
                        time: new Date(times.get(index)).toTimeString().slice(0,9),
                      },
                    });
                  }}
                />
              );
            })}
        </Group>
      </svg>
      {children}
    </Container>
  );
}

export default Graph;

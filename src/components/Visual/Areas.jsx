import React, { useMemo, useCallback } from 'react';
import { AreaClosed, Line, Bar } from '@visx/shape';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { curveMonotoneX } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
import { withTooltip, Tooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { max, extent } from 'd3-array';

import {
  formatDate,
  getDate,
  getRegistrationValue,
  getRegistrationYScale,
  bisectDate,
  tooltipStyles as defaultTooltipStyle,
  background,
  background2,
  accentColor,
  accentColorDark
} from 'utils/visx'

const AreasTooltip = withTooltip(
  ({
    // Override data
    data,
    titleTooltip = 'Total ',
    tooltipStyle = {},
    // Override style
    width,
    height,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }) => {
    const sortData = data ? data.sort((a, b) => {
      var dateA = new Date(a.date).getTime();
      var dateB = new Date(b.date).getTime();
  
      return dateA > dateB ? 1 : -1;  
    }) : []
    if (width < 10) return null;

    // bounds
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // scales
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(data, getDate),
        }),
      [innerWidth, margin.left],
    );
    const registValueScale = useMemo(
      () => scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [0, (max(data, getRegistrationValue) || 0) + innerHeight / 3],
        nice: true,
      }),
      [margin.top, innerHeight],
    );

    // tooltip handler
    const handleTooltip = useCallback(
      (event) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectDate(sortData, x0, 1);
        const d0 = sortData[index - 1];
        const d1 = sortData[index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: registValueScale(getRegistrationValue(d)),
        });
      },
      [showTooltip, registValueScale, dateScale],
    );

    return (
      <div className=' border border-solid border-grey-600 -ml-1 rounded-md'>
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="url(#area-background-gradient)"
            rx={14}
          />
          <LinearGradient id="area-background-gradient" from={background} to={background2} />
          <LinearGradient id="area-gradient" from={accentColor} to={accentColor} toOpacity={0.1} />
          <GridRows
            left={margin.left}
            scale={registValueScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0}
            pointerEvents="none"
          />
          <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0.2}
            pointerEvents="none"
          />
          <AreaClosed
            data={data}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => registValueScale(getRegistrationYScale(d)) ?? 0}
            yScale={registValueScale}
            strokeWidth={1}
            stroke="url(#area-gradient)"
            fill="url(#area-gradient)"
            curve={curveMonotoneX}
          />
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 12}
              left={tooltipLeft + 12}
              style={{
                ...defaultTooltipStyle,
                ...tooltipStyle // Can override style tooltip
              }}
            >
              {`${titleTooltip} ${getRegistrationValue(tooltipData)}`}
            </TooltipWithBounds>
            <Tooltip
              className="visx__tooltip"
              top={innerHeight + margin.top - 14}
              left={tooltipLeft}
              style={{
                ...defaultStyles
              }}
            >
              {formatDate(getDate(tooltipData))}
            </Tooltip>
          </div>
        )}
      </div>
    );
  },
);
const Areas = ({ loading, ...args }) => {

  return loading ? (
    <div className="skeleton w-full h-full" />

  ) : (<ParentSize>
    {({ width, height }) => (
      <AreasTooltip width={width} height={height} {...args} />
    )}
  </ParentSize>)
}

export default Areas;

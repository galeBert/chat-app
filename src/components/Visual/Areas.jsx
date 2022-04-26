import React, { useCallback, useMemo } from 'react';

import { curveMonotoneX } from '@visx/curve';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { GridColumns, GridRows } from '@visx/grid';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { scaleLinear, scaleTime } from '@visx/scale';
import { AreaClosed, Bar, Line } from '@visx/shape';
import {
  defaultStyles,
  Tooltip,
  TooltipWithBounds,
  withTooltip,
} from '@visx/tooltip';
import { extent, max } from 'd3-array';
import {
  accentColor,
  accentColorDark,
  background,
  background2,
  bisectDate,
  formatDate,
  getDate,
  getRegistrationValue,
  getRegistrationYScale,
  tooltipStyles as defaultTooltipStyle,
} from 'utils/visx';

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
    const sortData = data
      ? data.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();

          return dateA > dateB ? 1 : -1;
        })
      : [];
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
      [innerWidth, margin.left]
    );
    const registValueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top, margin.top],
          domain: [0, (max(data, getRegistrationValue) || 0) + innerHeight / 3],
          nice: true,
        }),
      [margin.top, innerHeight]
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
          d =
            x0.valueOf() - getDate(d0).valueOf() >
            getDate(d1).valueOf() - x0.valueOf()
              ? d1
              : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: registValueScale(getRegistrationValue(d)),
        });
      },
      [showTooltip, registValueScale, dateScale]
    );

    return (
      <div className=' border border-solid border-grey-600 -ml-1 rounded-md'>
        <svg height={height} width={width}>
          <rect
            fill='url(#area-background-gradient)'
            height={height}
            rx={14}
            width={width}
            x={0}
            y={0}
          />
          <LinearGradient
            from={background}
            id='area-background-gradient'
            to={background2}
          />
          <LinearGradient
            from={accentColor}
            id='area-gradient'
            to={accentColor}
            toOpacity={0.1}
          />
          <GridRows
            left={margin.left}
            pointerEvents='none'
            scale={registValueScale}
            stroke={accentColor}
            strokeDasharray='1,3'
            strokeOpacity={0}
            width={innerWidth}
          />
          <GridColumns
            height={innerHeight}
            pointerEvents='none'
            scale={dateScale}
            stroke={accentColor}
            strokeDasharray='1,3'
            strokeOpacity={0.2}
            top={margin.top}
          />
          <AreaClosed
            curve={curveMonotoneX}
            data={data}
            fill='url(#area-gradient)'
            stroke='url(#area-gradient)'
            strokeWidth={1}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => registValueScale(getRegistrationYScale(d)) ?? 0}
            yScale={registValueScale}
          />
          <Bar
            fill='transparent'
            height={innerHeight}
            onMouseLeave={() => hideTooltip()}
            onMouseMove={handleTooltip}
            onTouchMove={handleTooltip}
            onTouchStart={handleTooltip}
            rx={14}
            width={innerWidth}
            x={margin.left}
            y={margin.top}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                pointerEvents='none'
                stroke={accentColorDark}
                strokeDasharray='5,2'
                strokeWidth={2}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                fill='black'
                fillOpacity={0.1}
                pointerEvents='none'
                r={4}
                stroke='black'
                strokeOpacity={0.1}
                strokeWidth={2}
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                fill={accentColorDark}
                pointerEvents='none'
                r={4}
                stroke='white'
                strokeWidth={2}
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              left={tooltipLeft + 12}
              style={{
                ...defaultTooltipStyle,
                ...tooltipStyle, // Can override style tooltip
              }}
              top={tooltipTop - 12}
            >
              {`${titleTooltip} ${getRegistrationValue(tooltipData)}`}
            </TooltipWithBounds>
            <Tooltip
              className='visx__tooltip'
              left={tooltipLeft}
              style={{
                ...defaultStyles,
              }}
              top={innerHeight + margin.top - 14}
            >
              {formatDate(getDate(tooltipData))}
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
);
const Areas = ({ loading, ...args }) => {
  return loading ? (
    <div className='skeleton w-full h-full' />
  ) : (
    <ParentSize>
      {({ width, height }) => (
        <AreasTooltip height={height} width={width} {...args} />
      )}
    </ParentSize>
  );
};

export default Areas;

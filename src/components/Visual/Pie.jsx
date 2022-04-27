import React, { useState } from 'react';

import { Group } from '@visx/group';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { scaleOrdinal } from '@visx/scale';
import Pie from '@visx/shape/lib/shapes/Pie';
import { animated, interpolate, useTransition } from 'react-spring';

// accessor functions
const usage = (d) => d.usage;

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

const PieComponent = ({
  width,
  height,
  margin = defaultMargin,
  animate = true,
  pieThickness = 50,
  data = [],
  listOfColors = [],
}) => {
  const [selectedBrowser, setSelectedBrowser] = useState(null);

  if (width < 10) return null;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const donutThickness = pieThickness;

  // color scales
  const getBrowserColor = scaleOrdinal({
    domain: data.map(({ label }) => label),
    range: listOfColors.length
      ? listOfColors
      : [
          'rgba(255,255,255,0.7)',
          'rgba(255,255,255,0.6)',
          'rgba(255,255,255,0.5)',
          'rgba(255,255,255,0.4)',
          'rgba(255,255,255,0.3)',
          'rgba(255,255,255,0.2)',
          'rgba(255,255,255,0.1)',
        ],
  });

  return (
    <svg height={height} width={width}>
      <rect
        fill="url('#visx-pie-gradient')"
        height={height}
        rx={14}
        width={width}
      />
      <Group left={centerX + margin.left} top={centerY + margin.top}>
        <Pie
          cornerRadius={3}
          data={
            selectedBrowser
              ? data.filter(({ label }) => label === selectedBrowser)
              : data
          }
          innerRadius={radius - donutThickness}
          outerRadius={radius}
          padAngle={0.005}
          pieValue={usage}
        >
          {(pie) => (
            <AnimatedPie
              {...pie}
              animate={animate}
              getColor={(arc) => {
                const res = getBrowserColor(arc.data.label);
                return res;
              }}
              getKey={(arc) => arc.data.label}
              onClickDatum={({ data: { label } }) =>
                animate &&
                setSelectedBrowser(
                  selectedBrowser && selectedBrowser === label ? null : label
                )
              }
            />
          )}
        </Pie>
      </Group>
    </svg>
  );
};

const fromLeaveTransition = ({ endAngle }) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

function AnimatedPie({ animate, arcs, path, getKey, getColor, onClickDatum }) {
  const transitions = useTransition(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  });
  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

    return (
      <g key={key}>
        <animated.path
          // compute interpolated path d attribute from intermediate angle values
          d={interpolate(
            [props.startAngle, props.endAngle],
            (startAngle, endAngle) =>
              path({
                ...arc,
                startAngle,
                endAngle,
              })
          )}
          fill={getColor(arc)}
          onClick={() => onClickDatum(arc)}
          onTouchStart={() => onClickDatum(arc)}
        />
        {hasSpaceForLabel && (
          <animated.g style={{ opacity: props.opacity }}>
            <text
              dy='.33em'
              fill='white'
              fontSize={9}
              pointerEvents='none'
              textAnchor='middle'
              x={centroidX}
              y={centroidY}
            >
              {getKey(arc)}
            </text>
          </animated.g>
        )}
      </g>
    );
  });
}

const PieGraph = ({
  pieThickness,
  data,
  listOfColors,
  maxHeight = 300,
  ...args
}) => (
  <ParentSize>
    {({ width, height: heightParent }) => {
      const h = Math.min(heightParent, maxHeight);
      return (
        <PieComponent
          data={data}
          height={h}
          listOfColors={listOfColors}
          pieThickness={pieThickness}
          width={width}
          {...args}
        />
      );
    }}
  </ParentSize>
);

export default PieGraph;

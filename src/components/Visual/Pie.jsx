import React, { useState } from 'react';
import Pie from '@visx/shape/lib/shapes/Pie';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';
import { animated, useTransition, interpolate } from 'react-spring';

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
  listOfColors = []
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
    range: listOfColors.length ? listOfColors : [
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
    <svg width={width} height={height}>
      <rect rx={14} width={width} height={height} fill="url('#visx-pie-gradient')" />
      <Group top={centerY + margin.top} left={centerX + margin.left}>
        <Pie
          data={
            selectedBrowser ? data.filter(({ label }) => label === selectedBrowser) : data
          }
          pieValue={usage}
          outerRadius={radius}
          innerRadius={radius - donutThickness}
          cornerRadius={3}
          padAngle={0.005}
        >
          {(pie) => (
            <AnimatedPie
              {...pie}
              animate={animate}
              getKey={(arc) => arc.data.label}
              onClickDatum={({ data: { label } }) =>
                animate &&
                setSelectedBrowser(selectedBrowser && selectedBrowser === label ? null : label)
              }
              getColor={(arc) => {
                const res = getBrowserColor(arc.data.label)
                return res;
              }}
            />
          )}
        </Pie>
      </Group>
    </svg>
  );
}

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

function AnimatedPie({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
}) {
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
          d={interpolate([props.startAngle, props.endAngle], (startAngle, endAngle) =>
            path({
              ...arc,
              startAngle,
              endAngle,
            }),
          )}
          fill={getColor(arc)}
          onClick={() => onClickDatum(arc)}
          onTouchStart={() => onClickDatum(arc)}
        />
        {hasSpaceForLabel && (
          <animated.g style={{ opacity: props.opacity }}>
            <text
              fill="white"
              x={centroidX}
              y={centroidY}
              dy=".33em"
              fontSize={9}
              textAnchor="middle"
              pointerEvents="none"
            >
              {getKey(arc)}
            </text>
          </animated.g>
        )}
      </g>
    );
  });
}

const PieGraph = ({ pieThickness, data, listOfColors, maxHeight = 300, ...args }) => (
  <ParentSize>
    {({ width, height: heightParent }) => {
      const h = Math.min(heightParent, maxHeight);
      return (
        <PieComponent
          width={width}
          height={h}
          data={data}
          pieThickness={pieThickness}
          listOfColors={listOfColors}
          {...args}
        />
      )
    }}
  </ParentSize>
)

export default PieGraph;
import { defaultStyles } from '@visx/tooltip';
import { bisector } from 'd3-array';
import { timeFormat } from 'd3-time-format';

// util
export const formatDate = timeFormat("%b %d, '%y");

// accessors
export const getDate = (d) => new Date(d.date);
export const getRegistrationYScale = (d) => d.totalRegistration * 4;
export const getRegistrationValue = (d) => d.totalRegistration;
export const bisectDate = bisector((d) => new Date(d.date)).left;

// Background Colors
export const background = '#46374C';
export const background2 = '#46374C';
export const accentColor = '#7F57FF';
export const accentColorDark = '#7F57FF';
export const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};

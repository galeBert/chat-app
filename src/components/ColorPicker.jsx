import { useState } from 'react';

import { ChromePicker } from 'react-color';

const ColorPicker = ({ onChange }) => {
  const [color, setColor] = useState('#fff');

  const handlerOnChange = (updateColor) => {
    setColor(updateColor.hex);

    if (typeof onChange === 'function') onChange(updateColor);
  };
  return <ChromePicker color={color} disableAlpha onChange={handlerOnChange} />;
};

export default ColorPicker;

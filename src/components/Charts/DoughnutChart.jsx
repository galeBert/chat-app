import React from 'react';
import Pie from "components/Visual/Pie";


const DoughnutChart = ({ data }) => (
    <Pie
        pieThickness={60}
        data={data}
        listOfColors={[
            '#307BF4',
            '#7F57FF',
            '#FF0073',
            '#F6C059',
            'rgba(255,255,255,0.3)',
            'rgba(255,255,255,0.2)',
            'rgba(255,255,255,0.1)',
        ]}
    />

);

export default DoughnutChart;

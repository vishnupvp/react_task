import React from 'react';

const BarChart = ({ data, svgStyles }) => {
    let sorted = data.sort((a, b) => {
        return a.chartValue - b.chartValue
    })

    return (
        <div className="bar-chart">
            <svg style={svgStyles}>
                {sorted.map(({ chartValue }, index) => {
                    return (
                        <rect
                            x={1}
                            y={17 * index}
                            width="100%"
                            height="17"
                            fillOpacity="0.2"
                            className="bar"
                            key={`bar-${index}`}
                            transform={`scale(${Math.abs(chartValue)}, 1)`}
                        >
                        </rect>
                    )
                })}
            </svg>
        </div>
    );
};


export default BarChart; <div></div>
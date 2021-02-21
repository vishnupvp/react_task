import React from 'react';

const BarChart = ({ data }) => {
    return (
        <div className="bar-chart">
            <svg>
                {data.map(({ amount }, index) => {
                    return (
                        <rect
                            x={1}
                            y={17 * index}
                            width="100%"
                            height="17"
                            fillOpacity="0.2"
                            className="bar"
                            key={`bar-${index}`}
                            transform={`scale(${Math.abs(amount)}, 1)`}
                        >
                        </rect>
                    )
                })}
            </svg>
        </div>
    );
};


export default BarChart; <div></div>
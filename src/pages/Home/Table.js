import React from 'react';
import BarChart from './BarChart'

const Table = ({ isLoading, data, chartProps }) => {
    return (
        <div className="table">
            <div className="thead">
                <div className="trow">
                    <div className="tcell">

                    </div>
                    <div className="tcell">
                        Count
                                    </div>
                    <div className="tcell">
                        Amount
                                    </div>
                    <div className="tcell">
                        Total
                                    </div>
                    <div className="tcell">
                        Price
                                    </div>
                </div>
            </div>
            {isLoading ?
                <div className="loader">Loading..</div>
                :
                <div className="orders-body-wrap">
                    <div>
                        <div className="tbody">
                            {data.map(({ price, amount, count, total }, index) => {
                                return (
                                    <div className="trow" key={`row-${index}`}>
                                        <div className="tcell">
                                            <i className="fa fa-bell" aria-hidden="true"></i>
                                        </div>
                                        <div className="tcell">
                                            {count}
                                        </div>
                                        <div className="tcell">
                                            {amount}
                                        </div>
                                        <div className="tcell">
                                            {total}
                                        </div>
                                        <div className="tcell">
                                            {price}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <BarChart
                        {...chartProps}
                    />
                </div>
            }
        </div>
    );
};

export default Table;
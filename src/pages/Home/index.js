import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { updateOrders } from "redux/actions"
import './Home.scss'
import Table from "./Table"

const Home = () => {
    const orders = useSelector(({ orderBook }) => orderBook.list, shallowEqual)
    const dispatch = useDispatch()
    const [isLoading, setLoader] = useState(true)
    const [isCollapsed, setCollapse] = useState(false)

    const update = useCallback(
        (list) => {
            dispatch(updateOrders(list))
        },
        [dispatch]
    )

    let arr = []

    useEffect(() => {
        const socket = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

        const onOpen = () => {
            socket.send(JSON.stringify({
                "event": "subscribe",
                "channel": "book",
                "symbol": "tBTCUSD"
            }))
        }

        const onMessage = ({ data }) => {

            if (!Array.isArray(JSON.parse(data)))
                return;

            if (isLoading)
                setLoader(false)

            let [a, value] = JSON.parse(data)
            let [price, count, amount] = value

            if (count && amount > 0)
                arr.push({
                    price,
                    count,
                    amount
                })

            // limit the number of updates to redux 
            if (arr.length === 20) {
                update(arr)
                arr = []
            }

        }

        const onError = event => {
            console.log(event, "error")
        }

        // Connection opened
        socket.addEventListener('open', onOpen);
        // Listen for messages
        socket.addEventListener('message', onMessage);
        // Listen for errors
        socket.addEventListener('error', onError);


        return () => {
            socket.removeEventListener('open', onOpen)
            socket.removeEventListener('message', onMessage)
            socket.close()
        }

    }, [])

    const toggleCollapse = () => {
        setCollapse(!isCollapsed)
    }

    let tableData = orders.slice(0, 20)

    return (
        <div>
            <div className="container">
                <div className={`panel ${isCollapsed ? 'collapsed' : ''}`}>
                    <div className="header" onClick={toggleCollapse}>
                        <div>
                            <i className="fa fa-chevron-down fa-fw"></i>
                            <span>Order Book</span>
                            <span>&nbsp;</span>
                            <span>BTC/ USD</span>
                        </div>
                        <div className="widget-actions">
                            <button type="button">
                                <i className="fa fa-plus" aria-hidden="true"></i>
                            </button>
                            <button type="button">
                                <i className="fa fa-minus" aria-hidden="true"></i>
                            </button>
                            <button type="button">
                                <i className="fa fa-cog" aria-hidden="true"></i>
                            </button>
                            <button type="button">
                                <i className="fa fa-search-plus" aria-hidden="true"></i>
                            </button>
                            <button type="button">
                                <i className="fa fa-search-minus" aria-hidden="true"></i>
                            </button>


                        </div>
                    </div>
                    <div className="body">
                        <div className="d-flex">
                            <Table
                                data={tableData}
                                chartProps={{
                                    data: tableData,
                                    svgStyles: { fill: '#17B157', transform: 'scale(-1, 1)' }
                                }}
                                isLoading={isLoading}
                            />
                            <Table
                                data={tableData}
                                chartProps={{
                                    data: tableData,
                                    svgStyles: { fill: '#f05359', transform: 'scale(1, 1)' }
                                }}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                    <div className="footer">
                        <div>
                            <button className="btn-restore">
                                <i className="fa fa-window-restore" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div>
                            <ul className="d-flex">
                                <li>
                                    <button>
                                        <span>FULL BOOK</span>
                                    </button>
                                </li>
                                <li>
                                    <span className="data-status">
                                        <i className="fa fa-circle" aria-hidden="true"></i>
                                        <u>REAL-TIME</u>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
import React, { useEffect, useState, useCallback } from 'react';
import BarChart from './BarChart'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { updateOrders } from "redux/actions"
import './Home.scss'

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
            console.log(data, "message")

            if (!isLoading)
                setLoader(false)


            if (!Array.isArray(JSON.parse(data)))
                return;

            let [a, value] = JSON.parse(data)
            let [price, count, amount] = value

            if (count && amount > 0)
                arr.push({
                    price,
                    count,
                    amount
                })

            if (arr.length === 10) {
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
                    </div>
                    <div className="body">
                        <div className="table">
                            <div className="thead">
                                <div className="trow">
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
                                <div className="tbody">
                                    {orders.slice(0, 20).map(({ price, amount, count }, index) => {
                                        return (
                                            <div className="trow" key={`row-${index}`}>
                                                <div className="tcell">
                                                    {count}
                                                </div>
                                                <div className="tcell">
                                                    {amount}
                                                </div>
                                                <div className="tcell">
                                                </div>
                                                <div className="tcell">
                                                    {price}
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <BarChart data={orders.slice(0, 20)} />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
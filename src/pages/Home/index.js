import React, { useEffect, useState, useCallback } from 'react';
import { Header } from 'components'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import {updateOrders} from "redux/actions"

import './Home.scss'

const Home = () => {
    const orders = useSelector(({orderBook}) => orderBook.list, shallowEqual)
    const dispatch = useDispatch()

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

        const onMessage = ({data}) => {
            if(!Array.isArray(JSON.parse(data)))
                return;

            let [a, value] = JSON.parse(data)
            let [price, count, amount] = value
            
            if(count)
                arr.push({ 
                    price, 
                    count, 
                    amount
                })

            if(arr.length === 30){
                update(arr)
                arr = []
            }

        }

        // Connection opened
        socket.addEventListener('open', onOpen);
        // Listen for messages
        socket.addEventListener('message', onMessage);

        return () => {
            socket.removeEventListener('open', onOpen)
            socket.removeEventListener('message', onMessage)
            socket.close()
        }
        
    }, [])



    return (
        <div>
            <Header />
            <div className="container">
                <div className="wrapper">
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
                        <div className="tbody">
                            {orders.slice(0, 20).map(({price, amount, count}, index) => {
                                return(
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
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
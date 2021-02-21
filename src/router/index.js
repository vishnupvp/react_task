import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Routes } from './routes';

const RouterComponent = () => {
    return (
        <Router>
            <Switch>
                {Routes.map((route, i) => {
                    const {
                        path,
                        exact,
                        component,
                        children = []
                    } = route;

                    const Page = React.lazy(() => import(`pages/${component}`));

                    return (
                        <Suspense fallback={<div>Loading page...</div>}  key={`route_${i}`}>
                            <Route
                                path={path}
                                exact={exact}
                                render={(props) => {
                                    return (
                                        <Page
                                            childRoutes={children}
                                            {...props}
                                        />
                                    );
                                }}
                            />
                        </Suspense>
                    );
                })}
            </Switch>
        </Router>
    );
};

export default RouterComponent;

import React from 'react-dom';
import { Switch, Route } from 'react-router-dom';

import DeliveryIndex from './pages/delivery/DeliveryIndex';
import DeliveryForm from './pages/delivery/DeliveryForm';
import Map from './pages/Map';

const routes = () => {
    return (
        <Switch>
            <Route exact path="/" component={DeliveryIndex} />
            <Route path="/deliveries/new" component={DeliveryForm} />
            <Route path="/deliveries/:id/path" component={Map} />
        </Switch>
    );
}

export default routes;
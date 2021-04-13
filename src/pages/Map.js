import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import DeliveryService from '../services/delivery-service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import GoogleMapsApiService from '../services/google-maps-api-service';

const containerStyle = {
    width: '100%',
    height: '600px'
};

const loadingDivStyle = {
    width: '100%',
    height: '600px',
    textAlign: 'center',
    lineHeight: '600px',
    fontSize: '30px',
    backgroundColor: '#efefef',
    color: '#656565'
}

const center = {
    lat: -21.754530,
    lng: -41.324612
};

function Map() {
    const { id: deliveryId } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [directions, setDirections] = useState(null);
    const [directionsOptions, setDirectionsOptions] = useState({});
    const [googleMapsApiKey, setGoogleMapsApiKey] = useState('');

    useEffect(() => {
         let isMounted = true;

        const onLoad = async () => {
            const key = await GoogleMapsApiService.getKey();
            const delivery = await DeliveryService.find(deliveryId);

            if (isMounted) {
                setDirectionsOptions({
                    origin:`${delivery.departure.location.latitude}, ${delivery.departure.location.longitude}`,
                    destination: `${delivery.destination.location.latitude}, ${delivery.destination.location.longitude}`,
                    travelMode: 'DRIVING'
                });

                setGoogleMapsApiKey(key);
                setIsLoading(false);
            }
        }

        onLoad();

        return () => { isMounted = false };
    }, [deliveryId]);

    const directionsCallback = (response) => {
        if (response !== null) {
            if (response.status === 'OK') {
                setDirections(response);
            }
        }
    }

    const buildMap = () => {

        if (isLoading) {
            return (
                <div style={loadingDivStyle}>
                    <FontAwesomeIcon icon={faSyncAlt} spin />
                </div>
            );
        }

        if (googleMapsApiKey !== '') {
            let directionServiceComponent = null;
            let directionComponent = null;

            if (directionsOptions.origin !== undefined) {
                directionServiceComponent = (
                    <DirectionsService
                        options={directionsOptions}
                        callback={directionsCallback}
                    />
                );
            }

            if (directions) {
                directionComponent = <DirectionsRenderer options={{ directions }} />;
            }

            return (
                <LoadScript
                    googleMapsApiKey={`${googleMapsApiKey}`}
                >
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={10}
                    >
                        {directionServiceComponent}
                        {directionComponent}
                    </GoogleMap>
                </LoadScript>
            );
        }
    };

    return (
        <Card>
            <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Rota de Entrega</h3>
                <Link to="/" className="btn btn-secondary">
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Voltar
                </Link>
            </Card.Header>

            <Card.Body className="p-0">
                {buildMap()}
            </Card.Body>
        </Card>
    )
}

export default Map;

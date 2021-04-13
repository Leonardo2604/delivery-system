import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Form, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import InputMask from 'react-input-mask';

import DeliveryService from '../../services/delivery-service';
import GoogleMapsApiService from '../../services/google-maps-api-service';
import ViaCepApiService from '../../services/via-cep-api-service';

function DeliveryForm() {

    const [googleMapsApiKey, setGoogleMapsApiKey] = useState('');

    const [customerName, setCustomerName] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');

    const [zipCodeDeparture, setZipCodeDeparture] = useState('');
    const [latitudeDeparture, setLatitudeDeparture] = useState('');
    const [longitudeDeparture, setLongitudeDeparture] = useState('');
    const [cityDeparture, setCityDeparture] = useState('');
    const [neighborhoodDeparture, setNeighborhoodDeparture] = useState('');
    const [streetDeparture, setStreetDeparture] = useState('');
    const [numberDeparture, setNumberDeparture] = useState('');

    const [zipCodeDestination, setZipCodeDestination] = useState('');
    const [latitudeDestination, setLatitudeDestination] = useState('');
    const [longitudeDestination, setLongitudeDestination] = useState('');
    const [cityDestination, setCityDestination] = useState('');
    const [neighborhoodDestination, setNeighborhoodDestination] = useState('');
    const [streetDestination, setStreetDestination] = useState('');
    const [numberDestination, setNumberDestination] = useState('');

    const [disabled, setDisabled] = useState(false);
    const [validated, setValidated] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const getGoogleMapsApiKey = async () => {
            const key = await GoogleMapsApiService.getKey();

            if (isMounted) {
                setGoogleMapsApiKey(key);
            }
        }

        getGoogleMapsApiKey();

        return () => { isMounted = false; }
    }, []);

    const findDepartureAddressByLocation = async () => {
        if (
            latitudeDeparture !== ''
            && latitudeDeparture >= -90
            && latitudeDeparture <= 90
            && longitudeDeparture !== ''
            && longitudeDeparture >= -180
            && longitudeDeparture <= 180
        ) {
            const address = await GoogleMapsApiService.fromLatLng(googleMapsApiKey, latitudeDeparture, longitudeDeparture);
            setStreetDeparture(address.street);
            setNumberDeparture(address.number);
            setNeighborhoodDeparture(address.neighborhood);
            setCityDeparture(address.city);
            setZipCodeDeparture(address.zipCode);
        }
    }

    const findDestinationAddressByLocation = async () => {
        if (
            latitudeDestination !== ''
            && latitudeDestination >= -90
            && latitudeDestination <= 90
            && longitudeDestination !== ''
            && longitudeDestination >= -180
            && longitudeDestination <= 180
        ) {
            const address = await GoogleMapsApiService.fromLatLng(googleMapsApiKey, latitudeDestination, longitudeDestination);
            setStreetDestination(address.street);
            setNumberDestination(address.number);
            setNeighborhoodDestination(address.neighborhood);
            setCityDestination(address.city);
            setZipCodeDestination(address.zipCode);
        }
    }

    const findDepartureAddressByZipCode = async () => {
        const zipCode = zipCodeDeparture.replace(/[^\d]/g, '');

        if (zipCode.length === 8) {
            const address = await ViaCepApiService.find(zipCode);
            setStreetDeparture(address.street);
            setNeighborhoodDeparture(address.neighborhood);
            setCityDeparture(address.city);
            setZipCodeDeparture(address.zipCode);

            findDepartureLocationByAddress();
        }
    }

    const findDestinationAddressByZipCode = async () => {
        const zipCode = zipCodeDestination.replace(/[^\d]/g, '');

        if (zipCode.length === 8) {
            const address = await ViaCepApiService.find(zipCode);
            setStreetDestination(address.street);
            setNeighborhoodDestination(address.neighborhood);
            setCityDestination(address.city);
            setZipCodeDestination(address.zipCode);

            findDestinationLocationByAddress();
        }
    }

    const findDepartureLocationByAddress = async () => {
        if (streetDeparture !== '' && cityDeparture !== '' && neighborhoodDeparture !== '') {
            const location = await GoogleMapsApiService.fromAddress(googleMapsApiKey, {
                street: streetDeparture,
                city: cityDeparture,
                neighborhood: neighborhoodDeparture
            });

            setLatitudeDeparture(location.latitude);
            setLongitudeDeparture(location.longitude);
        }
    }

    const findDestinationLocationByAddress = async () => {
        if (streetDestination !== '' && cityDestination !== '' && neighborhoodDestination !== '') {
            const location = await GoogleMapsApiService.fromAddress(googleMapsApiKey, {
                street: streetDestination,
                city: cityDestination,
                neighborhood: neighborhoodDestination
            });

            setLatitudeDestination(location.latitude);
            setLongitudeDestination(location.longitude);
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        setValidated(true);

        if (!form.checkValidity()) {
            return;
        }

        setDisabled(true);

        const newDelivery = {
            customer_name: customerName,
            delivery_date: deliveryDate,
            departure: {
                zip_code: zipCodeDeparture.replace(/[^\d]/, ''),
                latitude: latitudeDeparture,
                longitude: longitudeDeparture,
                city: cityDeparture,
                neighborhood: neighborhoodDeparture,
                street: streetDeparture,
                number: numberDeparture,
            },
            destination: {
                zip_code: zipCodeDestination.replace(/[^\d]/, ''),
                latitude: latitudeDestination,
                longitude: longitudeDestination,
                city: cityDestination,
                neighborhood: neighborhoodDestination,
                street: streetDestination,
                number: numberDestination,
            }
        };

        try {
            await DeliveryService.create(newDelivery);
            setSuccessAlert(true);
            resetState();

            setTimeout(() => {
                setSuccessAlert(false);
            }, 3000);
        } catch (error) {
            console.log(error);
        }

        setDisabled(false);

    }

    const resetState = () => {
        setCustomerName('');
        setDeliveryDate('');
        setZipCodeDeparture('');
        setLatitudeDeparture('');
        setLongitudeDeparture('');
        setCityDeparture('');
        setNeighborhoodDeparture('');
        setStreetDeparture('');
        setNumberDeparture('');
        setZipCodeDestination('');
        setLatitudeDestination('');
        setLongitudeDestination('');
        setCityDestination('');
        setNeighborhoodDestination('');
        setStreetDestination('');
        setNumberDestination('');

        setValidated(false);
    }

    return (
        <>
            {
                successAlert &&
                <Alert variant="success" onClose={() => setSuccessAlert(false)} dismissible>
                    Entrega cadastrada!
                </Alert>
            }
            <Card>

                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Nova Entrega</h3>
                    <Link to="/" className="btn btn-secondary">
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Voltar
                    </Link>
                </Card.Header>

                <Card.Body className="pb-3">
                    <Form onSubmit={onSubmit} noValidate validated={validated}>
                        <Form.Row>
                            <Form.Group as={Col} controlId="customer-name">
                                <Form.Label>Nome do Cliente <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="text" disabled={disabled} maxLength="180" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Informe o nome do cliente" required />
                                <Form.Control.Feedback type="invalid">
                                    Por favor informe o nome do cliente
                            </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} controlId="delivery-date">
                                <Form.Label>Data de Entrega <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="date" disabled={disabled} min={(new Date()).toLocaleDateString().split('/').reverse().join('-')} value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} required />
                                <Form.Control.Feedback type="invalid">
                                    Por favor informe a data de entrega
                            </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>

                            <Col md="6">
                                <Card className="mb-3">

                                    <Card.Header>
                                        Ponto de Partida
                                </Card.Header>

                                    <Card.Body>
                                        <Form.Row>
                                            <Form.Group as={Col} md="4" controlId="zip-code-departure">
                                                <Form.Label>Cep <span className="text-danger">*</span></Form.Label>
                                                <InputMask mask="99999-999" maskChar={null} onBlur={findDepartureAddressByZipCode} id="zip-code-departure" className="form-control" pattern="\d{5}-\d{3}" disabled={disabled} value={zipCodeDeparture} onChange={e => setZipCodeDeparture(e.target.value)} required />
                                                <Form.Control.Feedback type="invalid">
                                                    Por favor informe o cep
                                            </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} md="4" controlId="latitude-departure">
                                                <Form.Label>Latitude <span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="number" min="-90" max="90" step="0.0000000001" onBlur={findDepartureAddressByLocation} disabled={disabled} value={latitudeDeparture} onChange={e => setLatitudeDeparture(e.target.value)} required />
                                                <Form.Control.Feedback type="invalid">
                                                    Por favor informe a latidude
                                            </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} md="4" controlId="longitude-departure">
                                                <Form.Label>Longitude <span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="number" min="-180" max="180" step="0.0000000001" onBlur={findDepartureAddressByLocation} disabled={disabled} value={longitudeDeparture} onChange={e => setLongitudeDeparture(e.target.value)} required />
                                                <Form.Control.Feedback type="invalid">
                                                    Por favor informe a longitude
                                            </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} controlId="city-departure">
                                                <Form.Label>Cidade <span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="text" maxLength="180" disabled={disabled} onBlur={findDepartureLocationByAddress} value={cityDeparture} onChange={e => setCityDeparture(e.target.value)} required />
                                                <Form.Control.Feedback type="invalid">
                                                    Por favor informe a cidade
                                            </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="neighborhood-departure">
                                                <Form.Label>Bairro <span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="text" maxLength="180" disabled={disabled} onBlur={findDepartureLocationByAddress} value={neighborhoodDeparture} onChange={e => setNeighborhoodDeparture(e.target.value)} required />
                                                <Form.Control.Feedback type="invalid">
                                                    Por favor informe o bairro
                                            </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} controlId="street-departure">
                                                <Form.Label>Rua <span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="text" maxLength="120" disabled={disabled} onBlur={findDepartureLocationByAddress} value={streetDeparture} onChange={e => setStreetDeparture(e.target.value)} required />
                                                <Form.Control.Feedback type="invalid">
                                                    Por favor informe a rua
                                            </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} md="2" controlId="number-departure">
                                                <Form.Label>Número <span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="text" maxLength="20" disabled={disabled} value={numberDeparture} onChange={e => setNumberDeparture(e.target.value)} required />
                                                <Form.Control.Feedback type="invalid">
                                                    Por favor informe o número
                                            </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                    </Card.Body>

                                </Card>
                            </Col>

                            <Col md="6">
                                <Card className="mb-3">

                                    <Card.Header>
                                        Ponto de Destino
                                </Card.Header>

                                    <Card.Body>
                                        <Form.Row>
                                            <Form.Group as={Col} md="4" controlId="zip-code-destination">
                                                <Form.Label>Cep <span className="text-danger">*</span></Form.Label>
                                                <InputMask mask="99999-999" onBlur={findDestinationAddressByZipCode} maskChar={null} id="zip-code-destination" className="form-control" pattern="\d{5}-\d{3}" disabled={disabled} value={zipCodeDestination} onChange={e => setZipCodeDestination(e.target.value)} required />
                                                <Form.Control.Feedback type="invalid">
                                                    Por favor informe o cep
                                            </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} md="4" controlId="latitude-destination">
                                                <Form.Label>Latitude <span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="number" min="-90" max="90" step="0.0000000001" disabled={disabled} onBlur={findDestinationAddressByLocation} value={latitudeDestination} onChange={e => setLatitudeDestination(e.target.value)} required />
                                                <Form.Control.Feedback type="invalid">
                                                    Por favor informe a latidude
                                            </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} md="4" controlId="longitude-destination">
                                                <Form.Label>Longitude <span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="number" min="-180" max="180" step="0.0000000001" disabled={disabled} onBlur={findDestinationAddressByLocation} value={longitudeDestination} onChange={e => setLongitudeDestination(e.target.value)} required />
                                                <Form.Control.Feedback type="invalid">
                                                    Por favor informe a longitude
                                            </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} controlId="city-destination">
                                                <Form.Label>Cidade <span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="text" maxLength="180" disabled={disabled} value={cityDestination} onBlur={findDestinationLocationByAddress} onChange={e => setCityDestination(e.target.value)} required />
                                                <Form.Control.Feedback type="invalid">
                                                    Por favor informe a cidade
                                            </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="neighborhood-destination">
                                                <Form.Label>Bairro <span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="text" maxLength="180" disabled={disabled} value={neighborhoodDestination} onBlur={findDestinationLocationByAddress} onChange={e => setNeighborhoodDestination(e.target.value)} required />
                                                <Form.Control.Feedback type="invalid">
                                                    Por favor informe o bairro
                                            </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} controlId="street-destination">
                                                <Form.Label>Rua <span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="text" maxLength="120" disabled={disabled} value={streetDestination} onBlur={findDestinationLocationByAddress} onChange={e => setStreetDestination(e.target.value)} required />
                                                <Form.Control.Feedback type="invalid">
                                                    Por favor informe a rua
                                            </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} md="2" controlId="number-destination">
                                                <Form.Label>Número <span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="text" maxLength="20" disabled={disabled} value={numberDestination} onChange={e => setNumberDestination(e.target.value)} required />
                                                <Form.Control.Feedback type="invalid">
                                                    Por favor informe o número
                                            </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                    </Card.Body>

                                </Card>
                            </Col>
                        </Form.Row>

                        <Button className="mb-4" type="submit" disabled={disabled}>
                            <FontAwesomeIcon icon={faCheck} className="mr-2" /> Cadastrar
                        </Button>

                        <p className="mb-0">
                            Campos com <span className="text-danger">*</span> são obrigatórios
                        </p>
                    </Form>
                </Card.Body>

            </Card>
        </>
    );
}

export default DeliveryForm;
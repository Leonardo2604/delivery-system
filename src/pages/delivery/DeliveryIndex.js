import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Card, Table, Button, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faPlus } from '@fortawesome/free-solid-svg-icons';

import WarningRow from '../../shared/components/WarningRow';
import DeliveryRow from './components/DeliveryRow';

import DeliveryService from '../../services/delivery-service';

function DeliveryIndex() {

    const [isLoading, setIsLoading] = useState(true);
    const [deliveries, setDeliveries] = useState([]);
    const [showWarningDeleteModal, setShowWarningDeleteModal] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const [deliveryToDelete, setDeliveryToDelete] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        /**
         * Para evitar problemas com a atualização de um component que já foi desmontado.
         * Isso acontece quando existe uma navegação rapida entre as paginas.
         */
        let isMounted = true;

        const getDeliveries = async () => {
            const deliveriesResult = await DeliveryService.all();

            if (isMounted) {
                setDeliveries(deliveriesResult);
                setIsLoading(false);
            }
        }

        getDeliveries();

        return () => { isMounted = false };
    }, []);

    const openWarningDeleteModal = (delivery) => {
        setDeliveryToDelete(delivery);
        setShowWarningDeleteModal(true);
    };

    const closeWarningDeleteModal = () => {
        setShowWarningDeleteModal(false);
        setDeliveryToDelete({});
    };

    const onConfirmDeleteDelivery = async () => {
        setShowWarningDeleteModal(false);
        setIsDeleting(true);

        try {
            await DeliveryService.delete(deliveryToDelete.id);
            setIsDeleting(false);

            let temp = deliveries.filter(delivery => deliveryToDelete.id !== delivery.id);
            setDeliveries(temp);

            setShowSuccessAlert(true);

            setTimeout(() => {
                setShowSuccessAlert(false);
            }, 3000);
        } catch (error) {
            setIsDeleting(false);
        }
    }

    const buildTableRows = () => {
        if (isLoading) {
            return <WarningRow col="7" text="Carregando..." />;
        }

        if (deliveries.length > 0) {
            return deliveries.map((delivery, index) => {
                const isDeletingThisDelivery = (isDeleting && deliveryToDelete.id === delivery.id);
                return <DeliveryRow key={index} delivery={delivery} disabled={isDeleting} isDeleting={isDeletingThisDelivery} onClick={e => openWarningDeleteModal(delivery)} />
            });
        }

        return <WarningRow col="7" text="Não há entregas cadastradas" />;
    };

    const buildSuccessAlert = () => {
        if (!showSuccessAlert) {
            return null;
        }

        return (
            <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
                Entrega deletada!
            </Alert>
        );
    };

    return (
        <>
            <Modal show={showWarningDeleteModal} onHide={closeWarningDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Tem Certeza?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    A entrega de código <strong>#{deliveryToDelete.id}</strong> será deletada
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeWarningDeleteModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => onConfirmDeleteDelivery()}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>

            {buildSuccessAlert()}

            <Card>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>
                        <FontAwesomeIcon icon={faTruck} className="mr-2" /> Minhas Entregas
                    </h3>
                    <Link to="/deliveries/new" className="btn btn-primary">
                        <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nova Entrega
                    </Link>
                </Card.Header>
                <Card.Body className="table-responsive">
                    <Table bordered striped hover style={{ minWidth: '1200px' }}>
                        <colgroup>
                            <col width="80"></col>
                            <col></col>
                            <col width='160'></col>
                            <col></col>
                            <col></col>
                            <col width='140'></col>
                            <col width="90"></col>
                        </colgroup>

                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Cliente</th>
                                <th className="text-center">Data de Entrega</th>
                                <th>Partida</th>
                                <th>Destino</th>
                                <th>Rota</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {buildTableRows()}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </>
    );
}

export default DeliveryIndex;
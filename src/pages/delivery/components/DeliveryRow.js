import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faTrash, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import Formatters from '../../../helpers/Formatters';

const DeliveryRow = ({ delivery, isDeleting, disabled, onClick: onClickHandle }) => {

    const buildDeleteButton = () => {
        let icon = <FontAwesomeIcon icon={faTrash} />;

        if (isDeleting) {
            icon = <FontAwesomeIcon icon={faSyncAlt} spin />;
        }

        return (
            <Button variant="danger" disabled={disabled} onClick={onClickHandle}>
                {icon}
            </Button>
        );
    }

    return (
        <tr>
            <td className="text-center">#{delivery.id}</td>
            <td>{delivery.customer_name}</td>
            <td className="text-center">{Formatters.date(delivery.delivery_date)}</td>
            <td>{`${delivery.departure.street}, ${delivery.departure.number} - ${delivery.departure.city}, ${delivery.departure.neighborhood} - ${Formatters.zipCode(delivery.departure.zip_code)}`}</td>
            <td>{`${delivery.destination.street}, ${delivery.destination.number} - ${delivery.destination.city}, ${delivery.destination.neighborhood} - ${Formatters.zipCode(delivery.destination.zip_code)}`}</td>
            <td className="text-center">
                <Link to={`/deliveries/${delivery.id}/path`} className="btn btn-warning">
                    <FontAwesomeIcon icon={faRoute} className="mr-2" /> Ver Rota
            </Link>
            </td>
            <td className="text-center">
                {buildDeleteButton()}
            </td>
        </tr>
    );
};

export default DeliveryRow;
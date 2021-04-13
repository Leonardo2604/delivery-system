import Api from './api';

const DeliveryService = {
    async all() {
        const response = await Api.get('deliveries');
        return response.data;
    },

    async find(id) {
        const response = await Api.get(`deliveries/${id}`);
        return response.data;
    },

    async create(data) {
        const response = await Api.post('deliveries', data);
        return response.data;
    },

    async delete(id) {
        const response = await Api.delete(`deliveries/${id}`);
        return response.data;
    }
}

export default DeliveryService;
import axios from 'axios';
import Api from './api';

const baseURL = 'https://maps.googleapis.com/maps/api/geocode';

const addressParser = (response) => {
    const results = response.results;
    const address = {
        street: '',
        number: '',
        city: '',
        zipCode: '',
        neighborhood: ''
    };

    if (results.length > 0) {
        let components = results[0].address_components;
        for (let i = 0; i < components.length; i++) {
            for (let k = 0; k < components[i].types.length; k++) {
                switch (components[i].types[k]) {
                    case 'street_number':
                        address.number = components[i].long_name.replace(/[^\d]/g, '');
                        break;

                    case 'route':
                        address.street = components[i].long_name;
                        break;

                    case 'sublocality':
                        address.neighborhood = components[i].long_name;
                        break;

                    case 'administrative_area_level_2':
                        address.city = components[i].long_name;
                        break;

                    case 'postal_code':
                        address.zipCode = components[i].long_name.replace(/[^\d]/g, '');
                        break;

                    default:
                        break;
                }
            }
        }
    }

    return address;
}

const GoogleMapsApiService = {
    async fromLatLng(key, lat, lng) {
        const response = await axios.get(`${baseURL}/json?latlng=${lat},${lng}&key=${key}`);
        return addressParser(response.data);
    },

    async fromAddress(key, address) {
        const response = await axios.get(`${baseURL}/json?address=${address.street},${address.city},${address.neighborhood}&key=${key}`);
        const results = response.data.results;
        const location = {
            latitude: '',
            longitude: '',
        }

        if (results.length > 0) {
            location.latitude = results[0].geometry.location.lat;
            location.longitude =results[0].geometry.location.lng;
        }

        return location;
    },

    async getKey() {
        const response = await Api.get('google-maps-key');
        return response.data.key;
    }
}

export default GoogleMapsApiService;

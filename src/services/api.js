import axios from 'axios';

const version = 'v1'

const instance = axios.create({
    baseURL: `https://delivery-system-api.herokuapp.com/${version}/`
});

const Api = {
    get(url, data, headers) {
        return instance.get(url, {
            data,
            headers
        });
    },

    post(url, data, headers) {
        return instance.post(url, data, {headers});
    },

    put(url, data, headers) {
        if (!data) {
            data = {};
        }

        data._method = 'PUT';

        return this.post(url, data, headers);
    },

    delete(url, data, headers) {
        if (!data) {
            data = {};
        }

        data._method = 'DELETE';

        return this.post(url, data, headers);
    }
}

export default Api;
import axios from 'axios';

const ViaCepApiService = {
    async find(zipCode) {
        const response = await axios.get(`https://viacep.com.br/ws/${zipCode}/json`);
        const data = response.data;
        const address = {
            street: '',
            number: '',
            city: '',
            zipCode: '',
            neighborhood: ''
        };

        if (data.erro === undefined && !data.erro) {
            address.street =  data.logradouro;
            address.city =  data.localidade;
            address.zipCode =  data.cep;
            address.neighborhood =  data.bairro;
        }

        return address;
    }
};

export default ViaCepApiService;
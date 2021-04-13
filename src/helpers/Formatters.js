const Formatters = {
    date(date) {
        // eslint-disable-next-line
        return date.replace(/^(\d{4})\-(\d{2})\-(\d{2})/, "$3/$2/$1")
    },

    zipCode(zipCode) {
        return zipCode.replace(/^(\d{5})(\d{3})/, "$1-$2")
    }
};

export default Formatters;
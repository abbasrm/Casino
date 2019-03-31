import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://coins-bet.firebaseio.com/',
    headers: {
        'X-Custom-Header': 'foobar'
    }
})

export default instance;
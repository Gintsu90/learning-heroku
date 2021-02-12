import axios from "axios";
const basUrl = 'http://localhost:3001/api/notes';

const getAll = () => {
    const request = axios.get(basUrl);
    return request.then(response => response.data)
};

const create = newObject => {
    const request = axios.post(basUrl, newObject);
    return request.then(response => response.data)
};

const update = (id, newObject) => {
    const request = axios.put(`${basUrl}/${id}`, newObject);
    return request.then(response => response.data)
};

export default { getAll, create, update }
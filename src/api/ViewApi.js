//Axios
import axios from 'axios';

//Url base
import { URL_BASE } from './BaseUrl';

export function getViews() {

    return axios.get(`${URL_BASE}api/get-view`).then(response => {
        return response;
    }).catch(err => {
        return err;
    });

}

export function getViewsByDay() {

    return axios.get(`${URL_BASE}api/get-view-by-day`).then(response => {
        return response;
    }).catch(err => {
        return err;
    });

}
// change this when you integrate with the real API, or when u start using the dev server
const API_URL = 'http://localhost:8080/data'

const getJSON = (path, options) =>
    fetch(path, options)
        .then(res => res.json())
        .catch(err => console.warn(`API_ERROR: ${err.message}`));

/**
 * This is a sample class API which you may base your code on.
 * You don't have to do this as a class.
 */
export default class API {

    /**
     * Defaults to teh API URL
     * @param {string} url
     */
    constructor(url = API_URL) {
        this.url = url;
    }

    makeAPIRequest(path) {
        return getJSON(`${this.url}/${path}`);
    }

    /**
     * @returns feed array in json format
     */
    getFeed(start) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + window.localStorage.getItem('AUTH_KEY')
        };

        return fetch('http://localhost:5000/user/feed?p=' + String(start) + '&n=10', {
            headers,
            method: 'GET'
        });

        // return fetch('http://localhost:5000/user/feed?p=0&n=10', {
        //     headers,
        //     method: 'GET'
        // });

    }

    /**
     * @returns auth'd user in json format
     */
    getMe() {
        var username = window.localStorage.getItem('username');
        if (username != null) {
            var url = "http://localhost:5000/user/?username=" + username;
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + window.localStorage.getItem('AUTH_KEY')
            }
            return fetch(url, {
                headers,
                method: 'GET'
            });
            // .then(response => {
            //     response.json().then(data => {
            //         console.log(data.username);
            //         console.log(data.id);
            //         console.log()
            //     })
            // });
        } else {
            return null;
        }
    }

}

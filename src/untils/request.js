import axios from 'axios'
import store from '../store'
import CryptoJS from 'crypto-js'
const instance = axios.create({
    timeout: 10000,
});



instance.interceptors.request.use(config => {
    const token = store.state.token;
    if (token) {        
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default {
    getData: getData,
    postData: postData,
    setBaseURL: setBaseURL
}

function getData(url) {
    return new Promise((resolve, reject) => {
        instance.get(url).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    });
}

function postData(url, data) {
    return new Promise((resolve, reject) => {
        var time = Date.now(); 
        if(data != null ){
            var key = CryptoJS.enc.Utf8.parse("mmm" + time)
            let encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
              iv: key,
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7
            })
            var encryptedText = encrypted.toString()
        }       
        var postdata = {'Id':time,'FormData':encryptedText}    
        instance.post(url, postdata).then(response => {
            if(response.data.code==9999){
                window.location.reload()
            }
            if(response.data.code==8888){
                store.state.OperatePassState=true
            }
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    });
}


function setBaseURL(newBaseURL) {
    instance.defaults.baseURL = newBaseURL + '/api/';
}


const https = require('https');
export default function({ app, $axios, store, $config: { API_URL } }) {
    $axios.defaults.baseURL = API_URL;
    $axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });
    $axios.onError(error => {
        if (error.response.status === 422) {
            store.dispatch('setErrors', error.response.data.errors);
            return Promise.reject(error.response.data.message);
        }
        if (error.response.status === 401) {
            store.dispatch('setAlerts', {
                has: true,
                type: 'danger',
                position: 'top',
                message: error.response.data.message
            });
            return Promise.reject(error.response.data.message);
        }
        if (error.response.status === 403) {
            store.dispatch('setAlerts', {
                has: true,
                type: 'danger',
                position: 'top',
                message: error.response.data.message
            });
            if(error.response.data.message === "Token has expired"){
               app.$auth.logout();
            }
            return Promise.reject(error.response.data.message);
        }
        if (error.response.status === 500) {
            store.dispatch('setAlerts', {
                has: true,
                type: 'danger',
                position: 'top',
                message: "Server 500 Error"
            });
            return Promise.reject(error);
        }
    });

    $axios.onRequest((config) => {
        if(['/auth/check'].indexOf(config.url) === -1){
            store.dispatch('clearAlerts',{});
            store.dispatch('clearErrors',{});
        }
    });

    $axios.onResponse((response)=>{
        if(typeof(response.data.success) !== 'undefined'){
            if(!response.data.success){
                store.dispatch('setAlerts', {
                    has: true,
                    type: 'danger',
                    position: 'bottom',
                    message: response.data.message
                });
                store.dispatch('setErrors', {error: response.data.message});
                return Promise.reject(response.data.message);
            }
            if(response.data.success && response.data.message !== ''){
                store.dispatch('clearAlerts',{});
                store.dispatch('clearErrors',{});
                store.dispatch('setAlerts', {
                    has: true,
                    type: 'success',
                    position: 'top',
                    message: response.data.message
                });
                return Promise.resolve(response);
            }
        }
    });

}

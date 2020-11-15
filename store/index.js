import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import global from './modules/global'
import validation from './modules/validation'

Vue.use(Vuex);

export default () => {
    return new Vuex.Store({
        actions: {

        },
        modules: {
            auth,
            global,
            validation
        }
    });
}
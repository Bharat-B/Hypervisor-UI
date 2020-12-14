import Vue from 'vue';

import { mapGetters, mapState } from 'vuex';

const Global = {
    install(Vue, options) {
        Vue.mixin({
            computed: {
                ...mapState({
                    formats: state => state.global.formats,
                    environment: state => state.global.environment,
                    currencyList: state => state.global.currencyList,
                    flagList: state => state.global.flagList,
                    countryList: state => state.global.countryList,
                    countryPhoneList: state => state.global.countryPhoneList,
                    stateList: state => state.global.stateList,
                    currencySymbol: state => state.global.currencySymbol,
                    countryStates: state => state.global.countryStates,
                    enabledBilling: (state) => { return state.global.environment.settings.enable_billing === '1' },
                    is_reseller: (state) => { return state.auth.user.is_reseller === 1 }
                }),
                ...mapGetters({
                    alerts: 'alerts',
                    errors: 'errors',
                    user: 'user',
                    loggedIn: 'loggedIn',
                })
            }
        })
    }
};

Vue.use(Global);


<template>
    <nav class="animated slideInLeft main-menu">
        <div class="mainlogo">
            <a class="symbol"><img class="animated fadeIn" style="width: 40px;" src="/symbol.png"/></a>
            <a class="animated fadeIn logo"><img  src="/logo.png"/></a>
        </div>
        <ul>
			<li class="has-subnav" v-if="is_reseller">
				<nuxt-link :to="{name: 'user-subusers'}">
					<i class="fa fa-users" aria-hidden="true"></i>
					<span class="nav-text">
                        Subusers
                    </span>
				</nuxt-link>
			</li>
            <li class="has-subnav">
                <nuxt-link :to="{name: 'user-dashboard'}">
                    <i class="fa fa-server" aria-hidden="true"></i>
                    <span class="nav-text">
                        Instances
                    </span>
                </nuxt-link>
            </li>
            <li class="has-subnav" v-show="enabledBilling">
                <nuxt-link :to="{name: 'user-billing'}">
                    <i class="fa fa-globe" aria-hidden="true"></i>
                    <span class="nav-text">
                            Billing
                    </span>
                </nuxt-link>
            </li>
            <li class="has-subnav" v-show="false">
                <nuxt-link :to="{name: 'user-domains'}">
                    <i class="fa fa-globe" aria-hidden="true"></i>
                    <span class="nav-text">
                            Domains
                    </span>
                </nuxt-link>
            </li>
            <li class="has-subnav">
                <nuxt-link :to="{name: 'user-firewalls'}">
                    <i class="fa fa-ban" aria-hidden="true"></i>
                    <span class="nav-text">
                        Firewall
                    </span>
                </nuxt-link>
            </li>
            <li class="has-subnav">
                <nuxt-link :to="{name: 'user-ssh-keys'}" href="/user/ssh-keys">
                    <i class="fa fa-lock famore" aria-hidden="true"></i>
                    <span class="nav-text">
						SSH Keys
                    </span>
                </nuxt-link>
            </li>
            <li>
                <nuxt-link :to="{name: 'user-recipes'}" href="/user/recipes">
                    <i class="fa fa-terminal famore" aria-hidden="true"></i>
                    <span class="nav-text">
                            Recipes
                    </span>
                </nuxt-link>
            </li>
			<li>
				<nuxt-link :to="{name: 'user-snapshots'}" href="/user/snapshots">
					<i class="fa fa-camera-retro" aria-hidden="true"></i>
					<span class="nav-text">
						Snapshots
					</span>
				</nuxt-link>
			</li>
        </ul>
        <ul class="users">
            <li>
                <a href="#" @click.prevent="cancel_masquerade" v-if="is_admin">
                    <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                    <span class="nav-text">
                        Back to Admin
                    </span>
                </a>
            </li>
            <li>
                <nuxt-link :to="{name: 'user-profile'}" href="/user/profile">
                    <i class="fa fa-user-circle" aria-hidden="true"></i>
                    <span class="nav-text">
                        Profile
                    </span>
                </nuxt-link>
            </li>
            <li>
                <a href="#logout" @click.prevent="signOut">
                    <i class="fa fa-power-off"></i>
                    <span class="nav-text">
                        Logout
                    </span>
                </a>
            </li>
        </ul>
    </nav>
</template>
<script>
    export default {
        data(){
            return {
                is_admin: false
            }
        },
        methods: {
            async cancel_masquerade(){
                let vm = this;
                let admin_token = window.localStorage.getItem('auth.admin_token');
                await this.$axios.post('/user/token/invalidate',{
                    token: vm.$auth.getToken('local')
                });
                vm.$auth.setToken('local',admin_token);
                setTimeout(()=>{
                    window.localStorage.removeItem('auth.admin_token');
                    window.location.reload();
                },1000);
            },
            async signOut() {
                await this.$axios.post('invalidate').then(()=>{
                    window.location.reload();
                });
            }
        },
        mounted(){
            let token = window.localStorage.getItem('auth.admin_token') || undefined;
            if(token !== undefined){
                this.$set(this,'is_admin', true);
            }
        }
    }
</script>

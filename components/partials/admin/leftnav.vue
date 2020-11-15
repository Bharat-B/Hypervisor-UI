<template>
    <nav class="main-menu">
        <a href="#"><img class="logo" src="/assets/symbol-white.png"></a>
        <ul>
            <li>
                <nuxt-link :to="{name: 'admin-dashboard'}" tag="a">
                    <i class="fa fa-home"></i>
                    <span class="nav-text">
                            Dashboard
                        </span>
                </nuxt-link>
            </li>
            <li class="dropdown-btn">
                <a href="#">
                    <i class="fa fa-credit-card"></i>
                    <span class="nav-text">
                        Billing &nbsp;&nbsp;&nbsp;&nbsp;<span class="fa fa-caret-down"></span>
                    </span>
                </a>
            </li>
            <div class="moremenu dropdown-container">
                <li>
                    <nuxt-link :to="{name: 'admin-invoices'}" tag="a">
                        <i class="fa fa-credit-card famore" aria-hidden="true"></i>
                        <span class="nav-text">
                                Invoices
                        </span>
                    </nuxt-link>
                </li>
                <li>
                    <nuxt-link :to="{name: 'admin-payments'}" tag="a">
                        <i class="fa fa-credit-card famore" aria-hidden="true"></i>
                        <span class="nav-text">
                                Payments
                        </span>
                    </nuxt-link>
                </li>
            </div>
            <li>
                <nuxt-link :to="{name: 'admin-instances'}" tag="a">
                    <i class="fa fa-th-large" aria-hidden="true"></i>
                    <span class="nav-text">
                            Instances
                        </span>
                </nuxt-link>
            </li>
			<li>
				<nuxt-link :to="{name: 'admin-migrations'}" tag="a">
					<i class="fa fa-random" aria-hidden="true"></i>
					<span class="nav-text">
                            Instance Migrations
                        </span>
				</nuxt-link>
			</li>
            <li>
                <nuxt-link :to="{name: 'admin-regions'}" tag="a">
                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                    <span class="nav-text">
                        Regions
                    </span>
                </nuxt-link>
            </li>
            <li>
                <nuxt-link :to="{name: 'admin-hypervisors'}" tag="a">
                    <i class="fa fa-server" aria-hidden="true"></i>
                    <span class="nav-text">
                            Hypervisors
                    </span>
                </nuxt-link>
            </li>
            <li>
                <nuxt-link :to="{name: 'admin-users'}" tag="a">
                    <i class="fa fa-users" aria-hidden="true"></i>
                    <span class="nav-text">
                             Users
                    </span>
                </nuxt-link>
            </li>
            <li class="dropdown-btn">
              <a href="#">
                <i class="fa fa-layer-group"></i>
                <span class="nav-text">
                          Plans &nbsp;&nbsp;&nbsp;&nbsp;<span class="fa fa-caret-down"></span>
                      </span>
              </a>
            </li>
            <div class="moremenu dropdown-container">
              <li>
                <nuxt-link :to="{name: 'admin-plans'}" tag="a">
                  <i class="fa fa-layer-group" aria-hidden="true"></i>
                  <span class="nav-text">
                        Instance Plans
                    </span>
                </nuxt-link>
              </li>
              <li>
                <nuxt-link :to="{name: 'admin-reseller-plans'}" tag="a">
                  <i class="fa fa-layer-group" aria-hidden="true"></i>
                  <span class="nav-text">
                        Reseller Plans
                    </span>
                </nuxt-link>
              </li>
            </div>
            <li>
                <nuxt-link :to="{name: 'admin-storages'}" tag="a">
                    <i class="far fa-hdd" aria-hidden="true"></i>
                    <span class="nav-text">
                            Storage
                        </span>
                </nuxt-link>
            </li>
            <li>
                <nuxt-link :to="{name: 'admin-networks'}" tag="a">
                    <i class="fa fa-globe" aria-hidden="true"></i>
                    <span class="nav-text">
                            Network
                        </span>
                </nuxt-link>
            </li>
            <li>
                <nuxt-link :to="{name: 'admin-images'}" tag="a">
                    <i class="fab fa-linux" aria-hidden="true"></i>
                    <span class="nav-text">
                            Images
                    </span>
                </nuxt-link>
            </li>
            <li>
                <nuxt-link :to="{name: 'admin-image-groups'}" tag="a">
                    <i class="fas fa-box-open" aria-hidden="true"></i>
                    <span class="nav-text">
                            Image Groups
                    </span>
                </nuxt-link>
            </li>
            <li>
                <nuxt-link :to="{name: 'admin-isos'}" tag="a">
                    <i class="fas fa-compact-disc" aria-hidden="true"></i>
                    <span class="nav-text">
                            ISO
                    </span>
                </nuxt-link>
            </li>
            <li>
                <nuxt-link :to="{name: 'admin-emails'}" tag="a">
                    <i class="fa fa-envelope" aria-hidden="true"></i>
                    <span class="nav-text">
                           Email Templates
                        </span>
                </nuxt-link>
            </li>
            <li>
                <nuxt-link :to="{name: 'admin-tasks'}" tag="a">
                    <i class="fa fa-cogs" aria-hidden="true"></i>
                    <span class="nav-text">
                           Tasks
                        </span>
                </nuxt-link>
            </li>
        </ul>
        <ul class="logout">
            <li>
                <nuxt-link :to="{name: 'admin-user-id', params: { id: user.id }}" tag="a">
                    <i class="fas fa-user" aria-hidden="true"></i>
                    <span class="nav-text">
                            My Account
                        </span>
                </nuxt-link>
            </li>
            <li>
                <nuxt-link :to="{name: 'admin-settings'}" tag="a">
                    <i class="fas fa-sliders-h" aria-hidden="true"></i>
                    <span class="nav-text">
                            Settings
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
        methods: {
            async signOut() {
              let vm = this;
                await this.$axios.post('invalidate').then(()=>{
                    vm.$auth.reset();
                    window.location.reload();
                });
            }
        },
        mounted(){
            let dropdown = document.getElementsByClassName("dropdown-btn");
            for (let i = 0; i < dropdown.length; i++) {
                dropdown[i].addEventListener("click", function() {
                    this.classList.toggle("active");
                    var dropdownContent = this.nextElementSibling;
                    if (dropdownContent.style.display === "block") {
                        dropdownContent.style.display = "none";
                    } else {
                        dropdownContent.style.display = "block";
                    }
                });
            }
        }
    }
</script>

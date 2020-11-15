<template>
    <div class="ipages">
        <div class="btn-group dropup">
            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> {{ items }} entries
            </button>
            <ul class="dropdown-menu">
                <li :class="{active: items === 20}"><a href="#" @click.prevent="setItems(20)">20 entries</a></li>
                <li :class="{active: items === 50}"><a href="#" @click.prevent="setItems(50)">50 entries</a></li>
                <li :class="{active: items === 100}"><a href="#" @click.prevent="setItems(100)">100 entries</a></li>
            </ul>
        </div>
        <div class="btn-group dropup">
            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Page {{ pageno }}
                <i class="far fa-arrow-alt-circle-up" aria-hidden="true"></i>
            </button>
            <ul class="dropdown-menu">
                <li v-for="i in range(pagination.last_page)">
                    <a href="#" @click.prevent="page(i, items, search)">
                        {{ i }}
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            pagination: {
                type: Object,
                required: true
            },
            search: {
                type: String
            }
        },
        watch: {
            pagination(value) {
                this.pageno = value.current_page;
                this.items = value.per_page;
            }
        },
        methods: {
            range(to) {
                let arr = [];
                for(let i=1; i <= to; i++) {
                    arr.push(i);
                }
                return arr;
            },
            page(page, items, search){
                this.pageno = page;
                this.items = items;
                this.$emit('paginate',page,items,search);
            },
            setItems(items){
                this.items = items;
                this.page(this.pageno, this.items, this.search)
            }
        },
        data() {
            return {
                pageno: this.$route.query.page ? this.$route.query.page : 1,
                items: this.$route.query.per_page ? this.$route.query.per_page : 20
            }
        }
    }

</script>
<template>
    <select class="form-control" :name="name" data-width="100%" :data-allow-clear="allowclear" ></select>
</template>
<script>
    export default {
        props: ['name','allowclear','id'],
        mounted(){

		}
    }
</script>

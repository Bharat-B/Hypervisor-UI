<template>
    <div class="alerts">
        <div class="animated slideInDown alert" :class="'alert-'+type" role="alert">
            <b></b>&nbsp; {{ message }}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    </div>
</template>
<script>
    export default {
        props: [
            'position',
            'type',
            'message'
        ]
    }
</script>

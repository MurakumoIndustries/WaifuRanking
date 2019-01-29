<template>
    <div class="py-3">
        <h5>Terms Of Service</h5>
        <p>You must read and agree to this Terms of Service Agreement if you are a User of this site.</p>
        <p>You acknowledge and agree that, by clicking the “I Agree” or similar button to access the Services, you have read these terms and agree to these terms. If you do not agree with these terms, you must immediately close this window.</p>
        <p>You acknowledge and agree that, all rankings generted by the Services are all meaningless.</p>
        <p>You must be rank 100 or greater, and has at least 1 waifu, to be a User of the Services.</p>

        <div class="text-right">
            <button type="button" class="btn btn-danger mr-1" v-on:click="donotagree">Don't Agree</button>
            <button
                type="button"
                class="btn btn-primary"
                v-on:click="$emit('step0complete')"
            >I Agree</button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        step0: Object
    },
    data: function() {
        return {};
    },
    methods: {
        donotagree: function() {
            location.href = "../";
        }
    }
};
</script>
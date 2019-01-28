<template>
    <div class="container-fluid" id="main">
        <RankStep0
            v-if="step0.complete==false"
            v-bind:step0="step0"
            v-on:step0complete="step0complete"
        />
        <RankStep1
            v-if="step0.complete&&step1.complete==false"
            v-bind:step1="step1"
            v-bind:step2="step2"
            v-on:step1back="step1back"
            v-on:step1complete="step1complete"
        />
        <RankStep2
            v-if="step1.complete&&step2.complete==false"
            v-bind:step1="step1"
            v-bind:step2="step2"
            v-on:step2back="step2back"
            v-on:step2complete="step2complete"
        />
    </div>
</template>

<script>
import RankStep0 from "./RankStep0.vue";
import RankStep1 from "./RankStep1.vue";
import RankStep2 from "./RankStep2.vue";

export default {
    data: function() {
        return {
            step0: {
                complete: false
            },
            step1: {
                complete: false,
                subjects: { Score: 1 },
                min: 1,
                max: 5,
                step: 1,
                ratebyattribute: false,
                excludecollabo: false,
                excludeanother: false,
                getAvailableScore: function() {
                    var list = [];
                    var current = this.min;
                    while (current <= this.max) {
                        list.push(current);
                        current += this.step;
                        current = Math.round(current * 1000000) / 1000000;
                    }
                    return list;
                }
            },
            step2: {
                complete: false,
                scores: {}
            },
            step3: {
                complete: false,
                title: "",
                header: "",
                footer: "",
                converter: {}
            }
        };
    },
    components: {
        RankStep0,
        RankStep1,
        RankStep2
    },
    methods: {
        step0complete: function() {
            this.step0.complete = true;
        },
        step1back: function() {
            this.step0.complete = false;
            this.step1.complete = false;
        },
        step1complete: function() {
            this.step1.complete = true;
            this.step2.scores.subjectsJson = JSON.stringify(
                this.step1.subjects
            );
        },
        step2back: function() {
            this.step1.complete = false;
            this.step2.complete = false;
        },
        step2complete: function() {
            this.step2.complete = true;
        }
    }
};
</script>
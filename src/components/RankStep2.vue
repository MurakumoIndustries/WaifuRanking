<template>
    <div class="py-3">
        <h5>Rate</h5>
        <div class="row">
            <div class="col-12">
                <button type="button" class="btn btn-secondary" v-on:click="allmax">All Max</button>
                <button type="button" class="btn btn-warning" v-on:click="allrandom">All Random</button>
                <button type="button" class="btn btn-secondary" v-on:click="allmin">All Min</button>
                <button type="button" class="btn btn-danger" v-on:click="disableAll">Disable All</button>
                <button type="button" class="btn btn-primary" v-on:click="enableAll">Enable All</button>
            </div>
        </div>
        <div class="row" v-for="(cgroup, index) in step2.charas" v-bind:key="index">
            <div class="col-12 text-center" v-if="index">
                <h3>{{attributes[Number(index)]}}</h3>
            </div>
            <CharaCard
                class="col-12 col-md-6 col-lg-4"
                v-for="chara in cgroup"
                v-bind:key="chara.id"
                v-bind:chara="chara"
                v-bind:actress="chara.actress"
                v-bind:step1="step1"
                v-bind:score.sync="step2.scores[chara.id]"
            />
        </div>
        <div class="row">
            <div class="col">
                <button type="button" class="btn btn-secondary" v-on:click="$emit('step2back')">Prev</button>
            </div>
            <div class="col text-right">
                <button
                    type="button"
                    class="btn btn-primary"
                    v-on:click="$emit('step2complete')"
                >Next</button>
            </div>
        </div>
    </div>
</template>

<script>
import { Data } from "../js/data.js";
import Ui from "../js/ui.js";
import CharaCard from "./CharaCard.vue";

export default {
    props: {
        step1: Object,
        step2: Object
    },
    data: function() {
        return {};
    },
    created: function() {
        var step1 = this.step1;
        var step2 = this.step2;
        var vm = this;

        var charas = Data.getAll("chara");

        _.each(charas, function(o, i) {
            o.actress = Data.get("actress", o.actressId) || {};
        });

        var excludeCharaId = [
            3720944093,
            3481056819,
            2009125206,
            702277936,
            //not in use
            1560659059,
            4147015183,
            1078449980,
            1928470746,
            927000490,
            1377445908, //nia seria an
            //not implemented
            1197654301,
            4292781688,
            2814228014,
            520212811
            //collabo not in use
        ];

        var chara4s = _.filter(charas, function(chara) {
            if (chara.rare != 4) {
                return false;
            }
            if (!chara.icon) {
                return false;
            }
            if (excludeCharaId.indexOf(chara.id) >= 0) {
                return false;
            }
            return true;
        });

        _.each(chara4s, function(o, i) {
            var defaultScore = {};

            _.each(step1.subjects, function(o, i) {
                defaultScore[o.name] = step1.max;
            });
            //step2.scores[o.id] = step2.scores[o.id] || defaultScore;
            vm.$set(step2.scores, o.id, step2.scores[o.id] || defaultScore);
        });

        var finalcharas = [_.shuffle(chara4s)];

        if (step1.ratebyattribute) {
            finalcharas = _.chain(chara4s)
                .shuffle()
                .groupBy("goodAttr")
                .toPairs()
                .orderBy(o => o[0])
                .fromPairs()
                .value();
        }

        step2.charas = finalcharas;
    },
    methods: {
        allmax: function() {
            var max = this.step1.max;
            var scores = this.step2.scores;
            var vm = this;
            _.each(scores, function(score, i) {
                if (isNaN(Number(i))) {
                    return;
                }
                _.each(score, function(o, j) {
                    if (j == "totalScore" || j == "disable") {
                        return;
                    }
                    vm.$set(scores[i], j, max);
                });
            });
        },
        allrandom: function() {
            var scores = this.step2.scores;
            var vm = this;
            var available = this.step1.getAvailableScore();
            _.each(scores, function(score, i) {
                if (isNaN(Number(i))) {
                    return;
                }
                _.each(score, function(o, j) {
                    if (j == "totalScore" || j == "disable") {
                        return;
                    }
                    vm.$set(scores[i], j, _.sample(available));
                });
            });
        },
        allmin: function() {
            var min = this.step1.min;
            var scores = this.step2.scores;
            var vm = this;
            _.each(scores, function(score, i) {
                if (isNaN(Number(i))) {
                    return;
                }
                _.each(score, function(o, j) {
                    if (j == "totalScore" || j == "disable") {
                        return;
                    }
                    vm.$set(scores[i], j, min);
                });
            });
        },
        disableAll: function() {
            var scores = this.step2.scores;
            var vm = this;
            _.each(scores, function(score, i) {
                if (isNaN(Number(i))) {
                    return;
                }
                vm.$set(scores[i], "disable", true);
            });
        },
        enableAll: function() {
            var scores = this.step2.scores;
            var vm = this;
            _.each(scores, function(score, i) {
                if (isNaN(Number(i))) {
                    return;
                }
                vm.$set(scores[i], "disable", false);
            });
        }
    },
    computed: {
        attributes: function() {
            return Ui.getAll("attribute");
        }
    },
    components: {
        CharaCard
    }
};
</script>
<template>
    <div class="actress-item my-2 col-12 col-md-6" :data-id="chara.id" :data-name="actress.name">
        <div
            class="card"
            :style="'background:linear-gradient(135deg, '+actress.imageColor+', '+actress.imageColor+' 10%, transparent 25%, transparent);'"
        >
            <div class="card-body p-1 actress-header">
                <h5 class="d-inline-block m-0">
                    <img
                        class="actress-icon"
                        :src="chara.icon&&('../img/chara/' + chara.icon + '.png')"
                    >
                    <div class="actress-name" v-if="canSplit">
                        <ruby>
                            {{nameSplit[0]}}
                            <rp>(</rp>
                            <rt>{{rubySplit[0]}}</rt>
                            <rp>)</rp>
                        </ruby>
                        <span>{{nameMatch[0]}}</span>
                        <ruby>
                            {{nameSplit[1]}}
                            <rp>(</rp>
                            <rt>{{rubySplit[1]}}</rt>
                            <rp>)</rp>
                        </ruby>
                    </div>
                    <div class="actress-name" v-else>
                        <ruby>
                            {{actress.name}}
                            <rp>(</rp>
                            <rt>{{actress.ruby}}</rt>
                            <rp>)</rp>
                        </ruby>
                    </div>
                    <img
                        class="another-icon"
                        :src="chara.anotherIcon&&('../img/another/' + chara.anotherIcon + '.png')"
                    >
                </h5>
                <div class="float-right">
                    <div
                        class="form-group"
                        v-for="subject in subjectsForScore"
                        v-bind:key="subject"
                    >
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">{{subject}}</span>
                            </div>
                            <input
                                type="number"
                                class="form-control"
                                :min="step1.min"
                                :max="step1.max"
                                :step="step1.step"
                                v-model.number="score[subject]"
                                v-on:change="validateScore(subject)"
                            >
                            <div class="input-group-append">
                                <button
                                    type="button"
                                    class="btn btn-warning"
                                    v-on:click="random(subject)"
                                >Random</button>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Total</span>
                            </div>
                            <input
                                type="number"
                                class="form-control"
                                readonly="readonly"
                                v-model="totalScore"
                            >
                            <div class="input-group-append">
                                <button
                                    type="button"
                                    class="btn btn-warning"
                                    v-on:click="randomall"
                                >Random All</button>
                                <button
                                    type="button"
                                    class="btn btn-secondary"
                                    v-on:click="maxall"
                                >Max All</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const splitRegex = /[・|\s]/g;
export default {
    props: {
        chara: Object,
        actress: Object,
        step1: Object,
        score: Object
    },
    data: function() {
        return {};
    },
    computed: {
        canSplit: function() {
            return splitRegex.test(this.actress.name);
        },
        nameMatch: function() {
            return this.actress.name.match(splitRegex);
        },
        nameSplit: function() {
            return this.actress.name.split(splitRegex);
        },
        rubySplit: function() {
            return this.actress.ruby.split(splitRegex);
        },
        subjectsForScore: function() {
            var list = [];
            _.each(this.step1.subjects, function(o, i) {
                list.push(o.name);
            });
            return list;
        },
        totalScore: function() {
            var score = this.score;
            var total = 0;
            var totalPercent = 0;
            _.each(this.step1.subjects, function(o, i) {
                total += score[o.name] * o.percent;
                totalPercent += o.percent;
            });
            score.totalScore =
                Math.round((total / totalPercent) * 1000000) / 1000000;
            return score.totalScore;
        }
    },
    methods: {
        validateScore: function(subject) {
            var score = this.score;
            var vm = this;
            var x = score[subject];
            var available = this.step1.getAvailableScore();
            var closest = available.sort(
                (a, b) => Math.abs(x - a) - Math.abs(x - b)
            )[0];
            vm.$set(score, subject, closest);
        },
        random: function(subject) {
            var score = this.score;
            var vm = this;
            var available = this.step1.getAvailableScore();
            vm.$set(score, subject, _.sample(available));
        },
        randomall: function() {
            var score = this.score;
            var vm = this;
            var available = this.step1.getAvailableScore();
            _.each(score, function(o, j) {
                vm.$set(score, j, _.sample(available));
            });
        },
        maxall: function(subject) {
            var score = this.score;
            var vm = this;
            var available = this.step1.getAvailableScore();
            var max = this.step1.max;
            _.each(score, function(o, j) {
                vm.$set(score, j, max);
            });
        }
    }
};
</script>

<style scoped>
.actress-item .card {
    min-height: 4.5rem;
}
.actress-item .actress-icon {
    width: 4rem;
    height: 4rem;
}

.actress-item .actress-header {
    white-space: nowrap;
}

.actress-item .actress-name {
    display: inline-block;
}

.another-icon {
    filter: drop-shadow(1px 1px 1px black);
    height: 2.5rem;
    vertical-align: top;
    margin-top: 0.5rem;
    margin-left: -0.5rem;
}
</style>

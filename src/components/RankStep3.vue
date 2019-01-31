<template>
    <div class="py-3">
        <h5>Generate</h5>
        <form>
            <div class="form-group">
                <label>Title</label>
                <input type="text" class="form-control" v-model="step3.title">
            </div>
            <div class="form-group">
                <label>Header</label>
                <input type="text" class="form-control" v-model="step3.header">
            </div>
            <div class="form-group">
                <label>Footer</label>
                <input type="text" class="form-control" v-model="step3.footer">
            </div>
            <div class="form-group d-none">
                <label>Score display type</label>
                <div class="btn-group btn-group-toggle" data-toggle="buttons">
                    <label class="btn btn-secondary active">
                        <input
                            type="radio"
                            name="scoredisplaytype"
                            value="off"
                            v-model="step3.scoredisplaytype"
                            autocomplete="off"
                            checked
                        >Off
                    </label>
                    <label class="btn btn-secondary">
                        <input
                            type="radio"
                            name="scoredisplaytype"
                            value="total"
                            v-model="step3.scoredisplaytype"
                            autocomplete="off"
                        >Total
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label>Score Convert</label>
                <div
                    class="input-group"
                    v-for="converter in step3.converters"
                    v-bind:key="converter.name"
                >
                    <div class="input-group-prepend">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            :disabled="step3.converters.length<=1"
                            v-on:click="delConverter(converter.name)"
                        >-</button>
                        <button
                            type="button"
                            class="btn btn-secondary"
                            v-on:click="addConverter()"
                        >+</button>
                    </div>
                    <input type="text" class="form-control" v-model.lazy="converter.name">
                    <input
                        type="text"
                        class="form-control"
                        placeholder="description"
                        v-model.lazy="converter.desc"
                    >
                    <input
                        type="number"
                        class="form-control"
                        v-model.lazy="converter.value"
                        v-on:change="validateConverter(converter)"
                    >
                </div>
            </div>
        </form>
        <div class="card">
            <div class="card-body">
                <div id="waifuRankingTable" class="container">
                    <div class="text-center">
                        <h3>{{step3.title}}</h3>
                    </div>
                    <div>
                        <h6>{{step3.header}}</h6>
                    </div>
                    <div>
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th scope="col"></th>
                                    <th
                                        scope="col"
                                        v-for="(cgroup, index) in step2.charas"
                                        v-bind:key="index"
                                    >{{index?attributes[Number(index)]:UiGetText("actresses")}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="converter in orderedConverters"
                                    v-bind:key="converter.name"
                                >
                                    <td class="pl-2 pr-1" style="width: 5rem;">
                                        <p class="text-nowrap">{{converter.name}}</p>
                                        <small class="form-text text-muted">{{converter.desc}}</small>
                                    </td>
                                    <td v-for="(cgroup, index) in step2.charas" v-bind:key="index">
                                        <img
                                            class="actress-icon"
                                            v-for="chara in charaInRange(cgroup, converter)"
                                            v-bind:key="chara.id"
                                            :src="chara.icon&&('../img/chara/' + chara.icon + '.png')"
                                        >
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="text-right">
                        <h6>{{step3.footer}}</h6>
                    </div>
                </div>
            </div>
        </div>
        <div class="row my-1">
            <div class="col">
                <button type="button" class="btn btn-secondary" v-on:click="$emit('step3back')">Prev</button>
            </div>
            <div class="col text-right">
                <button type="button" class="btn btn-primary" v-on:click="generate">Generate</button>
            </div>
        </div>
    </div>
</template>

<script>
import Ui from "../js/ui.js";
import _ from "lodash";
import domtoimage from "dom-to-image";

export default {
    props: {
        step1: Object,
        step2: Object,
        step3: Object
    },
    data: function() {
        return {};
    },
    created: function() {
        if (this.step3.converters.length < 1) {
            this.step3.converters.push({
                name: "S",
                desc: "",
                value: this.step1.min
            });
        }
    },
    methods: {
        addConverter: function() {
            this.step3.converters.push({
                name: "",
                desc: "",
                value: this.step1.min
            });
        },
        delConverter: function(name) {
            this.step3.converters = this.step3.converters.filter(function(
                item
            ) {
                return item.name != name;
            });
        },
        validateConverter: function(converter) {
            if (converter.value < this.step1.min) {
                converter.value = this.step1.min;
            }
            if (converter.value > this.step1.max) {
                converter.value = this.step1.max;
            }
        },
        charaInRange: function(cgroup, converter) {
            var min = converter.value;
            var max = null;
            var converterindex = this.orderedConverters.indexOf(converter);
            if (converterindex > 0) {
                max = this.orderedConverters[converterindex - 1].value;
            }
            var scores = this.step2.scores;
            var scoreInRange = _.chain(scores)
                .toPairs()
                .filter(function(scorePair) {
                    if (scorePair[0] == "subjectsJson") {
                        return false;
                    }
                    if (scorePair[1].totalScore < min) {
                        return false;
                    }
                    if (max != null && scorePair[1].totalScore >= max) {
                        return false;
                    }
                    return true;
                })
                .orderBy(function(o) {
                    return o[1].totalScore;
                }, "desc")
                .value();
            var result = [];
            for (var i = 0; i < scoreInRange.length; i++) {
                var chara = _.find(cgroup, function(chara) {
                    return chara.id == scoreInRange[i][0];
                });
                if (chara != null) result.push(chara);
            }
            return result;
            //return _.filter(cgroup, function(chara) {
            //                return _.map(scoreInRange, 0).indexOf(chara.id + "") >= 0;
            //          });
        },
        generate: function() {
            var w = window.open("about:blank;", "_blank");
            var node = document.getElementById("waifuRankingTable");
            domtoimage
                .toPng(node, { bgcolor: "#fff" })
                .then(function(dataUrl) {
                    var img = new Image();
                    img.src = dataUrl;
                    w.document.body.appendChild(img);
                })
                .catch(function(error) {
                    console.error("generate error", error);
                });
        },
        UiGetText: function(key, key2) {
            return Ui.getText(key, key2);
        }
    },
    computed: {
        attributes: function() {
            return Ui.getAll("attribute");
        },
        orderedConverters: function() {
            return _.orderBy(this.step3.converters, "value", "desc");
        }
    }
};
</script>
<style scoped>
.actress-icon {
    width: 4rem;
    height: 4rem;
    margin: 0.25rem;
}
</style>

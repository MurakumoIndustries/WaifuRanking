<template>
    <div class="py-3">
        <h5>Settings</h5>
        <form>
            <div class="form-group">
                <label>Rate Subjects</label>
                <div
                    class="input-group"
                    v-for="subject in step1.subjects"
                    v-bind:key="subject.name"
                >
                    <div class="input-group-prepend">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            :disabled="step1.subjects.length<=1"
                            v-on:click="delSubject(subject.name)"
                        >-</button>
                        <button type="button" class="btn btn-secondary" v-on:click="addSubject()">+</button>
                    </div>
                    <input
                        type="text"
                        class="form-control"
                        v-model.lazy="subject.name"
                        v-on:change="changeSubject()"
                    >
                    <input type="number" class="form-control" v-model.lazy.number="subject.percent">
                </div>
            </div>
            <div class="form-group">
                <label>Score Range</label>
                <div class="form-row">
                    <div class="col-4">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Min</span>
                            </div>
                            <input
                                type="number"
                                class="form-control"
                                placeholder="Min"
                                v-model.number="step1.min"
                            >
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Max</span>
                            </div>
                            <input
                                type="number"
                                class="form-control"
                                placeholder="Max"
                                v-model.number="step1.max"
                            >
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Step</span>
                            </div>
                            <input
                                type="number"
                                class="form-control"
                                placeholder="Step"
                                v-model.number="step1.step"
                            >
                        </div>
                    </div>
                </div>
                <small
                    class="form-text text-muted text-truncate"
                >Available Score:{{step1.getAvailableScore().join(', ')}}</small>
            </div>
            <div class="form-group form-check">
                <label class="form-check-label">
                    <input type="checkbox" class="form-check-input" v-model="step1.ratebyattribute">Rate by attribute
                </label>
            </div>
            <div class="form-group form-check">
                <label class="form-check-label">
                    <input type="checkbox" class="form-check-input" v-model="step1.excludecollabo">Exclude Collabo Actress
                </label>
            </div>
            <div class="form-group form-check">
                <label class="form-check-label">
                    <input type="checkbox" class="form-check-input" v-model="step1.excludeanother">Exclude Another Character
                </label>
            </div>
        </form>
        <div class="row">
            <div class="col">
                <button type="button" class="btn btn-secondary" v-on:click="$emit('step1back')">Prev</button>
            </div>
            <div class="col text-right">
                <button
                    type="button"
                    class="btn btn-primary"
                    v-on:click="$emit('step1complete')"
                >Next</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        step1: Object,
        step2: Object
    },
    data: function() {
        return {};
    },
    methods: {
        addSubject: function() {
            this.step1.subjects.push({ name: "", percent: 0 });
        },
        delSubject: function(name) {
            this.step1.subjects = this.step1.subjects.filter(function(item) {
                return item.name != name;
            });
        },
        changeSubject: function() {
            if (
                JSON.stringify(_.map(this.step1.subjects, "name")) !=
                this.step2.scores.subjectsJson
            ) {
                this.step2.scores = {};
            }
        }
    }
};
</script>
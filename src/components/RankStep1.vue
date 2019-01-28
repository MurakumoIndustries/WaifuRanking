<template>
    <div class="py-3">
        <h5>Settings</h5>
        <form>
            <div class="form-group">
                <label>Rate Subjects</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="subjectsjson"
                >
                <small
                    class="form-text text-muted"
                >Sample:{"Character":0.6,"Weapon":0.2,"Gear":"0.2"}</small>
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
        return {
            subjectsjson: JSON.stringify(this.step1.subjects)
        };
    },
    methods: {},
    watch: {
        subjectsjson: function() {
            try {
                this.step1.subjects = JSON.parse(this.subjectsjson);
            } catch {
                this.step1.subjects = { Score: 1 };
            }
            if (
                JSON.stringify(this.step1.subjects) !=
                this.step2.scores.subjectsJson
            ) {
                this.step2.scores = {};
            }
        }
    }
};
</script>
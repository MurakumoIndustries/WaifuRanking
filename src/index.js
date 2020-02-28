import 'popper.js'
import 'bootstrap';

import './style.scss'

import Vue from 'vue'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.start();

import Router from './js/router.js';
import Data from './js/data.js'
import Ui from './js/ui';

NProgress.set(0.1);
Vue.prototype.Ui = Ui;
Ui.getLang();
NProgress.set(0.3);
Data.init().then(function () {
    NProgress.set(0.9);
    Router.init();
    NProgress.done();
});

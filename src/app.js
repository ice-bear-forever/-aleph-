/*
  src/app.js — app setup
  Copyright (C) 2021 John Trinh

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// load css with webpack
import './app.css';
import './print.css';

// import js
import {
  ease,
  fadeElement,
  getCSSNum,
  loadProfile,
  loadQuestionSets,
  setClickEvents,
  showStart,
  updateProfilePage
} from './functions';
import {e} from './elements';

// environment variables

// dynamic version setting
const alephVersion = '0.8.4';

// set version numbers
e.titleVersion.innerHTML = `v${alephVersion}`;
e.footerVersion.innerHTML = `version ${alephVersion}`;

e.timerOn.onchange = function () {
  fadeElement('in', e.timerDisplay, getCSSNum('transition-speed'), ease.inOutSine);
};
e.timerOff.onchange = function () {
  fadeElement('out', e.timerDisplay, getCSSNum('transition-speed'), ease.inOutSine);
};

Neutralino.init({
  // fade in body element, start other animation tasks after window loads
  load: function () {
    updateProfilePage();
    loadProfile();
    loadQuestionSets();
    fadeElement('in', document.body, getCSSNum('transition-speed'), ease.inOutSine);
    showStart();
    setClickEvents();
  },
  pingSuccessCallback: function () {

  },
  pingFailCallback: function () {

  }
});

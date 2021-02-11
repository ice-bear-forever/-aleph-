/*
  src/elements.js — defines page elements
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

// define HTML DOM elements
export const e = {
  back: document.getElementById('back-button'),
  continueButton: document.getElementById('continue-button'),
  footerVersion: document.getElementById('footer-version'),
  helpBox: document.getElementById('help-box'),
  helpButton: document.getElementById('help-button'),
  inProgressMsg: document.getElementById('in-progress-msg'),
  loadBackupButton: document.getElementById('load-backup-button'),
  maq: {},
  maqlist: document.getElementById('multiple-answer-answer-list'),
  mcq: {},
  mcqlist: document.getElementById('multiple-choice-answer-list'),
  next: document.getElementById('next-button'),
  printButton: document.getElementById('print-button'),
  profile: {
    name: document.getElementById('profile-name-input'),
    colors: {
      fg: document.getElementById('profile-color-fg-input'),
      bg: document.getElementById('profile-color-bg-input'),
      accent: document.getElementById('profile-color-accent-input'),
      mid1: document.getElementById('profile-color-mid1-input'),
      mid2: document.getElementById('profile-color-mid2-input')
    },
    quizHeader: document.getElementById('profile-quiz-header'),
    quizList: document.getElementById('profile-quiz-list')
  },
  profileBox: document.getElementById('profile-box'),
  profileButton: document.getElementById('profile-button'),
  questionSetDropdown: document.getElementById('question-set-dropdown'),
  questionSetDropdownBox: document.getElementById('question-set-dropdown-box'),
  questionSetDropdownButton: document.getElementById('question-set-dropdown-button'),
  quickSettingsBox: document.getElementById('timer-box'),
  results: {
    ended: document.getElementById('results-ended'),
    name: document.getElementById('results-name'),
    questions: document.getElementById('results-questions'),
    score: document.getElementById('results-score'),
    setAuthor: document.getElementById('results-set-info-author'),
    setName: document.getElementById('results-set-info-name'),
    started: document.getElementById('results-started'),
    timeTaken: document.getElementById('results-time-taken')
  },
  resultsBox: document.getElementById('results-box'),
  shortans: document.getElementById('short-answer-input'),
  startBox: document.getElementById('start-box'),
  startButton: document.getElementById('start-button'),
  stopButton: document.getElementById('stop-button'),
  tf: {
    true: document.getElementById('true-input'),
    false: document.getElementById('false-input')
  },
  timerDisplay: document.getElementById('game-timer'),
  timerOff: document.getElementsByName('timer-toggle')[1],
  timerOn: document.getElementsByName('timer-toggle')[0],
  title: document.getElementById('title'),
  titleVersion: document.getElementById('title-version'),
  question: document.getElementById('question')
};

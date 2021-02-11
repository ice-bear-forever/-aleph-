/*
  src/functions.js — site scripting
  Copyright (C) 2021 bear

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

import {e} from './elements';

let questionSets;
let activeQuestionSet;
let quiz;
let currentQuestionNum;

// preferences object for active references
let profile = {
  name: 'player',
  colors: {
    fg: '#000000',
    bg: '#ffffff',
    mid1: '#949494',
    mid2: '#d6d6d6',
    accent: '#ff0000'
  },
  quizzes: []
};

// pulls data from profile form and applies it to internal data and data save
export function updateProfileData () {
  // save update profile info
  loadInfo();
  // udpate colors
  loadColors();
  applyColors();
  updateColorPickers();
  // save profile to disk
  saveProfile();
}

// reads question set directory and loads all the files
export function loadQuestionSets () {
  // resets list of sets and dropdown menu
  questionSets = [];
  e.questionSetDropdown.innerHTML = '';
  // read set directory
  Neutralino.filesystem.readDirectory('./app/assets/questionSets', function (data) {
    // remove all directory items and non-json files
    let files = [];
    for (let i = 0; i < data.files.length; i++) {
      if (data.files[i].type === 'file' && data.files[i].name.slice(-5) === '.json') {
        files.push(data.files[i]);
      }
    }
    // if question sets are actually present
    if (files.length > 0) {
      // create new question set from each file in list
      for (let i = 0; i < files.length; i++) {
        // callback required for race case, tries to make html elements before question set is
        // loaded otherwise
        questionSets.push(
            new QuestionSet(`./app/assets/questionSets/${files[i].name}`, function (obj) {

              // determines first and last elements in list and gives them rounded corners
              let corners = '';
              if (i === 0) corners += ' first';
              if (i === files.length - 1) corners += ' last';

              // make dropdown element
              let elId = `id="question-set-option-${i}"`;
              let elClass = `class="dropdown-item button${corners}"`;
              let elBody = `<strong>${obj.name}</strong> by <strong>${obj.author}</strong>`;
              let newEl = `<a href="#" ${elId} ${elClass}>${elBody}</a>`;
              // add dropdown element to dropdown
              e.questionSetDropdown.innerHTML += newEl;
              document.getElementById(`question-set-option-${i}`).onclick = function () {selectQuestionSet(i)};
            }));
      }
      // if no question lists are present
    } else {
      e.questionSetDropdown.innerHTML =
          '<a href="#" class="button first last"><em>no question sets!</em></a>';
    }
  }, function () {
    console.error('error');
  });
}

// set active question set, set its label in the button
export function selectQuestionSet (index) {
  if (questionSets.length === 0) {
    console.error('no question sets!');
    return;
  }
  activeQuestionSet = questionSets[index];
  // activates start button
  e.startButton.classList.remove('inactive');
  e.startButton.onclick = gameStart;
  e.startButton.innerHTML = 'START';
  // sets text in dropdown button
  e.questionSetDropdownButton.innerHTML =
      `<strong class="dropdown-button">${activeQuestionSet.name}</strong> by <strong class="dropdown-button">${activeQuestionSet.author}</strong>`;
}

// cancel quiz and return to start page
export function cancelQuiz () {
  stopQuestionTimers();
  quiz.timer.reset();
  quiz.inProgress = false;
  showStart();
}

// continue button logic
export function gameContinue () {
  switchWindow('question-box', 'switchable-main', ease.inOutSine);
  displayQuestion(currentQuestionNum);
  quiz.timer.start();
}

// loads backup file as a question set
export function loadBackup () {
  Neutralino.storage.getData('quizbackup', function (content) {
    // replace quiz object as saved one
    quiz = JSON.parse(JSON.stringify(content));
    currentQuestionNum = quiz.questionOn;
    // rehook timers because timer functions don't save in backup
    for (let i = 0; i < quiz.q.length; i++) {
      let val = quiz.q[i].timer.value;
      quiz.q[i].timer = new Timer(val);
    }
    let val = quiz.timer.value;
    quiz.timer = new Timer(val, e.timerDisplay);
    // normal game start stuff otherwise
    switchWindow('question-box', 'switchable-main', ease.inOutSine);
    displayQuestion(currentQuestionNum);
    quiz.timer.start();
  }, function () {
    console.error('error loading profile!');
  });
}

export function getCSSNum (name) {
  return Number.parseInt(getCSSVar(name).replace(/[^\d.-]/g, ''));
}

// easing functions for fadeElement
export const ease = {
  linear: function (t) {
    return t;
  },
  inOutSine: function (t) {
    return ( Math.cos(t * Math.PI) - 1 ) / -2;
  }
};

// fades specified element; direction "in" or "out", duration in ms
export function fadeElement (direction, element, duration, easeFunction, callback) {
  const interval = 20;
  // rough amt of change per step to reach specified duration
  const delta = 1 / ( duration / interval );
  let opacity;
  // starting values
  if (direction === 'out') {
    opacity = 1;
    element.style.opacity = '1';
  }
  if (direction === 'in') {
    opacity = 0;
    element.style.opacity = '0';
  }
  // set interval for making discrete changes
  const fadeInterval = setInterval(function () {
    if (direction === 'out') {
      opacity -= delta;
      // if not there yet, keep going, otherwise stop
      if (easeFunction(opacity) > 0) {
        element.style.opacity = easeFunction(opacity);
      } else {
        element.style.opacity = '0';
        clearInterval(fadeInterval);
        if (callback !== undefined) callback();
      }
    } else if (direction === 'in') {
      opacity += delta;
      // if not there yet, keep going, otherwise stop
      if (easeFunction(opacity) < 1) {
        element.style.opacity = easeFunction(opacity);
      } else {
        element.style.opacity = '1';
        clearInterval(fadeInterval);
        if (callback !== undefined) callback();
      }
    }
  }, interval);
}

// toggle dropdown element
export function toggleDropdown (elementId) {
  // get transition speed from css
  const speed = getCSSNum('transition-speed');
  let target = document.getElementById(elementId);
  // if visible, fade out then remove visible tag
  if (target.classList.contains('visible')) {
    fadeElement('out', target, speed, ease.linear, function () {
      target.classList.remove('visible');
    });
  } else {
    target.classList.add('visible');
    fadeElement('in', target, speed, ease.linear);
  }
}

// show start box
export function showStart () {
  if (e.startBox.style.display !== 'grid') {
    switchWindow('start-box', 'switchable-main', ease.inOutSine);
  }
  if (e.quickSettingsBox.style.opacity !== '1') {
    fadeElement('in', e.quickSettingsBox, getCSSNum('transition-speed'), ease.inOutSine);
  }
  e.loadBackupButton.style.display = 'none';
  checkForFile('./storage', 'quizbackup.json', function () {
    Neutralino.storage.getData('quizbackup', function (content) {
      const year = new Date(content.backupTime).getFullYear();
      const month = new Date(content.backupTime).getMonth() + 1;
      const day = new Date(content.backupTime).getDate();
      const hour = `${new Date(content.backupTime).getHours()}`.padStart(2, '0');
      const minute = `${new Date(content.backupTime).getMinutes()}`.padStart(2, '0');
      const second = `${new Date(content.backupTime).getSeconds()}`.padStart(2, '0');
      if (quiz !== undefined && quiz.inProgress === true) {
        e.loadBackupButton.style.display = 'none';
      } else {
        e.loadBackupButton.style.display = 'block';
        e.loadBackupButton.innerHTML =
            `Load backup from <strong>${month}/${day}/${year} ${hour}:${minute}:${second}</strong>`;
      }
    }, function () {
      console.error('error loading backup!');
    });
  });
  if (quiz !== undefined && quiz.inProgress === true) {
    pauseQuiz();
    e.inProgressMsg.style.display = 'block';
    e.questionSetDropdownBox.style.display = 'none';
    e.stopButton.style.display = 'block';
    e.continueButton.style.display = 'flex';
    e.startButton.style.display = 'none';
  } else {
    e.inProgressMsg.style.display = 'none';
    e.questionSetDropdownBox.style.display = 'block';
    e.stopButton.style.display = 'none';
    e.continueButton.style.display = 'none';
    e.startButton.style.display = 'flex';
  }
}

// show profile page
export function showProfile () {
  if (e.profileBox.style.display !== 'grid') {
    switchWindow('profile-box', 'switchable-main', ease.inOutSine);
  }
  if (e.quickSettingsBox.style.opacity !== '0') {
    fadeElement('out', e.quickSettingsBox, getCSSNum('transition-speed'), ease.inOutSine);
  }
  if (quiz !== undefined && quiz.inProgress === true) pauseQuiz();
  loadProfile();
}

// show help page
export function showHelp () {
  if (e.helpBox.style.display !== 'grid') {
    switchWindow('help-box', 'switchable-main', ease.inOutSine);
  }
  if (e.quickSettingsBox.style.opacity !== '0') {
    fadeElement('out', e.quickSettingsBox, getCSSNum('transition-speed'), ease.inOutSine);
  }
  if (quiz !== undefined && quiz.inProgress === true) pauseQuiz();
}

// displays quiz results for quiz of specified index
export function showResults (index) {
  if (index === undefined) index = profile.quizzes.length - 1;
  if (e.resultsBox.style.display !== 'grid') {
    switchWindow('results-box', 'switchable-main', ease.inOutSine);
  }
  if (e.quickSettingsBox.style.opacity !== '0') {
    fadeElement('out', e.quickSettingsBox, getCSSNum('transition-speed'), ease.inOutSine);
  }
  let selected = profile.quizzes[index];
  let correct = scoreQuiz(index);
  e.results.name.innerHTML = profile.name;
  e.results.started.innerHTML = new Date(selected.startTime).toLocaleString();
  e.results.ended.innerHTML = new Date(selected.finishTime).toLocaleString();
  e.results.timeTaken.innerHTML = selected.timer.display;
  e.results.score.innerHTML = `${correct}/${selected.q.length}`;
  e.results.setName = selected.fromQuiz.name;
  e.results.setAuthor = selected.fromQuiz.author;
  makeQuestionDisplays(index);
  scrollToTop();
}

// loads profile data
export function loadProfile () {
  checkForFile('./storage', 'profile.json', function () {
    Neutralino.storage.getData('profile', function (content) {
      console.log(content);
      for (let item in content) {
        profile[item] = content[item];
      }
      updateProfilePage();
      applyColors();
    }, function () {
      console.error('error loading profile!');
    });
  });
}

// sets ui elements in profile page to correct values
export function updateProfilePage () {
  updateProfileInputs();
  updateColorPickers();
  makeQuizDisplays();
}

// sets onclick functions for ui elements
export function setClickEvents () {
  // button click handling
  e.title.onclick = function () {showStart()};
  e.profileButton.onclick = function () {showProfile()};
  e.helpButton.onclick = function () {showHelp()};
  e.questionSetDropdownButton.onclick = function () {toggleDropdown('question-set-dropdown'
)
};
  e.loadBackupButton.onclick = function () {loadBackup()};
  e.stopButton.onclick = function () {cancelQuiz()};
  e.continueButton.onclick = function () {gameContinue()};
  e.printButton.onclick = function () {window.print()};

// window click handling
  window.onclick = function (event) {
    // if dropdown button is not clicked
    if (!event.target.matches('.dropdown-button')) {
      const dropdowns = document.getElementsByClassName('dropdown-content');
      for (let i = 0; i < dropdowns.length; i++) {
        const openDropdown = dropdowns[i];
        // close all visible dropdown elements
        if (openDropdown.classList.contains('visible')) {
          toggleDropdown(openDropdown.id);
        }
      }
    }
    if (e.profileBox.style.display !== 'none') updateProfileData();
  };
}

// stop all individual question timers
function stopQuestionTimers () {
  for (let i = 0; i < quiz.q.length; i++) {
    quiz.q[i].timer.stop();
  }
}

// saves progress and stops timers
function pauseQuiz () {
  markAnswer();
  saveQuizData('quizbackup');
  stopQuestionTimers();
  quiz.timer.stop();
}

// check if answer field has input
function checkForAns () {
  let type = quiz.q[currentQuestionNum].type;
  if (type === 'multiple-choice') {
    let group = document.getElementsByName('multiple-choice-answers');
    for (let i = 0; i < group.length; i++) {
      if (group[i].checked === true) return true;
    }
  } else if (type === 'true-false') {
    let group = document.getElementsByName('true-false-answers');
    for (let i = 0; i < group.length; i++) {
      if (group[i].checked === true) return true;
    }
  } else if (type === 'short-answer') {
    if (e.shortans.value !== '') return true;
  } else if (type === 'multiple-answer') {
    let group = document.getElementsByName('multiple-answer-answers');
    for (let i = 0; i < group.length; i++) {
      if (group[i].checked === true) return true;
    }
  }
  return false;
}

// makes a new quiz of specified length
function makeNewQuiz (num) {
  console.log('making a new quiz!');
  quiz = new Quiz(num);
  console.log(quiz);
}

// format nav buttons based on current question number
function formatNavButtons (num) {
  // disable back button if first question
  if (num === 0) {
    e.back.onclick = undefined;
    e.back.classList.add('inactive');
  } else {
    e.back.onclick = goBack;
    e.back.classList.remove('inactive');
  }
  // change next button to finish if last question
  if (num === quiz.q.length - 1) {
    e.next.onclick = function () {finishQuiz()};
    e.next.innerHTML = 'finish';
  } else {
    e.next.onclick = goForth;
    e.next.innerHTML = 'next';
  }
}

// saves answer value of current question to question object
function markAnswer () {
  let type = quiz.q[currentQuestionNum].type;
  let value;
  if (checkForAns()) {
    if (type === 'multiple-choice') {
      value = document.querySelector(`input[name="multiple-choice-answers"]:checked`).value;
    } else if (type === 'true-false') {
      value = document.querySelector(`input[name="true-false-answers"]:checked`).value;
    } else if (type === 'short-answer') {
      value = e.shortans.value;
    } else if (type === 'multiple-answer') {
      // iterates to catch multiple answers
      value = [];
      for (let i = 1; i <= Object.keys(e.maq).length; i++) {
        if (e.maq[i].checked) value.push(i);
        console.log(e.maq[i]);
      }
    } else value = undefined;
    quiz.q[currentQuestionNum].answer = value;
  }
}

// pushes current quiz data to disk
function saveQuizData (filename) {
  quiz.backupTime = Date.now();
  quiz.questionOn = currentQuestionNum;
  let data = {
    bucket: filename,
    content: JSON.parse(JSON.stringify(quiz))
  };
  // strip functions from timers
  data.content = stripTimers(data.content);
  // save data
  Neutralino.storage.putData(data, function () {
    console.log(`Data saved as storage/${filename}.json`);
  }, function () {
    console.error('An error occured while saving the data!');
  });
}

// removes current quiz backup
function deleteBackup () {
  Neutralino.filesystem.removeFile('./storage/quizbackup.json', function (data) {
    console.log(data);
  }, function () {
    console.error('error');
  });
}

// strip timer functions from quiz data
function stripTimers (quiz) {
  quiz = JSON.parse(JSON.stringify(quiz));
  for (let i = 0; i < quiz.q.length; i++) {
    quiz.q[i].timer = {
      value: quiz.q[i].timer.value,
      display: quiz.q[i].timer.display
    };
  }
  quiz.timer = {
    value: quiz.timer.value,
    display: quiz.timer.display
  };
  return quiz;
}

// set specified question in ui
function displayQuestion (num) {
  stopQuestionTimers();
  let q = quiz.q[num];
  // set internal var
  currentQuestionNum = num;
  // set question text
  e.question.innerHTML = q.question;
  let windowTarget;
  // format multiple choice q
  if (q.type === 'multiple-choice') {
    createMCQElements(q);
    // set previous answer, if any
    if (q.answer !== undefined) e.mcq[q.answer].checked = true;
    // specify window to switch to
    windowTarget = 'multiple-choice-answer-box';
  }
  // format true false q
  else if (q.type === 'true-false') {
    // set previous answer, if any
    if (q.answer !== undefined) e.tf[q.answer].checked = true;
    // specify window to switch to
    windowTarget = 'true-false-answer-box';
  }
  // format short answer q
  else if (q.type === 'short-answer') {
    // set previous answer, if any
    if (q.answer !== undefined) e.shortans.value = q.answer;
    // specify window to switch to
    windowTarget = 'short-answer-box';
  }
  // format multiple answer q
  else if (q.type === 'multiple-answer') {
    createMAQElements(q);
    // set previous answer, if any
    if (q.answer !== undefined) {
      for (let i = 0; i < q.answer.length; i++) e.maq[q.answer[i]].checked = true;
    }
    // specify window to switch to
    windowTarget = 'multiple-answer-answer-box';
  }
  formatNavButtons(num);
  // switch to proper window and start question timer
  switchWindow(windowTarget, 'switchable-answers', ease.inOutSine, function () {
    q.timer.start();
  });
}

// create html elements from given mcq object
function createMCQElements (q) {
  // empty answer list
  e.mcqlist.innerHTML = '';
  e.mcq = {};
  for (let i = 1; i <= q.options.length; i++) {
    // create html elements and add to page
    e.mcqlist.innerHTML += `
        <div class="invisible-input">
            <input id="multiple-choice-answer-${i}" name="multiple-choice-answers" type="radio" value="${i}"/>
            <label class="multiple-choice-answer answer button" for="multiple-choice-answer-${i}">
                ${q.options[i - 1]}
            </label>
        </div>`;
  }
  for (let i = 1; i <= q.options.length; i++) {
    // bind new elements to element directory
    e.mcq[i] = document.getElementById(`multiple-choice-answer-${i}`);
  }
}

// create html elements from given maq object
function createMAQElements (q) {
  // empty answer list
  e.maqlist.innerHTML = '';
  e.maq = {};
  for (let i = 1; i <= q.options.length; i++) {
    // create html elements and add to page
    e.maqlist.innerHTML += `
        <div class="invisible-input">
            <input id="multiple-answer-answer-${i}" name="multiple-answer-answers" type="checkbox" value="${i}"/>
            <label class="multiple-answer-answer answer button" for="multiple-answer-answer-${i}">
                ${q.options[i - 1]}
            </label>
        </div>`;
  }
  for (let i = 1; i <= q.options.length; i++) {
    // bind new elements to element directory
    e.maq[i] = document.getElementById(`multiple-answer-answer-${i}`);
  }
}

// scores given question from object and returns true (correct) or false (incorrect)
function scoreQuestion (q) {
  if (q.answer === undefined) return false;
  if (q.type === 'multiple-choice') {
    if (q.correct === Number.parseInt(q.answer)) return true;
  } else if (q.type === 'true-false') {
    if (q.correct.toString() === q.answer) return true;
  } else if (q.type === 'short-answer') {
    if (q.correct.includes(q.answer.trim())) return true;
  } else if (q.type === 'multiple-answer') {
    if (q.correct.length !== q.answer.length) return false;
    for (let i = 0; i < q.correct.length; i++) {
      if (q.correct[i] !== q.answer[i]) return false;
    }
    return true;
  }
  return false;
}

// scores quiz of given index and returns number correct
function scoreQuiz (quizIndex) {
  let selected = profile.quizzes[quizIndex];
  let correct = 0;
  for (let i = 0; i < selected.q.length; i++) {
    if (scoreQuestion(selected.q[i])) correct++;
  }
  return correct;
}

// return to previous question
function goBack () {
  saveQuizData('quizbackup');
  markAnswer();
  displayQuestion(currentQuestionNum - 1);
}

// continue to next question
function goForth () {
  saveQuizData('quizbackup');
  markAnswer();
  displayQuestion(currentQuestionNum + 1);
}

// finish quiz and display results
function finishQuiz () {
  markAnswer();
  stopQuestionTimers();
  quiz.finishTime = Date.now();
  quiz.inProgress = false;
  saveQuizToProfile();
  deleteBackup();
  showResults();
  quiz.timer.reset();
}

// start button logic
function gameStart () {
  makeNewQuiz(4);
  switchWindow('question-box', 'switchable-main', ease.inOutSine);
  displayQuestion(0);
  quiz.timer.start();
  quiz.startTime = Date.now();
  quiz.inProgress = true;
}

// CSS variable handlers
function setCSSVar (name, value) {
  document.documentElement.style.setProperty(`--${name}`, value);
}

function getCSSVar (name) {
  return window.getComputedStyle(document.documentElement)
               .getPropertyValue(`--${name}`);
}

// animated switch between different panels within specified class
function switchWindow (targetId, targetClass, easeFunction, callback) {
  // get all switchable windows
  const windows = document.getElementsByClassName(targetClass);
  // save window to switch to
  const targetWindow = windows[targetId];

  // find (first, if more than one) currently displayed window and hide others
  let currentWindow;
  for (let i = 0; i < windows.length; i++) {
    if (windows[i].style.display === 'grid' && currentWindow === undefined) {
      currentWindow = windows[i];
    } else {
      windows[i].style.display = 'none';
      windows[i].style.opacity = '0';
    }
  }

  // if window is present, fade out and disable it, then fade in target window
  const speed = getCSSNum('transition-speed');
  if (currentWindow === undefined) {
    targetWindow.style.display = 'grid';
    fadeElement('in', targetWindow, speed, easeFunction, callback);
  } else {
    fadeElement('out', currentWindow, speed, easeFunction, function () {
      currentWindow.style.display = 'none';
      targetWindow.style.display = 'grid';
      fadeElement('in', targetWindow, speed, easeFunction, callback);
    });
  }
}

// make question elements of currently finished or specified quiz for results page
function makeQuestionDisplays (quizIndex) {
  const working = profile.quizzes[quizIndex];
  e.results.questions.innerHTML = '';
  for (let i = 0; i < working.q.length; i++) {
    let q = working.q[i];
    let prompt = q.question;
    let color = scoreQuestion(q) ? '#40ff40' : '#ff4040';
    let type = q.type;
    let available = '';
    if (q.type === 'multiple-choice' || q.type === 'multiple-answer') {
      for (let j = 0; j < q.options.length; j++) {
        available += '• ' + q.options[j] + '<br/>';
      }
    }
    let given = '';
    if (q.answer === undefined) {
      given = 'none';
    } else if (q.type === 'multiple-answer') {
      for (let j = 0; j < q.answer.length; j++) {
        given += '• ' + q.options[q.answer[j] - 1] + '<br/>';
      }
    } else if (q.type === 'multiple-choice') {
      given = q.options[q.answer - 1];
    } else {
      given = q.answer;
    }
    let correct = '';
    if (q.type === 'multiple-answer') {
      for (let j = 0; j < q.correct.length; j++) {
        correct += '• ' + q.options[q.correct[j] - 1] + '<br/>';
      }
    } else if (q.type === 'short-answer') {
      for (let j = 0; j < q.correct.length; j++) {
        correct += '• ' + q.correct[j] + '<br/>';
      }
    } else if (q.type === 'multiple-choice') {
      correct = q.options[q.correct - 1];
    } else {
      correct = q.correct;
    }
    let header = `<h3 class="monospace" style="color: ${color}">${i + 1} – ${prompt}</h3>`;
    let typeEl = `<div class="results-stat-box">
                      <h4 class="monospace">type:</h4>
                      <p>${type}</p>
                  </div>`;

    let availableEl;
    if (available !== '') {
      availableEl = `<div class="results-stat-box">
                         <h4 class="monospace">available answers:</h4>
                         <p>${available}</p>
                     </div>`;
    } else {
      availableEl = '';
    }
    let givenEl = `<div class="results-stat-box">
                     <h4 class="monospace">given answer:</h4>
                     <p>${given}</p>
                 </div>`;
    if (q.type === 'multiple-answer' && q.answer !== undefined) {
      if (q.answer.length > 1)
        givenEl = `<div class="results-stat-box">
                     <h4 class="monospace">given answers:</h4>
                     <p>${given}</p>
                 </div>`;
    }
    let correctEl;
    if (( q.type === 'short-answer' || q.type === 'multiple-answer' ) && q.correct.length > 1) {
      correctEl = `<div class="results-stat-box">
                       <h4 class="monospace">correct answers:</h4>
                       <p>${correct}</p>
                   </div>`;
    } else {
      correctEl = `<div class="results-stat-box">
                       <h4 class="monospace">correct answer:</h4>
                       <p>${correct}</p>
                   </div>`;
    }
    let element = '<div class="results-question-box">' + header + typeEl + availableEl + givenEl +
                  correctEl + '</div>';
    e.results.questions.innerHTML += element;
  }
}

// make quiz elements for profile page
function makeQuizDisplays () {
  if (profile.quizzes.length === 0) {
    e.profile.quizList.innerHTML =
        `<p><i>you haven't completed any quizzes yet! once you have, you can find the results of 
         your finished quizzes here.</i></p>`;
  } else {
    e.profile.quizList.innerHTML = '';
    for (let i = 0; i < profile.quizzes.length; i++) {
      let cur = profile.quizzes[i];
      let date = new Date(cur.finishTime).toLocaleString();
      let score = scoreQuiz(i);
      let name = cur.fromQuiz.name;
      let element = `<div class="profile-quiz" id="profile-quiz-item-${i}"
                         style="background: linear-gradient(90deg, #80ff80 calc(100% * ${score} / ${cur.q.length}), #ff8080 0, #ff8080 100%)">
                         <p class="info monospace">${date}</p>
                         <p>score</p>
                         <p class="info monospace">${score}/${cur.q.length}</p>
                         <p>from quiz</p>
                         <p class="info monospace">${name}</p>
                     </div>`;
      e.profile.quizList.innerHTML += element;
      document.getElementById(`profile-quiz-item-${i}`).onclick = function () {showResults(i)};
    }
  }
}

// scrolls to top of window
function scrollToTop () {
  document.body.scrollTop = 0; // safari
  document.documentElement.scrollTop = 0; // chrome, firefox, ie, opera
}

// saves finished quiz to profile
function saveQuizToProfile () {
  const quizcopy = stripTimers(quiz);
  profile.quizzes.push(quizcopy);
  saveProfile();
}

// set contrasts and backgrounds for color boxes
function updateColorPickers () {
  setContrast(profile.colors.fg, e.profile.colors.fg);
  setContrast(profile.colors.bg, e.profile.colors.bg);
  setContrast(profile.colors.accent, e.profile.colors.accent);
  setContrast(profile.colors.mid1, e.profile.colors.mid1);
  setContrast(profile.colors.mid2, e.profile.colors.mid2);
}

// sets form values to saved data
function updateProfileInputs () {
  e.profile.name.value = profile.name;
  if (profile.quizzes.length === 0) {

  }
}

// applies saved color values
function applyColors () {
  setCSSVar('fg-color', profile.colors.fg);
  setCSSVar('bg-color', profile.colors.bg);
  setCSSVar('accent-color', profile.colors.accent);
  setCSSVar('mid-color-1', profile.colors.mid1);
  setCSSVar('mid-color-2', profile.colors.mid2);
}

function setContrast (hex, element) {
  element.value = hex;
  element.style.color = getContrast(hex);
  element.style.backgroundColor = hex;
}

// loads profile info from profile form and applies it
function loadInfo () {
  profile.name = e.profile.name.value;
}

// loads colors from profile form and applies them
function loadColors () {
  let reg = new RegExp(/^#([0-9a-f]{6})$/i);
  let fg = e.profile.colors.fg.value;
  let bg = e.profile.colors.bg.value;
  let accent = e.profile.colors.accent.value;
  let mid1 = e.profile.colors.mid1.value;
  let mid2 = e.profile.colors.mid2.value;
  if (reg.test(fg)) {
    profile.colors.fg = fg;
    console.log('checks out!');
  }
  if (reg.test(bg)) profile.colors.bg = bg;
  if (reg.test(accent)) profile.colors.accent = accent;
  if (reg.test(mid1)) profile.colors.mid1 = mid1;
  if (reg.test(mid2)) profile.colors.mid2 = mid2;
}

// saves profile data
function saveProfile () {
  let data = {
    bucket: 'profile',
    content: JSON.parse(JSON.stringify(profile))
  };
  Neutralino.storage.putData(data, function () {
    console.log('profile saved to storage/profile.json!');
  }, function () {
    console.error('error saving profile!');
  });
}

// checks for file in directory and runs callback if found
function checkForFile (directory, file, callback) {
  Neutralino.filesystem.readDirectory(directory, function (data) {
    for (let i = 0; i < data.files.length; i++) {
      if (data.files[i].name === file) {
        callback();
      }
    }
  }, function () {
    console.error(':3');
  });
}

// returns a random number between range, inclusive
function getRndInt (min, max) {
  return Math.floor(Math.random() * ( max - min + 1 )) + min;
}

// returns given array in randomized order, preserving saved index (or array of indices) if given
function shuffleArray (array, index) {
  let newIndices = [];
  let newArray = [];
  if (typeof index === 'number') index = [index];
  let newIndex = [];
  for (let i = 0; i < array.length; i++) {
    let rand = getRndInt(0, array.length - 1);
    while (newIndices.includes(rand)) {
      rand = getRndInt(0, array.length - 1);
    }
    if (index.includes(rand)) newIndex.push(newIndices.length);
    newIndices.push(rand);
    newArray.push(array[rand]);
  }
  if (index !== undefined) return [newArray, newIndex];
  return newArray;
}

// returns rgb array from given hex color
function convertHexToRGB (hex) {
  hex = hex.replace('#', '');
  let rgb = [];
  rgb[0] = parseInt(hex.substr(0, 2), 16);
  rgb[1] = parseInt(hex.substr(2, 2), 16);
  rgb[2] = parseInt(hex.substr(4, 2), 16);
  return rgb;
}

// returns white or black depending on brightness of color given
function getContrast (hex) {
  const rgb = convertHexToRGB(hex);
  const brightness = Math.round(
      ( ( parseInt(rgb[0]) * 299 ) + ( parseInt(rgb[1]) * 587 ) + ( parseInt(rgb[2]) * 114 ) ) /
      1000);
  if (brightness > 125) {
    return 'black';
  } else {
    return 'white';
  }
}

// returns ISO 8601 formatted date and time string from given date obj
function getISO8601Time (date) {
  const d = date;
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  const hour = `${d.getHours()}`.padStart(2, '0');
  const minute = `${d.getMinutes()}`.padStart(2, '0');
  const second = `${d.getSeconds()}`.padStart(2, '0');
  return `${year}${month}${day}T${hour}${minute}${second}Z`;
}

// returns ms from ISO 8601 formatted date and time string
function getMSFromISO (str) {
  const year = str.slice(0, 4);
  const month = str.slice(4, 6);
  const day = str.slice(6, 8);
  const hour = str.slice(9, 11);
  const minute = str.slice(11, 13);
  const second = str.slice(13, 15);
  return new Date.parse(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
}

// timer object for game and per-question timing
class Timer {
  // optional starting value; optional HTML DOM element displays timer value
  constructor (value, element) {
    this.value = 0;
    this.display = '0:00.0';
    this.element = undefined;
    this.interval = undefined;
    this.element = element;
    if (typeof value !== 'number') value = 0;
    this.value = value;
    this.update();
    if (this.element !== undefined) {
      this.element.innerHTML = this.display;
    }
  }

  // starts timer
  start () {
    console.error('timer started!');
    const self = this;
    // if timer is already running this clears it, would just double speed otherwise
    clearInterval(this.interval);
    this.interval = setInterval(function () {
      self.value++;
      self.update();
    }, 100);
    return this;
  }

  // this should be obvious
  stop () {
    clearInterval(this.interval);
    return this;
  }

  // stops and sets to 0
  reset () {
    this.stop();
    this.value = 0;
    this.update();
    return this;
  }

  // updates display value in object and HTML DOM element
  update () {
    const secsTotal = this.value / 10;
    const mins = Math.floor(secsTotal / 60);
    const secsRemaining = ( Math.round(( secsTotal % 60 ) * 10) / 10 );
    let leadingZero = '';
    if (secsRemaining < 10) {
      leadingZero = '0';
    }
    let trailingZero = '';
    if (( ( secsRemaining * 10 ) % 10 ) === 0) {
      trailingZero = '.0';
    }
    this.display = `${mins}:${leadingZero}${secsRemaining}${trailingZero}`;
    if (this.element !== undefined) {
      this.element.innerHTML = this.display;
    }
    return this;
  }
}

// set of random questions
class Quiz {

  constructor (num) {
    this.q = [];
    this.startTime = undefined;
    this.backupTime = undefined;
    this.finishTime = undefined;
    this.questionOn = undefined;
    this.timer = undefined;
    this.fromQuiz = undefined;
    this.inProgress = false;
    let pickedQs = [];
    for (let i = 0; i < num; i++) {
      let rand = getRndInt(0, activeQuestionSet.q.length - 1);
      while (pickedQs.includes(rand)) {
        rand = getRndInt(0, activeQuestionSet.q.length - 1);
      }
      pickedQs.push(rand);
      this.q.push(JSON.parse(JSON.stringify(activeQuestionSet.q[rand])));
      // shuffle order of multiple choice/answer qs and retain correct answers
      // complex because correct answers are noted as its index+1
      if (this.q[i].type === 'multiple-choice') {
        let currentQ = this.q[i];
        let shuffle = shuffleArray(currentQ.options, currentQ.correct - 1);
        currentQ.options = shuffle[0];
        currentQ.correct = Number.parseInt(shuffle[1]) + 1;
      }
      if (this.q[i].type === 'multiple-answer') {
        let currentQ = this.q[i];
        let index = [];
        for (let j = 0; j < currentQ.correct.length; j++) {
          index.push(currentQ.correct[j] - 1);
        }
        let shuffle = shuffleArray(currentQ.options, index);
        currentQ.options = shuffle[0];
        for (let j = 0; j < shuffle[1].length; j++) {
          currentQ.correct[j] = Number.parseInt(shuffle[1][j]) + 1;
        }
      }
      // give each question timers
      this.q[i].timer = new Timer(0);
    }
    this.timer = new Timer(0, e.timerDisplay);
    console.log(this.timer);
    this.fromQuiz = JSON.parse(JSON.stringify(activeQuestionSet));
  }


}

// collection of questions, specified by json file
class QuestionSet {
  // loads the specified question set file into object with optional callback
  constructor (path, callback) {
    this.name = undefined;
    this.description = undefined;
    this.author = undefined;
    this.q = [];
    this.size = undefined;
    const self = this;
    console.log(path);
    Neutralino.filesystem.readFile(path, function (data) {
      const dataObj = JSON.parse(data.content);
      self.name = dataObj.name;
      self.description = dataObj.description;
      self.author = dataObj.author;
      for (let i = 0; i < dataObj.questions.length; i++) {
        self.q[i] = new Question(dataObj.questions[i]);
      }
      self.size = self.q.length;
      if (callback !== undefined) callback(self);
    }, function () {
      console.error('error');
    });
  }
}

// a question from a question set
class Question {
  constructor (data) {
    let item;
    for (item in data) {
      this[item] = data[item];
    }
  }
}

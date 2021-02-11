!function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);n(0),n(1);var o,i,r,s,a={back:document.getElementById("back-button"),continueButton:document.getElementById("continue-button"),footerVersion:document.getElementById("footer-version"),helpBox:document.getElementById("help-box"),helpButton:document.getElementById("help-button"),inProgressMsg:document.getElementById("in-progress-msg"),loadBackupButton:document.getElementById("load-backup-button"),maq:{},maqlist:document.getElementById("multiple-answer-answer-list"),mcq:{},mcqlist:document.getElementById("multiple-choice-answer-list"),next:document.getElementById("next-button"),printButton:document.getElementById("print-button"),profile:{name:document.getElementById("profile-name-input"),colors:{fg:document.getElementById("profile-color-fg-input"),bg:document.getElementById("profile-color-bg-input"),accent:document.getElementById("profile-color-accent-input"),mid1:document.getElementById("profile-color-mid1-input"),mid2:document.getElementById("profile-color-mid2-input")},quizHeader:document.getElementById("profile-quiz-header"),quizList:document.getElementById("profile-quiz-list")},profileBox:document.getElementById("profile-box"),profileButton:document.getElementById("profile-button"),questionSetDropdown:document.getElementById("question-set-dropdown"),questionSetDropdownBox:document.getElementById("question-set-dropdown-box"),questionSetDropdownButton:document.getElementById("question-set-dropdown-button"),quickSettingsBox:document.getElementById("timer-box"),results:{ended:document.getElementById("results-ended"),name:document.getElementById("results-name"),questions:document.getElementById("results-questions"),score:document.getElementById("results-score"),setAuthor:document.getElementById("results-set-info-author"),setName:document.getElementById("results-set-info-name"),started:document.getElementById("results-started"),timeTaken:document.getElementById("results-time-taken")},resultsBox:document.getElementById("results-box"),shortans:document.getElementById("short-answer-input"),startBox:document.getElementById("start-box"),startButton:document.getElementById("start-button"),stopButton:document.getElementById("stop-button"),tf:{true:document.getElementById("true-input"),false:document.getElementById("false-input")},timerDisplay:document.getElementById("game-timer"),timerOff:document.getElementsByName("timer-toggle")[1],timerOn:document.getElementsByName("timer-toggle")[0],title:document.getElementById("title"),titleVersion:document.getElementById("title-version"),question:document.getElementById("question")};function c(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}var u={name:"player",colors:{fg:"#000000",bg:"#ffffff",mid1:"#949494",mid2:"#d6d6d6",accent:"#ff0000"},quizzes:[]};function p(){u.name=a.profile.name.value,function(){var e=new RegExp(/^#([0-9a-f]{6})$/i),t=a.profile.colors.fg.value,n=a.profile.colors.bg.value,o=a.profile.colors.accent.value,i=a.profile.colors.mid1.value,r=a.profile.colors.mid2.value;e.test(t)&&(u.colors.fg=t,console.log("checks out!"));e.test(n)&&(u.colors.bg=n);e.test(o)&&(u.colors.accent=o);e.test(i)&&(u.colors.mid1=i);e.test(r)&&(u.colors.mid2=r)}(),j(),P(),C()}function d(){o=[],a.questionSetDropdown.innerHTML="",Neutralino.filesystem.readDirectory("./app/assets/questionSets",(function(e){for(var t=[],n=0;n<e.files.length;n++)"file"===e.files[n].type&&".json"===e.files[n].name.slice(-5)&&t.push(e.files[n]);if(t.length>0)for(var r=function(e){o.push(new R("./app/assets/questionSets/".concat(t[e].name),(function(n){var r="";0===e&&(r+=" first"),e===t.length-1&&(r+=" last");var s='id="question-set-option-'.concat(e,'"'),c='class="dropdown-item button'.concat(r,'"'),l="<strong>".concat(n.name,"</strong> by <strong>").concat(n.author,"</strong>"),u='<a href="#" '.concat(s," ").concat(c,">").concat(l,"</a>");a.questionSetDropdown.innerHTML+=u,document.getElementById("question-set-option-".concat(e)).onclick=function(){!function(e){if(0===o.length)return void console.error("no question sets!");i=o[e],a.startButton.classList.remove("inactive"),a.startButton.onclick=D,a.startButton.innerHTML="START",a.questionSetDropdownButton.innerHTML='<strong class="dropdown-button">'.concat(i.name,'</strong> by <strong class="dropdown-button">').concat(i.author,"</strong>")}(e)}})))},s=0;s<t.length;s++)r(s);else a.questionSetDropdown.innerHTML='<a href="#" class="button first last"><em>no question sets!</em></a>'}),(function(){console.error("error")}))}function m(e){return Number.parseInt(function(e){return window.getComputedStyle(document.documentElement).getPropertyValue("--".concat(e))}(e).replace(/[^\d.-]/g,""))}var f={linear:function(e){return e},inOutSine:function(e){return(Math.cos(e*Math.PI)-1)/-2}};function g(e,t,n,o,i){var r,s=1/(n/20);"out"===e&&(r=1,t.style.opacity="1"),"in"===e&&(r=0,t.style.opacity="0");var a=setInterval((function(){"out"===e?o(r-=s)>0?t.style.opacity=o(r):(t.style.opacity="0",clearInterval(a),void 0!==i&&i()):"in"===e&&(o(r+=s)<1?t.style.opacity=o(r):(t.style.opacity="1",clearInterval(a),void 0!==i&&i()))}),20)}function h(e){var t=m("transition-speed"),n=document.getElementById(e);n.classList.contains("visible")?g("out",n,t,f.linear,(function(){n.classList.remove("visible")})):(n.classList.add("visible"),g("in",n,t,f.linear))}function y(){"grid"!==a.startBox.style.display&&H("start-box","switchable-main",f.inOutSine),"1"!==a.quickSettingsBox.style.opacity&&g("in",a.quickSettingsBox,m("transition-speed"),f.inOutSine),a.loadBackupButton.style.display="none",_("./storage","quizbackup.json",(function(){Neutralino.storage.getData("quizbackup",(function(e){var t=new Date(e.backupTime).getFullYear(),n=new Date(e.backupTime).getMonth()+1,o=new Date(e.backupTime).getDate(),i="".concat(new Date(e.backupTime).getHours()).padStart(2,"0"),s="".concat(new Date(e.backupTime).getMinutes()).padStart(2,"0"),c="".concat(new Date(e.backupTime).getSeconds()).padStart(2,"0");void 0!==r&&!0===r.inProgress?a.loadBackupButton.style.display="none":(a.loadBackupButton.style.display="block",a.loadBackupButton.innerHTML="Load backup from <strong>".concat(n,"/").concat(o,"/").concat(t," ").concat(i,":").concat(s,":").concat(c,"</strong>"))}),(function(){console.error("error loading backup!")}))})),void 0!==r&&!0===r.inProgress?(k(),a.inProgressMsg.style.display="block",a.questionSetDropdownBox.style.display="none",a.stopButton.style.display="block",a.continueButton.style.display="flex",a.startButton.style.display="none"):(a.inProgressMsg.style.display="none",a.questionSetDropdownBox.style.display="block",a.stopButton.style.display="none",a.continueButton.style.display="none",a.startButton.style.display="flex")}function v(e){void 0===e&&(e=u.quizzes.length-1),"grid"!==a.resultsBox.style.display&&H("results-box","switchable-main",f.inOutSine),"0"!==a.quickSettingsBox.style.opacity&&g("out",a.quickSettingsBox,m("transition-speed"),f.inOutSine);var t=u.quizzes[e],n=O(e);a.results.name.innerHTML=u.name,a.results.started.innerHTML=new Date(t.startTime).toLocaleString(),a.results.ended.innerHTML=new Date(t.finishTime).toLocaleString(),a.results.timeTaken.innerHTML=t.timer.display,a.results.score.innerHTML="".concat(n,"/").concat(t.q.length),a.results.setName=t.fromQuiz.name,a.results.setAuthor=t.fromQuiz.author,function(e){var t=u.quizzes[e];a.results.questions.innerHTML="";for(var n=0;n<t.q.length;n++){var o=t.q[n],i=o.question,r=z(o)?"#40ff40":"#ff4040",s=o.type,c="";if("multiple-choice"===o.type||"multiple-answer"===o.type)for(var l=0;l<o.options.length;l++)c+="• "+o.options[l]+"<br/>";var p="";if(void 0===o.answer)p="none";else if("multiple-answer"===o.type)for(var d=0;d<o.answer.length;d++)p+="• "+o.options[o.answer[d]-1]+"<br/>";else p="multiple-choice"===o.type?o.options[o.answer-1]:o.answer;var m="";if("multiple-answer"===o.type)for(var f=0;f<o.correct.length;f++)m+="• "+o.options[o.correct[f]-1]+"<br/>";else if("short-answer"===o.type)for(var g=0;g<o.correct.length;g++)m+="• "+o.correct[g]+"<br/>";else m="multiple-choice"===o.type?o.options[o.correct-1]:o.correct;var h='<h3 class="monospace" style="color: '.concat(r,'">').concat(n+1," – ").concat(i,"</h3>"),y='<div class="results-stat-box">\n                      <h4 class="monospace">type:</h4>\n                      <p>'.concat(s,"</p>\n                  </div>"),v=void 0;v=""!==c?'<div class="results-stat-box">\n                         <h4 class="monospace">available answers:</h4>\n                         <p>'.concat(c,"</p>\n                     </div>"):"";var b='<div class="results-stat-box">\n                     <h4 class="monospace">given answer:</h4>\n                     <p>'.concat(p,"</p>\n                 </div>");"multiple-answer"===o.type&&void 0!==o.answer&&o.answer.length>1&&(b='<div class="results-stat-box">\n                     <h4 class="monospace">given answers:</h4>\n                     <p>'.concat(p,"</p>\n                 </div>"));var w=void 0;w=("short-answer"===o.type||"multiple-answer"===o.type)&&o.correct.length>1?'<div class="results-stat-box">\n                       <h4 class="monospace">correct answers:</h4>\n                       <p>'.concat(m,"</p>\n                   </div>"):'<div class="results-stat-box">\n                       <h4 class="monospace">correct answer:</h4>\n                       <p>'.concat(m,"</p>\n                   </div>");var q='<div class="results-question-box">'+h+y+v+b+w+"</div>";a.results.questions.innerHTML+=q}}(e),document.body.scrollTop=0,document.documentElement.scrollTop=0}function b(){_("./storage","profile.json",(function(){Neutralino.storage.getData("profile",(function(e){for(var t in console.log(e),e)u[t]=e[t];w(),j()}),(function(){console.error("error loading profile!")}))}))}function w(){a.profile.name.value=u.name,u.quizzes.length,P(),function(){if(0===u.quizzes.length)a.profile.quizList.innerHTML="<p><i>you haven't completed any quizzes yet! once you have, you can find the results of \n         your finished quizzes here.</i></p>";else{a.profile.quizList.innerHTML="";for(var e=function(e){var t=u.quizzes[e],n=new Date(t.finishTime).toLocaleString(),o=O(e),i=t.fromQuiz.name,r='<div class="profile-quiz" id="profile-quiz-item-'.concat(e,'"\n                         style="background: linear-gradient(90deg, #80ff80 calc(100% * ').concat(o," / ").concat(t.q.length,'), #ff8080 0, #ff8080 100%)">\n                         <p class="info monospace">').concat(n,'</p>\n                         <p>score</p>\n                         <p class="info monospace">').concat(o,"/").concat(t.q.length,'</p>\n                         <p>from quiz</p>\n                         <p class="info monospace">').concat(i,"</p>\n                     </div>");a.profile.quizList.innerHTML+=r,document.getElementById("profile-quiz-item-".concat(e)).onclick=function(){v(e)}},t=0;t<u.quizzes.length;t++)e(t)}}()}function q(){a.title.onclick=function(){y()},a.profileButton.onclick=function(){"grid"!==a.profileBox.style.display&&H("profile-box","switchable-main",f.inOutSine),"0"!==a.quickSettingsBox.style.opacity&&g("out",a.quickSettingsBox,m("transition-speed"),f.inOutSine),void 0!==r&&!0===r.inProgress&&k(),b()},a.helpButton.onclick=function(){"grid"!==a.helpBox.style.display&&H("help-box","switchable-main",f.inOutSine),"0"!==a.quickSettingsBox.style.opacity&&g("out",a.quickSettingsBox,m("transition-speed"),f.inOutSine),void 0!==r&&!0===r.inProgress&&k()},a.questionSetDropdownButton.onclick=function(){h("question-set-dropdown")},a.loadBackupButton.onclick=function(){Neutralino.storage.getData("quizbackup",(function(e){r=JSON.parse(JSON.stringify(e)),s=r.questionOn;for(var t=0;t<r.q.length;t++){var n=r.q[t].timer.value;r.q[t].timer=new A(n)}var o=r.timer.value;r.timer=new A(o,a.timerDisplay),H("question-box","switchable-main",f.inOutSine),T(s),r.timer.start()}),(function(){console.error("error loading profile!")}))},a.stopButton.onclick=function(){B(),r.timer.reset(),r.inProgress=!1,y()},a.continueButton.onclick=function(){H("question-box","switchable-main",f.inOutSine),T(s),r.timer.start()},a.printButton.onclick=function(){window.print()},window.onclick=function(e){if(!e.target.matches(".dropdown-button"))for(var t=document.getElementsByClassName("dropdown-content"),n=0;n<t.length;n++){var o=t[n];o.classList.contains("visible")&&h(o.id)}"none"!==a.profileBox.style.display&&p()}}function B(){for(var e=0;e<r.q.length;e++)r.q[e].timer.stop()}function k(){I(),x("quizbackup"),B(),r.timer.stop()}function S(e){0===e?(a.back.onclick=void 0,a.back.classList.add("inactive")):(a.back.onclick=M,a.back.classList.remove("inactive")),e===r.q.length-1?(a.next.onclick=function(){var e;I(),B(),r.timer.stop(),r.finishTime=Date.now(),r.inProgress=!1,e=E(r),u.quizzes.push(e),C(),Neutralino.filesystem.removeFile("./storage/quizbackup.json",(function(e){console.log(e)}),(function(){console.error("error")})),v()},a.next.innerHTML="finish"):(a.next.onclick=L,a.next.innerHTML="next")}function I(){var e,t=r.q[s].type;if(function(){var e=r.q[s].type;if("multiple-choice"===e){for(var t=document.getElementsByName("multiple-choice-answers"),n=0;n<t.length;n++)if(!0===t[n].checked)return!0}else if("true-false"===e){for(var o=document.getElementsByName("true-false-answers"),i=0;i<o.length;i++)if(!0===o[i].checked)return!0}else if("short-answer"===e){if(""!==a.shortans.value)return!0}else if("multiple-answer"===e)for(var c=document.getElementsByName("multiple-answer-answers"),l=0;l<c.length;l++)if(!0===c[l].checked)return!0;return!1}()){if("multiple-choice"===t)e=document.querySelector('input[name="multiple-choice-answers"]:checked').value;else if("true-false"===t)e=document.querySelector('input[name="true-false-answers"]:checked').value;else if("short-answer"===t)e=a.shortans.value;else if("multiple-answer"===t){e=[];for(var n=1;n<=Object.keys(a.maq).length;n++)a.maq[n].checked&&e.push(n),console.log(a.maq[n])}else e=void 0;r.q[s].answer=e}}function x(e){r.backupTime=Date.now(),r.questionOn=s;var t={bucket:e,content:JSON.parse(JSON.stringify(r))};t.content=E(t.content),Neutralino.storage.putData(t,(function(){console.log("Data saved as storage/".concat(e,".json"))}),(function(){console.error("An error occured while saving the data!")}))}function E(e){e=JSON.parse(JSON.stringify(e));for(var t=0;t<e.q.length;t++)e.q[t].timer={value:e.q[t].timer.value,display:e.q[t].timer.display};return e.timer={value:e.timer.value,display:e.timer.display},e}function T(e){B();var t,n=r.q[e];if(s=e,a.question.innerHTML=n.question,"multiple-choice"===n.type)!function(e){a.mcqlist.innerHTML="",a.mcq={};for(var t=1;t<=e.options.length;t++)a.mcqlist.innerHTML+='\n        <div class="invisible-input">\n            <input id="multiple-choice-answer-'.concat(t,'" name="multiple-choice-answers" type="radio" value="').concat(t,'"/>\n            <label class="multiple-choice-answer answer button" for="multiple-choice-answer-').concat(t,'">\n                ').concat(e.options[t-1],"\n            </label>\n        </div>");for(var n=1;n<=e.options.length;n++)a.mcq[n]=document.getElementById("multiple-choice-answer-".concat(n))}(n),void 0!==n.answer&&(a.mcq[n.answer].checked=!0),t="multiple-choice-answer-box";else if("true-false"===n.type)void 0!==n.answer&&(a.tf[n.answer].checked=!0),t="true-false-answer-box";else if("short-answer"===n.type)void 0!==n.answer&&(a.shortans.value=n.answer),t="short-answer-box";else if("multiple-answer"===n.type){if(function(e){a.maqlist.innerHTML="",a.maq={};for(var t=1;t<=e.options.length;t++)a.maqlist.innerHTML+='\n        <div class="invisible-input">\n            <input id="multiple-answer-answer-'.concat(t,'" name="multiple-answer-answers" type="checkbox" value="').concat(t,'"/>\n            <label class="multiple-answer-answer answer button" for="multiple-answer-answer-').concat(t,'">\n                ').concat(e.options[t-1],"\n            </label>\n        </div>");for(var n=1;n<=e.options.length;n++)a.maq[n]=document.getElementById("multiple-answer-answer-".concat(n))}(n),void 0!==n.answer)for(var o=0;o<n.answer.length;o++)a.maq[n.answer[o]].checked=!0;t="multiple-answer-answer-box"}S(e),H(t,"switchable-answers",f.inOutSine,(function(){n.timer.start()}))}function z(e){if(void 0===e.answer)return!1;if("multiple-choice"===e.type){if(e.correct===Number.parseInt(e.answer))return!0}else if("true-false"===e.type){if(e.correct.toString()===e.answer)return!0}else if("short-answer"===e.type){if(e.correct.includes(e.answer.trim()))return!0}else if("multiple-answer"===e.type){if(e.correct.length!==e.answer.length)return!1;for(var t=0;t<e.correct.length;t++)if(e.correct[t]!==e.answer[t])return!1;return!0}return!1}function O(e){for(var t=u.quizzes[e],n=0,o=0;o<t.q.length;o++)z(t.q[o])&&n++;return n}function M(){x("quizbackup"),I(),T(s-1)}function L(){x("quizbackup"),I(),T(s+1)}function D(){var e;e=4,console.log("making a new quiz!"),r=new F(e),console.log(r),H("question-box","switchable-main",f.inOutSine),T(0),r.timer.start(),r.startTime=Date.now(),r.inProgress=!0}function N(e,t){document.documentElement.style.setProperty("--".concat(e),t)}function H(e,t,n,o){for(var i,r=document.getElementsByClassName(t),s=r[e],a=0;a<r.length;a++)"grid"===r[a].style.display&&void 0===i?i=r[a]:(r[a].style.display="none",r[a].style.opacity="0");var c=m("transition-speed");void 0===i?(s.style.display="grid",g("in",s,c,n,o)):g("out",i,c,n,(function(){i.style.display="none",s.style.display="grid",g("in",s,c,n,o)}))}function P(){J(u.colors.fg,a.profile.colors.fg),J(u.colors.bg,a.profile.colors.bg),J(u.colors.accent,a.profile.colors.accent),J(u.colors.mid1,a.profile.colors.mid1),J(u.colors.mid2,a.profile.colors.mid2)}function j(){N("fg-color",u.colors.fg),N("bg-color",u.colors.bg),N("accent-color",u.colors.accent),N("mid-color-1",u.colors.mid1),N("mid-color-2",u.colors.mid2)}function J(e,t){t.value=e,t.style.color=function(e){var t=function(e){e=e.replace("#","");var t=[];return t[0]=parseInt(e.substr(0,2),16),t[1]=parseInt(e.substr(2,2),16),t[2]=parseInt(e.substr(4,2),16),t}(e);return Math.round((299*parseInt(t[0])+587*parseInt(t[1])+114*parseInt(t[2]))/1e3)>125?"black":"white"}(e),t.style.backgroundColor=e}function C(){var e={bucket:"profile",content:JSON.parse(JSON.stringify(u))};Neutralino.storage.putData(e,(function(){console.log("profile saved to storage/profile.json!")}),(function(){console.error("error saving profile!")}))}function _(e,t,n){Neutralino.filesystem.readDirectory(e,(function(e){for(var o=0;o<e.files.length;o++)e.files[o].name===t&&n()}),(function(){console.error(":3")}))}function Q(e,t){return Math.floor(Math.random()*(t-e+1))+e}function V(e,t){var n=[],o=[];"number"==typeof t&&(t=[t]);for(var i=[],r=0;r<e.length;r++){for(var s=Q(0,e.length-1);n.includes(s);)s=Q(0,e.length-1);t.includes(s)&&i.push(n.length),n.push(s),o.push(e[s])}return void 0!==t?[o,i]:o}var A=function(){function e(t,n){c(this,e),this.value=0,this.display="0:00.0",this.element=void 0,this.interval=void 0,this.element=n,"number"!=typeof t&&(t=0),this.value=t,this.update(),void 0!==this.element&&(this.element.innerHTML=this.display)}var t,n,o;return t=e,(n=[{key:"start",value:function(){console.error("timer started!");var e=this;return clearInterval(this.interval),this.interval=setInterval((function(){e.value++,e.update()}),100),this}},{key:"stop",value:function(){return clearInterval(this.interval),this}},{key:"reset",value:function(){return this.stop(),this.value=0,this.update(),this}},{key:"update",value:function(){var e=this.value/10,t=Math.floor(e/60),n=Math.round(e%60*10)/10,o="";n<10&&(o="0");var i="";return 10*n%10==0&&(i=".0"),this.display="".concat(t,":").concat(o).concat(n).concat(i),void 0!==this.element&&(this.element.innerHTML=this.display),this}}])&&l(t.prototype,n),o&&l(t,o),e}(),F=function e(t){c(this,e),this.q=[],this.startTime=void 0,this.backupTime=void 0,this.finishTime=void 0,this.questionOn=void 0,this.timer=void 0,this.fromQuiz=void 0,this.inProgress=!1;for(var n=[],o=0;o<t;o++){for(var r=Q(0,i.q.length-1);n.includes(r);)r=Q(0,i.q.length-1);if(n.push(r),this.q.push(JSON.parse(JSON.stringify(i.q[r]))),"multiple-choice"===this.q[o].type){var s=this.q[o],l=V(s.options,s.correct-1);s.options=l[0],s.correct=Number.parseInt(l[1])+1}if("multiple-answer"===this.q[o].type){for(var u=this.q[o],p=[],d=0;d<u.correct.length;d++)p.push(u.correct[d]-1);var m=V(u.options,p);u.options=m[0];for(var f=0;f<m[1].length;f++)u.correct[f]=Number.parseInt(m[1][f])+1}this.q[o].timer=new A(0)}this.timer=new A(0,a.timerDisplay),console.log(this.timer),this.fromQuiz=JSON.parse(JSON.stringify(i))},R=function e(t,n){c(this,e),this.name=void 0,this.description=void 0,this.author=void 0,this.q=[],this.size=void 0;var o=this;console.log(t),Neutralino.filesystem.readFile(t,(function(e){var t=JSON.parse(e.content);o.name=t.name,o.description=t.description,o.author=t.author;for(var i=0;i<t.questions.length;i++)o.q[i]=new Y(t.questions[i]);o.size=o.q.length,void 0!==n&&n(o)}),(function(){console.error("error")}))},Y=function e(t){var n;for(n in c(this,e),t)this[n]=t[n]};a.titleVersion.innerHTML="v".concat("0.1.0"),a.footerVersion.innerHTML="version ".concat("0.1.0"),a.timerOn.onchange=function(){g("in",a.timerDisplay,m("transition-speed"),f.inOutSine)},a.timerOff.onchange=function(){g("out",a.timerDisplay,m("transition-speed"),f.inOutSine)},Neutralino.init({load:function(){w(),b(),d(),g("in",document.body,m("transition-speed"),f.inOutSine),y(),q()},pingSuccessCallback:function(){},pingFailCallback:function(){}})}]);
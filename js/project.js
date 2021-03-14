/*
  Art101 Final Project

*/

//var worktimerinput = document.getElementById("worktimerinput");
//var breaktimerinput = document.getElementById("breaktimerinput");


var worktimerinput = $('#worktimerinput');
var breaktimerinput = $('#breaktimerinput');

// Buttons
var worktimerbutton = $('#worktimerbutton');
var breaktimerbutton = $('#breaktimerbutton');
var clearsessioncountbutton = $('#clearsessioncountbutton');

var timerDisplay = $('#timerdisplay');
var workSessionsDisplayCount = $('#totalworksessionscompleted');


function initializeAudio() {
  var audioplayer = document.getElementById('audioplayer');
  audioplayer.volume = 0.2;
}

function getWorkSessions() {
  return Number(window.localStorage.getItem('totalWorkSessions'));
}

function addWorkSession() {
  window.localStorage.setItem('totalWorkSessions', getWorkSessions() + 1);
}

function clearWorkSessionCount() {
  window.localStorage.removeItem('totalWorkSessions');
}

$(document).ready(() => {

  initializeAudio();

  if (window.localStorage.getItem('totalWorkSessions') == null) {
    window.localStorage.setItem('totalWorkSessions', 0);
    console.log('Empty local storage, initializing work session count');
  } else {
    workSessionsDisplayCount.text(getWorkSessions());
  }
  // window.localStorage.removeItem('totalWorkSessions');
})

const TIMER_INTERVAL = 100;

worktimerbutton.click(function() {
  var timeLength = worktimerinput.val();
  console.log("Work Timer Clicked; value: " + worktimerinput.val());

  // start countdown of timer; call some other function when timer gets finished?
  
  timeLengthMilliseconds = timeLength * 1000 * 60;

  target = Date.now() + timeLengthMilliseconds; 

  // setTimeout(timerStep(expected), TIMER_INTERVAL);
  var timerFunc = setInterval(function() {

    var distance = target - Date.now();

    // var delta = Date.now() - start;
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    // prepend a "0" if value is below 10 to make it look more clock-like
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (distance <= 0) {
      // Timer reached 0, do timer end stuff
      timerDisplay.text("00:00");
      clearInterval(timerFunc);
      audioplayer.play();
      addWorkSession();
      workSessionsDisplayCount.text(getWorkSessions());
    } else {
      // Still time remaining, update time and loop again
      timerDisplay.text(minutes + ":" + seconds);
    }

  }, TIMER_INTERVAL);
});

// lots of repeating code, refactor later
breaktimerbutton.click(function() {
  var timeLength = breaktimerinput.val();
  console.log("Break Timer Clicked; value: " + breaktimerinput.val());

  timeLengthMilliseconds = timeLength * 1000 * 60;

  target = Date.now() + timeLengthMilliseconds; 

  var timerFunc = setInterval(function() {

    var distance = target - Date.now();

    // var delta = Date.now() - start;
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    // prepend a "0" if value is below 10 to make it look more clock-like
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (distance <= 0) {
      // Timer reached 0, do timer end stuff
      timerDisplay.text("00:00");
      clearInterval(timerFunc);
    } else {
      // Still time remaining, update time and loop again
      timerDisplay.text(minutes + ":" + seconds);
    }

  }, TIMER_INTERVAL);
});

clearsessioncountbutton.click(function() {
  clearWorkSessionCount();
  workSessionsDisplayCount.text(getWorkSessions());
})
// worktimerinput.addEventListener("click", )
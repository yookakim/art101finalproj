/*
  Art101 Final Project

*/

//var worktimerinput = document.getElementById("worktimerinput");
//var breaktimerinput = document.getElementById("breaktimerinput");

const taskItemTemplate = document.createElement('template');

taskItemTemplate.innerHTML = `
  <style>
    div {
      font-family: courier;
    }
    .taskcontainer {
      display: flex;
      padding-top: 5px;
      padding-bottom: 5px;
      border-top: darkgray;
      border-top-width: 1px;
      border-top-style: solid;
    }
    .tasktitle {
      padding-right: 10px;
    }
    .taskbutton {
      display: inline-block;
    }
  </style>
  <div class="taskcontainer">
    <div class="tasktitle">
      Test Template
    </div>
    <button class="taskbutton">Remove Task</button>
  </div>
`;

class TaskItem extends HTMLElement {
  constructor(title, index) {
    super();

    this.attachShadow( {mode : 'open' });
    this.shadowRoot.appendChild(taskItemTemplate.content.cloneNode(true));

    this.title = title;
    this.index = index;
    this.priority;

    this.shadowRoot.querySelector(".tasktitle").innerHTML = title;
    this.shadowRoot.querySelector(".taskbutton").addEventListener('click', () => this.removeTask());
  }

  removeTask() {
    console.log('removed task');
    this.shadowRoot.querySelector(".tasktitle").innerHTML = 'test lol';
    this.parentNode.removeChild(this);
    taskList.splice(this.index);
  }

  toJSON() {
    // when JSON.stringify() is called on this class object, it looks for this method first then takes the object it returns
    // so we pass in the properties we need to build the task
    return {
      title: this.title,
      index: this.index
    }
  }

  connectedCallback() {
    // this.shadowRoot.querySelector(".taskbutton").addEventListener('click', () => this.removeTask());
  }
}

window.customElements.define('task-item', TaskItem);

var taskList2 = ["test1", { test2: 'test2'}, 'test3'];
var taskList = [];

var worktimerinput = $('#worktimerinput');
var breaktimerinput = $('#breaktimerinput');

var tasktitleinput = $('#task-title-input');

// Buttons
var worktimerbutton = $('#worktimerbutton');
var breaktimerbutton = $('#breaktimerbutton');
var clearsessioncountbutton = $('#clearsessioncountbutton');
var addtaskbutton = $('#add-task-button');

var timerDisplay = $('#timerdisplay');
var workSessionsDisplayCount = $('#totalworksessionscompleted');

var tasklistContainer = $('#tasklist-container');

function addTask(titleString) {
  // create new task item/object
  // add the task object to the global tasklist array
  // parse the array to JSON and store to localStorage (immediately)
  // call refresh function to update the display of task list in DOM?

  // create the new task
  var newTask = new TaskItem(titleString, taskList.length);

  // add the new task to the list
  taskList.push(newTask);

  // parse the array with new added task and put in localStorage
  window.localStorage.setItem('taskList', JSON.stringify(taskList));

  // tasklistContainer.append(newTask);

  refreshList();
}

function refreshList() {
  // should it go through for loop and append each list object, or should it create the whole element and attach that instead?
  // processing overhead to redraw entire list each time probably isn't that big of a deal

  var newList = document.createElement('div');

  for (let i = 0; i < taskList.length; i++) {
    // newList.append(taskList[i]);
    tasklistContainer.append(taskList[i]);
  }

  // tasklistContainer.replaceWith(newList);
}


function initializeAudio() {
  var windchimes = document.getElementById('windchimes');
  windchimes.volume = 0.2;

  var alarm = document.getElementById('alarm');
  alarm.volume = 0.2;
}

function initializeStorageItems() {

  // initialize work sessions count
  if (!window.localStorage.hasOwnProperty('totalWorkSessions')) {
    window.localStorage.setItem('totalWorkSessions', 0);
    console.log('Empty local storage, initializing work session count');
  } else {
    workSessionsDisplayCount.text(getWorkSessions());
  }

  // initialize list of tasks
  /*
    if (list item doesn't exist in local storage) {
      storeListToStorage();    // this would be another function defined somewhere, do setItem() and stringify the global taskList array before passing through 
      or,
      window.localStorage.setItem('taskList', )
    } else {
      // the list does exist in storage
      updateList();            // reusable function that would refresh/update the task list?

    }
  */
}

function getWorkSessions() {
  // since localStorage only stores data in the form of key <-> string pairs, change string to number before use/display
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

  initializeStorageItems();


  // add existing tasks
  /*
    for (i is 0, i less than length of list of tasks in localStorage, i++) {
      print each task in the taskList object in localStorage
    }
  */

  // window.localStorage.removeItem('totalWorkSessions');
})

const TIMER_INTERVAL = 100;

addtaskbutton.click(function() {
  var title = tasktitleinput.val();
  addTask(title);
})



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
      alarm.play();
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
      alarm.play();
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
/*
  Art101 2021 Spring Quarter Final Project

  Yooha Kim
*/


const taskItemTemplate = document.createElement('template');

// Template element that gets inserted into 
taskItemTemplate.innerHTML = `
  <style>
    div {
      font-family: courier;
    }
    .taskcontainer {
      display: block;
      padding-top: 5px;
      padding-bottom: 5px;
      border-top: darkgray;
      border-top-width: 1px;
      border-top-style: solid;
    }
    .tasktitle {
      padding-right: 10px;
    }
    .removetaskbutton {
      display: inline-block;
    }
  </style>
  <div class="taskcontainer">
    <div class="tasktitle">
      Test Template
    </div>
    <button class="removetaskbutton">Remove Task</button>
    <button class="taskcompletebutton">Completed!</button>
  </div>
`;

class TaskItem extends HTMLElement
{
  constructor(title, index)
  {
    super();

    this.attachShadow( {mode : 'open' });
    this.shadowRoot.appendChild(taskItemTemplate.content.cloneNode(true));

    this.title = title;
    this.index = index;
    this.priority;

    this.shadowRoot.querySelector(".tasktitle").innerHTML = title;
    this.shadowRoot.querySelector(".removetaskbutton").addEventListener('click', () => this.removeTask());
    this.shadowRoot.querySelector(".taskcompletebutton").addEventListener('click', () => this.completeTask());
  }

  removeTask()
  {
    console.log('removed task');
    this.parentNode.removeChild(this);
    console.log(this);
    taskList.splice(this.index, 1);

    console.log(taskList);
    window.localStorage.setItem('taskList', JSON.stringify(taskList));
    console.log(JSON.stringify(taskList));

    // we have to refresh the stored index value in each TaskItem after the array is modified or else it will be out of order
    for (let i = 0; i < taskList.length; i++)
    {
      taskList[i].index = i;
    }
  }

  completeTask()
  {
    this.removeTask();
    incrementTasksCompleted();
  }

  toJSON()
  {
    // when JSON.stringify() is called on this class object, it looks for this method first then takes the object it returns
    // so we pass in the properties we need to build the task item
    return {
      title: this.title,
      index: this.index
    }
  }

  connectedCallback()
  {
    // this.shadowRoot.querySelector(".taskbutton").addEventListener('click', () => this.removeTask());
  }
}

window.customElements.define('task-item', TaskItem);

var taskList = [];

// Input fields
var worktimerinput = $('#worktimerinput');
var breaktimerinput = $('#breaktimerinput');
var tasktitleinput = $('#task-title-input');

// Buttons
var worktimerbutton = $('#worktimerbutton');
var breaktimerbutton = $('#breaktimerbutton');
var clearsessioncountbutton = $('#clearsessioncountbutton');
var addtaskbutton = $('#add-task-button');

// Display
var timerDisplay = $('#timerdisplay');
var workSessionsDisplayCount = $('#totalworksessionscompleted');
var tasksCompletedDisplayCount = $('#totaltaskscompleted');

var tasklistContainer = $('#tasklist-container');

function getWorkSessions()
{
  // since localStorage only stores data in the form of key <-> string pairs, change string to number before use/display
  return Number(window.localStorage.getItem('totalWorkSessions'));
}

function getTaskCompletionCount()
{
  // since localStorage only stores data in the form of key <-> string pairs, change string to number before use/display
  return Number(window.localStorage.getItem('totalTasksCompleted'));
}

function incrementSessionsCompleted()
{
  window.localStorage.setItem('totalWorkSessions', getWorkSessions() + 1);
}

function incrementTasksCompleted()
{
  console.log('increment tasks completed');
  window.localStorage.setItem('totalTasksCompleted', getTaskCompletionCount() + 1);
  tasksCompletedDisplayCount.text(getTaskCompletionCount());
  console.log(getTaskCompletionCount());
}

function clearWorkSessionCount()
{
  window.localStorage.removeItem('totalWorkSessions');
}

function clearTasksCompletedCount()
{
  window.localStorage.removeItem('totalTasksCompleted');
}

function addTask(titleString)
{
  // create new task item/object
  // add the task object to the global tasklist array
  // parse the array to JSON and store to localStorage (immediately)
  // call refresh function to update the display of task list in DOM?

  // create the new task, and initialize the task with its current location in the task list (by getting the length of the array)
  var newTask = new TaskItem(titleString, taskList.length);

  // add the new task to the list
  taskList.push(newTask);

  // parse the array with new added task and put in localStorage
  window.localStorage.setItem('taskList', JSON.stringify(taskList));

  // tasklistContainer.append(newTask);

  refreshList();
}

function refreshList()
{
  // Every time a list item is added, deleted, or when the page is refreshed and the local data is loaded in, redraw list
  for (let i = 0; i < taskList.length; i++)
  {
    // newList.append(taskList[i]);
    tasklistContainer.append(taskList[i]);
  }

  // tasklistContainer.replaceWith(newList);
}


function initializeAudio()
{
  var windchimes = document.getElementById('windchimes');
  windchimes.volume = 0.2;

  var alarm = document.getElementById('alarm');
  alarm.volume = 0.2;
}

function initializeStorageItems()
{

  // initialize work sessions count
  if (!window.localStorage.hasOwnProperty('totalWorkSessions')) {
    window.localStorage.setItem('totalWorkSessions', 0);
    console.log('Empty local storage for work session count, adding fresh entry');
  } 
  else 
  {
    workSessionsDisplayCount.text(getWorkSessions());
  }

  // initialize tasks completed count
  if (!window.localStorage.hasOwnProperty('totalTasksCompleted'))
  {
    window.localStorage.setItem('totalTasksCompleted', 0);
    console.log('Empty local storage for task completion count, adding fresh entry');
  }
  else
  {
    tasksCompletedDisplayCount.text(getTaskCompletionCount());
  }

  // initialize list of tasks
  if (!window.localStorage.hasOwnProperty('taskList')) 
  {

    // the task list wasn't found, so create a new one
    window.localStorage.setItem('taskList', JSON.stringify(taskList));
    console.log('No task list found in local storage, creating one');
  } 
  else
  {
    // the task list exists in localStorage, so:
    // 1. retrieve existing task list string from localStorage
    // 2. parse the string into JSON
    // 3. run function which creates a new TaskList object out of each object in the JSON

    var stringToParse = window.localStorage.getItem('taskList');

    var taskListJSON = jQuery.parseJSON(stringToParse);
    console.log(taskListJSON);

    taskListJSON.forEach((entry) =>
    {
      if (entry.hasOwnProperty('title')) {
        // although we should reasonably only have objects storing the TaskItem properties 
        // in this JSON, we check that the object has the 'title' property just in case 
        addTask(entry.title);
      }
    });
    refreshList();
  }
}


/*
  Initialize application upon document ready
*/
$(document).ready(() =>
{

  // Store references to audio elements and adjust volume
  initializeAudio();

  // Check for items in localStorage and load in if found
  // Items stored locally:
  // Number of work sessions completed (+1 upon work timer completion)
  // Items in task list
  initializeStorageItems();

})

const TIMER_INTERVAL = 100;



/*************************

  Event Listeners/onclick Functions

*************************/

addtaskbutton.click(function()
{
  var title = tasktitleinput.val();
  addTask(title);
});

$('#task-title-input').on('keydown', function(e)
{
  if (e.key === 'Enter') {
    e.preventDefault();
    var title = tasktitleinput.val();
    addTask(title);
  }
});

worktimerbutton.click(function()
{
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
      windchimes.play();
      incrementSessionsCompleted();
      workSessionsDisplayCount.text(getWorkSessions());
    } else {
      // Still time remaining, update time and loop again
      timerDisplay.text(minutes + ":" + seconds);
    }

  }, TIMER_INTERVAL);
});

// lots of repeating code, refactor later
breaktimerbutton.click(function()
{
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

clearsessioncountbutton.click(function()
{
  clearWorkSessionCount();
  workSessionsDisplayCount.text(getWorkSessions());
});
// worktimerinput.addEventListener("click", )
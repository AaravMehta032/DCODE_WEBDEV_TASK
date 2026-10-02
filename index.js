let habits = JSON.parse(localStorage.getItem("habits")) || [];
// localStorage = browser storage so that even after reloading that same page everything remains
// localStorage stores data in the browser
// Data remains even after refreshing or closing the browser
// If there is no previous info then empty
// JSON.parse() just makes it a JSON object
// JavaScript Object Notation
let labels = [];
// All labels will come in this list
let selectedMonth = new Date();
// new Date() selects current date/time

let month = document.getElementById("month");

month.value =
  selectedMonth.getFullYear() +
  "-" +
  String(selectedMonth.getMonth() + 1).padStart(2, "0");
// Months satrt from zero here so +1
// PadStart makes sure that there are 2 digits
// Add zero in beginning to make two digits if not there


month.addEventListener("change", function () {
  let value = month.value.split("-");

  selectedMonth = new Date(value[0], value[1] - 1, 1);

  showHabits();

  showSummary();
});

/* Add label */

function addLabel() {
  let select = document.getElementById("labelSelect");
  let label = select.value;
  if (label == "") {
    alert("Please select a label.");
    return;
  }

  if (labels.length >= 3) {
    alert("You can only add 3 labels.");
    return;
  }

  if (labels.includes(label)) {
    alert("This label is already added.");
    return;
  }

  labels.push(label);
// Add at end of array 
  select.value = "";
// Resets dropdown
  showLabels();
// Function shows the new labels to user
}



function showLabels() {
  let list = document.getElementById("labelList");

  list.innerHTML = "";

  for (let i = 0; i < labels.length; i++) {
    let div = document.createElement("div");

    div.className = "label";

    div.innerHTML = `
            ${labels[i]}

            <button onclick="removeLabel(${i})">
                X
            </button>
        `;

    list.appendChild(div);
  }
}

/* Remove label */

function removeLabel(index) {
  labels.splice(index, 1);

  showLabels();
}

/* Add habit */

function addHabit() {
  let name = document.getElementById("habitName").value.trim();

  if (name == "") {
    alert("Please enter a habit.");

    return;
  }
// CREATING A JSON OBJECT 
  let habit = {
    id: Date.now(),
    // Date.now() gives the current time in milliseconds since January 1, 1970.
    name: name,
    // This is the value of each label type thing we had in HTML/ the habit
    labels: labels,
    days: {},
    // To store later on like YYYYMMDD-true/false, ---
  };

  habits.push(habit);
  saveHabits();
  document.getElementById("habitName").value = "";
  labels = [];
  showLabels();
  showHabits();
  showSummary();
}



function getDate(day) {
  let year = selectedMonth.getFullYear();
  let month = String(selectedMonth.getMonth() + 1).padStart(2, "0");
  let date = String(day).padStart(2, "0");
  return year + "-" + month + "-" + date;
}


function showHabits() {
  let dayRow = document.getElementById("dayRow");
  let list = document.getElementById("habitList");
  dayRow.innerHTML = '<th class="habit-heading">HABIT</th>';
  list.innerHTML = "";
  let year = selectedMonth.getFullYear();
  let month = selectedMonth.getMonth();
  let totalDays = new Date(year, month + 1, 0).getDate();
// Day 0 of one month becomes last day of preceeding month
  for (let day = 1; day <= totalDays; day++) {
    let th = document.createElement("th");

    th.className = "day-heading";

    let date = new Date(year, month, day);

    let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    th.innerHTML = `
        <div class="day-name">
            ${dayNames[date.getDay()]}
        </div>

        <div class="day-number">
            ${day}
        </div>
    `;

    dayRow.appendChild(th);
  }
  /* Add habits */

  for (let i = 0; i < habits.length; i++) {
    let habit = habits[i];

    let row = document.createElement("tr");

    row.className = "habit-row";

    /* Habit name */

    let nameCell = document.createElement("td");

    nameCell.className = "habit-name";

    let labelHTML = "";

    for (let j = 0; j < habit.labels.length; j++) {
      labelHTML += `
                <span class="small-label">
                    ${habit.labels[j]}
                </span>
            `;
    }
    // SEE THIS

    nameCell.innerHTML = `

            ${habit.name}

            <button
                class="delete-btn"
                onclick="deleteHabit(${habit.id})">

                Delete

            </button>

            <div class="habit-labels">
                ${labelHTML}
            </div>

        `;

    row.appendChild(nameCell);

    

    for (let day = 1; day <= totalDays; day++) {
      let cell = document.createElement("td");
      cell.className = "day-box";
      let date = getDate(day);
      if (habit.days[date] == true) {
        cell.classList.add("completed");
      }
      cell.onclick = function () {
        toggleDay(habit.id, date);
      };
      row.appendChild(cell);
    }
    list.appendChild(row);
  }
}

// Complete habit for a day 

function toggleDay(habitId, date) {
  for (let i = 0; i < habits.length; i++) {
    if (habits[i].id == habitId) {
      if (habits[i].days[date] == true) {
        habits[i].days[date] = false;
      } else {
        habits[i].days[date] = true;
      }

      break;
    }
  }

  saveHabits();

  showHabits();

  showSummary();
}

// Delete habit 

function deleteHabit(habitId) {
  let newHabits = [];

  for (let i = 0; i < habits.length; i++) {
    if (habits[i].id != habitId) {
      // These habit ID are the values that were in HTML in the select Option tag
      newHabits.push(habits[i]);
      //Keep habits that are NOT being deleted
      //To delete 2 from 1,2,3 it checks each 
    }
  }
  habits = newHabits;
  saveHabits();
  showHabits();
  showSummary();
}

// Dates for summary
function getSummaryDates() {
  let dates = [];
  let type = document.getElementById("summaryType").value;
  let year = selectedMonth.getFullYear();
  let month = selectedMonth.getMonth();

 //Month

  if (type == "month") {
    let totalDays = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= totalDays; day++) {
      dates.push(getDate(day));
    }
  } else {

  //Week
    let today = new Date();
    let weekDay = today.getDay();
    //Get's Days numbered from 0 onwards
    let monday = new Date(today);
    //monday variable name is today's date's copy
    if (weekDay == 0) {
      monday.setDate(today.getDate() - 6);
      //If today is Sunday, go back 6 days to Monday.
    } else {
      monday.setDate(today.getDate() - weekDay + 1);
    }

    for (let i = 0; i < 7; i++) {
      let date = new Date(monday);
      date.setDate(monday.getDate() + i);
      let year = date.getFullYear();
      let month = String(date.getMonth() + 1).padStart(2, "0");
      let day = String(date.getDate()).padStart(2, "0");
      dates.push(year + "-" + month + "-" + day);
    }
    //Shows date as convert the date into: 2026-10-02
  }

  return dates;
}

/* Show summary */

function showSummary() {
  //THIS IS THE PROGRESS BAR CONTROL FEATURE
  //VERY VERY IMPORTANT
  let list = document.getElementById("summaryList");
  let done = document.getElementById("mostlyDone");
  let notDone = document.getElementById("mostlyNotDone");
  //Clear previous summary --> every time you click a day, the summary needs to be recalculated
  list.innerHTML = "";
  done.innerHTML = "";
  notDone.innerHTML = "";

  if (habits.length == 0) {
    list.innerHTML = "<p>No habits added yet.</p>";
    return;
    //Normal thing-- If no habit, then say there is no habit
  }

  let dates = getSummaryDates();
  //If a week then  7, if a month then 31
  let results = [];
  for (let i = 0; i < habits.length; i++) {
    let habit = habits[i];
    let completed = 0;
    for (let j = 0; j < dates.length; j++) {
      if (habit.days[dates[j]] == true) {
        completed++;
      }
    }

    let percentage = (completed / dates.length) * 100;
    results.push({
      name: habit.name,
      percentage: percentage,
      completed: completed,
    });

    let item = document.createElement("div");
    item.className = "summary-item";
    let status = "Not Done";
    let statusClass = "not-done";
    if (percentage >= 75) {
      status = "Done";
      statusClass = "done";
    }
    //If over 75% of the habit is done over the week/month, then it is marked as done 
    //Put the j-th label from habit.labels here.
    item.innerHTML = `
            <div class="summary-name">
                ${habit.name}
            </div>
            <div class="summary-progress">
                <div
                    class="summary-progress-bar"
                    style="width: ${percentage}%">
                    <!--The main important thing fill up the bar using the percentage value found before using that $ f string type thing and CSS to call the width to fill up-->
                </div>
            </div>

            <div class="summary-percentage">
                ${Math.round(percentage)}%
            </div>

            <div class="summary-status ${statusClass}">
                ${status}
            </div>

        `;

    list.appendChild(item);
  }


  let highest = results[0].percentage;
  let lowest = results[0].percentage;
  for (let i = 1; i < results.length; i++) {
    if (results[i].percentage > highest) {
      highest = results[i].percentage;
    }
    if (results[i].percentage < lowest) {
      lowest = results[i].percentage;
    }
  }

  /* Mostly done */

  for (let i = 0; i < results.length; i++) {
    if (results[i].percentage == highest) {
      let p = document.createElement("p");
      p.innerText =
        results[i].name + " - " + Math.round(results[i].percentage) + "%";
      done.appendChild(p);
    }
  }

  /* Mostly not done */

  for (let i = 0; i < results.length; i++) {
    if (results[i].percentage == lowest) {
      let p = document.createElement("p");
      p.innerText =
        results[i].name + " - " + Math.round(results[i].percentage) + "%";
      notDone.appendChild(p);
    }
  }
}

/* Save habits */

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

/* Load habits */

showHabits();
showSummary();

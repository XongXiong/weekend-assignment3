$(document).ready(main);

function main() {
    // Load tasks in database on startup
    getTasks();
    // Click handlers for buttons
    $('#submitTask').on('click', checkInput);
    $('body').on('click', '.compTaskBut', completeTask);
    $('body').on('click', '.delTaskBut', confirmDelete);
}

// Checks user input to make sure it isnt blank 
function checkInput() {
    var newTask = {
        task: $('#taskIn').val(),
        // date: $('#dateIn').val()
        completed: false // default completed status is "false"
    };
    if (newTask.task == '') {
        alert('Please input a task before moving on!');
        $('#taskIn').focus().addClass('noTask');
    } else {
        addTask(newTask);
        $('#taskIn').focus().removeClass('noTask');
        $.ajax({
            type: 'GET',
            url: '/tasks'
        }).done(function (response) {
            appendPendTasks(response);
        }).fail(function (error) {
            console.log('Error when getting tasks at /tasks', error);
        })
    }
}

function appendPendTasks(tasks) {
    $('#pendTaskBody').empty();
    for (var i = 0; i < tasks.length; i += 1) {
        var task = tasks[i];
        var $ptrow = $('#pendTaskBody').append('');
        if (task.completed == false) {
            $($ptrow).append('<tr class="delCss"><td>' + task.task + '</td><td class="completeTask"><button type="button" class="compTaskBut btn-primary" data-id="' + task.id + '">Click to complete</button></td><td class="deleteTask"><button type="button" class="delTaskBut btn-danger" data-id="' + task.id + '">Delete Task</button></td></tr>');
        }
    }
}

// Adds a task into the DOM when user inputs in data and hits submit
function addTask(newTask) {
    // Sends tasks to the server
    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: newTask
    }).done(function (response) {
        console.log('success!');
        // Gets data from the server
        $.ajax({
            type: 'GET',
            url: '/tasks/newTask'
        }).done(function (response) {
            // Clears input after user hits submit button
            $('#taskIn').val('');
            $('#taskIn').focus();
            appendNewTask(response)
        }).fail(function (error) {
            console.log('Error when getting tasks at /tasks', error);
        })
    }).fail(function (error) {
        console.log('Error when posting tasks at /tasks', error);
    })
}

// Append user's new task to "To Do List"
function appendNewTask(response) {
    var task = response[response.length - 1];
    var pendTask = '<tr class="delCss newTaskRow" style="display: none;"><td>' + task.task + '</td><td class="completeTask"><button type="button" class="compTaskBut btn-primary" data-id="' + task.id + '">Click to complete</button></td><td class="deleteTask"><button type="button" class="delTaskBut btn-danger" data-id="' + task.id + '">Delete Task</button></td></tr>';
    $('#pendTaskBody').append(pendTask);
    $('.newTaskRow').show('slow');
}

// Runs function to complete a task when user clicks on complete button
function completeTask() {
    var taskId = $(this).data("id"); // Gets id of the selected row
    var $thisRow = $(this).parent().parent(); // The row of the button that was clicked
    $(this).remove(); // Removes complete button so it can be replaced with text
    $.ajax({
        type: 'PUT',
        url: '/tasks/' + taskId
    }).done(function (response) {
        $($thisRow).fadeOut("slow");
        // Gets data from the server
        $.ajax({
            type: 'GET',
            url: '/tasks/compTask/' + taskId
        }).done(function (response) {
            appendCompTask(response);
            console.log($thisRow);
        }).fail(function (error) {
            console.log('Error when getting tasks at /tasks', error);
        })
    }).fail(function (error) {
        console.log('Error when attempting to complete task at /tasks/' + taskId);
    })
}

// Appends the completed task to the Completed List
function appendCompTask(response) {
    console.log(response);
    var task = response[response.length - 1];
    var compTask = '<tr class="compCss newCompRow" style="display: none;"><td>' + task.task + '</td><td>Completed!</td><td class="deleteTask"><button type="button" class="delTaskBut btn-danger" data-id="' + task.id + '">Delete Task</button></td></tr>';
    $('#compTaskBody').append(compTask);
    $('.newCompRow').show('slow');
}

// Asks the user if they want to delete row
function confirmDelete() {
    taskId = $(this).data("id");
    $thisRow = $(this).parent().parent();
    var result = confirm('Are you sure?');
    if (result) {
        $($thisRow).fadeOut("slow");
        deleteTask(taskId, $thisRow);
    }
}

// Deletes selected row
function deleteTask(taskId, $thisRow) {
    $.ajax({
        type: 'DELETE',
        url: '/tasks/' + taskId
    }).done(function (response) {
        console.log('Deleted!');
        $($thisRow).remove();
    }).fail(function (error) {
        console.log('Error when attempting to delete task at /tasks/' + taskId);
    })
}

// Gets tasks from the database
function getTasks() {
    $.ajax({
        type: 'GET',
        url: '/tasks'
    }).done(function (response) {
        appendTasks(response);
    }).fail(function (error) {
        console.log('Error when getting tasks at /tasks', error);
    })
}

// Appends tasks to the database
function appendTasks(tasks) {
    // Clear out the table bodies so that they are ready for data to be appended
    $('#pendTaskBody').empty();
    $('#compTaskBody').empty();
    for (i = 0; i < tasks.length; i += 1) {
        task = tasks[i];
        $ptrow = $('#pendTaskBody').append('');
        var $ctrow = $('#compTaskBody').append('');
        if (task.completed) {
            $($ctrow).append('<tr class="compCss"><td>' + task.task + '</td><td>Completed!</td><td class="deleteTask"><button type="button" class="delTaskBut btn-danger" data-id="' + task.id + '">Delete Task</button></td></tr>');
        } else {
            $($ptrow).append('<tr class="delCss"><td>' + task.task + '</td><td class="completeTask"><button type="button" class="compTaskBut btn-primary" data-id="' + task.id + '">Click to complete</button></td><td class="deleteTask"><button type="button" class="delTaskBut btn-danger" data-id="' + task.id + '">Delete Task</button></td></tr>');
        }
    }
}
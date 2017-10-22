$(document).ready(main);

function main() {
    // Load tasks in database on startup
    getTasks();
    // Click handlers for buttons
    $('#submitTask').on('click', addTask);
    $('.container').on('click', '.compTaskBut', completeTask);
    $('.container').on('click', '.delTaskBut', confirmDelete);
}

// Adds a task into the DOM when user inputs in data and hits submit
function addTask() {
    var newTask = {
        task: $('#taskIn').val(),
        // date: $('#dateIn').val()
        completed: false
    };
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
            appendNewTask(response)
        }).fail(function (error) {
            console.log('Error when getting tasks at /tasks', error);
        })
    }).fail(function (error) {
        console.log('Error when posting tasks at /tasks', error);
    })
}

// 
function appendNewTask(response) {
    var task = response[response.length - 1];
    $('#pendTaskBody').prepend('<tr id="new_row" class="delCss" style="display: none;"></tr>');
    $('#new_row').prepend('<td>' + task.task + '</td><td class="completeTask"><button type="button" class="compTaskBut" data-id="' + task.id + '">Complete!</button></td><td class="deleteTask"><button type="button" class="delTaskBut" data-id="' + task.id + '">Delete Task</button></td>').show('slow');
}


function completeTask() {
    var taskId = $(this).data("id");
    var thisRow = $(this).parent().parent();
    $(this).remove();
    $.ajax({
        type: 'PUT',
        url: '/tasks/' + taskId
    }).done(function (response) {
        $(thisRow).fadeOut("slow");
        // Gets data from the server
        $.ajax({
            type: 'GET',
            url: '/tasks/compTask/' + taskId
        }).done(function (response) {
            appendCompTask(response)
        }).fail(function (error) {
            console.log('Error when getting tasks at /tasks', error);
        })
    }).fail(function (error) {
        console.log('Error when attempting to complete task at /tasks/' + taskId);
    })
}

function appendCompTask(response) {
    console.log(response);
    var task = response[response.length - 1]
    $('#compTaskBody').prepend('<tr id="new_row" class="compCss" style="display: none;"></tr>');
    $('#new_row').prepend('<td>' + task.task + '</td><td>This task is completed!</td><td class="deleteTask"><button type="button" class="delTaskBut" data-id="' + task.id + '">Delete Task</button></td>').show('slow');
}

function confirmDelete() {
    taskId = $(this).data("id");
    thisRow = $(this).parent().parent();
    var result = confirm('Are you sure?');
    if (result) {
        $(thisRow).fadeOut("slow");
        deleteTask(taskId);
    }
}

function deleteTask(taskId) {
    $.ajax({
        type: 'DELETE',
        url: '/tasks/' + taskId
    }).done(function (response) {
        console.log('Deleted!');
        // getTasks();
    }).fail(function (error) {
        console.log('Error when attempting to delete task at /tasks/' + taskId);
    })
}

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

function appendTasks(tasks) {
    $('#pendTaskBody').empty();
    $('#compTaskBody').empty();
    for (var i = 0; i < tasks.length; i += 1) {
        var task = tasks[i];
        var $ptrow = $('#pendTaskBody').append('');
        var $ctrow = $('#compTaskBody').append('');
        if (task.completed) {
            $($ctrow).append('<tr class="compCss"><td>' + task.task + '</td><td>This task is completed!</td><td class="deleteTask"><button type="button" class="delTaskBut" data-id="' + task.id + '">Delete Task</button></td></tr>');
        } else {
            $($ptrow).append('<tr class="delCss"><td>' + task.task + '</td><td class="completeTask"><button type="button" class="compTaskBut" data-id="' + task.id + '">Complete!</button></td><td class="deleteTask"><button type="button" class="delTaskBut" data-id="' + task.id + '">Delete Task</button></td></tr>');
        }
    }
}
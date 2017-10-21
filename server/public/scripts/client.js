$(document).ready(main);

function main() {
    getTasks();
    $('#submitTask').on('click', addTask);
    $('#taskBody').on('click', '.compTaskBut', completeTask);
    $('#taskBody').on('click', '.delTaskBut', confirmDelete);
    // $('#taskBody').on('click', '.delTaskBut', deleteTask);
}

function addTask() {
    var newTask = {
        task: $('#taskIn').val(),
        // date: $('#dateIn').val()
        completed: false
    }
    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: newTask
    }).done(function (response) {
        console.log('success!');
        // getTasks();
    }).fail(function (error) {
        console.log('Error when posting tasks at /tasks', error);
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
    $('#taskBody').empty();
    for (var i = 0; i < tasks.length; i += 1) {
        var task = tasks[i];
        var $trow = $('#taskBody').append('')
        if (task.completed == true) {
            $($trow).append('<tr class="compCss"><td>' + task.task + '</td><td>This task is completed!</td><td class="deleteTask"><button type="button" class="delTaskBut" data-id="' + task.id + '">Delete Task</button></td></tr>');
        } else {
            $($trow).append('<tr class="delCss"><td>' + task.task + '</td><td class="completeTask"><button type="button" class="compTaskBut" data-id="' + task.id + '">Complete!</button></td><td class="deleteTask"><button type="button" class="delTaskBut" data-id="' + task.id + '">Delete Task</button></td></tr>');
        }
    }
}

function completeTask() {
    var taskId = $(this).data("id");
    $(this).remove();
    $.ajax({
        type: 'PUT',
        url: '/tasks/' + taskId
    }).done(function (response) {
        getTasks();
    }).fail(function (error) {
        console.log('Error when attempting to complete task at /tasks/' + taskId);
    })
}

function confirmDelete(){
    taskId = $(this).data("id");
    var thisRow = $(this).parent().parent();
    console.log(thisRow);
    $(thisRow).fadeOut(2000);
    var result = confirm('Are you sure?');
    if (result) {
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
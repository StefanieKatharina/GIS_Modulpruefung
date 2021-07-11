"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var table = $('#highscore-table');
    $.ajax(window.location.origin + '/scores', {
        type: 'GET',
        success: function (res) {
            for (var i = 0; i < res.length; i++) {
                var row = $('<tr>');
                row.append($("<td>" + (i + 1) + "</td>"));
                row.append($("<td>" + res[i].name + "</td>"));
                row.append($("<td>" + res[i].score + "</td>"));
                table.append(row);
                if (i == 9)
                    break;
            }
        },
        error: function (reg, err) {
            console.error('Getting highscores failed!', err);
            alert('Getting highscores failed.');
        }
    });
});

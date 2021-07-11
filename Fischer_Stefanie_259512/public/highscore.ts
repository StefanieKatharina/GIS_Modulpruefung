interface IScore {
    /** Spielername */
    name: string,
    score: number
}

document.addEventListener('DOMContentLoaded', () => {
    let table = $('#highscore-table');
    $.ajax(window.location.origin + '/scores', {
        type: 'GET',
        success: (res: IScore[]) => {
            for (let i = 0; i < res.length; i++) {
                let row = $('<tr>');
                row.append($(`<td>${i + 1}</td>`));
                row.append($(`<td>${res[i].name}</td>`));
                row.append($(`<td>${res[i].score}</td>`));
                table.append(row);
                if (i == 9)
                    break;
            }
        },
        error: (reg, err) => {
            console.error('Getting highscores failed!', err);
            alert('Getting highscores failed.');
        }
    })
});
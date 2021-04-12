import Player from './player.js';

let course;
let numHoles;
let courseId = 0;
const players = [];
let yardIn = 0;
let yardOut = 0;
let parIn = 0;
let parOut = 0;
let hcpIn = 0;
let hcpOut = 0;

const getCourses = () => {
    $.get('https://golf-courses-api.herokuapp.com/courses', (data) => {
        data['courses'].forEach(
            (course) => {
                $('#select-course').append(`<option value="${course.id}">${course.name}</option>`)
            } 
        )
        chooseCourse(data.courses[0].id)
    });
}


function chooseCourse(courseId) {
    $('#select-tee').html('');
    $.get(`https://golf-courses-api.herokuapp.com/courses/${courseId}`, (data) => {
        course = data.data;
        course.holes[0].teeBoxes.forEach(
            (teeBox, index) => {
                $('#select-tee').append(`<option value="${index}">${teeBox.teeType}</option>`)
            }
        )
        createCard(0);
    });
    
}

function createCard(teeType) {
    resetTotals();
    numHoles = course.holeCount;
    const holeInfo = course.holes;

    $('#holes').children('.holeBox').remove();
    $('#yardage').children('td').remove();
    $('#par').children('td').remove();
    $('#handicap').children('td').remove();

   if(numHoles < 18) {
        for (let hole in holeInfo) {
            const teeBox = holeInfo[hole].teeBoxes[teeType];
            $("#holes").append(`<div class = "table-header" ${holeInfo[hole].hole}</div>`);
            $("#yardage").append(`<div class = "table-data" id = "yardage-${holeInfo[hole].teeBoxes['']}"><span>${teeBox.yards}</span></div>`);
            $("#par").append(`<div class = "table-data" id = "par-${holeInfo[hole].hole}"<span>${teeBox.par}</span></div>`);
            $("#handicap").append(`<div class = "table-data" id = "hcp-${holeInfo[hole].hole}"<span>$${teeBox.hcp}</span></div>`);   
        }
    } else {
        for (let hole = 0; hole <= 8; hole++) { 
            let teeBox = holeInfo[hole].teeBoxes[teeType];
            $("#holes").append(`<th scope="col" class="holeBox table-header">${holeInfo[hole].hole}</th>`);
            $("#yardage").append(`<td class="table-data">${teeBox.yards}</td>`);
            $("#par").append(`<td class="table-data">${teeBox.par}</td>`);
            $("#handicap").append(`<td class="table-data">${teeBox.hcp}</td>`);
            yardOut += teeBox.yards;
            parOut += teeBox.par;
            hcpOut += teeBox.hcp;
        }

         $('#holes').append(`<th scope="col" class="holeBox table-total-header">OUT</th>`);
         $("#yardage").append(`<td class="yardBox table-data-inOutTotal">${yardOut}</td>`);
         $("#par").append(`<td class="parBox table-data-inOutTotal">${parOut}</td>`);
         $("#handicap").append(`<td class="hcpBox table-data-inOutTotal">${hcpOut}</td>`);

         

        for (let hole = 9; hole <= 17; hole++) {
            let teeBox = holeInfo[hole].teeBoxes[teeType];
            $("#holes").append(`<th scope="col" class="holeBox table-header">${holeInfo[hole].hole}</th>`);
            $("#yardage").append(`<td class="table-data">${teeBox.yards}</td>`);
            $("#par").append(`<td class="table-data">${teeBox.par}</td>`);
            $("#handicap").append(`<td class="table-data">${teeBox.hcp}</td>`);
            yardIn += teeBox.yards;
            parIn += teeBox.par;
            hcpIn += teeBox.hcp;


        }

        $('#holes').append(`<th scope="col" class="holeBox table-total-header">IN</th>`);
        $("#yardage").append(`<td class="yardBox table-data-inOutTotal">${yardIn}</td>`);
        $("#par").append(`<td class="parBox table-data-inOutTotal">${parIn}</td>`);
        $("#handicap").append(`<td class="hcpBox table-data-inOutTotal">${hcpIn}</td>`);
       

         
    }
        $('#holes').append(`<th scope="col" class="holeBox table-total-header">TOTAL</th>`);
        $("#yardage").append(`<td class="yardBox table-data-inOutTotal">${yardIn + yardOut}</td>`);
        $("#par").append(`<td class="parBox table-data-inOutTotal">${parIn + parOut}</td>`);
        $("#handicap").append(`<td class="hcpBox table-data-inOutTotal">${hcpIn + hcpOut}</td>`);
}

const addPlayer = () => {
    let name = '';
    if ($('#name-input').val()) {
        name = $('#name-input').val();
        const namingError = 'This name is taken. Please choose a new name';
        const numPlyrErr = 'There are already four players.';
        const newPlayer = new Player(name);
        if (players.length) {
            players.forEach(
                (_player) => {
                    if (_player.name.toLowerCase() === newPlayer.name.toLowerCase()) {
                        $('#error-msg').html(namingError);
                        setTimeout(() => {
                            $('#error-msg').html('');
                        }, 2000);
                        $('#name-input').val('');
                        return false;
                    }
                }
            );
            if (players.length === 4) {
                $('#error-msg').html(numPlyrErr);
                setTimeout(() => {
                    $('#error-msg').html('');
                }, 2000);
                $('#name-input').val('');
                return false;
            }
            const playerInfo = `
                        <tr id="${newPlayer.name}">
                            <th scope="row">${newPlayer.name}</th>
                        </tr>`;
            $('#scorecard').append(playerInfo);
            addPlayerInfo(newPlayer);
            players.push(newPlayer);
        } else {
            const playerInfo = `
                <tr id="${newPlayer.name}">
                    <th scope="row">${newPlayer.name}</th>
                </tr>`;
            $('#scorecard').append(playerInfo);
            addPlayerInfo(newPlayer);
            players.push(newPlayer);
        }
        $('#name-input').val('');
    }
}

function addPlayerInfo(player) {
    if (numHoles < 18) {
        for (let hole = 0; hole <= 8; hole++) {
            const tableData = `
                <td>
                    <input id="${player.name}-input-${hole + 1}" class="table-data score-input" type="number"  min="-9" max="9" owner="${player.name}"/>
                </td>`;
            $(`#${player.name}`).append(tableData);
            $(`#${player.name}-input-${hole + 1}`).focusout(lockScore);
        }
        $(`#${player.name}`).append(`<td id="${player.name}-out-total-score" class="table-data"><!-- out total score goes here --></td>`);
        $(`#${player.name}`).append(`<td id="${player.name}-total-score" class="table-data"><!-- total score goes here --></td>`);
    } else {
        for (let hole = 0; hole <= 8; hole++) { 
            const tableData = `
                <td>
                    <input id="${player.name}-input-${hole + 1}" class="table-data score-input" type="number"  min="-9" max="9" owner="${player.name}"/>
                </td>`;
            $(`#${player.name}`).append(tableData);
            $(`#${player.name}-input-${hole + 1}`).focusout(lockScore);
        }
        $(`#${player.name}`).append(`<td id="${player.name}-out-total-score" class="table-data"><!-- out total score goes here --></td>`);
    
        for (let hole = 9; hole <= 17; hole++) {
            const tableData = `
                <td>
                    <input id="${player.name}-input-${hole + 1}" class="table-data score-input" type="number"  min="-9" max="9" owner="${player.name}"/>
                </td>`;
            $(`#${player.name}`).append(tableData);
            $(`#${player.name}-input-${hole + 1}`).focusout(lockScore);
        }
        $(`#${player.name}`).append(`<td id="${player.name}-in-total-score" class="table-data"><!-- in total score goes here --></td>`);
    }
    $(`#${player.name}`).append(`<td id="${player.name}-total-score" class="table-data"><!-- total score goes here --></td>`);
}

const lockScore = (event) => {
    const target = event.target;
    if ($(target).val()) {
        $(target).attr('disabled', true);
        $('#error-msg').html(`Score locked for ${$(target).attr('owner')}.`);
        setTimeout(() => {
            $('#error-msg').html('');
        }, 2000);
        const player = players.find(
            (_player) => _player.name === $(target).attr('owner')
        )
        updateScore(player, $(target).val());
    }
}

function updateScore(player, score) {
    if (numHoles < 18) {
        if (player.outScores.length < 9) {
            player.outScores.push(parseInt(score));
            if (player.outScores.length === 9) {
                $(`#${player.name}-total-score`).html(player.outScores.reduce(sumScores));
                // getEndMsg()
            }
        }
    } else {
        if (player.outScores.length < 9) {
            player.outScores.push(parseInt(score));
            if (player.outScores.length === 9) {
                $(`#${player.name}-out-total-score`).html(player.outScores.reduce(sumScores));
            }
        } else if (player.inScores.length < 9) {
            player.inScores.push(parseInt(score));
            if (player.inScores.length === 9) {
                const totalScore = player.outScores.reduce(sumScores) + player.inScores.reduce(sumScores);
                $(`#${player.name}-in-total-score`).html(player.inScores.reduce(sumScores));
                $(`#${player.name}-total-score`).html(totalScore);
                getEndMsg(player, totalScore);
            }
        }
    }
}

const sumScores = (summedScores, newScore) => summedScores + newScore;
    
function getEndMsg(player, totalScore) {
    const difference = Math.abs((parIn + parOut) - totalScore);
    const positiveScoreMsg = `${difference} compared to par. On to the PGA, ${player.name}!`;
    const negativeScoreMsg = `${difference} compared to par. Better luck next time, ${player.name}!`;
    if (totalScore <= 108) {
        $('.scoreCard-Container').append(`<span class="message">${positiveScoreMsg}</span>`);
    } else {
        $('.scoreCard-Container').append(`<span class="message">${negativeScoreMsg}</span>`);
    }
}

function resetTotals() {
    yardIn = 0;
    yardOut = 0;
    parIn = 0;
    parOut = 0;
    hcpIn = 0;
    hcpOut = 0;
}

$(document).ready(getCourses);

document
    .getElementById('select-course')
    .addEventListener('change', (event) => {
        courseId = event.target.value;
        chooseCourse(courseId);
    });

document
    .getElementById('select-tee')
    .addEventListener('change', (event) => {
        createCard(event.target.value);
    });

document
    .getElementById('add-player')
    .addEventListener('click', addPlayer);
    

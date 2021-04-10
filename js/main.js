let course;
let numHoles;
let courseId = 0;
const players = [];
const outScores = [];
const inScores = [];

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

function getCourses() {
    $.get('https://golf-courses-api.herokuapp.com/courses', (data) => {
        data['courses'].forEach(
            (course, index) => {
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
    numHoles = course.holeCount;
    const holeInfo = course.holes;

    $('#holes').children('.holeBox').remove();
    $('#yardage').children('td').remove();
    $('#par').children('td').remove();
    $('#handicap').children('td').remove();

   if(numHoles < 18) {
        for (let hole in holeInfo) {
            const teeBox = holeInfo[hole].teeBoxes[teeType];
            $("#holes").append(`<div class = "holeBox" ${holeInfo[hole].hole}</div>`);
            $("#yardage").append(`<div class = "yardBox" id = "yardage-${holeInfo[hole].teeBoxes['']}"><span>${teeBox.yards}</span></div>`);
            $("#par").append(`<div class = "parBox" id = "par-${holeInfo[hole].hole}"<span>${teeBox.par}</span></div>`);
            $("#handicap").append(`<div class = "hcpBox" id = "hcp-${holeInfo[hole].hole}"<span>$${teeBox.hcp}</span></div>`);   
        }
    }
    else {
        for (let hole = 0; hole <= 8; hole++) { 
            let teeBox = holeInfo[hole].teeBoxes[teeType];
            $("#holes").append(`<th scope="col" class="holeBox">${holeInfo[hole].hole}</th>`);
            $("#yardage").append(`<td class="yardBox">${teeBox.yards}</td>`);
            $("#par").append(`<td class="parBox">${teeBox.par}</td>`);
            $("#handicap").append(`<td class="hcpBox">${teeBox.hcp}</td>`);

        }

        for (let hole = 9; hole <= 17; hole++) {
            let teeBox = holeInfo[hole].teeBoxes[teeType];
            $("#holes").append(`<th scope="col" class="holeBox">${holeInfo[hole].hole}</th>`);
            $("#yardage").append(`<td class="yardBox">${teeBox.yards}</td>`);
            $("#par").append(`<td class="parBox">${teeBox.par}</td>`);
            $("#handicap").append(`<td class="hcpBox">${teeBox.hcp}</td>`);


        }

    }
}

function addPlayer(name) {
    const namingError = 'This name is taken.';
    const numPlyrErr = 'There are already four players.';
    if (!players.includes(name)) {
        if (players.length !== 4) {
            const playerInfo = `
                <tr id="${name}">
                    <th scope="row">${name}</th>
                </tr>`;
            $('#scorecard').append(playerInfo);
            addPlayerInfo(name);
            players.push(name);
        } else {
            $('#error-msg').html(numPlyrErr);
            setTimeout(() => {
                $('#error-msg').html('');
            }, 2000);
        }
    } else {
        $('#error-msg').html(namingError);
            setTimeout(() => {
                $('#error-msg').html('');
            }, 2000);
    }
    $('#name-input').val('');
}

function addPlayerInfo(name) {
    const tableData = `
        <td>
            <input class="table-data" type="number"  min="-9" max="9" onfocusout="lockScore(this)" owner="${name}"/>
        </td>`;
    if (numHoles < 18) {
        for (let hole = 0; hole <= 8; hole++) {
            if (hole > 8) {
                $(`#${name}`).append(tableData);
            } else {
                $(`#${name}`).append(tableDataLast);
            }
        }
        $(`#${name}`).append('<div id="out-total-score" class="table-data"><!-- out total score goes here --></div>');
        $(`#${name}`).append('<div id="total-score" class="table-data"><!-- total score goes here --></div>');
    } else {
        for (let hole = 0; hole <= 8; hole++) { 
            $(`#${name}`).append(tableData);
        }
        $(`#${name}`).append('<div id="out-total-score" class="table-data"><!-- out total score goes here --></div>');
    
        for (let hole = 9; hole <= 17; hole++) {
            $(`#${name}`).append(tableData);
        }
        $(`#${name}`).append('<div id="in-total-score" class="table-data"><!-- in total score goes here --></div>');
        $(`#${name}`).append('<div id="total-score" class="table-data"><!-- total score goes here --></div>');
    }
}

function lockScore(target) {
    if ($(target).val()) {
        $(target).attr('disabled', true);
        $('#error-msg').html(`Score locked for ${$(target).attr('owner')}.`);
        setTimeout(() => {
            $('#error-msg').html('');
        }, 2000);
    }
}

const prom = new Promise(
    (resolve, reject) => {
        if (1 + 1 !== 2) {
            resolve('This is true.');
        } else {
            reject('This is false.');
        }
    }
);

prom
.then(message => {
    console.log(message);
})
.catch(error => {
    console.log(error);
});

function getCourses() {
    $.get('https://golf-courses-api.herokuapp.com/courses', (data) => {
        data['courses'].forEach(
            (course, index) => {
                $('#select-course').append(`<option value="${index + 1}">${course.name}</option>`)
            }
        )
    });
}
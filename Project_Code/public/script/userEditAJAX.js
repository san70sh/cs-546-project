let title = $('#title');
let employmentType = $('#employmentType');
let companyName =  $('#companyName');
let startDateEx =  $('#startDateEx');
let endDate =  $('#endDate');
let userId = $('#dumb');
let exConfig = {
    method: 'Get',
    url: `/users/ex/`
}

let school = $('#school');
let major = $('#major');
let degree = $('#degree');
let startDateEdu = $('#startDateEdu');
let endDateEdu = $('#endDateEdu');
let eduConfig = {
    method: 'Get',
    url: `/users/edu/`
}

let skill = $('#skills')
let skConfig = {
    method: 'Get',
    url: `/users/sk/`
}

let languages = $('#languages')
let laConfig = {
    method: 'Get',
    url: `/users/la/`
}
$(document).ready(function(){
    $.ajax(exConfig).then(responseMessage =>{
        //$('#error').hide();
        $('#preEx').children().remove();
        responseMessage.forEach(ele => {
            let li = `<li>CompanyName:&nbsp ${ele.companyName}, 
            Title:&nbsp${ele.title},
            EmploymentType:&nbsp ${ele.employmentType},
            StartDate:&nbsp${ele.startDateEx},
            EndDate:&nbsp${ele.endDate}
            &nbsp&nbsp&nbsp&nbsp<a href = ${ele.companyName}>remove</a>
            </li>`//need bind del events
            $('#preEx').append(li);
        });
    });
    $.ajax(eduConfig).then(responseMessage =>{
        //$('#error').hide();
        $('#preEdu').children().remove();
        responseMessage.forEach(ele => {
            let li = `<li>school:&nbsp ${ele.school}, 
            major:&nbsp${ele.major},
            degree:&nbsp ${ele.degree},
            StartDate:&nbsp${ele.startDate},
            EndDate:&nbsp${ele.endDate}
            &nbsp&nbsp&nbsp&nbsp<a href = ${ele.school}>remove</a>
            </li>`//need bind del events
            $('#preEdu').append(li);
        });
    });
    $.ajax(skConfig).then(responseMessage =>{
        //$('#error').hide();
        $('#preSk').children().remove();
        for(let i = 0; i < responseMessage.length; i++) {
            let li = `<li>${responseMessage[i]}
            &nbsp&nbsp&nbsp&nbsp<a href = ${responseMessage[i]}>remove</a>
            </li>`//need bind del events
            $('#preSk').append(li);
        }
    });
    $.ajax(laConfig).then(responseMessage =>{
        //$('#error').hide();
        $('#preLa').children().remove();
        for(let i = 0; i < responseMessage.length; i++) {
            let li = `<li>${responseMessage[i]}
            &nbsp&nbsp&nbsp&nbsp<a href = ${responseMessage[i]}>remove</a>
            </li>`//need bind del events
            $('#preLa').append(li);
        }
    });
});

$('#userEx').submit((event) => {
    event.preventDefault();
    if(title.val().trim().length && companyName.val().trim().length !== 0){
        let tmp = {
            title:title.val(),
            employmentType:employmentType.val(),
            companyName:companyName.val(),
            startDate:startDateEx.val(),
            endDate:endDate.val()
        }
        $.post(`/users/ex/`, {tmp}, 
        function(returnedData){
            if (returnedData){
            alert("your experience has successfully add!");
            location.reload(true);
            }
        }
        );
    } else {
        $('#exError').show();
        $('#exError').html('title and  companyName can\'t be empty or just spaces');
        $('#formLabel').addClass('error');
    }
})

$('#userEdu').submit((event) => {
    event.preventDefault();
    if(school.val().trim().length && major.val().trim().length !== 0 && degree.val().trim().length !== 0){
        let tmp = {
            school:school.val(),
            major:major.val(),
            degree:degree.val(),
            startDate:startDateEx.val(),
            endDate:endDate.val()
        }
        $.post(`/users/edu/`, {tmp}, 
        function(returnedData){
            if (returnedData){
            alert("your education has successfully add!");
            location.reload(true);
            }
        }
        );
    } else {
        $('#exError').show();
        $('#exError').html('school, major and degree can\'t be empty or just spaces');
        $('#formLabel').addClass('error');
    }
})

$('#userSk').submit((event) => {
    event.preventDefault();
    if(skill.val().trim().length !== 0){
        let tmp = {
            skills:skill.val()
        }
        $.post(`/users/sk/`, {tmp}, 
        function(returnedData){
            if (returnedData){
            alert("your skills has successfully add!");
            location.reload(true);
            }
        }
        );
    } else {
        $('#exError').show();
        $('#exError').html('skill can\'t be empty or just spaces');
        $('#formLabel').addClass('error');
    }
})

$('#userLa').submit((event) => {
    event.preventDefault();
    if(languages.val().trim().length !== 0){
        let tmp = {
            languages:languages.val()
        }
        $.post(`/users/la/`, {tmp}, 
        function(returnedData){
            if (returnedData){
            alert("your languages has successfully add!");
            location.reload(true);
            }
        }
        );
    } else {
        $('#exError').show();
        $('#exError').html('skill can\'t be empty or just spaces');
        $('#formLabel').addClass('error');
    }
})
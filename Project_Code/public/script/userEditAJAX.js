let title = $('#title');
let employmentType = $('#employmentType');
let companyName =  $('#companyName');
let startDate =  $('#startDate');
let endDate =  $('#endDate');
let userId = $('#dumb');
let requestConfig = {
    method: 'Get',
    url: `/users/ex/${userId.text()}`
}
$(document).ready(function(){
    $.ajax(requestConfig).then(responseMessage =>{
        //$('#error').hide();
        $('#preEx').children().remove();
        responseMessage.forEach(ele => {
            let li = `<li>CompanyName:&nbsp ${ele.companyName}, 
            Title:&nbsp${ele.title},
            EmploymentType:&nbsp ${ele.employmentType},
            StartDate:&nbsp${ele.startDate},
            EndDate:&nbsp${ele.endDate} 
            </li>`
            $('#preEx').append(li);
        });
    });
});

$('#userEx').submit((event) => {
    event.preventDefault();
    if(title.val().trim().length && companyName.val().trim().length !== 0){
        let tmp = {
            title:title.val(),
            employmentType:employmentType.val(),
            companyName:companyName.val(),
            startDate:startDate.val(),
            endDate:endDate.val()
        }
        $.post(`/users/ex/${userId.text()}`, {tmp}, 
        // function(returnedData){
        //     if (returnedData){
        //     alert("your experience has successfully add!");
        //     }
        // }
        );
    } else {
        $('#exError').show();
        $('#exError').html('title and  companyName can\'t be empty or just spaces');
        $('#formLabel').addClass('error');
    }
})


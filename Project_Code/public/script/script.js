$(document).ready(function() {
    
    // $("#recruiterLoginBtn").on('click',function() {
    //     $("#recruiterLogin").modal("show");
    // });

    // $("#applicantLoginBtn").on('click',function() {
    //     $("#applicantLogin").modal("show");
    // });

    // $("#recruiterSignupBtn").on('click', function() {
    //     $("#recruiterLogin").modal("hide");
    //     $("#recruiterSignup").modal("show");
    // })

    // $("#recruiterSigninBtn").on('click', function() {
    //     $("#recruiterLogin").modal("show");
    //     $("#recruiterSignup").modal("hide");
    // })

    // $("#applicantSignupBtn").on('click', function() {
    //     $("#applicantLogin").modal("hide");
    //     $("#applicantSignup").modal("show");
    // })

    // $("#applicantSigninBtn").on('click', function() {
    //     $("#applicantLogin").modal("show");
    //     $("#applicantSignup").modal("hide");
    // })

    $.ajax ({
        type :'GET',
        url : '/getsession',
        success: function(data){
            console.log(data.status);
            if(data.status == 'inactive'){
                console.log("hello");
                $('#sessionactive').show();
            }
            else{
                $('#logout').show();
            }
        }
    });

     
 

});

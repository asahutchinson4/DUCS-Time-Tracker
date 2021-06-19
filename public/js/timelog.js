// File: timelog.js
// Author: S. Sigman, A. Hutchinson IV   Date: 12/30/2020
// Copyright 2021 by A. Hutchinson IV
//
// This file defines the functionality for the landing page of the
// DTT application.
// 
// Sidebar code from: https://bootstrap-menu.com/detail-offcanvas-mobile.html



$(() => {
    // create an instance of the landing page of the app
    timeLHPApp = new HPApp("DUCS Time Tracker");
    timeLHPApp.initialize();
});

class HPApp {
    constructor (name) {
        this.title = name;
    }

    get getTitle() {
        return this.title;
    }

    initialize () {
        // code to initialize the app goes here
        // ie.  add the listeners here
        console.log(`${this.getTitle} app initialized`);

        // initialization for sidebar menu
        $("[data-trigger]").on("click", function(e){
            e.preventDefault();
            e.stopPropagation();
            var offcanvas_id =  $(this).attr('data-trigger');
            $(offcanvas_id).toggleClass("show");
            $('body').toggleClass("offcanvas-active");
            $(".screen-overlay").toggleClass("show");
    
            // check if a section needs to be hidden
            if ($('#stu-col').css("display") == "block") 
              $('#stu-col').css("display", "none");
    
            if ($('#inst-col').css("display") == "block") 
              $('#inst-col').css("display", "none");
    
            if ($('#about-info').css("display") == "block") 
              $('#about-info').css("display", "none");
    
        }); 
    
           // Close menu when pressing ESC
        $(document).on('keydown', function(event) {
            if(event.keyCode === 27) {
               $(".mobile-offcanvas").removeClass("show");
               $("body").removeClass("overlay-active");
            }
        });
    
        $(".btn-close, .screen-overlay").click(function(e){
            $(".screen-overlay").removeClass("show");
            $(".mobile-offcanvas").removeClass("show");
            $("body").removeClass("offcanvas-active");
        }); 
    
        $("#stu-info-btn, #inst-info-btn, #about-info-btn").click((event)=> {
            // remove the sidebar
            $(".screen-overlay").removeClass("show");
            $(".mobile-offcanvas").removeClass("show");
            $("body").removeClass("offcanvas-active");
    
            // show the card
            if (event.target.id=="stu-info-btn") {
                $('#stu-col').css("display","block");
            }
    
            if (event.target.id == "inst-info-btn") {
                $('#inst-col').css("display","block");
            }
    
            if (event.target.id == "about-info-btn") {
                $('#about-info').css("display","block");
            }
        });

        // sign the user in
        $('#signin-form').submit((event) =>{
            event.preventDefault(); // prevent submission

            // get the user data
            let user = {
                email: $('#username').val(),
                password: $('#password').val()
            }

            // save the user's email in local storage
            window.localStorage.setItem("email", user.email);
            // make the API call
            $.ajax({
                url: "api/auth",
                method: "POST",
                data: JSON.stringify(user),
                contentType: "application/json",
                dataType: "json"
            })
            .done((data, statusText, xhr) => {
                console.log(`Returned message: ${data.msg} Status Code: ${xhr.status}` );
                
                 // save the user's token in local storage
                window.localStorage.setItem("token", data.token);

                if (xhr.status == 200) {
                    // save user's email and name in local storage for use on 
                    // other pages
                    window.localStorage.setItem("fName",data.fname);
                    // transfer to the right page
                    if(data.role == "student") 
                        window.location.replace("ws-recording.html");
                    else 
                        window.location.replace("reporting-page.html");
                }
            })
            .fail((xhr, textStatus) => {

                // internal error message
                if (xhr.status == 500){
                    $('#sign-in-modal').modal('show');
                    $('#internal-error').removeClass('hide');

                    // remove the email from local storage
                    window.localStorage.removeItem("email");
                }

                // if the user is unauthorized
                if (xhr.status == 401) {
                    $('#sign-in-modal').modal('show');
                    $('#auth-error').removeClass('hide');

                    // remove the email from local storage
                    window.localStorage.removeItem("email");
                }
            })

        });

        // hide the auth-error when username or password changes 
        $('#username, #password').focus((event) =>{
            $('#auth-error').addClass('hide');
        });
    }
}
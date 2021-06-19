// File: ws-recording.js
// Author: A. Hutchinson IV   Date: 1/19/2021
// Copyright 2021 by A. Hutchinson IV
//
// This file defines the functionality for the work session recording
// page of the application.
// 
// Sidebar code from: https://bootstrap-menu.com/detail-offcanvas-mobile.html



$(() => {
    // create an instance of the work session recording page of the app
    stuWSApp = new WSApp("DUCS Time Tracker");
    stuWSApp.initialize();
});

class WSApp {
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

        // adjust the heading name
        $('#lg-userToggle').html(window.localStorage.getItem("fName"));
        // find the user's projects and populate the project dropdown
        // 1. create the URL with an encoded query string
        let encodedQuery = encodeURIComponent(window.localStorage.getItem("email"));
        let projUrl = `/api/project?u=${encodedQuery}`;
        console.log(`URL for GET Projects ${projUrl}`);

        // when the page loads, the edit button will be hidden
        var editBtn = document.getElementById("edit-btn");
        editBtn.style.display = "none";

        // make an ajax call to get the user's projects
        $.ajax({
            url: projUrl,
            method: "GET",
            dataType: "json"
        })
        .done((data, statusText, xhr)=>{
            console.log(`Get Projects Status Code: ${xhr.status}. Num projects returned: ${data.length}`);
            // Got the projects put in the dropdown 
            if (xhr.status == 200 && data.length > 0) {
                this.addProjects(data);
            }
            else{
                // user not assigned projects
                $('#acct-error').removeClass('hide');
            }
        });

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

        $('#wsForm').submit((event)=>{

            // if the green save button is clicked aka the 
            // the red edit save button is hidden
            if(editBtn.style.display === "none"){
                // Getting data from the worksession
                let data = {
                    owner: window.localStorage.getItem('email'),
                    project: $('#project').val(),
                    wsDate: $('#ws-date').val(),
                    startTime: $('#startTime').val(),
                    finishTime: $('#finishTime').val(),
                    code: $('#code').val(),
                    code90Desc: $('#otherCategory').val(),
                    desc: $('#desc').val()
                }
                // Making the API call
                $.ajax({
                    url: 'api/wsession',
                    method: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    dataType: 'json'
                })
                // Validation for success
                // Checks status code
                .done((data, statusText, xhr)=>{
                    event.preventDefault();
                    if(xhr.status == 201){
                        alert("Work session successfully saved");
                    }
                })
                // Validation for failing
                // Checks status code
                .fail((data, statusText, xhr)=>{
                    event.preventDefault();
                    if(xhr.status == 401 || xhr.status == 412){
                        alert("Error: Work session not saved");
                    }
                });
                }
                // if the red save edit button is clicked
                else{

                    // get project ID from selected row (which is stored in cookie)
                    let projectIDCookie = getCookie("projectID");
                    
                    let data = {
                        cookieID: projectIDCookie,
                        project: $('#project').val(),
                        wsDate: $('#ws-date').val(),
                        startTime: $('#startTime').val(),
                        finishTime: $('#finishTime').val(),
                        code: $('#code').val(),
                        code90Desc: $('#otherCategory').val(),
                        desc: $('#desc').val()
                    }

                    $.ajax({
                        url: 'api/editTimeCard',
                        method: "POST",
                        data: JSON.stringify(data),
                        contentType: 'application/json',
                        dataType: 'json'
                    })

                    .done((data, statusText, xhr)=>{
                        event.preventDefault();
                        if(xhr.status == 201){
                            alert("Work session successfully updated");
                        }
                    });             
                }
            })

            var totalTime = document.getElementsByName("totalTime")[0];
            var startTime = document.getElementsByName("startTime")[0];
            var finishTime = document.getElementsByName("finishTime")[0];

            // When the user inputs data into the Start box, this will calculate how much
            // time was spent on the project for the user.
            startTime.addEventListener("input", function(){
                // This is where you get the milliseconds for each time
                // and convert it to seconds, minutes or hours
                let startMili = Number(startTime.value.split(':')[0]) * 60 * 60 * 1000 + Number(startTime.value.split(':')[1]) * 60 * 1000;
                let endMili = Number(finishTime.value.split(':')[0]) * 60 * 60 * 1000 + Number(finishTime.value.split(':')[1]) * 60 * 1000;

                if(startMili > endMili){

                    totalTime.value = "Error-Time surpasses one day.";
                }
                else{
                    totalTime.value = endMili - startMili;
                    totalTime.value = timeConversion(totalTime.value);
                }
            

        }, false);

        // When the user inputs data into the Finish box, this will calculate how much
        // time was spent on the project for the user.
        finishTime.addEventListener("input", function(){
            // This is where you get the milliseconds for each time
            // and convert it to seconds, minutes or hours
            let startMili = Number(startTime.value.split(':')[0]) * 60 * 60 * 1000 + Number(startTime.value.split(':')[1]) * 60 * 1000;
            let endMili = Number(finishTime.value.split(':')[0]) * 60 * 60 * 1000 + Number(finishTime.value.split(':')[1]) * 60 * 1000;

            if(startMili > endMili){

                totalTime.value = "Error-Time surpasses one day.";
            }
            else{
                totalTime.value = endMili - startMili;
                totalTime.value = timeConversion(totalTime.value);
            }

        }, false);

         // listener for when row on the table is clicked
         $("table").delegate('tr', 'click', function(event){
            $("#ws-viewCards").modal("hide");

            // make the edit button visible
            editBtn.style.display = "block";

            var saveBtn = document.getElementById("save-btn");
            saveBtn.style.display = "none";    

            // create some variables for the selected row
            let selectedRow = $(this);
            let proj = selectedRow.find(".rawProject").text();
            let date = selectedRow.find(".rawDate").text();
            let start = selectedRow.find(".rawStart").text();
            let finish = selectedRow.find(".rawFinish").text();
            let hrs = selectedRow.find(".hrs").text();
            let code = selectedRow.find(".code").text();
            let act = selectedRow.find(".act").text();
            let id = selectedRow.find(".idProject").text();

            // clear project ID cookie then put the most recently
            // clicked project ID in cookie
            deleteCookie("projectID");
            document.cookie = `projectID=${id}`;

            // to fix problem with spaces before and after data
            proj = proj.replace(' ','');
            date = date.replace(' ','');
            start = start.replace(' ','');
            finish = finish.replace(' ','');
            hrs = hrs.replace(' ','');
            code = code.replace(' ','');
            act = act.replace(' ','');

            // for loop to select the project in the dropdown that matches
            // the project associated with the clicked timecard
            var project = document.getElementsByName("project")[0];
            for(var i=0; i < project.length; i++){

                if(project[i].value == proj){
                    $(project[i]).attr("selected","selected"); 
                }
                else{
                    $(project[i]).removeAttr('selected');
                }
            }


            // populating all boxes on the page with information from selected timecard
            var sessionDate = document.getElementsByName("ws-date")[0];
            sessionDate.value = date;

            var startTime = document.getElementsByName("startTime")[0];
            startTime.value = start;

            var finishTime = document.getElementsByName("finishTime")[0];
            finishTime.value = finish;

            var totalTime = document.getElementsByName("totalTime")[0];
            totalTime.value = hrs;

            var codeNum = document.getElementsByName("code")[0];
            codeNum.value = code;

            // to filter out the project names from the activity description
            var filteredAct = act.replace('(DTT)','');
            var filteredAct2 = filteredAct.replace('(SP1)','');

            var description = document.getElementsByName("desc")[0];
            description.value = filteredAct2;
         });

         // listener for when the sign out button is pressed
        $("#signout-btn").click((event)=> {

            // delete cookies with information
            deleteCookie("projectID");
            deleteCookie("user email");

            // take user to the home page
            window.location.replace("index.html");
        });
            
        document.getElementById("inst-info-btn").addEventListener("click", function() {
            // get user email from cookie
            let theEmailCookie = getCookie("user email");
            let timeCardModalUrl = `/api/timeCardModal?e=${theEmailCookie}`;

            $.ajax({
                url: timeCardModalUrl,
                method: "GET",
                dataType: "json"
            })

            .done((data, statusText, xhr)=>{
                var totalTimeWorked = 0;
                let modal = $("#cardsModalReport");
                let modalRow = $("#cardsModalReportRow");
                let modalName = $("#cardsModalName");
                let modalWeek = $("#cardsModalWeek");
                let modalProject = $("#cardsModalProject");
                let modalTotalHrs = $("#cardsModalTotalHrs");
                let html = "";
                let timecards = data.timecards;
                let projects = data.projects
                let amountOfProjects = data.amountOfProjects;
                
                // in order to clear out the modal each time you click on a row
                modal.empty();
                modal.append(modalRow);
                modalName.empty();
                modalWeek.empty();
                modalProject.empty();
                modalTotalHrs.empty();

                // add string for this project header
                modalProject.append("Project(s): ")

                // arrays for the start and finish times
                // used to join minutes and hours together to match required data format later on
                let startArray = [];
                let finishArray = [];

                // for loop to add the the project codes that the student has
                // worked on
                for(var x = 0; x < amountOfProjects; x++){
                    
                    modalProject.append(`${projects[x].projCode}...`);
                }

                // for loop to add sessions and their data in the modal
                for(var i = 0; i < timecards.length; i++){

                    // clear the arrays each time you use it
                    startArray = [];
                    finishArray = [];

                    let startMin = timecards[i].startMin;
                    let finishMin = timecards[i].finishMin;
                    let startHr = timecards[i].startHr;
                    let finishHr = timecards[i].finishHr;
                    let date = timecards[i].date.slice(5,10);
                    let tempSessionTime = hoursWorked(startHr, startMin, finishHr, finishMin);
                    totalTimeWorked += tempSessionTime;

                    // to convert startHr and startMin to standard time instead of military and
                    // to prevent times from looking like this
                    // 11:0 am, 8:7 am, etc.
                    let regStartTime;

                    if (startHr > 0 && startHr <= 12) {
                        regStartTime = "" + startHr;
                    } else if (startHr > 12) {
                        regStartTime = "" + (startHr - 12);
                    } else if (startHr == 0) {
                        regStartTime = "12";
                    }
                        
                    regStartTime += (startMin < 10) ? ":0" + startMin : ":" + startMin;  // get minutes
                    regStartTime += (startHr >= 12) ? " p.m." : " a.m.";  // get a.m./p.m.

                    // to convert finishHr and finishMin to standard time instead of military and
                    // to prevent times from looking like this
                    // 11:0 am, 8:7 am, etc.
                    let regFinishTime;

                    if (finishHr > 0 && finishHr <= 12) {
                        regFinishTime = "" + finishHr;
                    } else if (finishHr > 12) {
                        regFinishTime = "" + (finishHr - 12);
                    } else if (finishHr == 0) {
                        regFinishTime = "12";
                    }
                        
                    regFinishTime += (finishMin < 10) ? ":0" + finishMin : ":" + finishMin;  // get minutes
                    regFinishTime += (finishHr >= 12) ? " p.m." : " a.m.";  // get a.m./p.m.
                  

                    // the next four if statements are to ensure the data formats are correct when editing
                    // these add a 0 to the left of the digit if needed
                    if(startMin.toString().length == 1){
                        startMin = ('0' + startMin).slice(-2);
                    }

                    if(startHr.toString().length == 1){
                        startHr = ('0' + startHr).slice(-2);
                    }

                    if(finishMin.toString().length == 1){
                        finishMin = ('0' + finishMin).slice(-2);
                    }

                    if(finishHr.toString().length == 1){
                        finishHr = ('0' + finishHr).slice(-2);
                    }
                   

                    // add start and finish times to their respected arrays
                    // used to join minutes and hours together to match required data format later on
                    startArray.push(startHr, startMin);
                    finishArray.push(finishHr, finishMin);
    
                    // filling out data for rows of modal popup
                    html += `"<tr>"
                                "<td class="date"> ${date}</td>"
                                "<td class="start"> ${regStartTime}</td>"
                                "<td class="finish"> ${regFinishTime}</td>"
                                "<td class="hrs"> ${tempSessionTime.toFixed(1)}</td>"
                                "<td class="code"> ${timecards[i].code}</td>"
                                "<td class="act"> ${timecards[i].description} (${timecards[i].project})</td>"
                                "<td class="rawDate" hidden> ${timecards[i].date.slice(0,10)}</td>"
                                "<td class="rawStart" hidden> ${startArray.join(':')}</td>"
                                "<td class="rawFinish" hidden> ${finishArray.join(':')}</td>"
                                "<td class="rawProject" hidden> ${timecards[i].project}</td>"
                                "<td class="idProject" hidden> ${timecards[i]._id}</td>"
                            </tr>"`
                }
        
                modalTotalHrs.append(`Total Hours Worked: ${totalTimeWorked.toFixed(1)}`);
                modal.append(html);
            })
        });
    }

   

    addProjects(projects) {
        for(let i=0; i<projects.length; i++) {
            let proj = `<option value=${projects[i].projCode}`;
            if (i==0){
                proj += ` selected>`;
            }
            else {
                proj += '>'
            }
            proj += `${projects[i].name}</option>`

            // put in dropdown list
            $('#project').append(proj);
        }
    }
    
}

 // Converts milliseconds to hours
 function timeConversion(mili) {
  
    var hrs = (mili / (1000 * 60 * 60)).toFixed(1);
    return hrs
}


// To calculate total hours worked
function hoursWorked(startHr, startMin, finishHr, finishMin){
    let total = 0; 
    let hrs = finishHr - startHr;
    let mins = (finishMin - startMin)/60;
    total = total + hrs + mins;
  return total
}


// to get cookie data
function getCookie(cookieName){
    let name = cookieName + "=";
    var cookies = document.cookie;
    let decodedCookie = decodeURIComponent(cookies);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++){
      let c = ca[i];
      while (c.charAt(0) == ' '){
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0){
        return c.substring(name.length, c.length);
      }
    }
      return "";
  }
  
  // to delete cookies
  function deleteCookie(cookieName){
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
  
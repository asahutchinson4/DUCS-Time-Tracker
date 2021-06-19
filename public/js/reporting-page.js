// File: ws-recording.js
// Author: A. Hutchinson IV   Date: 1/19/2021
// Copyright 2021 by A. Hutchinson IV
//
// This file defines the functionality for the work session reporting
// page of the application.


$(() => {
        
        // sets default date of date selector for start week
        // to previous sunday 
        var today = new Date();
        var Sunday = new Date(today.getTime() - today.getDay() * 24 * 3600 * 1000);
        Sunday = formatDate(Sunday);
        $("#start-week").val(Sunday);

        $('#lg-userToggle').html(window.localStorage.getItem("fName"));
        let encodedQuery = encodeURIComponent(window.localStorage.getItem("email"));
        let projUrl = `/api/project?u=${encodedQuery}`;

        // listener for when create report button is clicked
        $('#wsForm-report').submit((event)=>{
            let projectName = $('#project').val();
            let startDate = $('#start-week').val();
            let reportUrl = `/api/wsession?p=${projectName}&d=${startDate}`;
            event.preventDefault();
            $.ajax({
                url: reportUrl,
                method: "GET",
                dataType: "json"
            })
            .done((data, statusText, xhr)=>{
                let reportlist = $("#reportChart");
                let reportTitle = $("#reportTitle");
                let row = $("#reportRow");
                let html = ""
                let title = ""
              
                // if status code 200 is returned (data retrieved successfully)
                if(xhr.status == 200){
    
                    // In order to clear out the table each time you click the create report button
                    reportlist.empty();
                    reportTitle.empty();
                    reportlist.append(row);
                    
                    // to populate data above student name and total hours table
                    title += `<h2 id="fullProjectName"> Project Name: ${data.projectName} </h2>`
                    title += `<h2> Start Date: ${startDate} </h2>`
                    title += `<h2> End Date: ${data.endDate} </h2>`
                            
                    reportTitle.append(title);
                    let timeCards = data.sessions;

                    // for loop to add data to table
                    for(i = 0; i < timeCards.length; i++){
                      html += `"<tr>"
                                    "<td class="name"> ${timeCards[i].lastName}, ${timeCards[i].firstName} </td>"
                                    "<td class="hrs"> ${timeCards[i].totalHrs}</td>"
                                    "<td class="owner" hidden> ${timeCards[i].email}</td>"
                              </tr>"`
                    }
                    
                    reportlist.append(html);
                  }
                })
            });

             // listener for when the sign out button is pressed
              $("#signout-btn").click((event)=> {

                // delete cookies with information
                deleteCookie("projectID");
                deleteCookie("user email");

                // take user to the home page
                window.location.replace("index.html");
            });

            // listener for when row on the table is clicked
            $("table").delegate('tr', 'click', function(event){
                $("#timeSheetModal").modal("show");
                let projectName = $('#project').val();
                let startDate = $('#start-week').val();
                let endDate = addSevenDays(startDate);
                let curRow = event.target.parentElement;
                let email = $(curRow.children[2]).text();
    
                let modal = $("#modalReport");
                let modalRow = $("#modalReportRow");
                let modalName = $("#modalName");
                let modalWeek = $("#modalWeek");
                let modalProject = $("#modalProject");
                let modalTotalHrs = $("#modalTotalHrs");
                let html = "";
                
                // In order to clear out the modal each time you click on a row
                modal.empty();
                modal.append(modalRow);
                modalName.empty();
                modalWeek.empty();
                modalProject.empty();
                modalTotalHrs.empty();

                // parse the cookie so we can manipulate the JSON data
                let theCookie = getCookie("wsessions");
                let jsonCookie = JSON.parse(theCookie);
                let cookie = jsonCookie;

                // create some variables for the selected row
                let selectedRow = $(this);
                let name = selectedRow.find(".name").text();
                let totalHrs = selectedRow.find(".hrs").text();
                let owner = selectedRow.find(".owner").text();
                let fullProjName = $("#fullProjectName").text();

                // to fix problem with spaces before and after emails
                owner = owner.replace(' ','');

                // adding data to top of modal popup
                modalName.append(`Name: ${name}`);
                modalWeek.append(`Week: ${startDate}  to  ${endDate}`);
                modalTotalHrs.append(`Total Hours Worked: ${totalHrs}`);
                
                
                // for loop to add sessions and their data in the modal
                for(i = 0; i < cookie.length; i++){

                  // to check if the email from the selected row matches 
                  // the email from the session
                  if(owner == cookie[i].owner){
                    modalProject.empty();
                    modalProject.append(`${fullProjName} (${cookie[i].project})`)
                    let startMin = cookie[i].startMin;
                    let finishMin = cookie[i].finishMin;
                    let startHr = cookie[i].startHr;
                    let finishHr = cookie[i].finishHr;
                    let date = cookie[i].date.slice(5,10);
                    let tempSessionTime = hoursWorked(startHr, startMin, finishHr, finishMin);
                    
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
                    
                    // filling out data for rows of modal popup
                    html += `"<tr>"
                                  "<td> ${date}</td>"
                                  "<td> ${regStartTime}</td>"
                                  "<td> ${regFinishTime}</td>"
                                  "<td> ${tempSessionTime.toFixed(1)}</td>"
                                  "<td> ${cookie[i].code}</td>"
                                  "<td> ${cookie[i].description}</td>"
                              </tr>"`
                  }
                }
                  
                  modal.append(html);
                
        });

        // make an ajax call to get the user's projects
        $.ajax({
            url: projUrl,
            method: "GET",
            dataType: "json"
        })

        .done((data, statusText, xhr)=>{
            console.log(`Get Projects Status Code: ${xhr.status}. Num projects returned: ${data.length}`);
            // got the projects put in the dropdown 
            if (xhr.status == 200 && data.length > 0) {
                addProjects(data);
            }
            else{
                // user not assigned projects
                $('#acct-error').removeClass('hide');
            }
        });


});

// To calculate total hours worked
function hoursWorked(startHr, startMin, finishHr, finishMin){
    let total = 0; 
    let hrs = finishHr - startHr;
    let mins = (finishMin - startMin)/60;
    total = total + hrs + mins;
  return total
}

function addProjects(projects) {
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

// formats dates correctly
function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

      if (month.length < 2) 
        month = '0' + month;
      if (day.length < 2) 
        day = '0' + day;
      
      return [year, month, day].join('-');
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


// To add seven days to your start date
function addSevenDays(startingDate){
  var endDate = new Date(startingDate);
  endDate.setDate(endDate.getDate() + 7);
  year = endDate.getFullYear();
  month = endDate.getMonth() + 1;
  date = endDate.getDate();
  return year+"-"+month+"-"+date;
}





//"<td> ${data.reports[i].date.substring(0,10)} </td>"
                           //"<td> ${data.reports[i].startHr}: ${data.reports[i].startMin}</td>"
                           //"<td> ${data.reports[i].finishHr}: ${data.reports[i].finishMin}</td>"
                           //"<td> ${data.reports[i].time}</td>"
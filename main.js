//////////////////////////////////////
////// DYNAMIC DATE BLOG LINK ////////
//////////////////////////////////////

/***** SUGGESTED READING BLOG LINK *****/
// This uses the MomentJs library (node module) to generate and format a dynamic date
$("span#current-date").append(`${moment().format('dddd[, ] MMMM Do')}`);


///////////////////////////////////////
////// POPULATING DROPDOWN MENUS //////
///////////////////////////////////////

/***** YEAR DROPDOWN MENU *****/
// Populates 'Year' dropdown menu options by getting the current year
//   then decrementing until the year 1900
for (let i = moment().get('year'); i >= 1900; i--) {
  $("#year-dropdown").append($("<option />").val(i).text(i));
}

/***** MONTH DROPDOWN MENU *****/
// Populates 'Month' dropdown menu by looping over the array of month names
//   in string format from the MomentJS library method 'months()'
// I chose to display the proper string name of each month, instead
//   of the number of each month because I think it is easier
//   for users to understand. If I had used the month number value,
//   I would assign with .text(index + 1) because moment.months()
//   array is zero-indexed
$.each(moment.months(), function (index, value) {
  $("#month-dropdown").append($("<option />").val(index).text(value));
});

/***** FUNCTION: CHECK FOR MONTH AND YEAR VALUES *****/
// -Purpose: Checks whether the 'Month' and 'Year' dropdown menus
//   have values
// -Receives: nothing
// -Returns: Boolean
function checkForMonthAndYearValues() {
  if ($("#year-dropdown").val() && $("#month-dropdown").val())
    return true;
  return false;
}

/***** FUNCTION: CALCULATE DAYS IN A MONTH *****/
// -Purpose: Calculates how many days were in the specified month
// -Receives: the values of the 'Year' and 'Month' dropdown menu elements
// -Returns: Integer: the number of days in the selected month
function calulateDaysInAMonth(year, month) {
  // 'month' must be converted to a number and increased by 1.
  // Using '0' as the third argument returns the PREVIOUS month's total days
  if (year && month)
    return new Date(+year, +month + 1, 0).getDate();
}

/***** FUNCTION: POPULATE THE 'DATE' DROPDOWN MENU *****/
// -Purpose: Populates the 'Date' dropdown menu with appropriate number of days
// -Receives: integer value of number of days in that month
// -Returns: nothing
function populateDateMenu(numberOfDays) {
  for (let i = 1; i <= numberOfDays; i++) {
    $("#date-dropdown").append($("<option />").val(i).text(i));
  }
}


////// DROPDOWN MENU EVENT LISTENERS //////


/***** EVENT LISTENER: POPULATE THE 'DATE' DROPDOWN MENU *****/
// Listener is applied to both the 'Year' and 'Month' select
//   elements so that when either of them change, the anonymous
//   function is executed
// THREE STEPS:
// STEP 1. Checks that both 'Month' and 'Year' menus actually have values
//           If they do not, nothing will happen
// STEP 2. If they do both have values, determine how many days are in
//           the selected month
// STEP 3. Using the number from STEP 2, populate the 'Date' select menu
$(".birthdate-selects").on("change", function () {
  let year = $("#year-dropdown").val(),
    month = $("#month-dropdown").val();
  if (checkForMonthAndYearValues())
    populateDateMenu(calulateDaysInAMonth(year, month));
});



//////////////////////////////////
//////// FORM SUBMISSION /////////
//////////////////////////////////

/***** FUNCTION: CHECK IF USER IS UNDER 18 YEARS OLD *****/
// -Purpose: Determine if the user is under 18 years old
// -Receives: nothing
// -Returns: Boolean
function isUserUnderLegalAge() {
  let usersAge = new Date($("#year-dropdown").val(), $("#month-dropdown").val(), $("#date-dropdown").val());
  let eighteenYearsOld = new Date((new Date().getFullYear() - 18), $("#month-dropdown").val(), $("#date-dropdown").val());
  // Dates are in milliseconds since 1970, so a smaller
  //   number actually means the user is older
  // So, if eighteenYearsOld is smaller than the usersAge,
  //   that means that the user is less than 18 years
  //   old, so the function returns true
  if (eighteenYearsOld < usersAge)
    return true;
  return false;
}

/***** FUNCTION: CALCULATE DAYS UNTIL USER IS 18 *****/
// -Purpose: Uses a MomentJS method to calculate the difference
//    in days between the user's age and the current date
// -Receives: nothing
// -Returns: Integer of how many days until the user is 18
function daysUntilEighteen() {
  let usersAge = new Date($("#year-dropdown").val(), $("#month-dropdown").val(), $("#date-dropdown").val());
  let rightNow = new Date();
  let millisecondsDifference = new moment.duration(rightNow - usersAge);
  return Math.round(millisecondsDifference.asDays());
}

/***** FUNCTION: SHOW POST-REGISTRATION MESSAGE *****/
// -Purpose: Replaces the html of the registration form
//   with a message that calculates how many restaurants
//   they entered based on the number of linebreaks in the
//   textarea
// -Receives: nothing
// -Returns: Integer of the value of their coupon book
function replaceFormWithMessage() {
  let restaurants = $("#favorite-restaurants-textarea").val().split('\n');
  let couponBookValue = 5 + ((restaurants.length - 1) * 3);
  $("#registration-form").hide();
  $("#message-after-registration").append(`
    Thank you for registering. We will be in touch. Please consider ordering a customized coupon book for just $${couponBookValue}.
  `);
}

/***** FUNCTION: SEND EMAIL *****/
// -Purpose: Creates and sends email with the user's form data
// -Receives: nothing
// -Returns: Promise
function sendEmail() {
  let userBdayMonth = $("#month-dropdown").val();
  if( userBdayMonth < 10)
    userBdayMonth = `0${userBdayMonth}`

  let userBdayDate = $("#date-dropdown").val();
  if( userBdayDate < 10)
    userBdayDate = `0${userBdayDate}`

  let userBirthdate = moment(`${$("#year-dropdown").val()}-${userBdayMonth}-${userBdayDate} `).format('MM/DD/YYYY');
  let newUserObjectEmail = {
    userName: $("#user-name").val(),
    userEmail: $("#user-email").val(),
    userBirthdate,
    destinationEmail: `infrastructure@medalogix.com`,
    subject: `New registration submitted on ${moment().format('dddd[, ] MMMM Do')}`,
    body: `${$("#favorite-restaurants-textarea").val()}`,
    CC: $("#user-email").val(),
  }
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `localhost:25`,
      method: 'POST',
      data: newUserObjectEmail,
      success: function (data) {
        resolve(data);
      },
      error: function (err) {
        console.log(err);
        reject(err);
      }
    });
  });
}

////// FORM SUBMIT EVENT LISTENERS //////

/***** EVENT LISTENER: SUBMIT FORM *****/
// Listener is applied to submit method of the form element
// THREE STEPS:
// STEP 1. HTML of form automatically runs form verification
// STEP 2. Page reload is prevented
// STEP 3. Checks that the user's birthdate is older than 18 years
$("#registration-form").on("submit", function (e) {
  e.preventDefault();
  if (isUserUnderLegalAge())
    alert(`Oops, you have ${daysUntilEighteen()} days until you turn 18.`);
  // sendEmail()
  // .then(response=>{
  //   replaceFormWithMessage();
  // });
  replaceFormWithMessage();
});

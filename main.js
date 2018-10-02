//////////////////////////////////////
////// DYNAMIC DATE BLOG LINK ////////
//////////////////////////////////////

// *** SUGGESTED READING BLOG LINK ***
// This uses the MomentJs library (node module) to generate and format a dynamic date
$("span#current-date").append(`${moment().format('dddd[, ] MMMM Do')}`);


///////////////////////////////////////
////// POPULATING DROPDOWN MENUS //////
///////////////////////////////////////

// *** YEAR DROPDOWN MENU *** //
// Populates 'Year' dropdown menu options by getting the current year
//   then decrementing until the year 1900
for(let i = moment().get('year'); i >= 1900; i--){
  $("#year-dropdown").append($("<option />").val(i).text(i));
}

// *** MONTH DROPDOWN MENU *** //
// Populates 'Month' dropdown menu by looping over the array of month names
//   in string format from the MomentJS library method 'months()'
// I chose to display the proper string name of each month, instead
//   of the number of each month because I think it is easier
//   for users to understand. If I had used the month number value,
//   I would assign with .text(index + 1) because moment.months()
//   array is zero-indexed
$.each(moment.months(), function(index, value){
  $("#month-dropdown").append($("<option />").val(index).text(value));
});

// *** DATE DROPDOWN MENU *** //
// Populates 'Date' dropdown menu based on the values of the
//   'Month' and 'Year' dropdown menus
// THREE STEPS:
// STEP 1. Checks that both 'Month' and 'Year' menus actually have values
//           If they do not, nothing will happen.
// STEP 2. If they both do have values, determine how many days are in
//           the selected month
// STEP 3. Using the number from STEP 2, it will populate the 'Date' menu

// STEP 1 FUNCTION
// Checks that both the 'Year' and 'Month' dropdowns have a value
// Receives: nothing
// Returns: Boolean
function checkForValues(){
  if($("#year-dropdown").val() && $("#month-dropdown").val())
    return true;
  return false;
}

// STEP 2 FUNCTION
// Receives: the values of the 'Year' and 'Month' dropdown menus
// Returns: Integer: the number of days in the selected month
function calulateDaysInAMonth(year, month){
  // 'month' must be converted to a number and increased by 1.
  // Using '0' as the third argument returns the PREVIOUS month's total days
  if (year && month)
    return new Date(+year, +month + 1, 0).getDate();
}

// STEP 3 FUNCTION
// Populates the 'Date' dropdown menu with appropriate number of days
// Receives: integer value of number of days in that month
// Returns: nothing
function populateDateMenu(numberOfDays){
  for(let i = 1; i <= numberOfDays; i++){
    $("#date-dropdown").append($("<option />").val(i).text(i));
  }
}

//// DROPDOWN EVENT LISTENERS ////

// Listener for the 2 inputs is assigned using a class
//   "birthdate-selects" that is applied to both 'select' elements
$(".birthdate-selects").on("change", function(){
  let year = $("#year-dropdown").val(),
  month = $("#month-dropdown").val();
  if(checkForValues())
    populateDateMenu(calulateDaysInAMonth(year, month));
});


////////////////////////////////
////// FORM SUBMISSION /////////
////////////////////////////////

// *** CHECK USER'S AGE *** //
// Receives: nothing
// Returns: Boolean
function isUserUnderLegalAge(){
  let usersAge = new Date($("#year-dropdown").val(), $("#month-dropdown").val(), $("#date-dropdown").val());
  let eighteenYearsOld = new Date((new Date().getFullYear() - 18), $("#month-dropdown").val(), $("#date-dropdown").val());
  // Dates are in milliseconds since 1970, so a smaller
  //   number means the user is actually older
  // So, if eighteenYearsOld is smaller than the usersAge,
  //   that means that the user is less than 18 years
  //   old, so the function returns true
  if(eighteenYearsOld < usersAge)
    return true;
  return false;
}

// *** CALCULATE DAYS UNTIL USER IS 18 *** //
// Receives: nothing
// Returns: Integer of how many days until the user is 18
function daysUntilEighteen(){
  let usersAge = new Date($("#year-dropdown").val(), $("#month-dropdown").val(), $("#date-dropdown").val());
  let rightNow = new Date();
  let millisecondsDifference = new moment.duration(rightNow - usersAge);
  return Math.round(millisecondsDifference.asDays());
}

///// FORM SUBMIT EVENT LISTENERS /////
$("#registration-form").on("submit", function(e){
  e.preventDefault();
  if(isUserUnderLegalAge())
    alert(`Oops, you have ${daysUntilEighteen()} days until you turn 18.`);
})

// *** SUGGESTED READING LINK ***
// This uses the MomentJs library (node module) to generate and format dynamic date
$("span#current-date").append(`${moment().format('dddd[, ] MMMM Do')}`);


// *** MONTH DROPDOWN MENU ***
// populates month menu options by looping over the array of month names
// in string format from the MomentJS library method 'months()'
$.each(moment.months(), function(index, value){
  $("#month-dropdown").append($("<option />").val(index).text(value));
});

// *** YEAR DROPDOWN MENU ***
// populates year menu options from 1900 to current year
for(let i = moment().get('year'); i >= 1900; i--){
  $("#year-dropdown").append($("<option />").val(i).text(i));
}

// *** DATE DROPDOWN MENU ***
// Populates the 'days' dropdown menu based on the values of the 'month' and 'year' dropdown menus
// THREE STEPS:
// STEP 1. Checks that both 'month' and 'year' actually have values
// STEP 2. If they both do, it will determine how many days are in the selected month
// STEP 3. Using that number, it will populate the 'days' menu

// STEP 1 FUNCTION
// Checks that both the 'year' and 'month' dropdowns have a value
function checkForValues(){
  if($("#year-dropdown").val() && $("#month-dropdown").val())
    return true;
  return false;
}

// STEP 2 FUNCTION
// Receives: the values of the two dropdown inputs
// Returns: Integer: the number of days in the month
function calulateDaysInAMonth(year, month){
  // 'month' must be converted to a number and increased by 1.
  // Using '0' as the third argument returns the PREVIOUS month's total days
  if (year && month)
    return new Date(+year, +month + 1, 0).getDate();
  return false;
}

// STEP 3 FUNCTION
// Receives: integer value of number of days in that month
// Populates the 'date' dropdown menu with appropriate number of days
function populateDateMenu(numberOfDays){
  for(let i = 1; i <= numberOfDays; i++){
    $("#date-dropdown").append($("<option />").val(i).text(i))
  }
}

// Listener for the 2 input changes assigned using a class that is applied to both select elements
$(".birthdate-select").on("change", function(){
  let year = $("#year-dropdown").val(),
  month = $("#month-dropdown").val();
  if(checkForValues())
    populateDateMenu(calulateDaysInAMonth(year, month));
});

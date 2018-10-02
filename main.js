
// This uses the MomentJs library (node module) to generate and format dynamic date
$("span#current-date").append(`${moment().format('dddd [, ] MMMM Do')}`);

// ***MONTH DROPDOWN MENU***
// populates month menu by looping over the array of month names
// in string form from the moment method
$.each(moment.months(), function(index, value){
  $("#month-dropdown").append($("<option />").val(value).text(value));
});

// ***YEAR DROPDOWN MENU***
// populates year menu from 1900 to current year
for(let i = 1900; i <= moment().get('year'); i++){
  $("#year-dropdown").append($("<option />").val(i).text(i));
}


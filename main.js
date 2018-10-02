
// Using the MomentJs library to generate and format dynamic date
$("span#current-date").append(`${moment().format('dddd [, ] MMMM Do')}`);
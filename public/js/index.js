$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

function texto(){
    if ((event.keyCode !== 32) && (event.keyCode < 65) || (event.keyCode > 90) && (event.keyCode < 97) || (event.keyCode > 122)){
        event.returnValue = false;
    }
}

function date(){
    if ((event.keyCode !== 47) && (event.keyCode < 48) || (event.keyCode > 57)){
        event.returnValue = false;
    }
}
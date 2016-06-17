$(function(){

$("#usrID").on('click', function(ev){
  ev.preventDefault();

  $.ajax({
  method: "DELETE",
  url: "/users/usrID"
  })
  .then(function(info) {
    console.log(info);
  });

});


});

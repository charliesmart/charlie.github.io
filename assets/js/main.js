$(document).ready(function(){
  $('nav p').on('click', function() {
    $('nav p').removeClass('selected');
    $(this).addClass('selected');
    
    $('.show').removeClass('show');
    $('.' + this.innerText).addClass('show');
  })
})

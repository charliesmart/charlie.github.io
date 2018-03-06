$(document).ready(function(){
  $('nav p').on('click', function() {
    $('nav p').removeClass('selected');
    $(this).addClass('selected');
    
    $('.show').removeClass('show');
    $('.' + this.innerText).addClass('show');
  })
  
  $('.work a').on('mouseenter', function(e) {
    var id = this.dataset.img;
    $('#' + id)
      .css('display', 'block')
      .css('left', e.clientX + 'px')
      .css('top', e.clientY + 'px');
  }).on('mouseleave', function() {
    $('.portfolio-img').css('display', 'none');
  })
})

$(document).ready(function(){
  let $imageContainer = $('#image-container');
  let $imageLinks = $('.image-link');

  $imageLinks.on('mouseenter', (e) => {
    let videoURL = e.target.dataset.image;

    $imageContainer.empty();

    let video = document.createElement('video');
    let $video = $(video);
    $video.attr('src', `assets/img/${videoURL}`);
    $video.attr('autoplay', true);
    $video.attr('loop', true);
    $video.attr('playslinline', true);

    $imageContainer.append($video);

    $imageContainer.css({
      left: e.clientX + 'px',
      top: e.clientY + 'px'
    })
    $imageContainer.addClass('visible');
  });

  $imageLinks.on('mousemove', (e) => {
    $imageContainer.css({
      left: e.clientX + 'px',
      top: e.clientY + 'px'
    })
  });

  $imageLinks.on('mouseleave', () => {
    $imageContainer.removeClass('visible');
  })
})

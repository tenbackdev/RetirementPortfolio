$(document).ready(function() {
    $('.navbar-toggler').on('click', function() {
      $(this).toggleClass('collapsed');
      $('#navbarNav').toggleClass('visible not-visible');
    });
  });
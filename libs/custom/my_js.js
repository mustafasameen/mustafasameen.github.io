$(document).ready(function () {
  // Variables
  var $codeSnippets = $(".code-example-body"),
    $nav = $(".navbar"),
    $body = $("body"),
    $window = $(window),
    $popoverLink = $("[data-popover]"),
    navOffsetTop = $nav.offset().top,
    $document = $(document),
    entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
    };

  function init() {
    $window.on("scroll", onScroll);
    $window.on("resize", resize);
    $popoverLink.on("click", openPopover);
    $document.on("click", closePopover);
    $('a[href^="#"]').on("click", smoothScroll);
    buildSnippets();
  }

  function smoothScroll(e) {
    e.preventDefault();
    $(document).off("scroll");
    var target = this.hash,
      menu = target;
    $target = $(target);
    $("html, body")
      .stop()
      .animate(
        {
          scrollTop: $target.offset().top - 40,
        },
        0,
        "swing",
        function () {
          window.location.hash = target;
          $(document).on("scroll", onScroll);
        }
      );
  }

  function openPopover(e) {
    e.preventDefault();
    closePopover();
    var popover = $($(this).data("popover"));
    popover.toggleClass("open");
    e.stopImmediatePropagation();
  }

  function closePopover(e) {
    if ($(".popover.open").length > 0) {
      $(".popover").removeClass("open");
    }
  }

  $("#button").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#elementtoScrollToID").offset().top,
      },
      2000
    );
  });

  function resize() {
    $body.removeClass("has-docked-nav");
    navOffsetTop = $nav.offset().top;
    onScroll();
  }

  function onScroll() {
    if (
      navOffsetTop < $window.scrollTop() &&
      !$body.hasClass("has-docked-nav")
    ) {
      $body.addClass("has-docked-nav");
    }
    if (
      navOffsetTop > $window.scrollTop() &&
      $body.hasClass("has-docked-nav")
    ) {
      $body.removeClass("has-docked-nav");
    }
  }

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  function buildSnippets() {
    $codeSnippets.each(function () {
      var newContent = escapeHtml($(this).html());
      $(this).html(newContent);
    });
  }

  // Modal image popup for project/publication images
  $(document).on('click', '.paper-image img', function() {
    var src = $(this).attr('src');
    var modal = $(
      '<div class="image-modal-overlay">' +
        '<div class="image-modal-content">' +
          '<button class="image-modal-close" aria-label="Close">&times;</button>' +
          '<img src="' + src + '" alt="Popup image" />' +
        '</div>' +
      '</div>'
    );
    $('body').append(modal);
  });

  // Close modal on overlay or close button click
  $(document).on('click', '.image-modal-overlay, .image-modal-close', function(e) {
    if ($(e.target).is('.image-modal-overlay') || $(e.target).is('.image-modal-close')) {
      $('.image-modal-overlay').remove();
    }
  });

  init();
});

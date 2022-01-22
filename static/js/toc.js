/* scroll to the anchor and scroll spy */
var navbarHeight = $('.fixed-top').height();
$("#page-scrollspy a.nav-link").on('click', function () {
    /* decode chinese hash */
    var target = decodeURI(this.hash.replace(/^#/, ''));
    var scrollSpeed = 600;
    $('html,body').animate({ scrollTop: $(":header[id='" + target + "']").offset().top - navbarHeight }, scrollSpeed);
    return false;
});

$('body').scrollspy({ target: "#page-scrollspy", offset: navbarHeight + 5 });
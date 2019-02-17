(function($) {
    $.fn.clickToggle = function(func1, func2) {
        var funcs = [func1, func2];
        this.data('toggleclicked', 0);
        this.click(function() {
            var data = $(this).data();
            var tc = data.toggleclicked;
            $.proxy(funcs[tc], this)();
            data.toggleclicked = (tc + 1) % 2;
        });
        return this;
    };
}(jQuery));

var navRightDesktopDisplayCSS = "justify-content: flex-end;list-style: none;margin: 0;padding: 0;display: -webkit-box;display: -moz-box;display: -ms-flexbox;display: -webkit-flex;display: flex;";
var navRightDesktopNoDisplayCSS = "justify-content: flex-end;list-style: none;margin: 0;padding: 0;display: none";
var navRightMobileCSS = "justify-content: flex-end;list-style: none;margin: 0;display: -webkit-box;display: -moz-box;display: -ms-flexbox;display: -webkit-flex;display: flex;";

function mobileNavSizing() {
    if ($('.menu-icon').css('display') != 'none') {
        $('.menu-icon').width($('.menu-icon').height());

        if (navRightDisplayed) {
            $('.nav-right').css('cssText', navRightMobileCSS);
        } else {
            $('.nav-right').css('cssText', navRightDesktopNoDisplayCSS);
        }
        $('.nav-right').css('top', $('nav').height());
    } else {
        $('.nav-right').css('cssText', navRightDesktopDisplayCSS);
        navRightDisplayed = false;
    }
}

mobileNavSizing();

$(window).resize(function() {
    mobileNavSizing();
});

var navRightDisplayed = false;

$('.menu-icon').clickToggle(function() {
    $('.nav-right').css('cssText', navRightMobileCSS);
    $('.nav-right').css('top', $('nav').height());
    navRightDisplayed = true;
}, function() {
    $('.nav-right').css('display', 'none');
    navRightDisplayed = false;
});

$(window).on("load", function() {
    $('.data-container').height($(window).height()-$('nav').height())
});

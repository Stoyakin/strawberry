'use strict';

$(function () {
  window.site = {};
  window.site.obj = {
    map: function map() {
      var $map = $('.js-map'),
          coords = $map.data('coords').split(',');
      ymaps.ready(function () {
        var myMap = new ymaps.Map("yaMap", {
          center: [coords[0], coords[1]],
          zoom: $map.data('zoom') || 16,
          controls: []
        });
        myMap.controls.add('zoomControl', {
          size: 'small'
        });
        myMap.behaviors.disable('scrollZoom');
        var myPlacemark = new ymaps.Placemark(coords, {}, {
          iconLayout: 'default#image',
          iconImageHref: 'static/img/pin.png',
          iconImageSize: [68, 85],
          iconOffset: [-25, -25]
        });
        myMap.geoObjects.add(myPlacemark);
      });
      return;
    },
    decorAnimate: function decorAnimate() {
      var _th = this;

      if ($(window).width() > 1239) {
        var decorPar = $('.js-decor'),
            decorEl = decorPar.find('.decor__item');
        decorEl.each(function (e) {
          var _t = $(this),
              _tLeft = parseInt(_t.css('left')),
              _tTop = parseInt(_t.css('top'));

          _t.attr('data-pos', _tLeft + ',' + _tTop);
        });
        $('body').mousemove(function (event) {
          var centerX = Math.round($(window).width() / 2),
              centerY = Math.round($(window).height() / 2),
              diffX = -(event.clientX - centerX) / centerX,
              diffY = -(event.clientY - centerY) / centerY;
          decorEl.each(function (e) {
            var _t = $(this),
                _tData = _t.data('pos').split(','),
                _tMaxRound = parseInt(_t.data('maxround')),
                decorImgLeft = parseInt(_tData[0]),
                decorImgTop = parseInt(_tData[1]);

            TweenMax.to(_t, 2, {
              'left': Math.round(decorImgLeft - _tMaxRound * diffX),
              'top': Math.round(decorImgTop - _tMaxRound * diffY),
              ease: Expo.easeOut
            });
          });
        });
      } else {
        $('.decor__item').each(function () {
          $(this).removeAttr('style');
        });
      }
    },
    init: function init() {
      var $body = $('body'),
          elemsAnimArr = ['.js-scroll-anim'];

      function visChecker(el) {
        var rect = el.getBoundingClientRect();
        var wHeight = window.innerHeight || document.documentElement.clientHeight;
        var wWidth = window.innerWidth || document.documentElement.clientWidth;
        return rect.bottom - el.offsetHeight * 0.50 <= wHeight && rect.right <= wWidth;
      }

      function elemVisCheck(elArray) {
        window.addEventListener('scroll', function () {
          if (elArray.length) {
            elArray.forEach(function (item) {
              if (document.querySelectorAll(item).length) {
                document.querySelectorAll(item).forEach(function (elem) {
                  if (visChecker(elem)) {
                    elem.classList.add('start-animate');
                  }
                });
              }
            });
          }
        });
      }

      if (elemsAnimArr.length) {
        elemVisCheck(elemsAnimArr);
      }

      if ($('.js-decor').length) {
        this.decorAnimate();
      }

      if ($('.js-map').length) {
        this.map();
      }

      if ($('.js-igall-swiper').length) {
        var igallSlider = new Swiper('.js-igall-swiper', {
          loop: true,
          speed: 750,
          slidesPerView: 1,
          effect: 'fade',
          fadeEffect: {
            crossFade: true
          },
          spaceBetween: 0,
          mousewheel: false,
          grabCursor: false,
          keyboard: false,
          simulateTouch: false,
          allowSwipeToNext: false,
          allowSwipeToPrev: false,
          navigation: {
            nextEl: '.igall .swiper-button-next',
            prevEl: '.igall .swiper-button-prev'
          }
        });
      }

      if ($('.js-burger').length) {
        $('.js-burger').on('click', function () {
          var _t = $(this),
              menuMobile = _t.siblings('.nav__list');

          if (!_t.hasClass('nav__burger--active')) {
            _t.addClass('nav__burger--active');

            $body.addClass('open-menu');
            menuMobile.fadeIn(350).css('display', 'flex');
          } else {
            _t.removeClass('nav__burger--active');

            menuMobile.fadeOut(350);
            $body.removeClass('open-menu');
          }

          return false;
        });
      }

      if ($('.js-btn-toggle-table').length) {
        $('.js-btn-toggle-table').on('click', function () {
          var _t = $(this),
              hiddenEl = _t.parents('.price-table').find('.price-table__content').first();

          if (!_t.hasClass('active')) {
            _t.addClass('active');

            hiddenEl.slideDown('slow');
          } else {
            _t.removeClass('active');

            hiddenEl.slideUp('slow');
          }

          return false;
        });
      }

      var $contentTables = $(".text table");
      var wrapFlag;

      if ($contentTables.length) {
        $contentTables.each(function () {
          if (!$(this).parents('.price-table').length) {
            $(this).wrap('<div class="table-wrap">');
          }
        });
      }

      var eventScroll;

      try {
        eventScroll = new Event('scroll');
      } catch (e) {
        eventScroll = document.createEvent('Event');
        var doesnt_bubble = false,
            isnt_cancelable = false;
        eventScroll.initEvent('scroll', doesnt_bubble, isnt_cancelable);
      }

      window.dispatchEvent(eventScroll);
      return this;
    }
  };
  var firstLoad = true;
  Pace.on('hide', function () {
    if (firstLoad) {
      firstLoad = false;
      setTimeout(function () {
        window.site.obj.init();
      }, 200);
    }
  });
});
//# sourceMappingURL=own.js.map

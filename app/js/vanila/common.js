'use strict';

$(function () {

  window.site = {};

  window.site.obj = ({
    map: function () {

      let $map = $('.js-map'),
        coords = $map.data('coords').split(',');

      ymaps.ready(function () {

        let myMap = new ymaps.Map("yaMap", {
          center: [coords[0], coords[1]],
          zoom: $map.data('zoom') || 16,
          controls: []
        });

        myMap.controls.add('zoomControl', {
          size: 'small'
        });

        myMap.behaviors.disable('scrollZoom');

        let myPlacemark = new ymaps.Placemark(coords, {}, {
          iconLayout: 'default#image',
          iconImageHref: 'static/img/pin.png',
          iconImageSize: [68, 85],
          iconOffset: [-25, -25]
        });

        myMap.geoObjects.add(myPlacemark);

      });

      return;
    },

    decorAnimate: function () {
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

    init: function () {
      let $body = $('body'),
        elemsAnimArr = ['.js-scroll-anim'];

      if ($('.js-decor').length) {
        this.decorAnimate();
      }

      if ($('.js-map').length) {
        this.map();
      }

      function visChecker(el) {
        const rect = el.getBoundingClientRect();
        const wHeight = window.innerHeight || document.documentElement.clientHeight;
        const wWidth = window.innerWidth || document.documentElement.clientWidth;
        return (
          rect.bottom - el.offsetHeight * 0.35 <= wHeight &&
          rect.right <= wWidth
        );
      }

      function elemVisCheck(elArray) {
        window.addEventListener('scroll', () => {
          if (elArray.length) {
            elArray.forEach((item) => {
              if (document.querySelectorAll(item).length) {
                document.querySelectorAll(item).forEach((elem) => {
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

      if ($('.js-igall-swiper').length) {
        let igallSlider = new Swiper('.js-igall-swiper', {
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
          let _t = $(this),
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

      let eventScroll
      try {
        eventScroll = new Event('scroll')
      } catch (e) {
        eventScroll = document.createEvent('Event');
        let doesnt_bubble = false,
          isnt_cancelable = false
        eventScroll.initEvent('scroll', doesnt_bubble, isnt_cancelable);
      }
      window.dispatchEvent(eventScroll)

      return this;
    }

  });

  let firstLoad = true;
  Pace.on('hide', () => {
    if (firstLoad) {
      firstLoad = false;
      setTimeout(() => {
        window.site.obj.init()
      }, 200)
    }
  })

});

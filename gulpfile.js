var gulp = require('gulp'),
  rebaseCSSurls = require('gulp-rebase-css-urls'),
  autoprefixer = require('autoprefixer'),
  pug = require('gulp-pug'),
  pugInheritance = require('gulp-pug-inheritance'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  print = require('gulp-print').default,
  $ = require('gulp-load-plugins')();

// Пути
var src = {
  'app': {
    'stylus': 'app/stylus/',
    'css': 'app/css/',
    'font': 'app/fonts/',
    'js': 'app/js/',
    'vendor': 'app/vendor/',
    'svg': 'app/svg/',
    'pug': 'app/pug/'
  },
  'build': {
    'css': 'prod/static/css/',
    'js': 'prod/static/js/',
    'tmpl': 'prod'
  }
};

// Компиляция .styl файлов (stylus)
function stylus(src, dst) {
  return function () {
    return gulp.src(src + 'styles.styl')
      .pipe($.plumber({
        errorHandler: $.notify.onError({
          title: 'Stylus error',
          message: '<%= error.message %>'
        })
      }))
      .pipe(print())
      .pipe($.stylus({
        'include css': true
      }))
      .pipe(gulp.dest(dst))
      .pipe($.notify({
        title: 'STYLUS',
        message: 'STYLUS build complete',
        onLast: true
      }));
  }
}

// Билд CSS
function css(src, dst) {
  return function () {
    var plugins = [
      autoprefixer({
        browsers: [
          "last 1 version",
          "> 1%",
          "IE 10"
        ],
        cascade: false
      })
    ];
    return gulp.src(src)
      .pipe($.plumber({
        errorHandler: $.notify.onError({
          title: 'CSS error',
          message: '<%= error.message %>'
        })
      }))
      .pipe(print())
      .pipe(rebaseCSSurls('.'))
      .pipe($.postcss([
        autoprefixer({
          browsers: [
            'last 2 versions',
            'Android >= 4',
            'IE >= 9'
          ]
        })
      ]))
      .pipe($.concat('style.css'))
      .pipe(gulp.dest(dst))
      .pipe($.notify({
        title: 'CSS',
        message: 'CSS build complete',
        onLast: true
      }))
      .pipe(reload({
        stream: true
      }));
  }
}

// Упаковка CSS
function csspack(src, dst) {
  return function () {
    return gulp.src(src)
      .pipe($.plumber({
        errorHandler: $.notify.onError({
          title: 'CSS PACK error',
          message: '<%= error.message %>'
        })
      }))
      .pipe(print())
      .pipe($.postcss([
        require('cssnano')({
          discardComments: {
            removeAll: true
          },
          discardUnused: {
            namespace: false
          }
        })
      ]))
      .pipe($.concat('styles.pack.css'))
      .pipe(gulp.dest(dst))
      .pipe($.notify({
        title: 'CSS PACK',
        message: 'CSS PACK complete',
        onLast: true
      }))
      .pipe(reload({
        stream: true
      }));
  }
}

// Билд JS
function js(src, dst, fileName) {
  return function () {
    return gulp.src(src)
      .pipe($.sourcemaps.init())
      .pipe($.plumber({
        errorHandler: $.notify.onError({
          title: 'JS error',
          message: '<%= error.message %>'
        })
      }))
      .pipe($.changed(dst, {
        extension: '.js'
      }))
      .pipe(print())
      .pipe($.concat(fileName))
      //.pipe($.uglify())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(dst))
      .pipe($.notify({
        title: 'JS',
        message: 'JS build complete',
        onLast: true
      }))
      .pipe(reload({
        stream: true
      }));
  }
}

// Таски
// Компилим pug
gulp.task('pug', function buildHTML() {
  return gulp.src(src.app.pug + '*.pug')
    .pipe($.changed(src.build.tmpl, {
      extension: '.html'
    }))
    .pipe($.if(global.isWatching, $.cached('pug')))
    .pipe(pugInheritance({
      basedir: 'app/pug/',
      skip: 'node_modules'
    }))
    .pipe(pug({
      pretty: '    '
    }))
    .pipe(gulp.dest(src.build.tmpl))
    .pipe(reload({
      stream: true
    }));
});

// Компилим CSS
gulp.task('stylus', stylus([src.app.stylus], src.app.css));

// Собираем CSS
gulp.task('css', css([
    src.app.css + 'fonts.css',
    src.app.css + 'ext/swiper-cut-svg.css',
    //src.app.css + 'ext/pace-theme-minimal.css',
    // тут нужно добавить css-файлы сторонних либ, если они используются
    //'node_modules/jquery-form-styler/dist/jquery.formstyler.css',
    //'node_modules/jquery-form-styler/dist/jquery.formstyler.theme.css',
    //src.app.css + 'ext/jquery.mCustomScrollbar.min.css',
    //src.app.css + 'ext/jquery.fancybox.css',
    //src.app.css + 'ext/animate.css',
    //src.app.css + 'ext/aos.css',
    src.app.css + 'styles.css'
  ],
  src.build.css
));

// Собираем JS

gulp.task("babel", function () {
  return gulp.src(src.app.js + 'vanila/common.js')
    .pipe($.babel({
      compact: false,
      presets: ["@babel/preset-env"],
      ignore: ['what-input.js', 'swiper.js']
    }))
    .pipe(gulp.dest(src.app.js))
    .pipe($.notify({
      title: 'JS-babel',
      message: 'JS-babel complete',
      onLast: true
    }));
});


// Собираем JS
gulp.task(
  'js-own',
  js(
    [
      src.app.js + '*'
    ],
    src.build.js,
    'own.js'
  )
);


/*
gulp.task('js-own', function () {
  return gulp.src(src.app.js + 'common.js')
    .pipe(gulp.dest(src.build.js)) //выгружаем в build
    .pipe(reload({
      stream: true
    }));
});
*/

gulp.task(
  'js-vendor',
  js(
    [
      src.app.js + 'ext/pace.min.js',
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/jquery-ui-dist/jquery-ui.min.js',
      'node_modules/jquery-migrate/dist/jquery-migrate.min.js',
      'node_modules/systemjs/dist/system.js',
      'node_modules/babel-polyfill/dist/polyfill.js',
      'node_modules/swiper/dist/js/swiper.js',
      src.app.js + 'ext/TweenMax.min.js',
      //'node_modules/jquery-form-styler/dist/jquery.formstyler.min.js',
      //src.app.js + 'ext/jquery.mCustomScrollbar.js',
      //src.app.js + 'ext/jquery.fancybox.js',
      //src.app.js + 'ext/owl.carousel.min.js',
      //src.app.js + 'ext/jquery.dotdotdot.min.js',
      //src.app.js + 'ext/jquery.maskedinput.min.js',
      //src.app.js + 'ext/aos.js',
      //подключаем модерниз, если нужен
      // src.app.vendor + "modernizr/modernizr.custom.js"
    ],
    src.build.js,
    'vendor.js'
  )
);

gulp.task(
  'js',
  function () {
    gulp.start('js-vendor');
    gulp.start('babel');
    gulp.start('js-own');
  }
);

gulp.task('setWatch', function () {
  global.isWatching = true;
});

// browser-sync task for starting the server.
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: "./",
      directory: true
    }
  });
});

// Reload all Browsers
gulp.task('bsReload', function () {
  browserSync.reload();
});

gulp.task('watch', function () {
  gulp.start('default');
  gulp.watch(src.app.pug + '*.pug', ['setWatch', 'pug']);
  gulp.watch(src.app.stylus + '**/*.styl', ['stylus']);
  gulp.watch(src.app.css + 'styles.css', ['css']);
  gulp.watch(src.app.js + '**/*.js', ['babel', 'js-own']);
});

gulp.task('build', ['pug', 'stylus', 'css', 'js']);

gulp.task('default', ['build', 'browserSync']);

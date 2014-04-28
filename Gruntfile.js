'use strict';

module.exports = function(grunt) {
  var jsSrc = 'public/js/src/'
    , jsBuild = 'public/js/build/'
    , cssSrc = 'public/css/'
    , cssBuild = 'public/scss/';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    
    uglify: {
      all: {
        files: [{
          expand: true,
          cwd: 'public/js/build',
          src: ['**/*.js', '!**/*.min.js', '!libs.js'],
          dest: 'public/js/build',
          ext: '.min.js',
          extDot: 'last'
        }]
      }
    },

    concat: {
      init: {
        src: [
          jsSrc + 'libs/jquery/*.js',
          jsSrc + 'libs/bootstrap/*.js',
          jsSrc + 'libs/champion/*.js'
        ],

        dest: jsBuild + 'libs.js'
      },

      dev: {
        files: {
          'public/js/build/signup.js': [
            jsBuild + 'libs.js',
            '!' + jsSrc + 'libs/**/*.js',

            jsSrc + 'partials/signup.intro.js',

            jsSrc + 'models/signup/*.js',
            jsSrc + 'views/signup/NavigationView.js',
            jsSrc + 'views/signup/WizardView.js',
            jsSrc + 'views/signup/BasicInfoView.js',
            jsSrc + 'views/signup/OtherInfoView.js',
            jsSrc + 'views/signup/SubmitSignupView.js',
            jsSrc + 'views/signup/VerifyEmailView.js',
            jsSrc + 'presenters/signup/NavigationPresenter.js',
            jsSrc + 'presenters/signup/WizardPresenter.js',
            jsSrc + 'presenters/signup/BasicInfoPresenter.js',
            jsSrc + 'presenters/signup/OtherInfoPresenter.js',
            jsSrc + 'presenters/signup/SubmitSignupPresenter.js',
            jsSrc + 'presenters/signup/VerifyEmailPresenter.js',
            jsSrc + 'signup.js',

            jsSrc + 'partials/signup.outro.js'
          ],

          'public/js/build/verifyEmail.js': [
            jsBuild + 'libs.js',
            '!' + jsSrc + 'libs/**/*.js',

            jsSrc + 'partials/signup.intro.js',

            jsSrc + 'models/verifyEmail/*.js',
            jsSrc + 'views/verifyEmail/*.js',
            jsSrc + 'presenters/verifyEmail/*.js',
            jsSrc + 'verifyEmail.js',

            jsSrc + 'partials/signup.outro.js',
          ]
        }
      }
    },

    sass: {
      dev: {
        options: {
          trace: true,

          style: 'expanded'
        },

        files: [{
          expand: true,
          cwd: 'public/scss',
          src: ['**/*.scss'],
          dest: 'public/css',
          ext: '.css',
          extDot: 'last'
        }]
      },

      prod: {
        options: {
          style: 'compressed'
        },

        files: [{
          expand: true,
          cwd: 'public/scss',
          src: ['**/*.scss'],
          dest: 'public/css',
          ext: '.min.css'
        }]
      }
    },
    
    watch: {
      js: {
        files: [jsSrc + '**/*.js'],

        tasks: ['concat:dev']
      },

      css: {
        files: [cssBuild + '**/*.scss'],

        tasks: ['sass:dev']
      },

      test: {
        files: [jsSrc + '**/*.js', 'test/spec/**/*.js'],

        tasks: ['concat:dev', 'jasmine']
      }
    },

    nodemon: {
      dev: {
        script: 'app.js',

        options: {
          ext: 'js,json',

          ignore: ['node_modules/**', 'public/**']
        }
      }
    },

    concurrent: {
      dev: {
        tasks: ['watch:js', 'watch:css', 'nodemon:dev'],

        options: {
          logConcurrentOutput: true
        }
      }
    },

    jasmine: {
      browser: {
        src: [
          //todo: clean up
          jsSrc + 'models/signup/*.js',
          jsSrc + 'views/signup/NavigationView.js',
          jsSrc + 'views/signup/WizardView.js',
          jsSrc + 'views/signup/BasicInfoView.js',
          jsSrc + 'views/signup/OtherInfoView.js',
          jsSrc + 'views/signup/SubmitSignupView.js',
          jsSrc + 'views/signup/VerifyEmailView.js',
          jsSrc + 'presenters/signup/NavigationPresenter.js',
          jsSrc + 'presenters/signup/WizardPresenter.js',
          jsSrc + 'presenters/signup/BasicInfoPresenter.js',
          jsSrc + 'presenters/signup/OtherInfoPresenter.js',
          jsSrc + 'presenters/signup/SubmitSignupPresenter.js',
          jsSrc + 'presenters/signup/VerifyEmailPresenter.js',

          //jsSrc + '**/*.js',
          '!' + jsSrc + 'partials/**/*.js',
          '!' + jsSrc + 'libs/**/*.js',
          '!' + jsSrc + 'signup.js'
        ],

        options: {
          specs: 'test/spec/**/*.js',

          vendor: [
            'node_modules/sinon/pkg/sinon.js',
            'node_modules/chai/chai.js',
            'public/js/build/libs.js'
          ],

          helpers: 'test/helpers/*.js',
          
          outfile: 'test/_SpecRunner.html',

          keepRunner: true
        }
      }
    },

    'json-replace': {
      run: {
        options: {
          replace: {
            appSettings: {
              proxy: {
                host: 'localhost'
              }
            }
          }
        },

        files: [{
          src: 'settings.json',
          dest: 'settings.json'
        }]
      },

      build: {
        options: {
          replace: {
            appSettings: {
              proxy: {
                host: 'mongoosex-services.herokuapp.com'
              }
            }
          }
        },

        files: [{
          src: 'settings.json',
          dest: 'settings.json'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-json-replace');

  grunt.registerTask('init', ['concat']);
  grunt.registerTask('test', 'jasmine');
  grunt.registerTask('run', ['json-replace:run', 'concurrent']);
  grunt.registerTask('build', ['uglify:all', 'sass:prod', 'json-replace:build']);
};
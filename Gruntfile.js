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
        src: [
          jsBuild + '*.js',
          '!' + jsBuild + 'main.min.js',
          '!' + jsBuild + 'test.js'
        ],

        dest: jsBuild + 'main.min.js'
      },

      prod: {
        src: [jsBuild + 'main.js'],

        dest: jsBuild + 'main.min.js'
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
        src: [
          jsBuild + 'libs.js',
          jsSrc + '**/*.js',
          '!' + jsSrc + 'libs/**/*.js'
        ],

        dest: jsBuild + 'main.js'
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
        src: jsBuild + 'main.js',

        options: {
          specs: 'test/spec/**/*.js',

          vendor: [
            'node_modules/sinon/pkg/sinon.js',
            'node_modules/chai/chai.js',
            'public/js/build/libs.js'
          ],
          
          outfile: 'test/_SpecRunner.html',

          keepRunner: true
        }
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

  grunt.registerTask('init', ['concat']);
  grunt.registerTask('test', 'jasmine');
  grunt.registerTask('run', ['concurrent']);
  grunt.registerTask('build', ['uglify:all', 'sass:prod']);
};
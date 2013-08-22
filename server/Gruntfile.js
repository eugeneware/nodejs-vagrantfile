'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app/app.js'
      }
    },
    complexity: {
      generic: {
        src: ['app/**/*.js'],
        options: {
          errorsOnly: true
        }
      }
    },
    jshint: {
      all: [
        'app/**/*.js',
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    mochacli: {
      all: ['test/**/*.js'],
      options: {
        reporter: 'spec',
        ui: 'tdd'
      }
    },
    watch: {
      grunt: {
        files: ['Gruntfile.js'],
        tasks: ['default']
      },
      js: {
        files: ['app/**/*.js'],
        tasks: ['default'],
        options: {
          nospawn: true,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-develop');
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-cli');

  grunt.registerTask('test', ['develop', 'complexity', 'jshint', 'mochacli']);
  grunt.registerTask('default', ['test', 'watch']);
};

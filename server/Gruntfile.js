'use strict';

var request = require('request');

module.exports = function (grunt) {
  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app/app.js'
      }
    },
    complexity: {
      generic: {
        src: ['app/**/*.js']
      }
    },
    mochaTest: {
      test: {
        src: ['test/**/*.js']
      }
    },
    watch: {
      options: {
        // nospawn: true
      },
      server: {
        files: ['app/**/*.js'],
        tasks: ['develop']
      },
      mochaTest: {
        files: ['test/**/*.js'],
        tasks: ['mochaTest']
      },
      js: {
        files: ['app/**/*.js']
      }
    }
  });

  grunt.config.requires('watch.server.files');
  files = grunt.config('watch.server.files');
  files = grunt.file.expand(files);

  grunt.loadNpmTasks('grunt-develop');
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['develop', 'mochaTest', 'complexity', 'watch']);
  grunt.registerTask('mocha', ['mochaTest']);
};

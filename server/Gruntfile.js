module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    exec: {
      mkdata: { cmd: 'mkdir -p ./data' },
      initdb: { cmd: 'initdb ./data' },
      startdb: { cmd: 'pg_ctl -D ./data -l ./data/logfile start' },
      createdb: { cmd: 'createdb testdb' },
      setupdb: {
        cmd:
          ['echo "CREATE USER testuser WITH PASSWORD \'testpassword\'; ',
           'GRANT ALL PRIVILEGES ON DATABASE testdb TO testuser;" ',
           '| psql testdb'].join('')
      },
      stopdb: { cmd: 'pg_ctl -D ./data -l ./data/logfile stop' }
    },
    develop: {
      server: {
        file: 'app/app.js'
      }
    },
    complexity: {
      generic: {
        src: ['app/**/*.js'],
        options: {
          errorsOnly: false,
          cyclometric: 6,       // default is 3
          halstead: 16,         // default is 8
          maintainability: 100  // default is 100
        }
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'app/**/*.js',
        'test/**/*.js'
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
      js: {
        files: ['app/**/*.js'],
        tasks: ['default'],
        options: {
          nospawn: true,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-develop');
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-cli');

  grunt.registerTask('test', ['develop', 'complexity', 'jshint', 'mochacli']);
  grunt.registerTask('default', ['test', 'watch']);
  grunt.registerTask('initdb', ['exec']);
  grunt.registerTask('startdb', ['exec:startdb']);
  grunt.registerTask('stopdb', ['exec:stopdb']);
};

module.exports = function(grunt) {
	const os = require('os');

  grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		express: {
	    options: {
	      // Override defaults here
	      port: 2082
	    },
	    dev: {
	      options: {
	        script: 'bin/server.js'
	      }
	    }
		},
		watch: {
	    express: {
	      files:  [ 'bin/**/*.js' ],
	      tasks:  [ 'express:dev' ],
	      options: {
	        spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
	      }
	    }
		},
	});

  require('load-grunt-tasks')(grunt);
  var shell = require('shelljs');
  shell.config.execPath = String(shell.which('node'));
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', []);
  grunt.registerTask('serve', [ 'express:dev', 'watch' ]);
};

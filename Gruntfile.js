module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		// concatinate all the library's files into one to rule them all
		concat: {
		  options: {
		    // define a string to put between each file in the concatenated output
		    separator: '/////////////////////////////////////////////////////////////'
		  },
		  dist: {
		    // the files to concatenate
		    src: ['src/**/*.js', 'src/*.js'],
		    // the location of the resulting JS file
		    dest: 'dist/<%= pkg.name %>.js'
		  }
		},

		// copy css
		copy: {
		  main: {
		    files: [
		      // includes files within path
		      {expand: true, cwd: 'src/', src: '*.css', dest: 'dist/', filter: 'isFile'}
		    ]
		  }
		},

		// lint shit with hint
	    jshint: {
	      files: ['src/**/*.js', 'src/*.js'],
	      options: {
	        // options here to override JSHint defaults
	        globals: {
	          jQuery: true,
	          console: true,
	          module: true,
	          document: true
	        }
	      }
	    },

		// watch for any changes and rebuild files live
		watch: {
		  scripts: {
		    files: 'src/**/*.js',
		    tasks: ['jshint', 'concat'],
		    options: {
		      livereload: true,
		    },
		  }
		},

		wiredep: {

		  task: {

		    // Point to the files that should be updated when
		    // you run `grunt wiredep`
		    src: [
		      'index.html'
		     ]
		   }
		}
	});
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-wiredep');


	grunt.registerTask('default', ['wiredep','jshint','concat', 'copy']);

}

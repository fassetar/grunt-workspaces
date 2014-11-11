'use strict';

var LIVERELOAD_PORT = 35729;

var lrSnippet = require( 'connect-livereload' )({
	port: LIVERELOAD_PORT
});

var mountFolder = function ( connect, dir ) {
	return connect.static( require( 'path' ).resolve( dir ) );
};

module.exports = function ( grunt ) {


	pkg: grunt.file.readJSON('package.json'),
	require( 'matchdep' ).filterDev('grunt-*').forEach( grunt.loadNpmTasks );

	grunt.initConfig({
		connect: {
			options: {
				port: 9000,
				hostname: 'localhost'
			},
			livereload: {
				options: {
					middleware: function ( connect ) {
						return [
							lrSnippet,
							mountFolder(connect, 'dist')
						];
					}
				}
			}
		},
		tag: {
			banner: "/*!\n" +
					" * Syntax highlighter\n" +
					" * @author Anthony Fassett\n" +
					" * @version 1.0.0\n" +
					" * Copyright 2014.\n" +
					" */\n"
		},
		uglify: {
			dist: {
				files: {
					'dist/js/script.min.js': [ 'src/js/*.js' ]
				}
			},
			options: {
				banner: "<%= tag.banner %>"
			}
		},
		sass: {
			dist: {
				options: {
					sourceMap: true,
					outputStyle: 'compressed'
											
				},
				files: {
					'dist/css/style.min.css': 'src/scss/style.scss'
				}
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'dist/index.html': 'src/index.html'
				}
			}
		},
		imagemin: {
			static: {
				options: {
					optimizationLevel: 3				
				}
			},
			dynamic: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'dist/'
				}]
			}
		},
		open: {
			server: {
				path: 'http://localhost:<%= connect.options.port %>'
			}
		},
		watch: {
			uglify: {
				files: 'src/js/{,*/}*.js',
				tasks: ['uglify']
			},
			sass: {
				files: 'src/scss/{,*/}*.{scss,sass}',
				tasks: ['sass']
			},
			htmlmin: {
				files: 'src/{,*/}*.html',
				tasks: ['htmlmin']
			},
			livereload: {
				options: {
					livereload: LIVERELOAD_PORT
				},
				files: [
					'dist/{,*/}*.html',
					'dist/css/*.css',
					'dist/js/{,*/}*.js',
					'dist/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		}
	});

	grunt.registerTask( 'default' , [
		'sass',
		'uglify',
		'htmlmin',
		'imagemin',
		'connect:livereload',
		'open',
		'watch'
	]);

};
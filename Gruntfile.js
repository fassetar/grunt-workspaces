'use strict';

module.exports = function ( grunt ) {

	pkg: grunt.file.readJSON('package.json'),
	require( 'matchdep' ).filterDev('grunt-*').forEach( grunt.loadNpmTasks );

	grunt.initConfig({
		config: { // Configurable paths            
            app: 'dist'           
        },
		connect: {
			options: {
				port: 9000,
				livereload: 35729,
				hostname: 'localhost'
			},
			livereload: {
				options: {
					open: true,
					base: [ '<%= config.app %>' ]
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
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= config.app %>/{,*/}*.html',
					'<%= config.app %>/css/{,*/}*.css',
					'<%= config.app %>/images/{,*/}*',
					'<%= config.app %>/js/{,*/}*.js'					
				]
			}
		}
	});

	grunt.registerTask('test', [
		'sass',
		'uglify',		
		'connect:livereload',
		'htmlmin',						
		'watch'
	]);
	grunt.registerTask( 'default' , [
		'sass',
		'uglify',		
		'connect:livereload',
		'htmlmin',						
		'watch'
	]);
	grunt.registerTask( 'build' , [
		'sass',
		'uglify',		
		'htmlmin',		
	]);
};
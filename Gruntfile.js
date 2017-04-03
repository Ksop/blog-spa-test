module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: ['build']
    },


    copy: {
      build: {
        files: [{
          expand: true,
          src: [
            'fonts/**',
            'img/**',
            '*.html'
          ],
          dest: 'build/'
        }]
      },

      js: {
        files: [{
          expand: true,
          src: [
            'js/**'
          ],
          dest: 'build/'
        }]
      }
    },


    includes: {
      html: {
        src: ['*.html'], // Source files
        dest: 'build/', // Destination directory
        cwd: '.',
        options: {
          includePath: 'includes/'
        }
      }
    },
    

    imagemin: {
      images: {     
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,                  // Enable dynamic expansion 
          cwd: 'build/img',                   // Src matches are relative to this path 
          src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match 
          dest: 'build/img/'                  // Destination path prefix 
        }]
      }
    },


    uglify: {
      js: {
        files: [{
          'build/js/main.min.js': [
            'js/script.js',
            'js/posts.js'
          ]
        }]
      }
    },


    less: {
      style: {
        files: {
          'build/css/style.css': 'less/style.less'
        }
      }
    },


    postcss: {
      options: {
        processors: [
          require('autoprefixer')({
            browsers: ['last 2 versions']
          })
        ]
      },
      dist: {
        src: 'build/css/*.css'
      }
    },


    css_mqpacker: {
      main: {
        options: {
          sort: true
        },
        expand: true,
        cwd: 'build/css/',
        src: 'style.css',
        dest: 'build/css/'
      }
    },


    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'build/css',
          src: ['*.css', '!*.min.css'],
          dest: 'build/css',
          ext: '.min.css'
        }]
      }
    },


    browserSync: {
      bsFiles: {
        src : [
          'build/*.html',
          'build/css/*.css',
          'build/img/*',
          'build/js/'
        ]
      },
      options: {
        watchTask: true,
        server: 'build/'
      }
    },


    watch: {
      html: {
        files: ['*.html', 'includes/*.html'],
        tasks: ['includes:html']
      },
      js: {
        files: ['js/**/*.js'],
        tasks: ['copy:js']
      },
      css: {
        files: ['less/**/*.less'],
        tasks: ['less', 'cssmin']
      }
    }
  });


  grunt.registerTask('server', ['browserSync','watch']);
  grunt.registerTask('build', [
    'clean',
    'copy:build',
    'includes',
    'imagemin',
    'uglify',
    'less', 
    'postcss',
    'css_mqpacker', 
    'cssmin'    
  ]);

};
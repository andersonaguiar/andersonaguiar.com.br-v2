'use strict';
module.exports = function(grunt) {

    // time of tasks
    require('time-grunt')(grunt);

    // Load all tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        //exec commands
        exec: {
            jekyllServe: 'jekyll serve',
            jekyllBuild: 'jekyll build',
            npmReset: 'rm -rf node_modules && sudo npm install'
        },

        // modify URL
        replace: {
            // URL
            devUrl: {
                src: ['_config.yml'],
                overwrite: true,                 // overwrite matched source files
                replacements: [{
                    from: /(url:\s+)'.*?'/g,
                    to: "$1''"
                }]
            },
            distUrl: {
                src: ['_config.yml'],
                overwrite: true,                 // overwrite matched source files
                replacements: [{
                    from: /(url:\s+)'.*?'/g,
                    to: "$1'http://www.andersonaguiar.com.br'"
                }]
            },
            // BS
            devBS: {
                src: ['_includes/scripts.html'],
                overwrite: true,                 // overwrite matched source files
                replacements: [{
                    from: /(<\!-- BS -->)\n*\t*.*?(<\!-- \/\/ -->)/g,
                    to: "$1\n\<script type='text\/javascript'\>\/\/\<\!\[CDATA\[\ndocument.write\(\"<script async src='\/\/HOST:3000\/browser-sync-client.1.3.7.js'><\\\/script>\".replace(\/HOST\/g, location\.hostname\)\);\n//]]><\/script>\n$2"
                }]
            },
            distBS: {
                src: ['_includes/scripts.html'],
                overwrite: true,                 // overwrite matched source files
                replacements: [{
                    from: /(<\!-- BS -->\n).*?\n.*\n.*\n(.*>)/g,
                    to: "$1\n$2"
                }]
            },
        },

        // compress css and compile less
        recess: {
            dist: {
                options: {
                    compile: true,
                    compress: true
                },
                files: {
                    'assets/css/main.min.css': ['assets/less/main.less']
                }
            },
            dev: {
                options: {
                    compile: true,
                    compress: false
                },
                files: {
                    'assets/css/main.css': ['assets/less/main.less']
                }
            }
        },

        // minify js
        uglify: {
            dist: {
                files: {
                    'assets/js/scripts.min.js': ['assets/js/plugins/*.js', 'assets/js/_*.js']
                }
            }
        },

        // minify imags
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 7,
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: 'images/'
                }]
            }
        },

        // minify svg
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: '{,*/}*.svg',
                    dest: 'images/'
                }]
            }
        },


        // make a copy of CNAME to _site
        copy: {
            CNAME: {
                src: 'CNAME',
                dest: '_site/',
            },
        },

        // task for build _site into gh-pages on Github
        'gh-pages': {
            options: {
                base: '_site',
                branch: 'gh-pages',
                message: 'Publish new post',
                dotfiles: true
            },
            // These files will get pushed to the branch.
            src: ['**/*']
        },

        // clean files
        clean: {
            dist: [
                'assets/css/main.min.css',
                'assets/js/scripts.min.js'
            ]
        },

        // watch for changes
        watch: {
            less: {
                files: [
                    'assets/less/*.less',
                    'assets/less/bootstrap/*.less'
                ],
                tasks: ['recess']
            },

            js: {
                files: [
                    'assets/js/**/*.js'
                ],
                tasks: ['uglify']
            },

            grunt: { files: ['Gruntfile.js'] },

            jekyll: {
                files: [
                    '_layouts/*.html',
                    '_posts/*.md',
                    '_includes/*.html',
                    'assets/**/*',
                    '_config.yml',
                    '*.md',
                    '*.html' 
                ],
                tasks: ['exec:jekyllBuild']
            }
        },

        // Keep multiple browsers & devices in sync when building websites.
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        '_site/index.html',
                        // '_site/assets/css/**/*',
                        // '_site/assets/js/**/*'
                    ]
                },
                options: {
                    watchTask: true
                }
            }
        },
    });

    // Register tasks
    grunt.registerTask('default', [
        'clean',
        'recess',
        'uglify',
        'imagemin',
        'svgmin'
    ]);

    grunt.registerTask('configDist', ['replace:distUrl', 'replace:distBS']);

    grunt.registerTask('dev', ['replace:devUrl', 'replace:devBS', 'exec:jekyllBuild', 'browserSync', 'watch']);

    grunt.registerTask('build', ['replace:distUrl', 'replace:distBS', 'default', 'exec:jekyllBuild', 'copy:CNAME', 'gh-pages']);
};

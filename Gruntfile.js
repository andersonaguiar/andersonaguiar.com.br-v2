'use strict';
module.exports = function(grunt) {

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
                        to: "$1'http://andersonaguiar.github.io/andersonaguiar.com.br-v2'"
                    }]
                },
            // BS
                devBS: {
                    src: ['_includes/scripts.html'],
                    overwrite: true,                 // overwrite matched source files
                    replacements: [{
                        from: /(<\!-- BS -->)\n*\t*.*?(<\!-- \/\/ -->)/g,
                        to: "$1\n\<script type='text\/javascript'\>\/\/\<\!\[CDATA\[\ndocument.write(\"<script async src='//HOST:3001/browser-sync-client.1.3.6.js'><\/script>\".replace(/HOST/g, location.hostname));\n//]]></script>\n$2"
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

        uglify: {
            dist: {
                files: {
                    'assets/js/scripts.min.js': ['assets/js/plugins/*.js', 'assets/js/_*.js']
                }
            }
        },

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

        copy: {
            CNAME: {
                src: 'CNAME',
                dest: '_site/',
            },
        },

        'gh-pages': {
            options: {
                base: '_site',
                branch: 'gh-pages',
                message: 'Publish new post',
                dotfiles: true
            },
            // These files will get pushed to the `bar` branch.
            src: ['**/*']
        },

        clean: {
            dist: [
                'assets/css/main.min.css',
                'assets/js/scripts.min.js'
            ]
        },

        // Keep multiple browsers & devices in sync when building websites.
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        '_site/**/*'
                    ]
                },
                options: {
                    watchTask: true,
                    // server: {
                    //     baseDir: "./"
                    // },
                    // proxy: {
                    //     host: "192.168.25.5",
                    //     port: 4000
                    // }
                }
            }
        },
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Register tasks
    grunt.registerTask('default', [
        'clean',
        'recess',
        'uglify',
        'imagemin',
        'svgmin'
    ]);

    grunt.registerTask('dev', ['replace:devUrl', 'replace:devBS', 'exec:jekyllBuild', 'browserSync', 'watch']);

    grunt.registerTask('build', ['replace:distUrl', 'replace:distBS', 'default', 'exec:jekyllBuild', 'copy:CNAME', 'gh-pages']);

};

module.exports = function (grunt) {
    const sass = require('node-sass');
    let concatFile = 'out/web/materialize_concat.js.map';

    // configure the tasks
    let config = {
        //  Sass
        sass: {
            options: {
                implementation: sass
            },
            // Task
            expanded: {
                // Target options
                options: {
                    outputStyle: 'expanded',
                    sourcemap: false
                },
                files: {
                    'resources/styles/materialize.vscode.css': 'resources/framework/materialize.vscode.scss'
                }
            },
            // Minify
            min: {
                options: {
                    outputStyle: 'compressed',
                    sourcemap: false
                },
                files: {
                    'resources/styles/materialize.vscode.min.css': 'resources/framework/materialize.vscode.scss'
                }
            },
            // Compile bin css (just so you have a prod ready one)
            bin: {
                options: {
                    outputStyle: 'expanded',
                    sourcemap: false
                },
                files: {
                    'dist/web/materialize.vscode.css': 'resources/framework/materialize.vscode.scss'
                }
            }
        },

        // PostCss Autoprefixer
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')()
                ]
            },
            expanded: {
                src: 'resources/styles/materialize.vscode.css'
            },
            min: {
                src: 'resources/styles/materialize.vscode.min.css'
            },
            bin: {
                src: 'dist/web/materialize.vscode.css'
            }
        },

        babel: {
            options: {
                sourceMap: false,
                presets: ['@babel/preset-env']
            },
            bin: {
                options: {
                    sourceMap: true
                },
                files: {
                    'resources/scripts/materialize.js': 'out/web/materialize_concat.js'
                }
            },
            dist: {
                files: {
                    'dist/web/materialize.js': 'out/web/materialize.js'
                }
            }
        },

        //  Concat
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: [
                    'resources/framework/js/cash.js',
                    'resources/framework/js/component.js',
                    'resources/framework/js/global.js',
                    'resources/framework/js/anime.min.js',
                    'resources/framework/js/collapsible.js',
                    'resources/framework/js/dropdown.js',
                    'resources/framework/js/modal.js',
                    'resources/framework/js/materialbox.js',
                    'resources/framework/js/parallax.js',
                    'resources/framework/js/tabs.js',
                    'resources/framework/js/tooltip.js',
                    'resources/framework/js/waves.js',
                    'resources/framework/js/toasts.js',
                    'resources/framework/js/sidenav.js',
                    'resources/framework/js/scrollspy.js',
                    'resources/framework/js/autocomplete.js',
                    'resources/framework/js/forms.js',
                    'resources/framework/js/slider.js',
                    'resources/framework/js/cards.js',
                    'resources/framework/js/chips.js',
                    'resources/framework/js/pushpin.js',
                    'resources/framework/js/buttons.js',
                    'resources/framework/js/datepicker.js',
                    'resources/framework/js/timepicker.js',
                    'resources/framework/js/characterCounter.js',
                    'resources/framework/js/carousel.js',
                    'resources/framework/js/tapTarget.js',
                    'resources/framework/js/select.js',
                    'resources/framework/js/range.js'
                ],
                // the location of the resulting JS file
                dest: 'out/web/materialize.js'
            },
            temp: {
                // the files to concatenate
                options: {
                    sourceMap: true,
                    sourceMapStyle: 'link'
                },
                src: [
                    'resources/framework/js/cash.js',
                    'resources/framework/js/component.js',
                    'resources/framework/js/global.js',
                    'resources/framework/js/anime.min.js',
                    'resources/framework/js/collapsible.js',
                    'resources/framework/js/dropdown.js',
                    'resources/framework/js/modal.js',
                    'resources/framework/js/materialbox.js',
                    'resources/framework/js/parallax.js',
                    'resources/framework/js/tabs.js',
                    'resources/framework/js/tooltip.js',
                    'resources/framework/js/waves.js',
                    'resources/framework/js/toasts.js',
                    'resources/framework/js/sidenav.js',
                    'resources/framework/js/scrollspy.js',
                    'resources/framework/js/autocomplete.js',
                    'resources/framework/js/forms.js',
                    'resources/framework/js/slider.js',
                    'resources/framework/js/cards.js',
                    'resources/framework/js/chips.js',
                    'resources/framework/js/pushpin.js',
                    'resources/framework/js/buttons.js',
                    'resources/framework/js/datepicker.js',
                    'resources/framework/js/timepicker.js',
                    'resources/framework/js/characterCounter.js',
                    'resources/framework/js/carousel.js',
                    'resources/framework/js/tapTarget.js',
                    'resources/framework/js/select.js',
                    'resources/framework/js/range.js'
                ],
                // the location of the resulting JS file
                dest: 'out/web/materialize_concat.js'
            }
        },

        //  Uglify
        uglify: {
            options: {
                // Use these options when debugging
                mangle: false,
                compress: false,
                beautify: true
            },
            dist: {
                files: {
                    'dist/web/materialize.min.js': ['dist/web/materialize.js']
                }
            },
            bin: {
                files: {
                    'resources/scripts/materialize.min.js': ['resources/scripts/materialize.js']
                }
            }
        },

        //  Clean
        clean: {
            temp: {
                src: ['out/web']
            }
        },

        //  Watch Files
        watch: {
            js: {
                files: ['resources/framework/**/*.js'],
                tasks: ['js_compile'],
                options: {
                    interrupt: false,
                    spawn: false
                }
            },

            sass: {
                files: ['resources/framework/**/*.scss'],
                tasks: ['sass_compile'],
                options: {
                    interrupt: false,
                    spawn: false
                }
            }
        },

        //  Concurrent
        concurrent: {
            options: {
                logConcurrentOutput: true,
                limit: 10
            },
            monitor: {
                tasks: [
                    'sass_compile',
                    'js_compile',
                    'watch:js',
                    'watch:sass',
                    'notify:watching'
                ]
            }
        },

        //  Notifications
        notify: {
            watching: {
                options: {
                    enabled: true,
                    message: 'Watching files',
                    title: 'CDS for Code', // defaults to the name in package.json, or will use project directory's name
                    success: true, // whether successful grunt executions should be notified automatically
                    duration: 1 // the duration of notification in seconds, for `notify-send only
                }
            },

            sass_compile: {
                options: {
                    enabled: true,
                    message: 'Sass files compiled',
                    title: 'CDS for Code',
                    success: true,
                    duration: 1
                }
            },

            js_compile: {
                options: {
                    enabled: true,
                    message: 'JS files compiled',
                    title: 'CDS for Code',
                    success: true,
                    duration: 1
                }
            }
        },

        // Text Replace
        replace: {
            version: {
                // Does not edit README.md
                src: ['package.json'],
                overwrite: true,
                replacements: [{
                    from: grunt.option('oldver'),
                    to: grunt.option('newver')
                }]
            },
            readme: {
                // Changes README.md
                src: ['README.md'],
                overwrite: true,
                replacements: [{
                    from: 'Release version: ' + grunt.option('oldver'),
                    to: 'Release version: ' + grunt.option('newver')
                }]
            }
        },

        // Create Version Header for files
        usebanner: {
            release: {
                options: {
                    position: 'top',
                    banner: '/*!\n * CloudSmith CDS for Code v' +
                        grunt.option('newver') +
                        ' (http://www.cloudsmithconsulting.com)\n * Copyright 2019 CloudSmith Consulting LLC\n * MIT License (https://raw.githubusercontent.com/CloudSmithConsulting/CDS-for-Code/master/LICENSE)\n */',
                    linebreak: true
                },
                files: {
                    src: ['out/**/*.css', 'out/**/*.js']
                }
            }
        }
    };

    grunt.initConfig(config);

    // load the tasks
    // grunt.loadNpmTasks('grunt-gitinfo');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-rename-util');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-babel');

    // define the tasks
    grunt.registerTask('release', [
        'sass:expanded',
        'sass:min',
        'postcss:expanded',
        'postcss:min',
        'concat:dist',
        'babel:dist',
        'uglify:dist',
        'usebanner:release',
        'compress:main',
        'replace:version',
        'replace:readme',
        'clean:temp'
    ]);

    grunt.task.registerTask('configureBabel', 'configures babel options', function () {
        config.babel.bin.options.inputSourceMap = grunt.file.readJSON(concatFile);
    });

    grunt.registerTask('js_compile', ['concat:temp', 'configureBabel', 'babel:bin', 'clean:temp', 'notify:js_compile']);
    grunt.registerTask('sass_compile', [
        'sass:bin',
        'postcss:bin',
        'notify:sass_compile'
    ]);
    grunt.registerTask('monitor', ['concurrent:monitor']);
    grunt.registerTask('travis', ['js_compile', 'sass_compile']);
};
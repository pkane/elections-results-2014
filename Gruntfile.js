module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({

        config: {
            app: 'src',
            dist: 'build',
            tmp: '.tmp'
        },

        pkg: grunt.file.readJSON('package.json'),

        // Empties folders to start fresh
        clean: {
            options: {
                force: true
            },
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.tmp %>',
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            server: '<%= config.tmp %>'
        },

        copy: {
            tmp: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.tmp %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.png',
                        '{,*/}*.html',
                        'fonts/{,*/}*.*',
                        'css/*.css'
                    ]
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.png',
                        '{,*/}*.html',
                        'fonts/{,*/}*.*',
                        'css/*.css'
                    ]
                }]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '<%= config.tmp %>',
                        '<%= config.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= config.dist %>',
                    livereload: false
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= config.app %>/js/{,*/}*.js',
                '!<%= config.app %>/js/lib/*'
            ]
        },
        
        removelogging: {
            dist: {
                src: '<%= config.dist %>/js/main.min.js'
            }
        },

        requirejs: {
            dist: {
                options: {
                    baseUrl: '<%= config.app %>/js',
                    mainConfigFile: '<%= config.app %>/js/main.js',
                    optimize: 'uglify',
                    findNestedDependencies: true,
                    generateSourceMaps: false,
                    dir: '<%= config.dist %>/js',
                    modules: [
                        {
                            name: 'common.min',
                            create: true,
                            include: [
                                'jquery',
                                'backbone',
                                'underscore',
                                'api/ads',
                                'api/analytics'
                            ]
                        },
                        {
                            name: 'main.min',
                            create: true,
                            exclude: [
                                'common.min'
                            ],
                            include: [
                                'main'
                            ]
                        }
                    ],
                    paths: {
                        jquery: '../bower_components/jquery/dist/jquery',
                        backbone: '../bower_components/backbone/backbone',
                        underscore: '../bower_components/underscore/underscore',
                        'api/ads': 'common/ads',
                        'api/analytics': 'common/analytics',
                        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
                        d3: '../bower_components/d3/d3',
                        'jquery.hashchange': '../bower_components/jquery-hashchange/jquery.ba-hashchange',
                        moment: '../bower_components/momentjs/moment',
                        respond: '../bower_components/respond/dest/respond.src',
                        typeahead: '../bower_components/typeahead.js/dist/typeahead',
                        text: '../bower_components/requirejs-text/text'
                    },
                    shim: {
                        'backbone': {
                            deps: ['underscore', 'jquery'],
                            exports: 'Backbone'
                        },
                        'underscore': {
                            exports: '_'
                        }
                    }
                }
            },
            server: {
                options: {
                    baseUrl: '<%= config.app %>/js',
                    mainConfigFile: '<%= config.app %>/js/main.js',
                    optimize: 'none',
                    findNestedDependencies: true,
                    generateSourceMaps: true,
                    dir: '<%= config.tmp %>/js',
                    modules: [
                        {
                            name: 'main',
                            create: true,
                            exclude: [],
                            include: ['main']
                        }
                    ],
                    paths: {
                        jquery: '../bower_components/jquery/dist/jquery',
                        backbone: '../bower_components/backbone/backbone',
                        underscore: '../bower_components/underscore/underscore',
                        'api/ads': 'common/ads',
                        'api/analytics': 'common/analytics',
                        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
                        d3: '../bower_components/d3/d3',
                        'jquery.hashchange': '../bower_components/jquery-hashchange/jquery.ba-hashchange',
                        masonry: '../bower_components/masonry/dist/masonry.pkgd',
                        moment: '../bower_components/momentjs/moment',
                        respond: '../bower_components/respond/dest/respond.src',
                        typeahead: '../bower_components/typeahead.js/dist/typeahead',
                        text: '../bower_components/requirejs-text/text'
                    },
                    shim: {
                        'backbone': {
                            deps: ['underscore', 'jquery'],
                            exports: 'Backbone'
                        },
                        'underscore': {
                            exports: '_'
                        }
                    }
                }
            }
        },

        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/scss',
                    src: ['*.scss'],
                    dest: '<%= config.dist %>/css',
                    ext: '.css'
                }]
            },
            server: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/scss',
                    src: ['*.scss'],
                    dest: '<%= config.tmp %>/css',
                    ext: '.css'
                }]
            }
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['<%= config.app %>/js/**'],
                tasks: ['jshint', 'requirejs:server'],
                options: {
                    livereload: true
                }
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            sass: {
                files: ['<%= config.app %>/scss/{,*/}*.{scss,sass}'],
                tasks: ['sass:server'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['<%= config.app %>/css/{,*/}*.css'],
                tasks: ['newer:copy:styles'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '{,*/}*.html',
                    'css/{,*/}*.css',
                    'sass/{,*/}*.{scss,sass}',
                    'images/{,*/}*.{gif,jpeg,jpg,png,svg,webp}'
                ]
            }
        }

    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-remove-logging');

    // Tasks
    grunt.registerTask('build', [
        'clean:dist',
        'sass:dist',
        'requirejs:dist',
        'removelogging:dist',
        'copy:dist'
    ]);

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'sass:server',
            'requirejs:server',
            'connect:livereload',
            'watch'
        ]);
    });

    // Default task(s).
    grunt.registerTask('default', [
        'newer:jshint',
        'build'
    ]);

};
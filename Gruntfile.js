module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        manifest: grunt.file.readJSON( './src/manifest.json' ),
        crx: {
            staging: {
                "src": "./src/",
                "dest": "./dist/staging/crx/<%= pkg.name %>-<%= manifest.version %>.crx",
                "exclude": [ ".md", ".gitignore", ".git", ".svn", "dist", ".pem", "Gruntfile.js", "package.json", "node_modules" ],
                "privateKey": "./build.pem"   
            },
            production: {
                "src": "./src/",
                "dest": "./dist/production/crx/<%= pkg.name %>-<%= manifest.version %>.crx",
                "exclude": [ ".md", ".gitignore", ".git", ".svn", "dist", ".pem", "Gruntfile.js", "package.json", "node_modules" ],
                "privateKey": "./build.pem"
            }
        },
        compress: {
            staging: {
                options: {
                    archive: "./dist/staging/zip/<%= pkg.name %>-<%= manifest.version %>.zip",
                },
                cwd: './src',
                src: [ '**' ],
                expand: true
            },
            production: {
                options: {
                    archive: "./dist/production/zip/<%= pkg.name %>-<%= manifest.version %>.zip",
                },
                cwd: './src',
                src: [ '**' ],
                expand: true
            }
        }
    });

    grunt.loadNpmTasks( 'grunt-crx' );
    grunt.loadNpmTasks( 'grunt-contrib-compress' );
    grunt.registerTask( 'package', [ 'crx:production', 'compress:production' ] );
    grunt.registerTask( 'default', [ 'crx:staging', 'compress:staging'] );
};
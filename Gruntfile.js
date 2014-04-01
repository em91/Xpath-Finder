module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        manifest: grunt.file.readJSON( './src/manifest.json' ),
        crx: {
            xpathFinder: {
                "src": "./src/",
                "dest": "./dist/crx/<%= pkg.name %>-<%= manifest.version %>.crx",
                "exclude": [ ".md", ".gitignore", ".git", ".svn", "dist", ".pem", "Gruntfile.js", "package.json", "node_modules" ],
                "privateKey": "./build.pem"
            }
        },
        compress: {
            xpathFinder: {
                options: {
                    archive: "./dist/zip/<%= pkg.name %>-<%= manifest.version %>.zip",
                },
                cwd: './src',
                src: [ '**' ],
                expand: true
            }
        }
    });

    grunt.loadNpmTasks( 'grunt-crx' );
    grunt.loadNpmTasks( 'grunt-contrib-compress' );
    grunt.registerTask( 'deploy', [ 'crx', 'compress'] );
    grunt.registerTask( 'default', [ 'crx', 'compress' ] );
};
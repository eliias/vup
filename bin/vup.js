#!/usr/bin/env node

'use strict';

process.title = 'vup';

var program = require( 'commander' ),
    rmdir   = require( 'rmdir' ),
    mkdir   = require( 'mkdirp' ),
    resolve = require( 'resolve' ).sync,
    path    = require( 'path' ),
    vup     = require( '../lib/vup' ),
    basedir = process.cwd(),
    vupfile,
    opts;

try {
    vupfile = resolve( path.join( basedir, 'Vupfile' ), {basedir: basedir} );
    opts = require( vupfile );
} catch (err) {
    console.error( 'Vupfile not found' );
    process.exit( 1 );
}

program
    .version( '0.0.1' )
    .option( '-f', '--file', 'Use a different file than Vupfile.js' );

program
    .command( 'publish <file> <output>' )
    .description( 'Transcode and publish given videofile' )
    .action( function( file, output ) {
        rmdir( opts.dist, function( err ) {
            mkdir( opts.dist, function( err ) {
                if (err) {
                    return console.error( err );
                }

                vup.transcode( file, output, opts, function( err ) {
                    if (err) {
                        console.error( err );
                        process.exit( 1 );
                    }

                    vup.publish( file, output, opts, function( err ) {
                        if (err) {
                            return console.error( err );
                        }

                        console.log( 'All done.' );
                    } )
                } );
            } );
        } );
    } );

program.parse( process.argv );

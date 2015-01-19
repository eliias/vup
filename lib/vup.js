'use strict';

var _      = require( 'lodash' ),
    ffmpeg = require( 'fluent-ffmpeg' ),
    scp    = require( 'scp' ),
    path   = require( 'path' );

function poster( src, dest, opts, cb ) {
    var filename = path.join(
                opts.dist,
                path.basename(
                    dest,
                    path.extname( dest )
                )
            ) + '.png',
        opts = opts.poster;
    opts.filename = filename;

    // Poster frame
    ffmpeg( src )
        .on( 'error', cb )
        .on( 'end', cb )
        .screenshot( opts );
}

function video( src, dest, opts, cb ) {
    ffmpeg( src )
        .videoCodec( opts.video.videoCodec )
        .audioCodec( opts.video.audioCodec )
        .size( opts.video.size )
        .on( 'progress', function( progress ) {
            console.log( Math.round( progress.percent ) + '%' );
        } )
        .on( 'error', cb )
        .on( 'end', cb )
        .save( path.join( opts.dist, dest ) );
}

function transcode( src, dest, opts, cb ) {
    // Poster frame
    poster( src, dest, opts, function( err ) {
        if (err) {
            return cb( err );
        }

        // Transcode video/*
        video( src, dest, opts, function( err ) {
            if (err) {
                return cb( err );
            }

            cb();
        } );
    } );
}

function publish( opts, cb ) {
    opts = _.extend( {
        file: './dist/*'
    }, opts.scp );
    scp.send( opts, cb );
}

module.exports = {
    transcode: transcode,
    publish:   publish
};

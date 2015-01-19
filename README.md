# vup

Transcode a video and publish on site

## Example

Create a *Vupfile.js* within the directory you want to transcode and publish
a video.

```js
module.exports = {
    dist:   './dist',
    scp:    {
        host:     'hostname.tld',
        user:     'username',
        key_file: '/Users/youruser/.ssh/id_rsa',
        path:     '/var/www/location/'
    },
    poster: {
        count: 1
    },
    video:  {
        size:       '320x200',
        videoCodec: 'libx264',
        audioCodec: 'libmp3lame'
    }
};
```

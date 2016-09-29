#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var childProcess = require('child_process')

var binary = (process.platform === 'darwin') ? 'afplay' : 'play'
var filepath = path.join(process.env['HOME'], 'hold-music.mp3')

if (!fs.existsSync(filepath)) {
  console.error('Please place a file at the path', filepath)
  process.exit(1)
}

var hold = childProcess.spawn(binary, [filepath])

hold.stdout.resume()
hold.stderr.resume()
hold.unref()

if (process.argv[2]) {
  hold.stdout.unref()
  hold.stderr.unref()
  hold.stdin.unref()

  var command = process.argv[2]
  var args = process.argv.slice(3)
  var options = { stdio: 'inherit' }

  childProcess.spawn(command, args, options)
}

process.on('exit', function () {
  hold.kill()
})

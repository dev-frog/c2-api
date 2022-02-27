#!/usr/bin/env node

const { spawn } = require('child_process');
const name = process.argv[2];
if(!name || name.match(/[<>:"\/\\|?*\x00-\x1F]/)){
    return console.log(`
    Invalid directory name.
    Usage: c2-api <name>
    `)
}

const repo = 'https://github.com/dev-frog/command-control-api.git';

runCommand('git', ['clone', repo, name])
    .then(() => {
        return runCommand('rm', ['-rf', `${name}/.git`]);
    })
    .then(() => {
        console.log('Installing depenencies...');
        return runCommand('npm', ['install'], { cwd: process.cwd() + '/' + name });
    })
    .then(() => {
        console.log('Done!');
        console.log('')
        console.log('To start the server:');
        console.log(`cd ${name}`);
        console.log('npm run dev');

    })

function runCommand(command, args, options = undefined){
    const spawned = spawn(command, args, options);
    return new Promise((resolve, reject) => {
        spawned.stdout.on('data', data => {
            console.log(data.toString());
        }
        );
        spawned.stderr.on('data', data => {
            console.log(data.toString());
        }
        );
        spawned.on('close', code => {
            if(code !== 0) {
                reject(code);
            } else {
                resolve();
            }
        }
        );
    }
    );
}

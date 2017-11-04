#!/usr/bin/env node

var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');

function showHelp() {
	var help = `
Usage:
  git done-maybe [--a=<author name>] [--d=<days-ago>] [--df=<date-format>] [--m] [--f] [--s] [--h]

  --author      	- Specify author to restrict search to (if not specified, will return all contributors)
  --days      		- Specify the number of days back to include (default: 1)
  --dateformat		- Specify the date format for "git log" (default: relative, options: local|default|iso|iso-strict|rfc|short|raw)
  --multiple	  	- Specify the multiple git projects search in target directory
  --fetch      		- Fetch the latest commits beforehand
  --stats      		- Display stats for the commits (files changed, insertions, deletions)
  --help      		- Display this help screen

Example:
  git done-maybe --a="John Doe" --d=7 --f --s
`;
	console.log(help);
}

var author,
	days,
	date_format,
	stats,
	multiple = false,
	fetch_last = false,
	help = false;

process.argv = process.argv.slice(2);

process.argv.forEach(function (arg) {
	var k = arg.split('=');

	switch (k[0]) {
		case '--a': case '--author':
			author = `-i --author=${k[1]}`;
			break;
		case '--d': case '--days':
			days = `${k[1] || 1}' days ago'`;
			break;
		case '--df': case '--dateformat':
			var all = ['relative', 'local', 'default', 'iso', 'iso-strict', 'rfc', 'short', 'raw'];
			date_format = !!(all.indexOf(k[1]) + 1) ? k[1] : 'relative';
			break;
		case '--m': case '--multiple':
			multiple = true;
			break;
		case '--f': case '--fetch':
			fetch_last = true;
			break;
		case '--s': case '--stats':
			stats = '--shortstat';
			break;
		case '--h': case '--help':
			help = true;
			break;
		default:
			break;
	}
});

if (help) { showHelp(); return; }
var pretty_format = `--pretty=format:'%Cred%h%Creset ### %s%Creset ### %Cgreen(%ad)%Creset ### %C(yellow)<%an>%Creset' ${stats || ''}`;
var gitLog = `git log --since=${days || '1.days'} ${pretty_format} --abbrev-commit --date=${date_format || 'relative'} ${author || ''} --no-merges`;
var gitFetch = 'git fetch --all';

function getWork(gitPath) {
	fetch_last ? (
		console.log(`\x1b[32mFetching commits from ${repoName(gitPath)} .. \x1b[0m`),
		executeGitFetch(gitPath, function () {
			executeGitLogWork(gitPath);
		})
	) : executeGitLogWork(gitPath);
}

function executeGitFetch(gitPath, callback) {
	exec(gitFetch, { cwd: gitPath }, function (err, stdout, stderr) {
		callback();
	});
}

function executeGitLogWork(gitPath) {
	exec(gitLog, { cwd: gitPath }, function (err, stdout, stderr) {
		console.log('\n\x1b[4m\x1b[36m/' + repoName(gitPath) + '\x1b[0m\n');
		if (!checkGitDir(gitPath)) return;
		if (err) return console.log('\x1b[31mSomething went wrong.\x1b[0m');

		stdout.length === 0 ?
			console.log('\x1b[31mSeems like nothing here!\x1b[0m')
			: (
				stdout = stdout.split('\n'),
				stdout.forEach(function (el) {
					var a = el.split(' ### ');
					console.log(a.join(' '))
				}, this)
			)
	});
}

function repoName(repo) {
	var name = repo.split('/');
	return name[name.length - 1];
}

function checkGitDir(pathDir) {
	var gitPath = path.join(pathDir, '.git/HEAD');
	return !fs.existsSync(gitPath) ? (
		console.log('\x1b[31m.git not found in this directory!\x1b[0m'),
		false
	) : true;
}

function getSubDirectories() {
	var path = process.cwd();
	return fs.readdirSync(path).filter(function (file) {
		return fs.statSync(path + '/' + file).isDirectory();
	});
}

if (multiple) {
	var directories = getSubDirectories();
	directories.forEach(function (dir) {
		if (dir !== '.git') {
			var gitPath = path.join(process.cwd(), dir);
			if (fs.existsSync(gitPath)) {
				getWork(gitPath);
			}
		}
	})
} else {
	getWork(process.cwd());
}
# git-done-maybe

> What you did on the last working day ..or what someone else did.
> Inspired by [git-standup](https://github.com/kamranahmedse/git-standup) and need to have compact multiple repo access.

## Install

To install git-done-maybe library via npm

```bash
$ npm install -g git-done-maybe
```

## Usage

```bash
$ git done-maybe [--a=<author name>] 
                 [--d=<days-ago>] 
                 [--df=<date-format>] 
                 [--m] 
                 [--f] 
                 [--s] 
                 [--h]
```

Below is the description for each of the flags

- `--a`      	- Specify author to restrict search to (if not specified, will return all contributors)
- `--d`      	- Specify the number of days back to include (default: 1)
- `--df`			- Specify the date format for "git log" (default: relative, options: local|default|iso|iso-strict|rfc|short|raw)
- `--m`	  	 	- Specify the multiple git projects search in target directory
- `--f`      	- Fetch the latest commits beforehand
- `--s`      	- Display stats for the commits (files changed, insertions, deletions)
- `--h`      	- Display the help screen

For the basic usage, all you have to do is run `git done-maybe` in a repository.

### Single Repository

To check all commits from last working day, head to the project repository and run

```bash
$ git done-maybe
```

### Multiple Repository
Open a directory having multiple repositories and run

```bash
$ git done-maybe --m
```

This will show you all commits since the last working day in all the repositories inside.

### Checking commits for specific contributor

If you want to find out someone else's commits

```bash
# If heir name on git is "Charles Lee"
$ git done-maybe --a="Charles Lee"

# Or if their email on git is "charles@something.com"
$ git done-maybe --a="charles@something.com"
```

### Commits from `n` days ago

If you would like to show all your/someone else's commits from `n` days ago

```bash
# Show all commits from 7 days ago
$ git done-maybe --d=7

# Show all Charles Lee's commits from 7 days ago
$ git done-maybe --a="Charles Lee" --d=7
```

### Specifying the output date format

Add `--df` flag to specify the date format (default: `relative`)

```bash
$ git done-maybe --df=iso
# Available relative|local|default|iso|iso-strict|rfc|short|raw
```

### Fetch latest commits before showing result

If you would like to automatically run `git fetch --all` before printing the result, you can add the `--f` flag

```bash
$ git done-maybe --f
```

### Show statistics for all commits

If you would like to show how many files are changed (with insertions/deletions) per commit , you can add the `--s` flag

```bash
$ git done-maybe --s
```

## License

MIT
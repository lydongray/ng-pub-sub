# Contributing to ng-pub-sub
Found a bug or want to contribute a new feature?

### Step 1: Fork
Create a clone of the repository. Fork it by pressing the "fork" button in GitHub.

### Step 2: Branch
Features and bug fixes can be developed on the master branch.
It's good practice to do all development in a new branch. Create a new branch and give it a good name.

```text
$ git checkout -b my-branch -t origin/master
```

### Step 3: Do some work
Cut some code.

### Step 4: Test
If you've written a new feature, write a test for it. If you've found a bug, write a test that fails for the bug then fix it so that the test passes. Ensure all other tests pass as well.

```text
$ gulp unit-test
```

### Step 5: Build
Build the repository. You'll be asked to bump the version number. Choose to bump the major, minor or revision.

```text
$ gulp build
```

### Step 6: Commit
Commit your changes.
Write a nice commit message. Here's a great [guide on writing commit messages](http://chris.beams.io/posts/git-commit/).

### Step 6: Push
Push your changes to your forked repository.

```text
$ git push origin my-branch
```

Go to https://github.com/yourusername/ng-pub-sub and select your branch.
Click the 'Pull Request' button and fill in the details.

Your pull request will be reviewed ASAP.
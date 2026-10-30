# Git Line

The status bar shows who last changed the cursor's line and when. Click it for the commit's message.

Open a file in a git repository and move the cursor: the status bar says, for example, **Sam, 3 days ago**, or **You, 2 hours ago** for your own commits. Lines you have not committed say **Not committed yet**.

Click it to see the commit's whole message, its id, author and date. From there you can copy the commit id, or show the whole commit (`git show`) in the terminal.

- It uses `git blame`, so [Git](https://git-scm.com) has to be installed.
- Outside a git repository, for files git does not track, and for files with changes that are not saved yet, it shows nothing. Save the file to see it again.
- Each file is read once and kept for half a minute, so moving the cursor is quick. **Git Line: Look Again** in the Command Palette reads it again now (after a commit, say).

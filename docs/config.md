# Tessereact configuration

Tessereact config should be named as `tessereact.config.json` and located in root directory of your app.

## Configuration options

`port` — a port of your Tessereact server, 5001 by default

`snapshotsPath` — a path to directory where Tessereact is going to store snapshots

`entryURL` — an URL to Tessereact Webpack entry

`staticURL` — if specified, redirects 404 to this URL.
  Useful if the site contains static files linked by relative path.
  For example, if the server is running on 5001 port, and `staticURL` is 'http://localhost:5000',
  then 'http://localhost:5001/static/image.png' redirects to 'http://localhost:5000/static/image.png'
  (note ports)

`templatePath` — a path to Tessereact template

`screenshotSizes` — a list of sizes for screenshot diff

`screenshotDiff` — options for visual diffs:

- `screenshotDiff.command` — a command used to create a visual diff.
    Default: "convert -delay 50 $BEFORE $AFTER -loop 0 $RESULT".
    Use $BEFORE, $AFTER and $RESULT variables instead of the respective file names.
    Example:
      "convert '(' $BEFORE -flatten -grayscale Rec709Luminance ')' '(' $AFTER -flatten -grayscale Rec709Luminance ')' '(' -clone 0-1 -compose darken -composite ')' -channel RGB -combine $RESULT"

- `screenshotDiff.resultExtension` - file name extension of the result file. Default: "gif"

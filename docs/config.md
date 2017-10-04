# Tessereact configuration

Tessereact config should be named as `tessereact.config.json` and located in root directory of your app.

## Configuration options

`port` — a port of your Tessereact server, 5001 by default

`chromedriverPort` — chromedriver port for making screenshots, 5003 by default

`snapshotsPath` — a path to directory where Tessereact is going to store snapshots

`entryURL` — an URL to Tessereact Webpack entry

`templatePath` — a path to Tessereact template

`cacheCSS` — should server cache CSS diffs

`screenshotSizes` — a list of sizes for screenshot diff

`screenshotDiffCommand` — a command used to create a visual diff.
  Default: "convert -delay 50 $BEFORE $AFTER -loop 0 $RESULT".
  Use $BEFORE, $AFTER and $RESULT variables instead of the respective file names.
  Example:
    "convert '(' $BEFORE -flatten -grayscale Rec709Luminance ')' '(' $AFTER -flatten -grayscale Rec709Luminance ')' '(' -clone 0-1 -compose darken -composite ')' -channel RGB -combine $RESULT"

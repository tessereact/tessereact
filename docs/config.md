# Tessereact configuration

Tessereact config should be named as `tessereact.config.json` and located in root directory of your app
(or on the path specified by `TESSEREACT_CONFIG` environment variable).

## Configuration options

`port` — a port of your Tessereact server, 5001 by default

`snapshotsPath` — a path to directory where Tessereact is going to store snapshots

`entryURL` — an URL to Tessereact Webpack entry

`templatePath` — a path to Tessereact template

`screenshotSizes` — a list of sizes for screenshot diff.
  Example:
  ```json
  "screenshotSizes": [
    {"width": 320, "height": 568, "alias": "iPhone SE"},
    {"width": 640, "height": 480},
    {"width": 800, "height": 600},
    {"width": 1024, "height": 768}
  ]
  ```

`screenshotDiff` — options for visual diffs:

- `screenshotDiff.command` — a command used to create a visual diff.
    Default: "convert -delay 50 $BEFORE $AFTER -loop 0 $RESULT".
    Use $BEFORE, $AFTER and $RESULT variables instead of the respective file names.
    Example:
      "convert '(' $BEFORE -flatten -grayscale Rec709Luminance ')' '(' $AFTER -flatten -grayscale Rec709Luminance ')' '(' -clone 0-1 -compose darken -composite ')' -channel RGB -combine $RESULT"

- `screenshotDiff.resultExtension` - file name extension of the result file. Default: "gif"

## About this quide
This guide exists to
- avoid technical problems when editing code and
- to make working with the codebase as easy as possible

## Indentations
Please **don't** ever use whitespaces for indentations. Please use tabs for indentations. Some code editors allow to change the tabbing style without disrupting the look of the code for other developers. E.g. gedit allows me to tweak the tab width but this setting does not affect different setups of other developers. To indentate via whitespace would break someelses working flow which we want to prevent where possible.

## Strings
- In HTML code we use the `'` char (single quote) to declare strings like `'This is string'`
  - Realistic example: `<img class='small-icon custom-leaflet-icon' src='/images/locating.svg' onclick='requestLocation()' />`
- In javascript code and in JSON we use the `"` char (doppel quote) to declare strings like `"This is string"`
  - Realistic example for json: `{iconUrl: "/markers/marker-green.svg", code: "#00c700"}`
  - Realistic example for javascript: `checkbox.id = "filter" + id;`

## Use of `eval()`
The use of `eval` is allowed but please note the following:
- Don't use `eval` in conjunction with data sent to Babykarte by servers.
- Don't use `eval` in conjunction with user generated code.

## Use of cookies and other storage technology
We don't take use of cookies and other intransparent technologies on our site. A request that includes the use of these technologies will be rejected.

## Coding long JSON oneliners
Coding long JSON oneliners are allowed as you can see when looking throw the code. Most developers should have the tools that helps them to read it. Such functions could be but not limited to: syntax highlighting, bracket detection, line and column numbering and breakpoints.
You're free to prettify existing oneliners into multiliners to make the code better readable.

## JQuery
The use of JQuery is allowed but the use of other frameworks are not. This prevents us from loading too much requirement into the browser's cache and makes Babykarte faster

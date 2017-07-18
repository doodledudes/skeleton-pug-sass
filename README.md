---
# What's new
- angularjs (AngularJS v1.6.5)
- gulp-inject (no more manual linking of js/css on the page)
---
# skeleton-pug-sass
A starter template using pug and sass.

## What is a Skeleton?
A skeleton is basically an application boilerplate that provides a good starting point for new applications.

## What is this for?
You can use this skeleton as a starting point on writing your code in pug and scss or sass instead of semantic html/css.

## How does it work?
Dont think too much. It's easy. Just install the following and follow the instructions.
- [Node](https://nodejs.org/en/download/package-manager/)
- [Bower](https://bower.io/#install-bower)
- [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)

Once installed open the **Terminal** and navigate to the directory where the 'skeleton-pug-scss' folder is located and then run these two commands.
```
$ npm install
$ bower install
```
Running the **'npm install'** will install the following dependencies I have specified on the **'package.json'**.
- gulp
- gulp-clean
- gulp-pug
- gulp-sass
- browser-sync (if you prefer you may just serve your project using [harpjs](http://harpjs.com/))
- gulp-autoprefixer (optional)

Same with **'bower install'** this will install the **bower** components that I have specified on the **'bower.json'**.
- jQuery
- font-awesome

## What else do I need?
Run [gulp](http://gulpjs.com/) for the first time on your **Terminal**. This should only be ran ones.

But if for instance you have added new plugins or assets like images and new css files, you should run this command again.
```
$ gulp
```
and
```
$ gulp serve
```
What **'gulp serve'** does is it runs the **'serve'** task inside the **'gulpfile.js'**, automatically open up a new browser window and watch your **'pug'** and **'sass'** files.

If you're not familiar with ['Pug'](https://pugjs.org/api/getting-started.html) and ['Sass'](http://sass-lang.com/) you can visit their site and look for the documentation. Enjoy!

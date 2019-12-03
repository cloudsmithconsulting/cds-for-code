var gulp = require('gulp');
var run = require('gulp-run-command').default;

gulp.task('createBootstrapLess', run("sass2less resources/framework/vscode.bootstrap.scss 'resources/framework/vscode.bootstrap.less'"));
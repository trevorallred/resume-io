#!/bin/sh

echo "Minifying AngularJS files for ResumeIO"


export RESUME_HOME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd ../ && pwd )"
export APP_DIR=$RESUME_HOME/app

cat $APP_DIR/js/* > $APP_DIR/concat.js
wc $APP_DIR/concat.js

echo "Removing 'use strict'; for production"
sed "s/'use strict';//g" $APP_DIR/concat.js > $APP_DIR/concat.prod.js
wc $APP_DIR/concat.prod.js

echo "Running AngularJS pre-minifier"
ngmin $APP_DIR/concat.prod.js $APP_DIR/concat.annotated.js
wc $APP_DIR/concat.annotated.js

echo "Minifying"
java -jar $RESUME_HOME/scripts/compiler.jar --js $APP_DIR/concat.annotated.js --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file $APP_DIR/resume-io.min.js

# rm $APP_DIR/concat.js
# rm $APP_DIR/concat.annotated.js

wc $APP_DIR/resume-io.min.js

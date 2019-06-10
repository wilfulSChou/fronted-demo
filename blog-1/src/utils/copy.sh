#!/bin/sh
cd /Users/zhousisi/Desktop/front-end-learn/node-demo/blog-1/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log
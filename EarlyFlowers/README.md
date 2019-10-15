# EarlyFlowers
using ml5.js and p5.js to detect flowers by webcam

# Preparation of the images
to scale the images into 244x244 i use two bash scripts inside the folder

## Scale the images and crop around center
for i in *.*; do mogrify -resize "244^>" -gravity center -crop 244x244+0+0 $i; done 

## Rename images
ls | cat -n | while read n f; do mv "$f" "$n.jpg"; done

## JSON-Generation
python python_json img/ > json_ml5data.json

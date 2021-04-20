# Twitter Tree

A basic app that lets you visualize trees of replies to tweets. Written in Django and React.js.

It traverses through all the replies to a tweet, and the replies to those replies, and so on ... until you get something that looks like this:

https://user-images.githubusercontent.com/25040701/115451749-95f24080-a1eb-11eb-94d0-65a341af47bc.mp4

## Usage (right now)

Right now I got it working in Ubuntu and on Mac OS 10.15.4—no idea what will happen if you try it on windows (it probably won't work for some reason or the other).

Dependencies:
- conda
- npm
- (I think that is it)

In order to run right now, here is what you have to do:

1. create conda environment:
```
conda env create -f environment.yaml
```
2. start django server:
```
conda activate ttree
cd tt_backend
python manage.py runserver
```
3. (In a separate terminal window) start react server
```
cd tt_frontend
npm install
npm start
```
4. Open up in your web browser http://localhost:3000 and check it out!

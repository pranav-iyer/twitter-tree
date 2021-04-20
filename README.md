# Twitter Tree

A basic app that lets you visualize trees of replies to tweets. Written in Django and React.js.

It traverses through all the replies to a tweet, and the replies to those replies, and so on ... until you get something that looks like this:


https://user-images.githubusercontent.com/25040701/115449879-3eeb6c00-a1e9-11eb-9ff5-4b723da749ad.mp4

## Usage (right now)

In order to run right now, here is what you have to do:

1. create conda environment:
```
conda create -f environment.yaml
```
2. start django server:
```
conda activate ttree
cd tt_backend
python manage.py runserver
```
3. (separately) start react server
```
cd tt_frontend
npm install
npm start
```

# The Wall Website

This is the Wall Website. the purpose of the project is to make a [Pinterest](pinterest.com) like.  
We want that users can add some pictures, commentaries and likes the content of the website.

## Frameworks and Technologies

We are using Angular 2+ for this website

## Website configuration

Inside **src/env.json**, you have to change value of
  `window.__env.API_URL = ''` with URL of your TheWall API

### How to run ?

For testing:

    npm run tsc && ng build --aot --watch

/!\ Check that your inotify is high to handle all your files ! /!\
See the helper [here](https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers)

For building:

    ng build --serve

Result in the /build folder.

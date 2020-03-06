# TheWall

Link to this website : [TheWall](https://the-wall-journey.herokuapp.com)

This project is a picture gallery, like [Pinterest](https://www.pinterest.com).  
You can publish pictures (tags, description, etc), add comments, like, search pictures by filters, consult profiles, do moderation stuffs etc.  

We've created this platform to publish our travel photos from South Korea (2018-2019, Chung-Ang University, Seoul, 10 months).  
This project can be reused for another purpose.

## Technologies

This project is using fullstack JS technologies :
- [TypeScript](https://www.typescriptlang.org/)
- [Angular](https://angular.io/)
- [FeathersJS](https://feathersjs.com/)
- [MongoDB](https://mongoosejs.com/)

### Front

In front folder, you will find website project in [Angular 2+](https://cli.angular.io/) using [Typescript](https://www.typescriptlang.org/), and we are using some modules like [Bootstrap module](https://ng-bootstrap.github.io/#/home) and [Material module](https://material.angular.io/).  
See the README in this folder to check how to configure the website.

### Back

In api folder, you will find api project, necessary for the website to work properly.  
We are using the Framework [FeathersJS](https://feathersjs.com/) to create a powerful and realtime REST API.  
Pictures are stored on [Google Drive](https://www.google.com/drive/).  
See the README in this folder to check how to configure API.

### How to test ?

Pretty simple !  
You can go to our website [here](https://the-wall-journey.herokuapp.com).  

In case you want to deploy the platform, you can put everything on [Heroku](https://www.heroku.com/home), on 2 different instances (one for front and one for api), create a MongoDB on [mLab](https://mlab.com/), then configure api and front (see Readme files inside front and api folders). Heroku and mblab are free, you will also need a google drive account for pictures storage.

### Contributors

- [Valentin Montage](https://github.com/ValMont13)
- [Vianney Doleans](https://github.com/VianneyDoleans)
- [Clément Nancelle](https://github.com/Hardkaise)
- [Philippe Antunes](https://github.com/Deartchix)

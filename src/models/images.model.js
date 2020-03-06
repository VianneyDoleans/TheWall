// images-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const images = new Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    path: { type: String, default: 'default.png' },
    data: { type: String },
    about: { type: String, default: '' },
    tags: {type: Array, default: []}
  }, {
    timestamps: true
  });

  return mongooseClient.model('images', images);
};

// notifications-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const notifications = new Schema({
    type: { type: String, required: true },
    read: { type: Boolean, default: false },
    authorId: { type: String, required: true },
    imageId: { type: String, required: true },
    receiver: { type: String, required: true },
    data: { type: Object, required: true },
  }, {
    timestamps: true
  });

  return mongooseClient.model('notifications', notifications);
};

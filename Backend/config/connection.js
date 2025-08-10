const mongoose = require('mongoose');

require("dotenv").config(); //this line convert?transfer all the data of .env file into process ka object

const dbConnect = () => {
    mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err));

}

module.exports = dbConnect;
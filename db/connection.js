const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedtopology: true,
  })
  .then(() => console.log(`Connection to Database Successful`))
  .catch((err) => console.log(err));

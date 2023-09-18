const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/route.js');
// const adminRoutes = require('./routes/admin');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to the database (you need to set up your MongoDB connection here)
mongoose.connect('mongodb+srv://sanketmunishwar7:q5WEY4lK4vMAzwbJ@cluster0.0jenlvx.mongodb.net/Vaccine?retryWrites=true&w=majority', {
  useNewUrlParser: true,

})
.then(()=> console.log("MongoDB is connected ....."))
.catch(()=> console.log(error))


// Routes


app.use('/', routes);
// app.use('/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

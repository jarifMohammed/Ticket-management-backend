const app =  require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);
const express = require("express");
const multer = require("multer");
const { connectMongoDb } = require("./connection");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/orders");
const {checkAuth} = require('./middlewares/auth');
const {handleUpdateProfile} = require("./controllers/auth");
const {handleCreateNewProduct} = require("./controllers/products");
const path = require("path");


const app = express();
const PORT = 8000;

// Connection
connectMongoDb('mongodb+srv://harshadharsh07:vz8RBN33IZ9bWJUA@hgscluster.1hlddmf.mongodb.net/vweb-ecommerce?retryWrites=true&w=majority')
  .then(() => console.log('MongoDb connected'))
  .catch(err => console.error('MongoDb connection error:', err));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(logReqRes("log.txt"));

// Routes

// login - signup - profile 
app.use('/api', authRouter);

//cart
app.use('/api/cart',checkAuth, cartRouter);

// products
app.use('/api/products',checkAuth, productRouter);

// orders
app.use('/api/order',checkAuth, orderRouter);


// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(Boolean(req.body.is_product_image)){
      return cb(null, './uploads'); 
    }else{
      return cb(null, './uploads'); 
    }
  },
  filename: function (req, file, cb) {
      return cb(null, `${Date.now()}_${file.originalname}`)
  }
});

// Initialize multer middleware
const upload = multer({storage});




// add product
app.post('/api/products/add-product',upload.fields([{ name: 'products_images', maxCount: 5 }]),handleCreateNewProduct,express.static('uploads'))


//update profile
app.patch('/api/profile/update-profile',upload.single('profile_image'),checkAuth,handleUpdateProfile,express.static('uploads'))

// app.get('/uploads/:imageName',
//   (req, res) => {
//     const image = req.params.imageName
//     res.sendFile(path.join(__dirname, `./uploads/${image}`));
//   }
// )




app.listen(PORT, () => console.log(`Server started at Port:${PORT}`));
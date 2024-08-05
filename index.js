const express = require("express");
const multer = require("multer");
const cors = require('cors');
const { connectMongoDb } = require("./connection");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/products");
const collectionRouter = require("./routes/collections");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/orders");
const {checkAuth} = require('./middlewares/auth');
const {handleUpdateProfile} = require("./controllers/auth");
const {handleCreateNewProduct} = require("./controllers/products");
const path = require("path");


const app = express();
const PORT = 8000;

// Connection
connectMongoDb('mongodb+srv://harshadharsh07:vz8RBN33IZ9bWJUA@hgscluster.1hlddmf.mongodb.net/vweb-ecommerce_test?retryWrites=true&w=majority')
  .then(() => console.log('MongoDb connected'))
  .catch(err => console.error('MongoDb connection error:', err));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: '*',
  allowedHeaders: 'X-Requested-With, Content-Type, Authorization',
})); 
// app.use(logReqRes("log.txt"));

// Routes

// login - signup - profile 
app.use('/api', authRouter);

//cart
app.use('/api/cart',checkAuth, cartRouter);

// products
app.use('/api/products', productRouter);

// collections
app.use('/api/collections', collectionRouter);

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


const fileFilter = (req, file, cb) => {
  if (req.files && req.files['products_images'] && req.files['products_images'].length >= 5) {
    return cb(new Error('Cannot upload more than 5 files'), false);
  }
  cb(null, true);
};

// Initialize multer middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
}).fields([{ name: 'products_images', maxCount: 5 }]);

const profileUpload = multer({storage});

// Middleware to handle errors from multer
const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    return res.status(400).json({ status: 'failed', message: err.message });
  } else if (err) {
    // Other errors
    return res.status(400).json({ status: 'failed', message: err.message });
  }
  next();
};




// add product
app.post('/api/products/add-product',upload,uploadErrorHandler,handleCreateNewProduct,express.static('uploads'))


//update profile
app.patch('/api/profile/update-profile',profileUpload.single('profile_image'),checkAuth,handleUpdateProfile,express.static('uploads'))

app.get('/uploads/:imageName',
  (req, res) => {
    const image = req.params.imageName
    res.sendFile(path.join(__dirname, `./uploads/${image}`));
  }
)




app.listen(PORT, () => console.log(`Server started at Port:${PORT}`));
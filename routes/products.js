const express = require('express');
const router = express.Router();
const {getAllProducts,addProduct,getCategory,getProductById,deleteProduct,updateProduct,addCategory} = require('../controllers/productsController');
const upload = require('../middlewares/upload');


router.get('/products', getAllProducts);
router.post('/products',upload.single("image"), addProduct);
router.get('/category', getCategory);
router.post('/category', addCategory);
router.get('/product/:id', getProductById);
router.delete('/products/:id', deleteProduct);
router.put('/products/:id',upload.single("image"), updateProduct);


module.exports = router;
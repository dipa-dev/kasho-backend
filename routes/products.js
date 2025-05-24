const express = require('express');
const router = express.Router();
const {getAllProducts,addProduct,getCategory,getProductById,deleteProduct,updateProduct,addCategory} = require('../controllers/productsController');


router.get('/products', getAllProducts);
router.post('/products', addProduct);
router.get('/category', getCategory);
router.post('/category', addCategory);
router.get('/product/:id', getProductById);
router.delete('/products/:id', deleteProduct);
router.put('/products/:id', updateProduct);


module.exports = router;
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName : {
        type : String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    sellingPrice: {
        type: Number
    },
    mrp:{
        type:Number
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String
    },
    qty: {
        type: Number
    },
    inStock: {type: Boolean}
})

productSchema.pre('save',function(next){
    this.inStock = this.qty > 0;
    next();
});

module.exports = mongoose.model("Products", productSchema);
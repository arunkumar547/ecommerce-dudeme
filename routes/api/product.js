const express = require('express')
const router = express.Router();
const Product = require('../../models/Product')

const ErrorHandler = require('../../utils/errorHandler')
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors')
const APIFeatures = require('../../utils/apiFeatures')
const cloudinary = require('cloudinary')

const { isAuthenticatedUser, authorizeRoles } = require('../../middlewares/auth')

// @route     POST api/products
// @desc      create new product
// @access    private
router.post('/admin/product/new', isAuthenticatedUser, authorizeRoles('admin'), catchAsyncErrors(async (req, res) => {

    // let images = []
    // if (req.body.images === 'String') {
    //     images.push(req.body.images)
    // } else {
    //     images = req.body.images
    // }
    // console.log("images",images)
    // const imageLinks = []
    // for (let i = 0; i < images.length; i++) {
    //     const result = await cloudinary.v2.uploader.upload(images[i], {
    //         folder: 'products'
    //     })
    //     console.log("result",result)
    //     imageLinks.push({
    //         public_id: result.public_id,
    //         url: result.secure_url
    //     })
    // }
    // console.log("imageLinks",imageLinks)
    // req.body.images = imageLinks

    const product = await Product.create(req.body);

    res.status(200).json({
        success: true,
        product
    })
}))

// @route     POST api/products?keyword=apple
// @desc      get all products
// @access    public
router.get('/products', catchAsyncErrors(async (req, res) => {

    const resPerPage = 4
    const productsCount = await Product.countDocuments()
    console.log(req.query)
    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()

    let products = await apiFeatures.query
    console.log("pro",products)
    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage)
    products = await apiFeatures.query

    res.status(200).json({
        success: true,
        productsCount,
        resPerPage,
        filteredProductsCount,
        products
    })

}))

// @route     POST api/products/admin/products
// @desc      get admin products
// @access    private
router.get('/admin/products', catchAsyncErrors(async (req, res) => {

    const products = await Product.find()

    res.status(200).json({
        success: true,
        products
    })

}))

// @route     POST api/product/:id
// @desc      get single product details
// @access    public
router.get('/product/:id', async (req, res, next) => {
    try {
        // console.log(req.params.id)
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler('Product not Found', 404))
        }

        res.json({
            success: true,
            product
        })

    } catch (err) {
        // console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route     Put api/product/:id
// @desc      update product
// @access    private
router.put('/admin/product/:id', isAuthenticatedUser, authorizeRoles('admin'), async (req, res, next) => {
    try {
        // console.log("req.params.id,", req.params.id)
        let product = await Product.findById(req.params.id);
        // console.log("product",product)
        if (!product) {
            return next(new ErrorHandler('Product not Found', 404))
        }

        let images = []
        if (req.body.images === 'String') {
            images.push(req.body.images)
        } else {
            images = req.body.images
        }

        if (images !== undefined) {
            for (let i = 0; i < product.images.length; i++) {
                const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
            }

            const imageLinks = []
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: 'products'
                })

                imageLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                })
            }

            req.body.images = imageLinks
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body)

        res.json({
            success: true,
            product
        })

    } catch (err) {
        // console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route     delete api/product/:id
// @desc      update product
// @access    private
router.delete('/admin/product/:id', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler('Product not Found', 404))
        }

        // deleting images associated with the product
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        await Product.remove()

        res.json({
            success: true,
            message: 'Product is deleted'
        })

    } catch (err) {
        // console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//create new review  ==> /api/product/review
router.put('/review', isAuthenticatedUser, catchAsyncErrors(async (req, res) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId)

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment
                review.rating = rating
            }
        })
    } else {
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true
    })
}))

//get product reviews  ==> /api/product/reviews
router.get('/reviews', isAuthenticatedUser, catchAsyncErrors(async (req, res) => {
    const product = await Product.findById(req.query.id)

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
}))

//delete product review  ==> /api/product/reviews
router.delete('/reviews', isAuthenticatedUser, catchAsyncErrors(async (req, res) => {
    const product = await Product.findById(req.query.productId)

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString())

    const numOfReviews = reviews.length

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
}))


module.exports = router
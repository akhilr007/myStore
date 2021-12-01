const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {

    Product.findById(id).populate("category").exec((err, product) => {
        if (err) {
            return res.status(400).json({
                err: "Product not found"
            });
        }

        req.product = product;
        next();
    });
};

exports.createProduct = (req, res) => {

    let form = new formidable({ keepExtensions: true });

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Problem with image"
            });
        }

        // destructure the fields
        const {
            name,
            description,
            price,
            category,
            stock
        } = fields;

        if (!name ||
            !description ||
            !price ||
            !category ||
            !stock
        ) {
            return res.status(400).json({
                error: "Please include all fields"
            });
        }

        let product = new Product(fields);

        // handle file here
        if (files.photo) {
            if (files.photo.size > 3000000) {
                return res.status(400).json({
                    error: "Photo size is too big"
                });
            }

            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        // save to the database
        product.save((err, product) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    error: "Product didn't get saved in DB successfully"
                });
            }
            res.json(product);
        });
    });
};

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

// creating middleware for photo so that it can be fast
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

exports.deleteProduct = (req, res) => {
    let product = req.product;

    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: "Product didn't get deleted"
            });
        }

        res.json({
            message: "Deleted successfully",
            deletedProduct
        });
    });
};

exports.updateProduct = (req, res) => {
    let form = new formidable({ keepExtensions: true });

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Problem with image"
            });
        }

        // updation code
        let product = req.product;
        product = _.extend(product, fields);

        // handle file here
        if (files.photo) {
            if (files.photo.size > 3000000) {
                return res.status(400).json({
                    error: "Photo size is too big"
                });
            }

            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        // save to the database
        product.save((err, product) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    error: "Updation of a product failed"
                });
            }
            res.json(product);
        });
    });
};

exports.getAllProducts = (req, res) => {

    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([
            [sortBy, "asc"]
        ])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Product not found"
                });
            }
            res.json(products);
        });
};

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if (err) {
            return res.status(400).json({
                error: "No category found"
            });
        }
        res.json(category);
    });
};

exports.updateStock = (req, res, next) => {

    let myOperations = req.body.order.products.map(product => {
        return {
            updateOne: {
                filter: { _id: product._id },
                update: { $inc: { stock: -product.count, sold: +product.count } }
            }
        }
    });

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            return res.status(400).json({
                error: "Bulk operation failed"
            });
        }
        next();
    });
};
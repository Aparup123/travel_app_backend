const isSellerOrAdmin = (req, res, next) => {
    try {
        if (req.userRole == 'seller' || req.userRole == 'admin') {
            next()
        } else {
            return res.status(403).json("You are not permitted")
        }
    }
    catch (err) {
        return res.status(504).json("something went wrong")
    }
}

module.exports=isSellerOrAdmin
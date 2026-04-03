export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      // update review
      alreadyReviewed.rating = rating;
      alreadyReviewed.comment = comment;
    } else {
      // new review
      product.reviews.push({
        user: req.user._id,
        rating,
        comment,
      });
    }

    product.numReviews = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();

    res.json({ success: true, message: "Review added/updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

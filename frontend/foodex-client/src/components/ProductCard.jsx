function ProductCard({ product, addToCart }) {
  return (
    <div className="product-card">
      <img
        src={
          product.imageUrl ||
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
        }
        alt={product.name}
      />

      <div className="product-content">
        <h3>{product.name}</h3>
        <p className="product-category">
          {product.category || "Uncategorized"}
        </p>

        <p>{product.description}</p>

        <div className="product-footer">
          <span>${product.price}</span>

          <button onClick={() => addToCart(product)}>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
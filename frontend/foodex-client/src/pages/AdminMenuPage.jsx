import { useEffect, useState } from "react"
import Spinner from "../components/Spinner"

function AdminMenuPage({
  showToast
}) {
  const [restaurant, setRestaurant] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "cheeseburger.png",
    category: "Burgers"
  })

  const categories = [
    "Burgers",
    "Pizza",
    "Main Dishes",
    "Sides",
    "Desserts",
    "Drinks"
  ]

  const getRestaurant = () => {
    const savedUser = localStorage.getItem("user")

    if (!savedUser) return

    const user = JSON.parse(savedUser)

    fetch(`http://localhost:5115/api/Restaurants/${user.restaurantId}`)
      .then((response) => response.json())
      .then((data) => setRestaurant(data))
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    getRestaurant()
  }, [])

  const handleAddProduct = async () => {
    const response = await fetch("http://localhost:5115/api/Products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: newProduct.name,
        description: newProduct.description || "No description",
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        imageUrl: newProduct.imageUrl || "cheeseburger.png",
        category: newProduct.category,
        restaurantId: restaurant.id
      })
    })

    if (!response.ok) {
      showToast("Product could not be added.", "error")
      return
    }

    showToast("Product added successfully!")

    setNewProduct({
      name: "",
      description: "",
      price: "",
      stock: "",
      imageUrl: "cheeseburger.png",
      category: "Burgers"
    })

    getRestaurant()
  }

  const handleSaveChanges = async () => {
    const response = await fetch(
      `http://localhost:5115/api/Products/${editingProduct.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: editingProduct.name,
          price: Number(editingProduct.price),
          description: editingProduct.description || "No description",
          stock: Number(editingProduct.stock),
          imageUrl: editingProduct.imageUrl || "cheeseburger.png",
          category: editingProduct.category || "Burgers",
          restaurantId: restaurant.id
        })
      }
    )

    if (!response.ok) {
      showToast("Update failed.", "error")
      return
    }

    showToast("Product updated successfully!")

    getRestaurant()
    setEditingProduct(null)
  }

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    )

    if (!confirmDelete) return

    const response = await fetch(
      `http://localhost:5115/api/Products/${productId}`,
      {
        method: "DELETE"
      }
    )

    if (!response.ok) {
      showToast("Product could not be deleted.", "error")
      return
    }

    showToast("Product deleted successfully!")
    getRestaurant()
  }

  if (!restaurant) {
    return <Spinner />
  }
  const groupedProducts = restaurant.products.reduce((groups, product) => {
    const category = product.category || "Other"

    if (!groups[category]) {
      groups[category] = []
    }

    groups[category].push(product)

    return groups
  }, {})

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Menu Panel</h1>
          <p>Manage products for {restaurant.name}.</p>
        </div>
      </div>

      <div className="add-product-card">
        <h2>Add New Product</h2>

        <div className="add-product-form">
          <input
            type="text"
            placeholder="Product name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                name: e.target.value
              })
            }
          />

          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                price: e.target.value
              })
            }
          />

          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                stock: e.target.value
              })
            }
          />

          <select
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                category: e.target.value
              })
            }
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Image URL or image file name"
            value={newProduct.imageUrl}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                imageUrl: e.target.value
              })
            }
          />

          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                description: e.target.value
              })
            }
          />

          <button onClick={handleAddProduct}>
            Add Product
          </button>
        </div>
      </div>

      {Object.entries(groupedProducts).map(([category, products]) => (
        <section className="menu-category-section" key={category}>
          <h3 className="menu-category-title">
            {category}
          </h3>

          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                />

                <div className="product-content">
                  <h3>{product.name}</h3>

                  <p
                    className={
                      product.stock > 0 && product.stock < 10
                        ? "low-stock"
                        : "normal-stock"
                    }
                  >
                    Stock: {product.stock}
                  </p>

                  <div className="product-footer">
                    <span>${product.price}</span>

                    <button onClick={() => setEditingProduct(product)}>
                      Edit
                    </button>

                    <button
                      className="delete-product-button"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {editingProduct && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Edit Product</h2>

            <input
              type="text"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  name: e.target.value
                })
              }
            />

            <input
              type="number"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  price: e.target.value
                })
              }
            />

            <input
              type="number"
              value={editingProduct.stock}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  stock: e.target.value
                })
              }
            />

            <select
              value={editingProduct.category || "Burgers"}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  category: e.target.value
                })
              }
            >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
            </select>

            <input
              type="text"
              value={editingProduct.imageUrl || ""}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  imageUrl: e.target.value
                })
              }
            />

            <div className="edit-actions">
              <button
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>

              <button onClick={handleSaveChanges}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMenuPage
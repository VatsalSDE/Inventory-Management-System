import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Search,
  Edit,
  Trash2,
  Upload,
  Filter,
  Star,
  TrendingUp,
  Package,
  Image as ImageIcon,
  Camera,
  FileText,
} from "lucide-react";
import { productsAPI } from "../services/api";

const Products = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    product_name: "",
    category: "steel",
    no_burners: "2",
    type_burner: "Brass",
    price: "",
    quantity: "",
    min_stock_level: "10",
    image_url: "",
    image_public_id: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Helper function to check if image URL is valid
  const isValidImageUrl = (url) => {
    if (!url) return false;
    if (url.startsWith('blob:')) return false;
    if (url.startsWith('data:')) return false;
    return true;
  };

  // Helper function to get display image URL
  const getDisplayImageUrl = (product) => {
    if (isValidImageUrl(product.image_url)) {
      return product.image_url;
    }
    return "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400";
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateProductCode = (name, category, burners, burnerType) => {
    const nameCode = name
      .split(" ")
      .map((word) => word.substring(0, 3))
      .join("")
      .toUpperCase();
    return `${nameCode}-${category.toUpperCase()}-${burners}-${burnerType.toUpperCase()}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    try {
      const result = await productsAPI.uploadImage(file);
      if (result.success) {
        return result.image.url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      product_name: "",
      category: "steel",
      no_burners: "2",
      type_burner: "Brass",
      price: "",
      quantity: "",
      min_stock_level: "10",
      image_url: "",
      image_public_id: "",
    });
    setImageFile(null);
    setImagePreview("");
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.product_name.trim()) {
      errors.product_name = 'Product name is required';
    } else if (formData.product_name.trim().length < 3) {
      errors.product_name = 'Product name must be at least 3 characters';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      errors.quantity = 'Quantity must be 0 or greater';
    }

    if (imageFile && imageFile.size > 5 * 1024 * 1024) { // 5MB limit
      errors.image = 'Image size must be less than 5MB';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setUploading(true);
      setFormErrors({}); // Clear errors on success

      let imageUrl = formData.image_url;

      // Upload image if file is selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        // Store the public_id for future reference
        formData.image_public_id = imageUrl.split('/').pop().split('.')[0];
      }

      const productCode = generateProductCode(
        formData.product_name,
        formData.category,
        formData.no_burners,
        formData.type_burner,
      );

      // Check for duplicate product code
      const existingProduct = products.find(p => p.product_code === productCode);
      if (existingProduct) {
        setFormErrors({
          product_name: `Product code "${productCode}" already exists. Please change the product name, category, or specifications to generate a unique code.`
        });
        setUploading(false);
        return;
      }

      const newProduct = {
        ...formData,
        product_code: productCode,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        min_stock_level: parseInt(formData.min_stock_level),
        image_url: imageUrl,
        image_public_id: formData.image_public_id,
      };

      await productsAPI.create(newProduct);
      await loadProducts();
      resetForm();
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Failed to create product:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      product_name: product.product_name,
      category: product.category,
      no_burners: product.no_burners.toString(),
      type_burner: product.type_burner,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      min_stock_level: (product.min_stock_level || 10).toString(),
      image_url: product.image_url || "",
      image_public_id: product.image_public_id || "",
    });
    setImagePreview(product.image_url || "");
    setImageFile(null);
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);

      let imageUrl = formData.image_url;

      // Upload image if file is selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        // Store the public_id for future reference
        formData.image_public_id = imageUrl.split('/').pop().split('.')[0];
      }

      const productCode = generateProductCode(
        formData.product_name,
        formData.category,
        formData.no_burners,
        formData.type_burner,
      );

      // Check for duplicate product code (excluding current product)
      const existingProduct = products.find(p => p.product_code === productCode && p.product_id !== editingProduct.product_id);
      if (existingProduct) {
        setFormErrors({
          product_name: `Product code "${productCode}" already exists. Please change the product name, category, or specifications to generate a unique code.`
        });
        setUploading(false);
        return;
      }

      const updatedProduct = {
        ...formData,
        product_code: productCode,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        min_stock_level: parseInt(formData.min_stock_level),
        image_url: imageUrl,
        image_public_id: formData.image_public_id,
        old_image_public_id: editingProduct.image_public_id || null,
      };

      await productsAPI.update(editingProduct.product_id, updatedProduct);
      await loadProducts();
      resetForm();
      setShowEditForm(false);
      setEditingProduct(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to update product:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        await loadProducts();
      } catch (err) {
        setError(err.message);
        console.error('Failed to delete product:', err);
      }
    }
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ||
        product.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "quantity":
          return b.quantity - a.quantity;
        case "name":
          return a.product_name.localeCompare(b.product_name);
        default:
          return a.product_name.localeCompare(b.product_name);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadProducts}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Package className="w-8 h-8 text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {products.length}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Products
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage your gas stove inventory with style
            </p>
            <div className="mt-4">
              <button
                onClick={() => window.open('/catalogue.pdf', '_blank')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                <FileText className="w-4 h-4" />
                View PDF Catalogue
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {products.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-gray-800">
                  {products.filter((p) => p.quantity >= (p.min_stock_level || 10)).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">⚠️</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-800">
                  {products.filter((p) => p.quantity < (p.min_stock_level || 10)).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">₹</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                <p className="text-2xl font-bold text-gray-800">
                  ₹
                  {products.length > 0
                    ? (
                      products.reduce((sum, p) => sum + (Number(p.price) || 0), 0) / products.length
                    ).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products, categories, or codes..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-gray-700 placeholder-gray-400 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-4 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-700 text-lg"
            >
              <option value="all">All Categories</option>
              <option value="steel">Steel</option>
              <option value="glass">Glass</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-4 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-700 text-lg"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="quantity">Sort by Quantity</option>
            </select>

            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg font-semibold"
            >
              <Plus className="w-6 h-6" />
              Add Product
            </button>

            <button
              onClick={async () => {
                if (window.confirm('This will clean up old blob URLs and set them to default images. Continue?')) {
                  try {
                    await productsAPI.cleanupBlobUrls();
                    await loadProducts();
                    alert('Cleanup completed! Old blob URLs have been removed.');
                  } catch (error) {
                    alert('Cleanup failed: ' + error.message);
                  }
                }
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg font-semibold"
            >
              <Trash2 className="w-5 h-5" />
              Cleanup Images
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.product_id}
            className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
          >
            {/* Product Image */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={getDisplayImageUrl(product)}
                alt={product.product_name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span
                  className={`px-3 py-1 text-white text-xs font-bold rounded-full shadow-lg ${product.quantity < (product.min_stock_level || 10)
                      ? "bg-gradient-to-r from-red-500 to-red-600"
                      : "bg-gradient-to-r from-green-500 to-green-600"
                    }`}
                >
                  {product.quantity < (product.min_stock_level || 10) ? "⚠️ Low Stock" : "✅ In Stock"}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(product.product_id)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                  {product.product_name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {product.product_code}
                </p>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="font-semibold text-gray-700 capitalize">
                    {product.category}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Burners</p>
                  <p className="font-semibold text-gray-700">
                    {product.no_burners}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Type</p>
                  <p className="font-semibold text-gray-700">
                    {product.type_burner}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Stock</p>
                  <p
                    className={`font-semibold ${product.quantity < (product.min_stock_level || 10) ? "text-red-600" : "text-green-600"}`}
                  >
                    {product.quantity} units
                  </p>
                  <p className="text-xs text-gray-500">Min: {product.min_stock_level || 10}</p>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-emerald-600">
                    ₹{product.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{product.product_code}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-colors shadow-lg transform hover:scale-105 text-sm font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.product_id)}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-colors shadow-lg transform hover:scale-105 text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50">
            <div className="flex items-center justify-between p-8 border-b border-gray-100">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Add New Product
                </h2>
                <p className="text-gray-600 mt-1">
                  Create a new gas stove product
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-lg"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center p-4 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="category"
                      value="steel"
                      checked={formData.category === "steel"}
                      onChange={handleInputChange}
                      className="mr-3 w-5 h-5 text-emerald-500"
                    />
                    <span className="text-lg font-medium">Steel</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="category"
                      value="glass"
                      checked={formData.category === "glass"}
                      onChange={handleInputChange}
                      className="mr-3 w-5 h-5 text-emerald-500"
                    />
                    <span className="text-lg font-medium">Glass</span>
                  </label>
                </div>
              </div>

              {/* Burners and Type */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Number of Burners <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["1", "2", "3", "4"].map((num) => (
                      <label
                        key={num}
                        className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="no_burners"
                          value={num}
                          checked={formData.no_burners === num}
                          onChange={handleInputChange}
                          className="mr-2 w-4 h-4 text-emerald-500"
                        />
                        <span className="font-medium">{num}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Burner Type <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="type_burner"
                        value="Brass"
                        checked={formData.type_burner === "Brass"}
                        onChange={handleInputChange}
                        className="mr-3 w-4 h-4 text-emerald-500"
                      />
                      <span className="font-medium">Brass</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="type_burner"
                        value="Alloy"
                        checked={formData.type_burner === "Alloy"}
                        onChange={handleInputChange}
                        className="mr-3 w-4 h-4 text-emerald-500"
                      />
                      <span className="font-medium">Alloy</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Price and Quantity */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-lg"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-lg"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    name="min_stock_level"
                    value={formData.min_stock_level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-lg"
                    placeholder="10"
                    min="1"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Product Image
                </label>
                <div className="space-y-4">
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-2xl border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setImageFile(null);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-emerald-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="space-y-4">
                        {imagePreview ? (
                          <Camera className="w-12 h-12 text-emerald-500 mx-auto" />
                        ) : (
                          <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                        )}
                        <div>
                          <p className="text-lg font-medium text-gray-700">
                            {imagePreview ? "Change Image" : "Upload Product Image"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {imagePreview ? "Click to select a different image" : "Click to browse or drag and drop"}
                          </p>
                        </div>
                        {!imagePreview && (
                          <p className="text-xs text-gray-400">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Fallback URL Input */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Or use an image URL:</p>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Generated Product Code */}
              {formData.product_name && (
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
                  <label className="block text-lg font-semibold text-emerald-700 mb-2">
                    Generated Product Code
                  </label>
                  <div className="text-2xl font-bold text-emerald-600 font-mono">
                    {generateProductCode(
                      formData.product_name,
                      formData.category,
                      formData.no_burners,
                      formData.type_burner,
                    )}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors text-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-colors shadow-lg text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    "Create Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditForm && editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50">
            <div className="flex items-center justify-between p-8 border-b border-gray-100">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Edit Product
                </h2>
                <p className="text-gray-600 mt-1">
                  Update product information
                </p>
              </div>
              <button
                onClick={() => {
                  setShowEditForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-lg"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center p-4 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="category"
                      value="steel"
                      checked={formData.category === "steel"}
                      onChange={handleInputChange}
                      className="mr-3 w-5 h-5 text-emerald-500"
                    />
                    <span className="text-lg font-medium">Steel</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="category"
                      value="glass"
                      checked={formData.category === "glass"}
                      onChange={handleInputChange}
                      className="mr-3 w-5 h-5 text-emerald-500"
                    />
                    <span className="text-lg font-medium">Glass</span>
                  </label>
                </div>
              </div>

              {/* Burners and Type */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Number of Burners <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["1", "2", "3", "4"].map((num) => (
                      <label
                        key={num}
                        className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="no_burners"
                          value={num}
                          checked={formData.no_burners === num}
                          onChange={handleInputChange}
                          className="mr-2 w-4 h-4 text-emerald-500"
                        />
                        <span className="text-xs font-medium">{num}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Burner Type <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="type_burner"
                        value="Brass"
                        checked={formData.type_burner === "Brass"}
                        onChange={handleInputChange}
                        className="mr-3 w-4 h-4 text-emerald-500"
                      />
                      <span className="font-medium">Brass</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="type_burner"
                        value="Alloy"
                        checked={formData.type_burner === "Alloy"}
                        onChange={handleInputChange}
                        className="mr-3 w-4 h-4 text-emerald-500"
                      />
                      <span className="font-medium">Alloy</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Price and Quantity */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-lg"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-lg"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    name="min_stock_level"
                    value={formData.min_stock_level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-lg"
                    placeholder="10"
                    min="1"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Product Image
                </label>
                <div className="space-y-4">
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-2xl border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setImageFile(null);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload-edit"
                    />
                    <label htmlFor="image-upload-edit" className="cursor-pointer">
                      <div className="space-y-4">
                        {imagePreview ? (
                          <Camera className="w-12 h-12 text-blue-500 mx-auto" />
                        ) : (
                          <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                        )}
                        <div>
                          <p className="text-lg font-medium text-gray-700">
                            {imagePreview ? "Change Image" : "Upload Product Image"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {imagePreview ? "Click to select a different image" : "Click to browse or drag and drop"}
                          </p>
                        </div>
                        {!imagePreview && (
                          <p className="text-xs text-gray-400">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Fallback URL Input */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Or use an image URL:</p>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Generated Product Code */}
              {formData.product_name && (
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                  <label className="block text-lg font-semibold text-blue-700 mb-2">
                    Generated Product Code
                  </label>
                  <div className="text-2xl font-bold text-blue-600 font-mono">
                    {generateProductCode(
                      formData.product_name,
                      formData.category,
                      formData.no_burners,
                      formData.type_burner,
                    )}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors text-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-colors shadow-lg text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    "Update Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
import React, { useState } from "react";
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
} from "lucide-react";

const Products = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium Gas Stove Deluxe",
      category: "Steel",
      burners: 4,
      burnerType: "Brass",
      price: 15000,
      quantity: 25,
      productCode: "PGS-STEEL-4-BRASS",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
      description:
        "High-quality 4 burner steel gas stove with brass burners. Perfect for large families with premium finish and durability.",
      rating: 4.8,
      sales: 145,
      featured: true,
    },
    {
      id: 2,
      name: "Compact Glass Top Stove",
      category: "Glass",
      burners: 2,
      burnerType: "Alloy",
      price: 8500,
      quantity: 45,
      productCode: "CGS-GLASS-2-ALLOY",
      image:
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400",
      description:
        "Space-saving 2 burner glass top gas stove with alloy burners. Modern design for contemporary kitchens.",
      rating: 4.5,
      sales: 98,
      featured: false,
    },
    {
      id: 3,
      name: "Professional Chef Series",
      category: "Steel",
      burners: 3,
      burnerType: "Brass",
      price: 12000,
      quantity: 8,
      productCode: "PCS-STEEL-3-BRASS",
      image: "https://images.unsplash.com/photo-1556909019-f2c9d2d0c1bb?w=400",
      description:
        "Professional grade 3 burner stove designed for heavy-duty cooking with superior heat distribution.",
      rating: 4.9,
      sales: 76,
      featured: true,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    category: "Steel",
    burners: "2",
    burnerType: "Brass",
    price: "",
    quantity: "",
    image: "",
    description: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const productCode = generateProductCode(
      formData.name,
      formData.category,
      formData.burners,
      formData.burnerType,
    );

    const newProduct = {
      id: products.length + 1,
      ...formData,
      productCode,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      image:
        formData.image ||
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
      rating: 0,
      sales: 0,
      featured: false,
    };

    setProducts([...products, newProduct]);
    setFormData({
      name: "",
      category: "Steel",
      burners: "2",
      burnerType: "Brass",
      price: "",
      quantity: "",
      image: "",
      description: "",
    });
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ||
        product.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "rating":
          return b.rating - a.rating;
        case "sales":
          return b.sales - a.sales;
        default:
          return a.name.localeCompare(b.name);
      }
    });

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
                  {products.filter((p) => p.quantity > 10).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-gray-800">
                  {products.filter((p) => p.featured).length}
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
                  {Math.round(
                    products.reduce((sum, p) => sum + p.price, 0) /
                      products.length,
                  ).toLocaleString()}
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
              <option value="rating">Sort by Rating</option>
              <option value="sales">Sort by Sales</option>
            </select>

            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg font-semibold"
            >
              <Plus className="w-6 h-6" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
          >
            {/* Product Image */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {product.featured && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg">
                    ⭐ Featured
                  </span>
                )}
                <span
                  className={`px-3 py-1 text-white text-xs font-bold rounded-full shadow-lg ${
                    product.quantity < 10
                      ? "bg-gradient-to-r from-red-500 to-red-600"
                      : "bg-gradient-to-r from-green-500 to-green-600"
                  }`}
                >
                  {product.quantity < 10 ? "⚠️ Low Stock" : "✅ In Stock"}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Rating */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold text-gray-700">
                  {product.rating}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="font-semibold text-gray-700">
                    {product.category}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Burners</p>
                  <p className="font-semibold text-gray-700">
                    {product.burners}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Type</p>
                  <p className="font-semibold text-gray-700">
                    {product.burnerType}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Stock</p>
                  <p
                    className={`font-semibold ${product.quantity < 10 ? "text-red-600" : "text-green-600"}`}
                  >
                    {product.quantity} units
                  </p>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-emerald-600">
                    ₹{product.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{product.productCode}</p>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-colors shadow-lg transform hover:scale-105 text-sm font-semibold">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
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

      {/* Add Product Modal - Enhanced */}
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
                onClick={() => setShowAddForm(false)}
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
                  name="name"
                  value={formData.name}
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
                      value="Steel"
                      checked={formData.category === "Steel"}
                      onChange={handleInputChange}
                      className="mr-3 w-5 h-5 text-emerald-500"
                    />
                    <span className="text-lg font-medium">Steel</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="category"
                      value="Glass"
                      checked={formData.category === "Glass"}
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
                          name="burners"
                          value={num}
                          checked={formData.burners === num}
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
                        name="burnerType"
                        value="Brass"
                        checked={formData.burnerType === "Brass"}
                        onChange={handleInputChange}
                        className="mr-3 w-4 h-4 text-emerald-500"
                      />
                      <span className="font-medium">Brass</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="burnerType"
                        value="Alloy"
                        checked={formData.burnerType === "Alloy"}
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
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-lg"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-lg resize-none"
                  placeholder="Enter product description..."
                />
              </div>

              {/* Generated Product Code */}
              {formData.name && (
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
                  <label className="block text-lg font-semibold text-emerald-700 mb-2">
                    Generated Product Code
                  </label>
                  <div className="text-2xl font-bold text-emerald-600 font-mono">
                    {generateProductCode(
                      formData.name,
                      formData.category,
                      formData.burners,
                      formData.burnerType,
                    )}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors text-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-colors shadow-lg text-lg font-semibold"
                >
                  Create Product
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

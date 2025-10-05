import { useEffect, useState } from "react";
import { ShoppingCart, Search, Package, Trash2, Plus, Minus, Loader } from "lucide-react";

const ProductCatalog = () => {
const [products, setProducts] = useState([]);

useEffect(() => {
  fetch("https://kapil-thakur-24bcs80042-shoppings.onrender.com/api/products")
    .then(res => res.json())
    .then(data => setProducts(data))
    .catch(err => console.error(err));
}, []);

  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  const filteredProducts = products.filter((p) => {
    return (
      (category === "All" || p.category === category) &&
      (!search || p.name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const addToCart = (product, variant) => {
    const existingIndex = cart.findIndex(
      item => item._id === product._id && 
      item.variant.colorName === variant.colorName && 
      item.variant.size === variant.size
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { ...product, variant, quantity: 1 }]);
    }
  };

  const updateQuantity = (index, change) => {
    const updated = [...cart];
    updated[index].quantity += change;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }
    setCart(updated);
  };

  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const handleImageLoad = (id) => {
    setImageLoadingStates(prev => ({ ...prev, [id]: true }));
  };

  const handleImageError = (id) => {
    setImageLoadingStates(prev => ({ ...prev, [id]: false }));
  };

  const categories = ["All", "Electronics", "Clothing", "Footwear"];
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <Package size={32} color="#6366f1" />
            <div>
              <h1 style={styles.logoText}>CU Shop</h1>
              <p style={styles.developerInfo}>By Kapil Thakur | UID: 24BCS80042</p>
            </div>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.guidanceInfo}>
              <p style={styles.guidanceText}>Section: 625 | Group: A</p>
              <p style={styles.guidanceText}>Guide: Mayank Sharma</p>
            </div>
            <button 
              style={styles.cartButton}
              onClick={() => setShowCart(!showCart)}
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <div style={styles.container}>
 

        {/* Filters */}
        <div style={styles.filters}>
          <div style={styles.searchWrapper}>
            <Search size={20} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.categoryButtons}>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  ...styles.categoryButton,
                  ...(category === c ? styles.categoryButtonActive : {})
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <div key={product._id} style={styles.productCard}>
              <div style={styles.imageWrapper}>
                {!imageLoadingStates[product._id] && (
                  <div style={styles.imageLoader}>
                    <Loader size={40} color="#667eea" style={styles.spinningLoader} />
                  </div>
                )}
                <img 
                  src={product.imageURL} 
                  alt={product.name} 
                  style={{
                    ...styles.productImage,
                    opacity: imageLoadingStates[product._id] ? 1 : 0
                  }}
                  onLoad={() => handleImageLoad(product._id)}
                  onError={() => handleImageError(product._id)}
                />
                <div style={styles.categoryBadge}>{product.category}</div>
              </div>
              <div style={styles.productInfo}>
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.productPrice}>₹{product.price.toLocaleString()}</p>
                
                <div style={styles.variants}>
                  {product.variants.map((v, i) => (
                    <div key={i} style={styles.variantCard}>
                      <div style={styles.variantInfo}>
                        <span
                          style={{
                            ...styles.colorCircle,
                            backgroundColor: v.color,
                            border: v.color === '#FFFFFF' ? '2px solid #e5e7eb' : 'none'
                          }}
                        />
                        <span style={styles.variantText}>
                          {v.colorName} • {v.size}
                        </span>
                        <span style={styles.stockBadge}>
                          {v.stock} left
                        </span>
                      </div>
                      <button 
                        onClick={() => addToCart(product, v)}
                        style={styles.addButton}
                        disabled={v.stock === 0}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <>
            <div style={styles.overlay} onClick={() => setShowCart(false)} />
            <div style={styles.cartSidebar}>
              <div style={styles.cartHeader}>
                <h2 style={styles.cartTitle}>Shopping Cart</h2>
                <button onClick={() => setShowCart(false)} style={styles.closeButton}>×</button>
              </div>
              
              <div style={styles.cartItems}>
                {cart.length === 0 ? (
                  <div style={styles.emptyCart}>
                    <ShoppingCart size={64} color="#9ca3af" />
                    <p style={styles.emptyCartText}>Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    {cart.map((item, i) => (
                      <div key={i} style={styles.cartItem}>
                        <div style={styles.cartImageWrapper}>
                          {!imageLoadingStates[`cart-${item._id}-${i}`] && (
                            <div style={styles.cartImageLoader}>
                              <Loader size={20} color="#667eea" style={styles.spinningLoader} />
                            </div>
                          )}
                          <img 
                            src={item.imageURL} 
                            alt={item.name} 
                            style={{
                              ...styles.cartItemImage,
                              opacity: imageLoadingStates[`cart-${item._id}-${i}`] ? 1 : 0
                            }}
                            onLoad={() => handleImageLoad(`cart-${item._id}-${i}`)}
                            onError={() => handleImageError(`cart-${item._id}-${i}`)}
                          />
                        </div>
                        <div style={styles.cartItemInfo}>
                          <h4 style={styles.cartItemName}>{item.name}</h4>
                          <p style={styles.cartItemVariant}>
                            {item.variant.colorName} • {item.variant.size}
                          </p>
                          <p style={styles.cartItemPrice}>₹{item.price.toLocaleString()}</p>
                        </div>
                        <div style={styles.cartItemActions}>
                          <div style={styles.quantityControl}>
                            <button 
                              onClick={() => updateQuantity(i, -1)}
                              style={styles.quantityButton}
                            >
                              <Minus size={14} />
                            </button>
                            <span style={styles.quantity}>{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(i, 1)}
                              style={styles.quantityButton}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(i)}
                            style={styles.removeButton}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
              
              {cart.length > 0 && (
                <div style={styles.cartFooter}>
                  <div style={styles.totalRow}>
                    <span style={styles.totalLabel}>Total</span>
                    <span style={styles.totalAmount}>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <button style={styles.checkoutButton}>Proceed to Checkout</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
    lineHeight: 1.2,
  },
  developerInfo: {
    fontSize: '11px',
    color: '#6b7280',
    margin: '2px 0 0 0',
    fontWeight: '500',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  guidanceInfo: {
    textAlign: 'right',
  },
  guidanceText: {
    fontSize: '11px',
    color: '#6b7280',
    margin: '2px 0',
    fontWeight: '500',
  },
  cartButton: {
    position: 'relative',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 16px',
    cursor: 'pointer',
    color: 'white',
    transition: 'transform 0.2s',
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#ef4444',
    color: 'white',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 30px',
  },
  hero: {
    textAlign: 'center',
    marginBottom: '50px',
    color: 'white',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '12px',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  heroSubtitle: {
    fontSize: '20px',
    opacity: 0.9,
  },
  filters: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '40px',
  },
  searchWrapper: {
    position: 'relative',
    maxWidth: '600px',
    margin: '0 auto',
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
  },
  searchInput: {
    width: '100%',
    padding: '16px 20px 16px 50px',
    borderRadius: '16px',
    border: 'none',
    fontSize: '16px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  categoryButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  categoryButton: {
    padding: '12px 28px',
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  categoryButtonActive: {
    background: 'white',
    color: '#667eea',
    transform: 'scale(1.05)',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '20px',
  },
  productCard: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  imageWrapper: {
    position: 'relative',
    overflow: 'hidden',
    paddingTop: '100%',
    background: '#f3f4f6',
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f3f4f6',
    zIndex: 1,
  },
  spinningLoader: {
    animation: 'spin 1s linear infinite',
  },
  productImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s, opacity 0.3s',
  },
  categoryBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#667eea',
  },
  productInfo: {
    padding: '16px',
  },
  productName: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#1f2937',
  },
  productPrice: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: '12px',
  },
  variants: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  variantCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 10px',
    background: '#f9fafb',
    borderRadius: '10px',
    transition: 'background 0.2s',
  },
  variantInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
  },
  colorCircle: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  variantText: {
    fontSize: '13px',
    color: '#4b5563',
    fontWeight: '500',
  },
  stockBadge: {
    fontSize: '11px',
    color: '#10b981',
    fontWeight: '600',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  addButton: {
    padding: '6px 10px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    fontSize: '13px',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 200,
  },
  cartSidebar: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '450px',
    maxWidth: '90vw',
    height: '100vh',
    background: 'white',
    zIndex: 201,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
  },
  cartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
  },
  cartTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '32px',
    cursor: 'pointer',
    color: '#6b7280',
    padding: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartItems: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
  },
  emptyCart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '16px',
  },
  emptyCartText: {
    color: '#9ca3af',
    fontSize: '18px',
  },
  cartItem: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    background: '#f9fafb',
    borderRadius: '12px',
    marginBottom: '16px',
  },
  cartImageWrapper: {
    position: 'relative',
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    overflow: 'hidden',
    background: '#f3f4f6',
  },
  cartImageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f3f4f6',
  },
  cartItemImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.3s',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 4px 0',
  },
  cartItemVariant: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0 0 8px 0',
  },
  cartItemPrice: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#667eea',
    margin: 0,
  },
  cartItemActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-end',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'white',
    borderRadius: '8px',
    padding: '4px',
  },
  quantityButton: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: 'none',
    background: '#f3f4f6',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4b5563',
  },
  quantity: {
    fontSize: '14px',
    fontWeight: '600',
    minWidth: '24px',
    textAlign: 'center',
  },
  removeButton: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    padding: '4px',
  },
  cartFooter: {
    padding: '24px',
    borderTop: '1px solid #e5e7eb',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  totalLabel: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
  },
  totalAmount: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#667eea',
  },
  checkoutButton: {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  developerInfo: {
    fontSize: '13px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '2px 0 0 0',
    fontWeight: '600',
    animation: 'shimmer 2s infinite',
  },
  guidanceInfo: {
    fontSize: '15px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '2px 0 0 0',
    fontWeight: '600',
    animation: 'shimmer 2s infinite',
  },
};

// Add keyframe animation in a style tag
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default ProductCatalog;
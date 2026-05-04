import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://umezcsuxoqaurmopnzkx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtZXpjc3V4b3FhdXJtb3Buemt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MzAyNTcsImV4cCI6MjA5MzQwNjI1N30.S9din8GcWUeLfEC4dLtowwVR4wDHiZjflcsOOGKkJ_s"
);

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    checkUser();
    fetchProducts();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }

  async function login() {
    await supabase.auth.signInWithOtp({ email });
    alert("Check your email");
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*");
    setProducts(data || []);
  }

  function addToCart(p) {
    setCart([...cart, p]);
    setCartOpen(true);
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = cart.reduce((s, i) => s + i.price, 0);

  // LOGIN
  if (!user) {
    return (
      <div style={styles.center}>
        <div style={styles.loginBox}>
          <h1 style={styles.logo}>DRAPE</h1>
          <input
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <button onClick={login} style={styles.button}>
            CONTINUE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Helvetica Neue, sans-serif" }}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logo}>DRAPE</div>

        <div style={styles.nav}>
          <span onClick={() => setSearchOpen(true)}>SEARCH</span>
          <span onClick={() => setCartOpen(true)}>CART ({cart.length})</span>
          <span onClick={logout}>LOGOUT</span>
        </div>
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroText}>
          NEW COLLECTION
        </div>
      </div>

      {/* PRODUCTS */}
      <div style={styles.grid}>
        {filtered.map((p) => (
          <div key={p.id} style={styles.card}>
            <img src={p.image} style={styles.image} />
            <div style={styles.cardInfo}>
              <p style={styles.name}>{p.name}</p>
              <p style={styles.price}>₹ {p.price}</p>
            </div>
            <button onClick={() => addToCart(p)} style={styles.add}>
              ADD
            </button>
          </div>
        ))}
      </div>

      {/* SEARCH */}
      {searchOpen && (
        <div style={styles.searchOverlay}>
          <input
            autoFocus
            placeholder="SEARCH"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button onClick={() => setSearchOpen(false)}>CLOSE</button>
        </div>
      )}

      {/* CART */}
      <div style={{
        ...styles.cart,
        right: cartOpen ? 0 : "-350px"
      }}>
        <h2>CART</h2>

        {cart.map((i, idx) => (
          <div key={idx} style={styles.cartItem}>
            <p>{i.name}</p>
            <p>₹ {i.price}</p>
          </div>
        ))}

        <h3>Total: ₹ {total}</h3>

        <button style={styles.checkout}>CHECKOUT</button>
        <button onClick={() => setCartOpen(false)}>CLOSE</button>
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  center: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  loginBox: {
    width: 300
  },

  logo: {
    letterSpacing: 8,
    fontWeight: 500,
    marginBottom: 30
  },

  input: {
    width: "100%",
    padding: 12,
    border: "1px solid #ccc",
    marginBottom: 10
  },

  button: {
    width: "100%",
    padding: 12,
    background: "black",
    color: "white",
    border: "none"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 40px",
    position: "fixed",
    width: "100%",
    background: "white",
    zIndex: 10
  },

  nav: {
    display: "flex",
    gap: 20,
    fontSize: 12,
    letterSpacing: 2
  },

  hero: {
    height: "100vh",
    background:
      "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d') center/cover",
    display: "flex",
    alignItems: "flex-end"
  },

  heroText: {
    color: "white",
    fontSize: 40,
    padding: 40,
    letterSpacing: 4
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: 20,
    padding: 20,
    marginTop: "100vh"
  },

  card: {
    position: "relative"
  },

  image: {
    width: "100%",
    height: 350,
    objectFit: "cover"
  },

  cardInfo: {
    marginTop: 10
  },

  name: {
    fontSize: 14
  },

  price: {
    fontSize: 13,
    color: "#555"
  },

  add: {
    position: "absolute",
    bottom: 10,
    right: 10,
    background: "white",
    border: "1px solid black",
    padding: "5px 10px"
  },

  searchOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "white",
    padding: 40
  },

  searchInput: {
    width: "100%",
    fontSize: 30,
    padding: 10,
    border: "none",
    borderBottom: "1px solid black"
  },

  cart: {
    position: "fixed",
    top: 0,
    width: 350,
    height: "100%",
    background: "white",
    padding: 20,
    transition: "0.3s"
  },

  cartItem: {
    display: "flex",
    justifyContent: "space-between"
  },

  checkout: {
    width: "100%",
    padding: 12,
    background: "black",
    color: "white",
    marginTop: 10
  }
};
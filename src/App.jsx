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
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

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
    alert("Check your email for login link");
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

  const total = cart.reduce((sum, i) => sum + i.price, 0);

  // 🔐 LOGIN PAGE
  if (!user) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter"
      }}>
        <h1 style={{
          fontFamily: "Playfair Display",
          letterSpacing: 6
        }}>
          DRAPE
        </h1>

        <input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: 10,
            width: 250,
            marginTop: 20
          }}
        />

        <button
          onClick={login}
          style={{
            marginTop: 15,
            padding: 10,
            width: 250,
            background: "black",
            color: "white"
          }}
        >
          Continue
        </button>
      </div>
    );
  }

  // 🏬 MAIN STORE
  return (
    <div style={{ fontFamily: "Inter", background: "#fff" }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 30px",
        borderBottom: "1px solid #eee"
      }}>
        <div style={{
          fontFamily: "Playfair Display",
          letterSpacing: 6
        }}>
          DRAPE
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          <span onClick={() => setShowSearch(!showSearch)}>🔍</span>
          <span onClick={() => setCartOpen(true)}>🛒 ({cart.length})</span>
          <span onClick={logout}>Logout</span>
        </div>
      </div>

      {/* SEARCH */}
      {showSearch && (
        <div style={{ padding: 10 }}>
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
      )}

      {/* HERO */}
      <div style={{
        height: "60vh",
        backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d')",
        backgroundSize: "cover",
        display: "flex",
        alignItems: "flex-end",
        padding: 20,
        color: "white",
        fontSize: 30,
        fontFamily: "Playfair Display"
      }}>
        MODERN MINIMAL WEAR
      </div>

      {/* PRODUCTS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        gap: 10,
        padding: 10
      }}>
        {filtered.map((p) => (
          <div key={p.id}>
            <img src={p.image} style={{
              width: "100%",
              height: 250,
              objectFit: "cover"
            }} />

            <p>{p.name}</p>
            <p>₹{p.price}</p>

            <button onClick={() => addToCart(p)}>
              Add
            </button>
          </div>
        ))}
      </div>

      {/* CART */}
      <div style={{
        position: "fixed",
        right: cartOpen ? 0 : "-300px",
        top: 0,
        width: 300,
        height: "100%",
        background: "white",
        padding: 20,
        transition: "0.3s"
      }}>
        <h2>Cart</h2>

        {cart.map((i, idx) => (
          <p key={idx}>{i.name}</p>
        ))}

        <h3>Total: ₹{total}</h3>

        <button onClick={() => setCartOpen(false)}>
          Close
        </button>
      </div>
    </div>
  );
}
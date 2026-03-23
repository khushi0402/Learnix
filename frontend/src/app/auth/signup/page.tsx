"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./signup.module.css";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSignup = async () => {
    if (!name || !phone || !email || !password) {
      setMessage("⚠️ Please fill all fields");
      setShowPopup(true);
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
          },
        },
      });

      if (error) {
        setMessage(`❌ ${error.message}`);
      } else {
        setMessage("✅ Account created successfully!");

        // clear fields
        setName("");
        setPhone("");
        setEmail("");
        setPassword("");

        // 🔥 auto redirect to login
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      }

    } catch (err) {
      setMessage("Something went wrong ❌");
    } finally {
      setLoading(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        <h1 className={styles.heading}>
          Create <span className={styles.highlight}>Account 🚀</span>
        </h1>

        <p className={styles.subtext}>
          Start your journey with Learnix
        </p>

        <input
          type="text"
          placeholder="Full Name"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className={styles.input}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link href="/auth/login" className={styles.link}>
            Login
          </Link>
        </p>
      </div>

      {showPopup && <div className={styles.popup}>{message}</div>}
    </div>
  );
}
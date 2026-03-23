"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("⚠️ Fill all fields");
      setShowPopup(true);
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(`❌ ${error.message}`);
      } else {
        setMessage("✅ Login successful!");

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }

    } catch (err) {
      setMessage("Something went wrong ❌");
    } finally {
      setLoading(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("⚠️ Enter email first");
      setShowPopup(true);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage("📩 Password reset link sent!");
    }

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        <h1 className={styles.heading}>Welcome Back 👋</h1>

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

        <p onClick={handleForgotPassword} className={styles.forgot}>
          Forgot Password?
        </p>

        <button
          onClick={handleLogin}
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className={styles.footer}>
          Don’t have an account?{" "}
          <Link href="/auth/signup" className={styles.link}>
            Sign Up
          </Link>
        </p>
      </div>

      {showPopup && <div className={styles.popup}>{message}</div>}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";

import { db, auth } from "./firebase";
import { signOut } from "firebase/auth";

import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc
} from "firebase/firestore";

const SESSION_KEY = "fmsCurrentUser";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
    } catch {
      return null;
    }
  });

  const [page, setPage] = useState("login");
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  // Get feedback only for verified admin sessions
  useEffect(() => {
    if (!user || user.role !== "admin") {
      setFeedbacks([]);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "feedbacks"),
      (snapshot) => {
        const allFeedbacks = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }));

        setFeedbacks(allFeedbacks);
      },
      (error) => {
        console.error("Firebase error:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  function saveLogin(account) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(account));
    setUser(account);
    setMessage("");
  }

  function login(account) {
    saveLogin(account);
  }

  function signup(name, email) {
    saveLogin({
      name,
      email,
      role: "user"
    });
  }

  // Verify admin using Firestore UID document
  async function adminLogin(firebaseUser) {
    try {
      const adminRef = doc(db, "admins", firebaseUser.uid);
      const adminDoc = await getDoc(adminRef);

      if (adminDoc.exists() && adminDoc.data().role === "admin") {
        saveLogin({
          name: "Admin",
          email: firebaseUser.email,
          role: "admin"
        });
      } else {
        await signOut(auth);
        setMessage("You are not authorized as an admin.");
      }
    } catch (error) {
      await signOut(auth);
      setMessage("Admin verification failed.");
      console.error(error);
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setFeedbacks([]);
    setPage("login");
    setMessage("You have logged out.");
  }

  // Save feedback in Firestore
  async function addFeedback(feedback) {
    try {
      await addDoc(collection(db, "feedbacks"), {
        ...feedback,
        status: "New",
        createdAt: serverTimestamp()
      });

      console.log("Feedback saved successfully!");
      return true;
    } catch (error) {
      console.error("Error saving feedback:", error);
      return false;
    }
  }

  if (!user) {
    if (page === "signup") {
      return (
        <Signup
          onSignup={signup}
          onShowLogin={() => {
            setPage("login");
            setMessage("");
          }}
          message={message}
        />
      );
    }

    return (
      <Login
        onLogin={login}
        onAdminLogin={adminLogin}
        onShowSignup={() => {
          setPage("signup");
          setMessage("");
        }}
        message={message}
      />
    );
  }

  if (user.role === "admin") {
    return (
      <AdminDashboard
        user={user}
        feedbacks={feedbacks}
        onLogout={logout}
      />
    );
  }

  return (
    <UserDashboard
      user={user}
      onLogout={logout}
      onSubmitFeedback={addFeedback}
    />
  );
}

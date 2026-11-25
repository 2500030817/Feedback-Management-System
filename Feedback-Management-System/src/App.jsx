
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
  getDoc,
  query,
  where
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
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Admin feedback listener
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
      (error) => console.error("Feedback error:", error)
    );

    return () => unsubscribe();
  }, [user]);

  // User orders and bookings listener
  useEffect(() => {
    if (!user || user.role !== "user") {
      setOrders([]);
      setBookings([]);
      return;
    }

    const orderQuery = query(
      collection(db, "orders"),
      where("userEmail", "==", user.email)
    );

    const bookingQuery = query(
      collection(db, "bookings"),
      where("userEmail", "==", user.email)
    );

    const unsubscribeOrders = onSnapshot(
      orderQuery,
      (snapshot) => {
        setOrders(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
        );
      },
      (error) => console.error("Orders error:", error)
    );

    const unsubscribeBookings = onSnapshot(
      bookingQuery,
      (snapshot) => {
        setBookings(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
        );
      },
      (error) => console.error("Bookings error:", error)
    );

    return () => {
      unsubscribeOrders();
      unsubscribeBookings();
    };
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

  // Admin verification
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

  // Logout
  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setFeedbacks([]);
    setOrders([]);
    setBookings([]);
    setPage("login");
    setMessage("You have logged out.");
  }

  // Save feedback
  async function addFeedback(feedback) {
    try {
      await addDoc(collection(db, "feedbacks"), {
        ...feedback,
        userEmail: user.email,
        status: "New",
        createdAt: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error("Feedback error:", error);
      return false;
    }
  }

  // Place product order
  async function placeOrder(cart, total) {
    try {
      await addDoc(collection(db, "orders"), {
        userEmail: user.email,
        userName: user.name,
        items: cart,
        total: total,
        status: "Confirmed",
        createdAt: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error("Order error:", error);
      return false;
    }
  }

  // Book service
  async function bookService(service) {
    try {
      await addDoc(collection(db, "bookings"), {
        userEmail: user.email,
        userName: user.name,
        serviceId: service.id,
        name: service.name,
        price: service.price,
        bookingDate: service.bookingDate,
        status: "Booked",
        createdAt: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error("Booking error:", error);
      return false;
    }
  }

  // Login and signup pages
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

  // Admin dashboard
  if (user.role === "admin") {
    return (
      <AdminDashboard
        user={user}
        feedbacks={feedbacks}
        onLogout={logout}
      />
    );
  }

  // User dashboard
  return (
    <UserDashboard
      user={user}
      onLogout={logout}
      onSubmitFeedback={addFeedback}
      onPlaceOrder={placeOrder}
      onBookService={bookService}
      orders={orders}
      bookings={bookings}
    />
  );
}
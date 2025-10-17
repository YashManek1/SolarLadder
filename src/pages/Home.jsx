import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import "../styles/Home.css";

function Home() {
  const [loading, setLoading] = useState(false);
  const [canvasList, setCanvasList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCanvases = async () => {
      const canvasCollection = collection(db, "canvas");
      const querySnapshot = await getDocs(canvasCollection);
      const canvases = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCanvasList(canvases);
    };

    fetchCanvases();
  }, []);

  const handleCreateNewCanvas = async () => {
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, "canvas"), {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        canvasData: null,
        name: "Untitled Canvas",
      });
      navigate(`/canvas/${docRef.id}`);
    } catch (error) {
      console.log(error);
      alert("Error creating new canvas. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="hero-section">
          <h1 className="hero-title">Canvas Editor</h1>
          <p className="subtitle">Create and edit your canvases with ease.</p>
          <button
            className="create-button"
            onClick={handleCreateNewCanvas}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create New Canvas"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;

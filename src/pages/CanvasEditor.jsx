import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import CanvasArea from "../components/CanvasArea";
import Toolbar from "../components/Toolbar";
import "../styles/CanvasEditor.css";

function CanvasEditor() {
  const { canvasId } = useParams();
  const navigate = useNavigate();
  const [canvasData, setCanvasData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canvas, setCanvas] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedTool, setSelectedTool] = useState("select");
  const [selectedObject, setSelectedObject] = useState(null);
  const [key, setKey] = useState(Date.now());
  useEffect(() => {
    const loadCanvas = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "canvas", canvasId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTimeout(() => {
            setCanvasData(data.canvasData);
            setLoading(false);
          }, 200);
        } else {
          alert("Canvas not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Error loading canvas:", error);
        alert("Error loading canvas. Please try again.");
        setLoading(false);
      }
    };

    loadCanvas();
  }, [canvasId, navigate]);

  const handleSave = async () => {
    if (!canvas) return;
    try {
      setSaving(true);
      const json = canvas.toJSON();
      const docRef = doc(db, "canvas", canvasId);
      await updateDoc(docRef, {
        canvasData: json,
        updatedAt: new Date().toISOString(),
      });
      alert("Canvas saved successfully");
      const saveBtn = document.querySelector(".save-button");
      if (saveBtn) {
        saveBtn.textContent = "Saved";
        setTimeout(() => {
          saveBtn.textContent = "Save";
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving canvas:", error);
      alert("Error saving canvas. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
      });

      const link = document.createElement("a");
      link.download = `canvas-${canvasId}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImportImage = (e) => {
    const file = e.target.files[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (f) => {
        const data = f.target.result;
        window.fabric.Image.fromURL(data, (img) => {
          img.scaleToWidth(300);
          canvas.add(img);
          canvas.requestRenderAll();
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader">
          <p>Loading Canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="canvas-editor">
      <header className="editor-header">
        <div className="header-left">
          <button className="home-button" onClick={() => navigate("/")}>
            Home
          </button>
          <h2>Canvas Editor</h2>
        </div>
        <button className="save-button" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </header>

      <Toolbar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        selectedObject={selectedObject}
        canvas={canvas}
      />

      {/* Use the key to force remount when needed */}
      <CanvasArea
        key={key}
        canvasId={canvasId}
        initialData={canvasData}
        setCanvas={setCanvas}
        selectedTool={selectedTool}
        setSelectedObject={setSelectedObject}
      />
    </div>
  );
}

export default CanvasEditor;

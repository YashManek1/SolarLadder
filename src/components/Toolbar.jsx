import React, { useState, useEffect } from "react";
import { Image as FabricImage } from "fabric";
import "../styles/Toolbar.css";

function Toolbar({ selectedTool, setSelectedTool, canvas, selectedObject }) {
  const [fillColor, setFillColor] = useState("#3498db");
  const [strokeColor, setStrokeColor] = useState("#2c3e50");

  useEffect(() => {
    if (selectedObject) {
      setFillColor(selectedObject.fill || "#3498db");
      setStrokeColor(selectedObject.stroke || "#2c3e50");
    }
  }, [selectedObject]);

  const tools = [
    { id: "select", icon: "↖️", label: "Select" },
    { id: "rectangle", icon: "▭", label: "Rectangle" },
    { id: "circle", icon: "⚪", label: "Circle" },
    { id: "text", icon: "🅰️", label: "Text" },
    { id: "pen", icon: "✏️", label: "Pencil" },
  ];

  const handleColorChange = (type, color) => {
    if (!canvas || !selectedObject) return;

    if (type === "fill") {
      setFillColor(color);
      selectedObject.set("fill", color);
    } else {
      setStrokeColor(color);
      selectedObject.set("stroke", color);
    }

    canvas.renderAll();
  };

  const handleDelete = () => {
    if (!canvas || !selectedObject) return;
    canvas.remove(selectedObject);
    canvas.renderAll();
  };

  const handleExport = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
    });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas.png";
    link.click();
  };

  const handleImportImage = (e) => {
    const file = e.target.files[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgObj = new Image();
      imgObj.src = event.target.result;
      imgObj.onload = () => {
        const imgInstance = new FabricImage(imgObj);
        imgInstance.scaleToWidth(300);
        canvas.add(imgInstance);
        canvas.renderAll();
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="toolbar">
      <div className="tool-section">
        <h3>Tools</h3>
        <div className="tool-buttons">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={`tool-button ${
                selectedTool === tool.id ? "active" : ""
              }`}
              onClick={() => setSelectedTool(tool.id)}
              title={tool.label}
            >
              <span className="tool-icon">{tool.icon}</span>
              <span className="tool-label">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedObject && (
        <div className="tool-section">
          <h3>Properties</h3>
          <div className="property-controls">
            <div className="color-control">
              <label>Fill</label>
              <input
                type="color"
                value={fillColor}
                onChange={(e) => handleColorChange("fill", e.target.value)}
              />
            </div>
            <div className="color-control">
              <label>Stroke</label>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => handleColorChange("stroke", e.target.value)}
              />
            </div>
            <button className="delete-button" onClick={handleDelete}>
              🗑️Delete
            </button>
          </div>
        </div>
      )}

      <div className="tool-section">
        <h3>Actions</h3>
        <div className="action-buttons">
          <button className="action-button" onClick={handleExport}>
            📥 Export PNG
          </button>
          <input
            type="file"
            onChange={handleImportImage}
            accept="image/*"
            style={{ display: "none" }}
            id="imageUpload"
          />
          <label htmlFor="imageUpload" className="action-button">
            📤 Import Image
          </label>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;

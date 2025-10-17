import React, { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Circle, IText, PencilBrush } from "fabric";
import "../styles/CanvasArea.css";

function CanvasArea({
  canvasId,
  initialData,
  setCanvas,
  selectedTool,
  setSelectedObject,
}) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const isDrawingMode = useRef(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    let fabricCanvas = null;
    if (canvasRef.current && !fabricCanvasRef.current) {
      try {
        fabricCanvas = new Canvas(canvasRef.current, {
          width: Math.min(window.innerWidth - 80, 1200),
          height: window.innerHeight - 250,
          backgroundColor: "#ffffff",
          selection: true,
          preserveObjectStacking: true,
        });

        fabricCanvasRef.current = fabricCanvas;
        setCanvas(fabricCanvas);
        setCanvasReady(true);

        fabricCanvas.on("selection:created", (e) => {
          setSelectedObject(e.selected[0]);
        });

        fabricCanvas.on("selection:updated", (e) => {
          setSelectedObject(e.selected[0]);
        });

        fabricCanvas.on("selection:cleared", () => {
          setSelectedObject(null);
        });

        const handleResize = () => {
          fabricCanvas.setDimensions({
            width: Math.min(window.innerWidth - 80, 1200),
            height: window.innerHeight - 250,
          });
          fabricCanvas.renderAll();
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          if (fabricCanvas) {
            try {
              fabricCanvas.dispose();
              fabricCanvasRef.current = null;
              setCanvasReady(false);
              setDataLoaded(false);
            } catch (err) {
              console.error("Error disposing canvas:", err);
            }
          }
        };
      } catch (err) {
        console.error("Error initializing canvas:", err);
      }
    }
  }, [setCanvas, setSelectedObject]);

  useEffect(() => {
    const loadCanvasData = async () => {
      if (
        !canvasReady ||
        !fabricCanvasRef.current ||
        !initialData ||
        dataLoaded
      ) {
        return;
      }

      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const fabricCanvas = fabricCanvasRef.current;
        fabricCanvas.clear();
        fabricCanvas.loadFromJSON(initialData, () => {
          fabricCanvas.requestRenderAll();
          setTimeout(() => {
            fabricCanvas.requestRenderAll();
            const objects = fabricCanvas.getObjects();
            if (objects.length > 0) {
              fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
              setTimeout(() => {
                fabricCanvas.requestRenderAll();
                setDataLoaded(true);
                console.log(
                  "Canvas data loaded successfully with",
                  objects.length,
                  "objects"
                );
              }, 100);
            } else {
              setDataLoaded(true);
            }
          }, 100);
        });
      } catch (err) {
        console.error("Error loading canvas data:", err);
        setDataLoaded(true);
      }
    };

    loadCanvasData();
  }, [canvasReady, initialData, dataLoaded]);

  useEffect(() => {
    if (!canvasReady || !fabricCanvasRef.current) return;

    const fabricCanvas = fabricCanvasRef.current;
    fabricCanvas.off("mouse:down");

    if (selectedTool === "pen") {
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.color = "#2c3e50";
      fabricCanvas.freeDrawingBrush.width = 3;
      isDrawingMode.current = true;
      return;
    } else {
      fabricCanvas.isDrawingMode = false;
      isDrawingMode.current = false;
    }

    if (selectedTool === "select") {
      fabricCanvas.selection = true;
      fabricCanvas.defaultCursor = "default";
      return;
    } else {
      fabricCanvas.selection = false;
    }

    const handleCanvasClick = (e) => {
      if (isDrawingMode.current) return;

      const pointer = fabricCanvas.getPointer(e.e);
      let obj = null;

      switch (selectedTool) {
        case "rectangle":
          obj = new Rect({
            left: pointer.x - 50,
            top: pointer.y - 40,
            width: 100,
            height: 80,
            fill: "#3498db",
            stroke: "#2c3e50",
            strokeWidth: 2,
          });
          break;

        case "circle":
          obj = new Circle({
            left: pointer.x - 50,
            top: pointer.y - 50,
            radius: 50,
            fill: "#e74c3c",
            stroke: "#2c3e50",
            strokeWidth: 2,
          });
          break;

        case "text":
          obj = new IText("Double click to edit", {
            left: pointer.x,
            top: pointer.y,
            fontSize: 24,
            fill: "#2c3e50",
            fontFamily: "Arial",
          });
          break;

        default:
          break;
      }

      if (obj) {
        fabricCanvas.add(obj);
        fabricCanvas.setActiveObject(obj);
        fabricCanvas.requestRenderAll();
        setSelectedObject(obj);
      }
    };

    fabricCanvas.on("mouse:down", handleCanvasClick);

    return () => {
      if (fabricCanvas) {
        fabricCanvas.off("mouse:down", handleCanvasClick);
      }
    };
  }, [canvasReady, selectedTool, setSelectedObject]);

  useEffect(() => {
    if (!canvasReady) return;

    const handleKeyDown = (e) => {
      if (!fabricCanvasRef.current) return;
      const fabricCanvas = fabricCanvasRef.current;

      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObject = fabricCanvas.getActiveObject();
        if (activeObject && activeObject.type !== "i-text") {
          e.preventDefault();
          fabricCanvas.remove(activeObject);
          fabricCanvas.requestRenderAll();
          setSelectedObject(null);
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        const activeObject = fabricCanvas.getActiveObject();
        if (activeObject) {
          activeObject.clone((cloned) => {
            cloned.set({
              left: cloned.left + 20,
              top: cloned.top + 20,
            });
            fabricCanvas.add(cloned);
            fabricCanvas.setActiveObject(cloned);
            fabricCanvas.requestRenderAll();
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvasReady, setSelectedObject]);

  useEffect(() => {
    if (canvasReady && fabricCanvasRef.current) {
      const renderTimer = setTimeout(() => {
        fabricCanvasRef.current.requestRenderAll();
      }, 500);

      return () => clearTimeout(renderTimer);
    }
  }, [canvasReady]);

  const saveToHistory = () => {
    if (fabricCanvasRef.current) {
      const json = fabricCanvasRef.current.toJSON();
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(json);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  useEffect(() => {
    if (canvasReady && fabricCanvasRef.current) {
      fabricCanvasRef.current.on("object:modified", saveToHistory);
      fabricCanvasRef.current.on("object:added", saveToHistory);
      fabricCanvasRef.current.on("object:removed", saveToHistory);
      saveToHistory();
      return () => {
        fabricCanvasRef.current.off("object:modified", saveToHistory);
        fabricCanvasRef.current.off("object:added", saveToHistory);
        fabricCanvasRef.current.off("object:removed", saveToHistory);
      };
    }
  }, [canvasReady, saveToHistory]);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
      {!canvasReady && (
        <div className="canvas-loading">Initializing canvas...</div>
      )}
    </div>
  );
}

export default CanvasArea;

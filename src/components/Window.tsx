import React, { useState, useRef, useEffect } from "react";
import { X, Minus, Square, Maximize2, Minimize2 } from "lucide-react";

interface WindowProps {
  title: string;
  children: React.ReactNode;
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
  defaultSize?: { width: number; height: number };
  isMobile?: boolean;
  defaultPosition?: { x: number; y: number };
}

const Window = ({
  title,
  children,
  isActive,
  onClose,
  onFocus,
  defaultSize = { width: 400, height: 300 }, // Reduced by 200px from original 600x500
  defaultPosition = { x: 100, y: 100 },
}: WindowProps) => {
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [originalState, setOriginalState] = useState({
    position: defaultPosition,
    size: defaultSize,
  });
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  const windowRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
  });
  const resizeRef = useRef({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    direction: "",
  });

  // Update viewport size on window resize
  useEffect(() => {
    const handleResize = () => {
      const newViewportSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      setViewportSize(newViewportSize);

      // Adjust window position and size if it's outside viewport
      setPosition((prev) => ({
        x: Math.min(prev.x, Math.max(0, newViewportSize.width - 200)), // Keep at least 200px visible
        y: Math.min(prev.y, Math.max(0, newViewportSize.height - 100)), // Keep at least 100px visible
      }));

      setSize((prev) => ({
        width: Math.min(prev.width, newViewportSize.width),
        height: Math.min(prev.height, newViewportSize.height - 40),
      }));

      // Update maximized state if needed
      if (isMaximized) {
        setSize({
          width: newViewportSize.width,
          height: newViewportSize.height - 40,
        });
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMaximized]);

  // Initialize responsive size and position
  useEffect(() => {
    const isMobile = viewportSize.width < 768;
    const isTablet = viewportSize.width < 1024;

    if (isMobile) {
      // On mobile, make windows take most of the screen
      const mobileSize = {
        width: Math.min(viewportSize.width - 20, 400),
        height: Math.min(viewportSize.height - 60, 500),
      };
      const mobilePosition = {
        x: (viewportSize.width - mobileSize.width) / 2,
        y: 30,
      };
      setSize(mobileSize);
      setPosition(mobilePosition);
    } else if (isTablet) {
      // On tablet, use moderate sizing
      const tabletSize = {
        width: Math.min(viewportSize.width - 100, defaultSize.width),
        height: Math.min(viewportSize.height - 120, defaultSize.height),
      };
      setSize(tabletSize);
      setPosition((prev) => ({
        x: Math.min(prev.x, viewportSize.width - tabletSize.width),
        y: Math.min(prev.y, viewportSize.height - tabletSize.height),
      }));
    }
  }, [viewportSize.width, viewportSize.height]);

  // Constrain position and size within viewport bounds
  const constrainBounds = (
    newPosition: typeof position,
    newSize: typeof size
  ) => {
    const minVisibleWidth = 200;
    const minVisibleHeight = 100;

    const constrainedPosition = {
      x: Math.max(
        -newSize.width + minVisibleWidth,
        Math.min(newPosition.x, viewportSize.width - minVisibleWidth)
      ),
      y: Math.max(
        0,
        Math.min(newPosition.y, viewportSize.height - minVisibleHeight)
      ),
    };

    const constrainedSize = {
      width: Math.min(newSize.width, viewportSize.width),
      height: Math.min(newSize.height, viewportSize.height - 40),
    };

    return { position: constrainedPosition, size: constrainedSize };
  };

  // Handle window dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) onFocus();
    if (e.target !== e.currentTarget) return;

    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isMaximized) {
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;

      const newPosition = {
        x: dragRef.current.startPosX + deltaX,
        y: dragRef.current.startPosY + deltaY,
      };

      const { position: constrainedPosition } = constrainBounds(
        newPosition,
        size
      );
      setPosition(constrainedPosition);
    }

    if (isResizing) {
      const deltaX = e.clientX - resizeRef.current.startX;
      const deltaY = e.clientY - resizeRef.current.startY;

      let newSize = { ...size };
      let newPosition = { ...position };

      // Responsive minimum size constraints
      const isMobile = viewportSize.width < 768;
      const minWidth = isMobile ? 280 : 300;
      const minHeight = isMobile ? 200 : 200;

      if (resizeRef.current.direction.includes("right")) {
        newSize.width = Math.max(
          minWidth,
          resizeRef.current.startWidth + deltaX
        );
      }
      if (resizeRef.current.direction.includes("bottom")) {
        newSize.height = Math.max(
          minHeight,
          resizeRef.current.startHeight + deltaY
        );
      }
      if (resizeRef.current.direction.includes("left")) {
        const newWidth = Math.max(
          minWidth,
          resizeRef.current.startWidth - deltaX
        );
        if (newWidth > minWidth) {
          newPosition.x = position.x + (size.width - newWidth);
        }
        newSize.width = newWidth;
      }
      if (resizeRef.current.direction.includes("top")) {
        const newHeight = Math.max(
          minHeight,
          resizeRef.current.startHeight - deltaY
        );
        if (newHeight > minHeight) {
          newPosition.y = position.y + (size.height - newHeight);
        }
        newSize.height = newHeight;
      }

      const { position: constrainedPosition, size: constrainedSize } =
        constrainBounds(newPosition, newSize);
      setSize(constrainedSize);
      setPosition(constrainedPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isActive) onFocus();
    if (e.target !== e.currentTarget) return;

    const touch = e.touches[0];
    setIsDragging(true);
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startPosX: position.x,
      startPosY: position.y,
    };
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && !isMaximized) {
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragRef.current.startX;
      const deltaY = touch.clientY - dragRef.current.startY;

      const newPosition = {
        x: dragRef.current.startPosX + deltaX,
        y: dragRef.current.startPosY + deltaY,
      };

      const { position: constrainedPosition } = constrainBounds(
        newPosition,
        size
      );
      setPosition(constrainedPosition);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Handle window resizing
  const startResize = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
      direction,
    };
  };

  // Handle window maximize/restore
  const toggleMaximize = () => {
    if (isMaximized) {
      // Restore to original size and position
      const { position: constrainedPosition, size: constrainedSize } =
        constrainBounds(originalState.position, originalState.size);
      setPosition(constrainedPosition);
      setSize(constrainedSize);
    } else {
      // Save current state and maximize
      setOriginalState({
        position: { ...position },
        size: { ...size },
      });
      setPosition({ x: 0, y: 0 });
      setSize({
        width: viewportSize.width,
        height: viewportSize.height - 40,
      });
    }
    setIsMaximized(!isMaximized);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  // Restore window when clicked from taskbar
  useEffect(() => {
    if (isActive && isMinimized) {
      setIsMinimized(false);
    }
  }, [isActive]);

  // Add/remove global mouse and touch event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, isResizing, position, size, viewportSize]);

  if (isMinimized) return null;

  const isMobile = viewportSize.width < 768;
  const isTablet = viewportSize.width < 1024;

  return (
    <div
      ref={windowRef}
      className={`absolute bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 dark:bg-gray-800/95 backdrop-blur-md rounded-xl border border-white/50 dark:border-gray-700/50 shadow-2xl transition-all duration-200 overflow-hidden select-none ${
        isActive
          ? "z-50 ring-2 ring-pink-300 dark:ring-pink-400"
          : "z-40 opacity-90"
      } ${isMaximized ? "rounded-none" : ""} ${
        isMobile ? "touch-manipulation" : ""
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        transform: isActive ? "scale(1)" : "scale(0.99)",
        minWidth: isMobile ? "280px" : "300px",
        minHeight: "200px",
        maxWidth: "100vw",
        maxHeight: "calc(100vh - 40px)",
      }}
      onClick={onFocus}
    >
      {/* Title Bar */}
      <div
        className={`flex items-center justify-between p-3 border-b border-white/30 dark:border-gray-700/30 cursor-move bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 touch-none ${
          isMaximized ? "rounded-t-none" : "rounded-t-xl"
        } ${isMobile ? "px-2 py-2" : ""}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <h3
          className={`font-semibold text-white dark:text-gray-200 flex items-center gap-2 truncate ${
            isMobile ? "text-sm max-w-[50%]" : "max-w-[60%]"
          }`}
        >
          {title}
        </h3>
        <div className={`flex gap-2 ${isMobile ? "gap-1" : ""}`}>
          {!isMobile && (
            <button
              onClick={handleMinimize}
              className={`rounded-full bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors ${
                isMobile ? "w-5 h-5" : "w-6 h-6"
              }`}
              aria-label="Minimize"
            >
              <Minus
                className={`text-yellow-800 dark:text-yellow-900 ${
                  isMobile ? "w-2 h-2" : "w-3 h-3"
                }`}
              />
            </button>
          )}
          <button
            onClick={toggleMaximize}
            className={`rounded-full bg-green-400 dark:bg-green-500 flex items-center justify-center hover:bg-green-500 dark:hover:bg-green-600 transition-colors ${
              isMobile ? "w-5 h-5" : "w-6 h-6"
            }`}
            aria-label={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <Minimize2
                className={`text-green-800 dark:text-green-900 ${
                  isMobile ? "w-2 h-2" : "w-3 h-3"
                }`}
              />
            ) : (
              <Maximize2
                className={`text-green-800 dark:text-green-900 ${
                  isMobile ? "w-2 h-2" : "w-3 h-3"
                }`}
              />
            )}
          </button>
          <button
            onClick={onClose}
            className={`rounded-full bg-red-400 dark:bg-red-500 flex items-center justify-center hover:bg-red-500 dark:hover:bg-red-600 transition-colors ${
              isMobile ? "w-5 h-5" : "w-6 h-6"
            }`}
            aria-label="Close"
          >
            <X
              className={`text-red-800 dark:text-red-900 ${
                isMobile ? "w-2 h-2" : "w-3 h-3"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className={`overflow-auto ${
          isMobile ? "h-[calc(100%-36px)]" : "h-[calc(100%-42px)]"
        }`}
      >
        {children}
      </div>

      {/* Resize Handles - Hidden on mobile */}
      {!isMaximized && !isMobile && (
        <>
          {/* Right resize handle */}
          <div
            className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize hover:bg-pink-200/50 transition-colors"
            onMouseDown={(e) => startResize(e, "right")}
          />
          {/* Bottom resize handle */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2 cursor-s-resize hover:bg-pink-200/50 transition-colors"
            onMouseDown={(e) => startResize(e, "bottom")}
          />
          {/* Bottom-right resize handle */}
          <div
            className="absolute right-0 bottom-0 w-3 h-3 cursor-se-resize hover:bg-pink-300/70 transition-colors"
            onMouseDown={(e) => startResize(e, "right bottom")}
          />
          {/* Left resize handle */}
          <div
            className="absolute left-0 top-0 bottom-0 w-2 cursor-w-resize hover:bg-pink-200/50 transition-colors"
            onMouseDown={(e) => startResize(e, "left")}
          />
          {/* Top resize handle */}
          <div
            className="absolute top-0 left-0 right-0 h-2 cursor-n-resize hover:bg-pink-200/50 transition-colors"
            onMouseDown={(e) => startResize(e, "top")}
          />
          {/* Top-right resize handle */}
          <div
            className="absolute right-0 top-0 w-3 h-3 cursor-ne-resize hover:bg-pink-300/70 transition-colors"
            onMouseDown={(e) => startResize(e, "right top")}
          />
          {/* Bottom-left resize handle */}
          <div
            className="absolute left-0 bottom-0 w-3 h-3 cursor-sw-resize hover:bg-pink-300/70 transition-colors"
            onMouseDown={(e) => startResize(e, "left bottom")}
          />
          {/* Top-left resize handle */}
          <div
            className="absolute left-0 top-0 w-3 h-3 cursor-nw-resize hover:bg-pink-300/70 transition-colors"
            onMouseDown={(e) => startResize(e, "left top")}
          />
        </>
      )}
    </div>
  );
};

export default Window;
import React, { useState } from 'react'
import {
  Pen,
  Highlighter,
  Eraser,
  Minus,
  Square,
  Circle,
  ArrowRight,
  Type,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Palette as PaletteIcon,
} from 'lucide-react'
import { Button, Tooltip, Slider, Modal } from '../ui'

export function WhiteboardToolbar({
  activeTool,
  setActiveTool,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  onUndo,
  onRedo,
  onClear,
  onExport,
  canUndo,
  canRedo,
}) {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const [isClearModalOpen, setIsClearModalOpen] = useState(false)

  const tools = [
    { id: 'pen', label: 'Pen', icon: Pen },
    { id: 'highlighter', label: 'Highlighter', icon: Highlighter },
    { id: 'eraser', label: 'Eraser', icon: Eraser },
    { id: 'line', label: 'Line', icon: Minus },
    { id: 'rectangle', label: 'Rectangle', icon: Square },
    { id: 'ellipse', label: 'Circle', icon: Circle },
    { id: 'arrow', label: 'Arrow', icon: ArrowRight },
    { id: 'text', label: 'Text', icon: Type },
  ]

  const swatches = [
    '#000000',
    '#007AFF', // System Blue
    '#34C759', // System Green
    '#FF9500', // System Orange
    '#FF3B30', // System Red
    '#AF52DE', // System Purple
    '#5856D6', // System Indigo
    '#8E8E93', // System Gray
    '#FFFFFF', // White
  ]

  return (
    <>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
        <div className="glass-toolbar rounded-pill p-1.5 sm:p-2 flex items-center gap-1 sm:gap-1.5 shadow-floating">
          {/* Tool Buttons */}
          <div className="flex items-center gap-1">
            {tools.map((t) => {
              const Icon = t.icon
              const isSelected = activeTool === t.id
              return (
                <Tooltip key={t.id} content={t.label}>
                  <Button
                    variant={isSelected ? 'tinted' : 'ghost'}
                    size="icon-sm"
                    onClick={() => setActiveTool(t.id)}
                    className={`rounded-full ${isSelected ? 'bg-accent text-white hover:bg-accent-hover' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                </Tooltip>
              )
            })}
          </div>

          <div className="h-5 w-px bg-separator/40 mx-1" />

          {/* Color Well & Popover Trigger */}
          <div className="relative">
            <Tooltip content="Color & Stroke Width">
              <button
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                className="w-7 h-7 rounded-full border border-separator/50 flex items-center justify-center p-0.5 shadow-sm transition-transform active:scale-95"
                style={{ backgroundColor: color }}
              >
                {color === '#FFFFFF' && <span className="w-2 h-2 rounded-full bg-neutral-400" />}
              </button>
            </Tooltip>

            {/* Color & Stroke Popover */}
            {isColorPickerOpen && (
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 glass-panel p-3.5 rounded-card w-56 shadow-floating border border-separator/40 z-50">
                <p className="text-caption-1 font-semibold text-label-secondary mb-2">Palette</p>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {swatches.map((swatch) => (
                    <button
                      key={swatch}
                      onClick={() => {
                        setColor(swatch)
                        setIsColorPickerOpen(false)
                      }}
                      className={`w-7 h-7 rounded-full border transition-transform hover:scale-110 ${
                        color === swatch ? 'ring-2 ring-accent ring-offset-2 scale-105' : 'border-separator/40'
                      }`}
                      style={{ backgroundColor: swatch }}
                    />
                  ))}
                </div>

                <div className="pt-2 border-t border-separator/30">
                  <Slider
                    label="Stroke Width"
                    valueDisplay={`${strokeWidth}px`}
                    min={1}
                    max={24}
                    step={1}
                    value={strokeWidth}
                    onChange={setStrokeWidth}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-separator/40 mx-1" />

          {/* Undo / Redo */}
          <Tooltip content="Undo (Cmd+Z)">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="rounded-full"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Redo (Cmd+Shift+Z)">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="rounded-full"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </Tooltip>

          <div className="h-5 w-px bg-separator/40 mx-1" />

          {/* Export PNG */}
          <Tooltip content="Export Canvas to PNG">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onExport}
              className="rounded-full"
            >
              <Download className="w-4 h-4" />
            </Button>
          </Tooltip>

          {/* Clear Board */}
          <Tooltip content="Clear Whiteboard">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsClearModalOpen(true)}
              className="rounded-full text-system-destructive hover:bg-system-destructive-muted"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear Whiteboard?"
        description="This will erase all strokes and shapes for all participants in the room. This action cannot be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsClearModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsClearModalOpen(false)
                onClear()
              }}
            >
              Clear Entire Board
            </Button>
          </>
        }
      />
    </>
  )
}

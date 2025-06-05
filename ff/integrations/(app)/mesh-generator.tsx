"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PlusCircle, XCircle } from "lucide-react"

// Placeholder for the actual mesh rendering component
// You would replace this with your actual animated mesh component (e.g., RainbowMeshAnimation)
// and pass the props (colors, brightness, graininess, contrast) to it.
const AnimatedMeshDisplay = ({ colors, brightness, graininess, contrast }: {
  colors: string[];
  brightness: number;
  graininess: number;
  contrast: number;
}) => {
  const meshStyle: React.CSSProperties = {
    width: '100%',
    height: '300px',
    border: '1px dashed #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: '20px',
    position: 'relative', // Needed for grain overlay
    backgroundImage: colors.length > 1 ? `linear-gradient(to right, ${colors.join(', ')})` : colors.length === 1 ? `linear-gradient(to right, ${colors[0]}, ${colors[0]})` : 'transparent',
    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
    overflow: 'hidden', // Ensure grain doesn't overflow
  };

  // Basic grain effect using a repeating background image (SVG or a small PNG)
  // A more sophisticated grain effect might involve canvas or WebGL shaders.
  const grainOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3OLi4ubm5uVlZWPj4+NjY19fX2JiYl/f39ra2uRkZGZmZlpaWmXl5dvb29xcXGTk5NnZ2c8TV1mAAAAG3RSTlNAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAvEOwtAAAAYklEQVR42tXQWRcAMAgQDTTCDcvw/2rL9kUkApjGzZ+goO+1gqCg60sA4JzzA0gB3pGgK/t0jWs3HNGgK4P7gEZwBqfU3/7L8yZ5GRY/q/74YAZsXJgHLSzYIdSK2eEAAAAASUVORK5CYII=)',
    opacity: graininess / 150, // Adjust intensity of grain
    pointerEvents: 'none', // Make sure it doesn't interfere with interactions
  };

  return (
    <div style={meshStyle}>
      <div style={grainOverlayStyle}></div>
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px' }}>
        <p className="text-sm font-medium">Mesh Preview</p>
        <p style={{ fontSize: '10px', wordBreak: 'break-all' }}>
          Colors: {colors.join(', ')} | Brightness: {brightness}% | Contrast: {contrast}% | Grain: {graininess}%
        </p>
        <p className="text-xs mt-2 text-muted-foreground">Note: Animation not shown in this preview.</p>
      </div>
    </div>
  );
};

export default function MeshGenerator() {
  const [colors, setColors] = React.useState<string[]>(["#6A0DAD", "#0077FF", "#FFD700"]);
  const [brightness, setBrightness] = React.useState(100); // Percentage
  const [graininess, setGraininess] = React.useState(10); // Percentage
  const [contrast, setContrast] = React.useState(100); // Percentage

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  const addColor = () => {
    if (colors.length < 5) { // Limit number of colors, e.g., to 5
      setColors([...colors, "#FFFFFF"]);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) { // Keep at least one color
      const newColors = colors.filter((_, i) => i !== index);
      setColors(newColors);
    }
  };

  return (
    <div className="p-6 space-y-8 rounded-xl border bg-card text-card-foreground shadow-lg w-full max-w-lg mx-auto my-8">
      <h1 className="text-3xl font-bold text-center text-primary">Mesh Generator</h1>

      {/* Color Controls */}
      <div className="space-y-3">
        <Label className="text-xl font-semibold">Colors</Label>
        {colors.map((color, index) => (
          <div key={index} className="flex items-center gap-3 p-2 border rounded-md">
            <Input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(index, e.target.value)}
              className="w-12 h-10 p-0.5 border-0 cursor-pointer"
            />
            <Input
              type="text"
              value={color}
              onChange={(e) => handleColorChange(index, e.target.value)}
              placeholder="#RRGGBB"
              className="flex-grow text-sm"
            />
            {colors.length > 1 && (
              <Button variant="ghost" size="icon" onClick={() => removeColor(index)} className="text-muted-foreground hover:text-destructive">
                <XCircle className="h-5 w-5" />
              </Button>
            )}
          </div>
        ))}
        {colors.length < 5 && (
          <Button variant="outline" onClick={addColor} className="w-full mt-3">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Color
          </Button>
        )}
      </div>

      {/* Brightness Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="brightness-slider" className="text-lg font-medium">Brightness</Label>
          <span className="text-sm font-mono px-2 py-1 bg-muted rounded-md">{brightness}%</span>
        </div>
        <Slider
          id="brightness-slider"
          min={0}
          max={200}
          step={1}
          value={[brightness]}
          onValueChange={(value) => setBrightness(value[0])}
          aria-label="Brightness"
        />
      </div>

      {/* Graininess Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="graininess-slider" className="text-lg font-medium">Grain</Label>
          <span className="text-sm font-mono px-2 py-1 bg-muted rounded-md">{graininess}%</span>
        </div>
        <Slider
          id="graininess-slider"
          min={0}
          max={100}
          step={1}
          value={[graininess]}
          onValueChange={(value) => setGraininess(value[0])}
          aria-label="Graininess"
        />
      </div>

      {/* Contrast Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="contrast-slider" className="text-lg font-medium">Contrast</Label>
          <span className="text-sm font-mono px-2 py-1 bg-muted rounded-md">{contrast}%</span>
        </div>
        <Slider
          id="contrast-slider"
          min={0}
          max={200}
          step={1}
          value={[contrast]}
          onValueChange={(value) => setContrast(value[0])}
          aria-label="Contrast"
        />
      </div>

      {/* Mesh Preview */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-xl font-semibold mb-3 text-center">Live Preview</h3>
        <AnimatedMeshDisplay
          colors={colors}
          brightness={brightness}
          graininess={graininess}
          contrast={contrast}
        />
      </div>

      {/* Instructions/Notes */}
      <div className="mt-6 p-3 bg-muted/50 rounded-md text-sm text-muted-foreground">
        <p><strong>Note:</strong> This is a UI for controlling mesh properties. You'll need to integrate your actual animated mesh rendering component (like an enhanced version of <code>RainbowMeshAnimation</code> or a new WebGL/Three.js component) into <code>AnimatedMeshDisplay</code> to see the live animated mesh.</p>
      </div>
    </div>
  );
}

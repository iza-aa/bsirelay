#!/usr/bin/env python3
"""
figma_analyzer.py — Computer Vision & Visual Analysis Tool for BSI Relay

Extracts color palettes (#FAFAFA, #002F87), measures UI padding/margins,
and trims whitespace from Figma DevTools screenshots.
"""

import sys
import os
import argparse
from typing import List, Tuple, Dict

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False


def rgb_to_hex(r: int, g: int, b: int) -> str:
    return f"#{r:02X}{g:02X}{b:02X}"


def analyze_colors(image_path: str, top_n: int = 6) -> List[Dict[str, any]]:
    if not HAS_PIL:
        print("⚠️ Pillow (PIL) is not installed. Install with: pip install Pillow")
        return []

    if not os.path.exists(image_path):
        print(f"❌ Image not found: {image_path}")
        return []

    with Image.open(image_path) as img:
        img = img.convert("RGB")
        # Resize for fast color quantization
        img_small = img.resize((150, 150))
        colors = img_small.getcolors(maxcolors=25000)
        if not colors:
            return []

        colors.sort(key=lambda x: x[0], reverse=True)
        total_pixels = sum(c[0] for c in colors)

        palette = []
        for count, rgb in colors[:top_n]:
            hex_code = rgb_to_hex(*rgb)
            percentage = round((count / total_pixels) * 100, 1)
            role = classify_color_role(hex_code, rgb)
            palette.append({
                "hex": hex_code,
                "rgb": rgb,
                "percentage": percentage,
                "role": role
            })
        return palette


def classify_color_role(hex_code: str, rgb: Tuple[int, int, int]) -> str:
    r, g, b = rgb
    # Bright/White background
    if r > 240 and g > 240 and b > 240:
        if hex_code.upper() in ["#FAFAFA", "#F8F9FA", "#F5F5F5"]:
            return "Filter Card Background (#FAFAFA standard)"
        return "Surface / Background (White)"
    # Border / Divider
    if 200 < r < 235 and 200 < g < 235 and 200 < b < 235:
        return "Border / Divider (#E0E0E0 standard)"
    # Navy / Primary Blue
    if b > 100 and r < 80 and g < 100:
        return "Primary Brand (#002F87 standard)"
    # Dark text
    if r < 80 and g < 80 and b < 80:
        return "Typography / Primary Text (#333333)"
    return "Accent / Data Color"


def analyze_layout(image_path: str) -> Dict[str, any]:
    if not HAS_PIL:
        return {"error": "Pillow is not installed"}

    if not os.path.exists(image_path):
        return {"error": f"Image not found: {image_path}"}

    with Image.open(image_path) as img:
        width, height = img.size
        return {
            "width": width,
            "height": height,
            "aspect_ratio": f"{round(width/height, 2)}:1",
            "recommended_zoom": "80% (Micro verification)" if height < 800 else "25-30% (Macro overview)"
        }


def print_report(image_path: str):
    print("=" * 60)
    print("🎨 BSI Relay — Figma Canvas Visual Analyzer")
    print("=" * 60)

    layout = analyze_layout(image_path)
    if "error" in layout:
        print(f"❌ {layout['error']}")
        return

    print(f"\n📐 Dimensions: {layout['width']}x{layout['height']} px ({layout['aspect_ratio']})")
    print(f"🔍 Recommended Zoom: {layout['recommended_zoom']}\n")

    palette = analyze_colors(image_path)
    if palette:
        print("🎨 Dominant Palette & Token Classification:")
        print("  HEX       │ Share  │ Classification / Token")
        print("  ──────────┼────────┼────────────────────────────────────────")
        for item in palette:
            hex_p = item['hex'].ljust(9)
            share_p = f"{item['percentage']}%".ljust(6)
            print(f"  {hex_p} │ {share_p} │ {item['role']}")
        print("  ──────────┴────────┴────────────────────────────────────────\n")


def main():
    parser = argparse.ArgumentParser(description="Figma Canvas Visual Analysis Tool for BSI Relay")
    parser.add_argument("image", nargs="?", default="", help="Path to Figma screenshot image")
    parser.add_argument("--colors", action="store_true", help="Extract color palette and classify tokens")
    parser.add_argument("--layout", action="store_true", help="Measure canvas layout dimensions")
    parser.add_argument("--test", action="store_true", help="Run self-diagnostic test")

    args = parser.parse_args()

    if args.test or not args.image:
        # Check built-in assets for testing
        test_img = os.path.join(os.path.dirname(__file__), "..", "assets", "logo-bsi.png")
        if os.path.exists(test_img):
            print_report(test_img)
        else:
            parser.print_help()
        return

    print_report(args.image)


if __name__ == "__main__":
    main()

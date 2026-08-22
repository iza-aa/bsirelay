#!/usr/bin/env python3
import unittest
import os
import sys

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from tools.figma_analyzer import rgb_to_hex, classify_color_role
from tools.distill_rules import classify_rule

class TestPythonTools(unittest.TestCase):
    def test_rgb_to_hex(self):
        self.assertEqual(rgb_to_hex(250, 250, 250), "#FAFAFA")
        self.assertEqual(rgb_to_hex(0, 47, 135), "#002F87")

    def test_classify_color_role(self):
        self.assertIn("FAFAFA", classify_color_role("#FAFAFA", (250, 250, 250)))
        self.assertIn("Primary Brand", classify_color_role("#002F87", (0, 47, 135)))
        self.assertIn("Border", classify_color_role("#E0E0E0", (224, 224, 224)))

    def test_classify_rule(self):
        self.assertEqual(classify_rule("Highcharts Donut Chart", "margin bottom"), "📊 Charts & Highcharts")
        self.assertEqual(classify_rule("Figma DevTools Scroll", "adaptive deltaY"), "🔍 Figma Canvas & Inspection")
        self.assertEqual(classify_rule("API Lumen Endpoint", "service mapping"), "🔌 API & Backend Services")

if __name__ == '__main__':
    print("🧪 Running Python Tools Unit Tests...\n")
    unittest.main()

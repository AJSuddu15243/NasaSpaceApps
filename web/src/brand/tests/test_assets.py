"""Offline checks for publishable brand assets; no simulation or raw data."""
import json
from pathlib import Path
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SVG = '{http://www.w3.org/2000/svg}'


class BrandAssets(unittest.TestCase):
    def test_manifest_resolves_local_svg_assets(self):
        brand = json.loads((ROOT / 'brand.json').read_text())
        self.assertEqual(brand['name'], 'Lunala')
        for relative in brand['assets'].values():
            path = (ROOT / relative).resolve()
            self.assertTrue(path.is_relative_to(ROOT))
            self.assertEqual(path.suffix, '.svg')
            self.assertTrue(path.is_file())

    def test_vectors_are_self_contained_and_non_executable(self):
        allowed = {'svg', 'title', 'rect', 'path', 'circle'}
        for path in (ROOT / 'assets').glob('*.svg'):
            with self.subTest(asset=path.name):
                root = ET.parse(path).getroot()
                self.assertEqual(root.tag, SVG + 'svg')
                self.assertIn(root.get('viewBox'), ('0 0 64 64', '0 0 32 32'))
                for element in root.iter():
                    self.assertIn(element.tag.removeprefix(SVG), allowed)
                    for key, value in element.attrib.items():
                        self.assertFalse(key.lower().startswith('on'))
                        self.assertNotIn('href', key.lower())
                        self.assertNotIn('url(', value.lower())

    def test_standalone_marks_have_accessible_names(self):
        for name in ('mark.svg', 'mark-mono.svg'):
            root = ET.parse(ROOT / 'assets' / name).getroot()
            title = root.find(SVG + 'title')
            self.assertIsNotNone(title)
            self.assertEqual(root.get('role'), 'img')
            self.assertEqual(root.get('aria-labelledby'), title.get('id'))
            self.assertEqual(title.text, 'Lunala')

    def test_voice_has_five_rules_and_preview_uses_product_name(self):
        rows = [line for line in (ROOT / 'VOICE.md').read_text().splitlines() if line.startswith('|')]
        self.assertEqual(len(rows) - 2, 5)
        preview = (ROOT / 'preview' / 'index.html').read_text()
        brand = json.loads((ROOT / 'brand.json').read_text())
        for key in ('name', 'descriptor', 'tagline', 'summary'):
            self.assertIn(brand[key], preview)


if __name__ == '__main__':
    unittest.main()

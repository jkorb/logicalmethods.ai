#!/usr/bin/env python3
"""
Comic Shanns Logic — the object-language face, with logic symbols
=================================================================

The formal languages in this book mix Latin identifiers with logic symbols in
one run: `Human x → Mortal x`. Comic Shanns covers the letters but almost none
of the symbols, which is why the symbols were PNGs, and later inline SVG.

This adds them to the font itself, using the course's own hand-drawn outlines
(assets/img/sym/*.svg, traced from the original artwork). Formulas then become
ordinary text: selectable, copyable, searchable, and readable by a screen
reader, in the same hand as the letters beside them.

    python3 scripts/build-notation-font.py

Writes assets/fonts/ComicShanns/comic-shanns-logic.woff2.

Comic Shanns is MIT licensed, which permits modification and redistribution
with the notice retained; see assets/fonts/ComicShanns/LICENSE.txt.
"""
import os, re, sys, xml.etree.ElementTree as ET
from fontTools.ttLib import TTFont
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import ControlBoundsPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.reverseContourPen import ReverseContourPen
from fontTools.svgLib.path import SVGPath
from fontTools.misc.transform import Transform

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, 'assets/fonts/ComicShanns/comic-shanns.otf')
SYMS = os.path.join(ROOT, 'assets/img/sym')
OUT  = os.path.join(ROOT, 'assets/fonts/ComicShanns/comic-shanns-logic')

# symbol file -> (codepoint, glyph name). Only what the book actually uses.
MAP = {
    'forall':        (0x2200, 'forall'),
    'exists':        (0x2203, 'existential'),
    'conjunction':   (0x2227, 'logicaland'),
    'disjunction':   (0x2228, 'logicalor'),
    'longrightarrow':(0x27F9, 'arrowlongdblright'),
    'vDash':         (0x22A8, 'models'),
    'nvDash':        (0x22AD, 'notmodels'),
    'v_dash':        (0x22A2, 'turnstile'),
    'nv_dash':       (0x22AC, 'notturnstile'),
    'subseteq':      (0x2286, 'subsetorequal'),
    'in':            (0x2208, 'element'),
    'notin':         (0x2209, 'notelement'),
    'cap':           (0x2229, 'intersection'),
    'cup':           (0x222A, 'union'),
    'llbracket':     (0x27E6, 'dblbracketleft'),
    'rrbracket':     (0x27E7, 'dblbracketright'),
    'therefore':     (0x2234, 'therefore'),
    'top':           (0x22A4, 'top'),
    'bot':           (0x22A5, 'bottom'),
}
# glyphs that sit on the baseline like a capital; the rest center on the math axis
BASELINE = {'forall','existential','dblbracketleft','dblbracketright','bottom',
            'turnstile','notturnstile','models','notmodels'}

CAP        = 650     # Comic Shanns cap height
MATH_AXIS  = 250     # where operators center
SIDE       = 55      # side bearing, font units


def svg_outline(path):
    """Return (RecordingPen, width, height) in SVG user units, y still down."""
    tree = ET.parse(path).getroot()
    vb = [float(v) for v in tree.get('viewBox').split()]
    rec = RecordingPen()
    # SVGPath applies no viewBox transform, so coordinates come out as authored
    SVGPath(path).draw(rec)
    return rec, vb[2], vb[3]


def add_glyph(font, glyph_name, codepoint, svg_path, scale_hint):
    rec, w, h = svg_outline(svg_path)
    target_h = scale_hint * 850.0                 # same relative sizing the site uses
    k = target_h / h
    if glyph_name in BASELINE:
        y_off = 0.0
    else:
        y_off = MATH_AXIS - target_h / 2.0
    # SVG y grows downward; flip it and lift onto the baseline
    t = Transform(k, 0, 0, -k, SIDE, target_h + y_off)

    pen = T2CharStringPen(0, None)
    rec.replay(TransformPen(pen, t))
    cs = pen.getCharString()

    bounds = ControlBoundsPen(None)
    rec.replay(TransformPen(bounds, t))
    advance = int(round((bounds.bounds[2] if bounds.bounds else target_h) + SIDE))

    cff = font['CFF '].cff
    top = cff[cff.fontNames[0]]
    charstrings = top.CharStrings
    cs.private = top.Private
    cs.globalSubrs = charstrings.globalSubrs
    # a new glyph has to be appended to the charstring index before it can be
    # addressed by name
    if charstrings.charStringsAreIndexed:
        charstrings.charStringsIndex.append(cs)
        charstrings.charStrings[glyph_name] = len(charstrings.charStringsIndex) - 1
    else:
        charstrings.charStrings[glyph_name] = cs
    if glyph_name not in top.charset:
        top.charset.append(glyph_name)
    font['hmtx'].metrics[glyph_name] = (advance, int(round(bounds.bounds[0] if bounds.bounds else 0)))
    for table in font['cmap'].tables:
        if table.isUnicode():
            table.cmap[codepoint] = glyph_name
    return advance


def main():
    if not os.path.exists(SRC):
        sys.exit(f'missing {SRC}')
    font = TTFont(SRC)
    have = font.getBestCmap()

    # relative sizes were measured from the original artwork; reuse them
    scale = {}
    for f in os.listdir(SYMS):
        if not f.endswith('.svg'):
            continue
        m = re.search(r'--sym-scale:([\d.]+)', open(os.path.join(SYMS, f)).read())
        scale[f[:-4]] = float(m.group(1)) if m else 0.75

    added, skipped = [], []
    order = list(font.getGlyphOrder())
    for name, (cp, gname) in MAP.items():
        svg = os.path.join(SYMS, f'{name}.svg')
        if not os.path.exists(svg):
            skipped.append(f'{name} (no traced outline)'); continue
        if cp in have:
            skipped.append(f'{name} (U+{cp:04X} already in font)'); continue
        adv = add_glyph(font, gname, cp, svg, scale.get(name, 0.75))
        order.append(gname)
        added.append(f'{gname:18} U+{cp:04X}  advance {adv}')
    # Match ↔ to Comic Shanns' own →: the same shaft, weight and arrowheads.
    # Reverse winding before reflecting so overlapping outlines remain filled.
    right = font.getBestCmap()[0x2192]
    rec = RecordingPen()
    font.getGlyphSet()[right].draw(rec)
    bounds = ControlBoundsPen(None)
    rec.replay(bounds)
    xmin, _, xmax, _ = bounds.bounds
    pen = T2CharStringPen(0, None)
    shaft_extension = 180
    rec.replay(TransformPen(pen, Transform(1, 0, 0, 1, shaft_extension, 0)))
    rec.replay(ReverseContourPen(TransformPen(pen, Transform(-1, 0, 0, 1, xmin + xmax, 0))))
    cs = pen.getCharString()
    top = font['CFF '].cff.topDictIndex[0]
    cs.private, cs.globalSubrs = top.Private, top.CharStrings.globalSubrs
    top.CharStrings.charStringsIndex.append(cs)
    top.CharStrings.charStrings['arrowboth'] = len(top.CharStrings.charStringsIndex) - 1
    top.charset.append('arrowboth')
    advance, bearing = font['hmtx'].metrics[right]
    font['hmtx'].metrics['arrowboth'] = (advance + shaft_extension, bearing)
    for table in font['cmap'].tables:
        if table.isUnicode():
            table.cmap[0x2194] = 'arrowboth'
    order.append('arrowboth')
    added.append('arrowboth          U+2194  from native arrowright')
    font.setGlyphOrder(order)
    font['maxp'].numGlyphs = len(order)

    # a modified font gets its own name
    for rec in font['name'].names:
        if rec.nameID in (1, 3, 4, 6):
            v = rec.toUnicode()
            v = v.replace('Comic Shanns', 'Comic Shanns Logic')
            if rec.nameID == 6:
                v = v.replace(' ', '')
            rec.string = v

    font.flavor = 'woff2'
    font.save(OUT + '.woff2')
    font.flavor = None
    font.save(OUT + '.otf')

    print(f'added {len(added)} glyphs:')
    for a in added: print('  ' + a)
    if skipped:
        print(f'skipped {len(skipped)}:')
        for s in skipped: print('  ' + s)
    print(f'\nwrote {os.path.relpath(OUT, ROOT)}.woff2  '
          f'({os.path.getsize(OUT + ".woff2")/1024:.0f}KB)')

main()

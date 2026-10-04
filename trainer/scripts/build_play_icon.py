"""Generate the /play/ PWA icon set - a proper Pokemon ball.

The binder's icon is a gold lightning bolt on navy (icons/bolt-transparent.png),
so /play/ needs its own identity on a phone home screen. This draws a ball with
real geometry - split sphere with gradients, dark rim, belt, release button,
gloss highlight - over the app's dark purple background inside the app's --gold
frame, so it still reads as the same product.

Drawn at 6x supersample and downscaled: a ball is mostly large flat arcs, and any
stepping along the rim or belt is instantly visible at 512px.
Run: python trainer/scripts/build_play_icon.py
"""
import os
from PIL import Image, ImageDraw, ImageFilter

R = r"C:\Users\ankha\AppData\Local\hermes\profiles\cg-bro\workspace\mezastar-dex"
OUT = os.path.join(R, "play", "icons")
os.makedirs(OUT, exist_ok=True)

# app palette
BG_TOP = (30, 18, 50)
BG_BOT = (11, 7, 20)
GOLD = (245, 196, 81)
GOLD_DK = (170, 118, 28)

# ball palette - the classic red, warmed slightly so it sits with the gold
RED_HI = (255, 92, 92)
RED_LO = (196, 26, 44)
WHITE_HI = (255, 255, 255)
WHITE_LO = (203, 205, 218)
DARK = (26, 22, 34)

SS = 6  # supersample factor


def lerp(a, b, t):
    t = max(0.0, min(1.0, t))
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def bg_img(size):
    """Vertical gradient plus a soft purple glow behind the ball."""
    im = Image.new("RGB", (size, size))
    d = ImageDraw.Draw(im)
    for y in range(size):
        d.line([(0, y), (size, y)], fill=lerp(BG_TOP, BG_BOT, y / max(1, size - 1)))

    glow = Image.new("L", (size, size), 0)
    gd = ImageDraw.Draw(glow)
    cx = cy = size / 2
    steps = 48
    for i in range(steps):
        t = i / (steps - 1)
        r = size * 0.50 * (1 - t)
        gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=int(70 * (t ** 2.4)))
    glow = glow.filter(ImageFilter.GaussianBlur(size / 40))
    return Image.composite(Image.new("RGB", (size, size), (62, 38, 98)), im, glow)


def ball_layer(D, radius):
    """The ball on a transparent canvas of side D, circle of `radius` centred."""
    ball = Image.new("RGBA", (D, D), (0, 0, 0, 0))
    d = ImageDraw.Draw(ball)
    cx = cy = D / 2
    R = float(radius)
    box = [cx - R, cy - R, cx + R, cy + R]

    # --- shell: top red, bottom white, both as vertical gradients ------------
    top, bot, mid = cy - R, cy + R, cy
    span = max(1.0, bot - top)
    y0, y1 = int(round(top)), int(round(bot))
    for y in range(y0, int(round(mid)) + 1):
        t = min(1.0, max(0.0, (y - top) / span))
        d.line([(cx - R, y), (cx + R, y)], fill=lerp(RED_HI, RED_LO, t ** 0.85))
    for y in range(int(round(mid)), y1 + 1):
        t = min(1.0, max(0.0, (y - top) / span))
        d.line([(cx - R, y), (cx + R, y)], fill=lerp(WHITE_HI, WHITE_LO, t ** 0.75))

    # clip the flat halves back to a sphere
    mask = Image.new("L", (D, D), 0)
    ImageDraw.Draw(mask).ellipse(box, fill=255)
    ball.putalpha(mask)

    def clip(layer):
        """Keep a layer only where the sphere is."""
        layer.putalpha(Image.composite(
            layer.split()[3], Image.new("L", (D, D), 0), mask))
        return Image.alpha_composite(ball, layer)

    # --- rim ---------------------------------------------------------------
    rim = Image.new("RGBA", (D, D), (0, 0, 0, 0))
    ImageDraw.Draw(rim).ellipse(box, outline=DARK, width=max(2, int(R * 0.085)))
    ball = clip(rim)

    # --- belt --------------------------------------------------------------
    belt = Image.new("RGBA", (D, D), (0, 0, 0, 0))
    bh = max(2, int(R * 0.15))
    ImageDraw.Draw(belt).rectangle(
        [cx - R, cy - bh / 2, cx + R, cy + bh / 2], fill=DARK)
    ball = clip(belt)

    # --- release button ----------------------------------------------------
    btn = Image.new("RGBA", (D, D), (0, 0, 0, 0))
    bd = ImageDraw.Draw(btn)
    br = R * 0.30
    bd.ellipse([cx - br, cy - br, cx + br, cy + br], fill=DARK)
    ir = br * 0.62
    off = br * 0.10
    for i in range(14):
        t = i / 13
        r = ir * (1 - t * 0.92)
        bd.ellipse([cx - off - r, cy - off - r, cx - off + r, cy - off + r],
                   fill=lerp(WHITE_HI, (206, 210, 226), t))
    ball = clip(btn)

    # --- gloss -------------------------------------------------------------
    gloss = Image.new("RGBA", (D, D), (0, 0, 0, 0))
    gd = ImageDraw.Draw(gloss)
    gd.ellipse([cx - R * 0.74, cy - R * 0.90, cx + R * 0.16, cy - R * 0.14],
               fill=(255, 255, 255, 70))
    gd.ellipse([cx - R * 0.60, cy - R * 0.78, cx - R * 0.08, cy - R * 0.36],
               fill=(255, 255, 255, 78))
    gloss = gloss.filter(ImageFilter.GaussianBlur(R * 0.055))
    ball = clip(gloss)

    # --- drop shadow so the ball lifts off the background -------------------
    sh = Image.new("RGBA", (D, D), (0, 0, 0, 0))
    ImageDraw.Draw(sh).ellipse(
        [cx - R + R * .05, cy - R + R * .10, cx + R + R * .05, cy + R + R * .10],
        fill=(0, 0, 0, 120))
    sh = sh.filter(ImageFilter.GaussianBlur(R * 0.10))
    return Image.alpha_composite(sh, ball)


def build(size, maskable=False):
    S = size * SS
    im = bg_img(S)

    # A maskable icon is cropped to the full canvas by the launcher, so the ball
    # must stay inside the safe zone (the middle 80%).
    frac = 0.52 if maskable else 0.72
    im = Image.alpha_composite(
        im.convert("RGBA"), ball_layer(S, S * frac / 2.0)).convert("RGB")

    d = ImageDraw.Draw(im)
    if not maskable:
        inset = int(S * 0.085)
        d.rounded_rectangle([inset, inset, S - inset, S - inset],
                            radius=int(S * 0.22),
                            outline=GOLD, width=int(S * 0.020))
        d.rounded_rectangle([inset, inset, S - inset, S - inset],
                            radius=int(S * 0.22),
                            outline=GOLD_DK, width=int(S * 0.007))
    return im.resize((size, size), Image.LANCZOS)


def main():
    made = []
    for size, name in ((192, "icon-192.png"), (512, "icon-512.png"),
                       (180, "apple-touch-icon.png"), (32, "favicon-32.png")):
        p = os.path.join(OUT, name)
        build(size).save(p, "PNG", optimize=True)
        made.append((name, os.path.getsize(p)))
    p = os.path.join(OUT, "maskable-512.png")
    build(512, maskable=True).save(p, "PNG", optimize=True)
    made.append(("maskable-512.png", os.path.getsize(p)))
    for n, s in made:
        print("wrote play/icons/%-22s %6d bytes" % (n, s))


if __name__ == "__main__":
    main()
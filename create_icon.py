#!/usr/bin/env python3
"""
Generate Windows .ico file for EcoBuild Smart using pure Python (no PIL/Pillow needed).
Creates a multi-resolution icon (48x48 and 32x32) with 32-bit BGRA color and transparency.
"""

import struct
import math
import os

def create_image_data(size):
    """
    Generate RGBA pixel data for a circular emerald badge with a stylized green leaf & solar accent.
    Returns (dib_data, and_mask)
    """
    width = size
    height = size
    radius = (size - 2) / 2.0
    cx = size / 2.0
    cy = size / 2.0

    pixels = [] # Bottom-up order for BMP

    for y in range(height - 1, -1, -1): # bottom-up
        for x in range(width):
            dx = x - cx
            dy = y - cy
            dist = math.sqrt(dx*dx + dy*dy)

            if dist > radius:
                # Outside circle - fully transparent
                pixels.append((0, 0, 0, 0)) # B, G, R, A
            elif dist > radius - 1.5:
                # Anti-aliased border
                alpha = int(255 * (radius - dist) / 1.5)
                pixels.append((74, 185, 16, alpha)) # Emerald border
            else:
                # Inside icon: deep emerald gradient background
                grad_factor = (y / float(height))
                r = int(6 + 10 * grad_factor)
                g = int(78 + 60 * grad_factor)
                b = int(59 + 20 * grad_factor)

                # Draw stylized leaf shape in center
                nx = (x - cx) / radius
                ny = (y - cy) / radius

                # Leaf curve: |nx| <= (1 - ny^2)*0.6 and ny between -0.6 and 0.6
                in_leaf = False
                if -0.6 <= ny <= 0.6:
                    leaf_w = 0.55 * (1.0 - (ny * 1.2)**2)
                    if abs(nx) < leaf_w:
                        in_leaf = True

                # Solar sun accent in top-right
                sun_dx = x - (cx + radius * 0.45)
                sun_dy = y - (cy - radius * 0.45)
                in_sun = math.sqrt(sun_dx*sun_dx + sun_dy*sun_dy) < (radius * 0.28)

                if in_sun:
                    # Gold/amber sun
                    pixels.append((24, 191, 251, 255)) # B, G, R, A (amber)
                elif in_leaf:
                    # Bright emerald leaf
                    if abs(nx) < 0.05: # Central leaf stem
                        pixels.append((255, 255, 255, 240)) # White stem
                    else:
                        pixels.append((105, 211, 52, 255)) # Bright green
                else:
                    pixels.append((b, g, r, 255))

    # Convert pixels to bytes (BGRA)
    pixel_bytes = bytearray()
    for b, g, r, a in pixels:
        pixel_bytes.extend([b, g, r, a])

    # AND mask (1 bit per pixel, padded to 32 bits per row)
    # For 32-bit alpha icons, all zeros is standard
    row_bytes_len = (width + 31) // 32 * 4
    and_mask = bytearray(row_bytes_len * height)

    # BITMAPINFOHEADER (40 bytes)
    bih = struct.pack(
        "<IIIHHIIIIII",
        40,             # biSize
        width,          # biWidth
        height * 2,     # biHeight (XOR + AND mask height in ICO)
        1,              # biPlanes
        32,             # biBitCount
        0,              # biCompression (BI_RGB)
        len(pixel_bytes) + len(and_mask), # biSizeImage
        0,              # biXPelsPerMeter
        0,              # biYPelsPerMeter
        0,              # biClrUsed
        0               # biClrImportant
    )

    image_data = bih + pixel_bytes + and_mask
    return image_data

def build_ico(sizes=[48, 32, 16]):
    images = []
    for s in sizes:
        data = create_image_data(s)
        images.append((s, data))

    # ICONDIR header (6 bytes)
    header = struct.pack("<HHH", 0, 1, len(images))

    offset = 6 + (16 * len(images))
    entries = []
    image_payloads = []

    for s, data in images:
        entry = struct.pack(
            "<BBBBHHII",
            s if s < 256 else 0, # bWidth
            s if s < 256 else 0, # bHeight
            0,                   # bColorCount
            0,                   # bReserved
            1,                   # wPlanes
            32,                  # wBitCount
            len(data),           # dwBytesInRes
            offset               # dwImageOffset
        )
        entries.append(entry)
        image_payloads.append(data)
        offset += len(data)

    ico_bytes = header + b"".join(entries) + b"".join(image_payloads)
    return ico_bytes

if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(__file__), "icons")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "ecobuild.ico")
    
    ico_content = build_ico([48, 32, 16])
    with open(out_path, "wb") as f:
        f.write(ico_content)
    print(f"[Icon] Generated Windows multi-res icon at: {out_path} ({len(ico_content)} bytes)")

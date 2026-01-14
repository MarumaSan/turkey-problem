from PIL import Image, ImageDraw
import random
import os

def generate_turkey_skin_texture(width=512, height=512):
    # Create base image with a golden brown color
    base_color = (210, 140, 70) # Golden brown (slightly lighter)
    img = Image.new('RGB', (width, height), base_color)
    draw = ImageDraw.Draw(img)

    # Add noise and "skin" details
    for _ in range(30000):
        x = random.randint(0, width)
        y = random.randint(0, height)
        
        # Random variations for "roasted" look
        r_offset = random.randint(-40, 40)
        g_offset = random.randint(-40, 40)
        b_offset = random.randint(-40, 40)
        
        # Skin pores / bumps
        size = random.randint(1, 3)
        
        color = (
            max(0, min(255, base_color[0] + r_offset)),
            max(0, min(255, base_color[1] + g_offset)),
            max(0, min(255, base_color[2] + b_offset))
        )
        
        draw.ellipse([x, y, x+size, y+size], fill=color)

    # Add some darker "burned"/"roasted" spots for realism
    for _ in range(400):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(8, 20)
        color = (160, 80, 40, 50) # Saddle brown
        draw.ellipse([x, y, x+size, y+size], fill=color)

    return img

if __name__ == "__main__":
    output_dir = "public/textures"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    img = generate_turkey_skin_texture()
    img.save(os.path.join(output_dir, "turkey_skin.png"))
    print("Texture generated at public/textures/turkey_skin.png")

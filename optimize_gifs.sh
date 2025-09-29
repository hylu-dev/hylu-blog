#!/bin/bash

# Script to optimize GIF files using ImageMagick
# Reduces file size while preserving animation quality

echo "Optimizing GIF files..."

# Counter for tracking progress
total_files=0
optimized_files=0

# Find all GIF files and count them
echo "Scanning for GIF files..."
gif_files=$(find . -name "*.gif" -not -path "./themes/*" | wc -l)
echo "Found $gif_files GIF files to optimize"

total_files=$gif_files

# Optimize GIFs
echo "Optimizing GIFs..."
find . -name "*.gif" -not -path "./themes/*" | while read -r file; do
    # Get directory and filename
    dir=$(dirname "$file")
    filename=$(basename "$file")
    name="${filename%.*}"
    
    # Create optimized filename
    optimized_file="$dir/${name}_optimized.gif"
    
    echo "Optimizing: $file"
    
    # Get original file size
    original_size=$(stat -c%s "$file" 2>/dev/null || echo "0")
    
    # Optimize using ImageMagick with various techniques
    # -fuzz: Allow slight color variations for better compression
    # -layers optimize: Optimize animation layers
    # -colors: Reduce color palette
    # -dither: Apply dithering for better quality with fewer colors
    if magick "$file" -fuzz 2% -layers optimize -colors 256 -dither FloydSteinberg "$optimized_file"; then
        # Get optimized file size
        optimized_size=$(stat -c%s "$optimized_file" 2>/dev/null || echo "0")
        
        # Calculate savings
        if [ "$original_size" -gt 0 ]; then
            savings=$((original_size - optimized_size))
            savings_percent=$((savings * 100 / original_size))
            
            if [ "$savings" -gt 0 ]; then
                echo "✓ Optimized: $file (saved ${savings_percent}% - ${savings} bytes)"
                # Replace original with optimized version
                mv "$optimized_file" "$file"
                ((optimized_files++))
            else
                echo "○ No improvement: $file (keeping original)"
                rm "$optimized_file"
            fi
        else
            echo "✓ Optimized: $file"
            mv "$optimized_file" "$file"
            ((optimized_files++))
        fi
    else
        echo "✗ Failed to optimize: $file"
        rm -f "$optimized_file"
    fi
done

echo "GIF optimization complete!"
echo "Optimized $optimized_files out of $total_files files"

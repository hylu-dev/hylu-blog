#!/usr/bin/env bash
# Optimize images in content/ for the web.
#
#   scripts/optimize-media.sh [--dry-run] [path ...]   (default path: content)
#
# Animated WebP/GIF -> <name>.mp4 (H.264, loops via the templates) and the
#   original file is replaced by a still WebP of the first frame. The templates
#   render <name>.mp4 whenever it sits next to <name>.webp, and use the still as
#   the poster and as the social-card image, so no markup needs to change.
#   Animations are skipped if the MP4 + poster would not save at least 40%.
# Still JPEG/PNG/GIF -> <name>.webp (quality 82, max 2560px wide). References
#   in Markdown must be updated by hand; the script prints them.
# Still WebP wider than 2560px -> downscaled in place.
#
# Requires: ffmpeg/ffprobe (libx264), webp tools (cwebp, webpmux, anim_dump, gif2webp).
set -euo pipefail

MAX_WIDTH=2560
CRF=23
DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && { DRY_RUN=1; shift; }
paths=("$@"); [[ ${#paths[@]} -eq 0 ]] && paths=(content)

for tool in ffmpeg ffprobe cwebp webpmux anim_dump gif2webp; do
  command -v "$tool" >/dev/null || { echo "missing required tool: $tool" >&2; exit 1; }
done

tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
size() { stat -c %s "$1"; }
width() { webpmux -info "$1" | awk '/Canvas size/{print $3; exit}'; }

# Animated WebP -> MP4 + first-frame poster
animated_to_mp4() {
  local src=$1 base=${1%.*} frames="$tmp/frames"
  rm -rf "$frames"; mkdir -p "$frames"
  anim_dump -folder "$frames" -prefix f "$src" >/dev/null
  # Per-frame durations (ms) so variable frame timing is preserved
  mapfile -t durs < <(webpmux -info "$src" | awk '$1 ~ /^[0-9]+:$/ {print $7}')
  local list="$tmp/list.txt" i=0 f
  : > "$list"
  for f in "$frames"/f*.png; do
    printf "file '%s'\nduration %s\n" "$f" "$(awk "BEGIN{print ${durs[$i]:-100}/1000}")" >> "$list"
    i=$((i+1))
  done
  printf "file '%s'\n" "$f" >> "$list"   # concat demuxer ignores the last duration otherwise
  ffmpeg -nostdin -loglevel error -y -f concat -safe 0 -i "$list" -an \
    -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p" -fps_mode vfr \
    -c:v libx264 -preset slow -crf "$CRF" -movflags +faststart "$tmp/out.mp4"
  local first=("$frames"/f*.png)
  cwebp -quiet -q 80 "${first[0]}" -o "$tmp/poster.webp"

  local before after
  before=$(size "$src"); after=$(( $(size "$tmp/out.mp4") + $(size "$tmp/poster.webp") ))
  if (( after * 10 > before * 6 )); then
    printf "skip   %-70s %6dK -> %6dK (not worth it)\n" "$src" $((before/1024)) $((after/1024)); return
  fi
  printf "video  %-70s %6dK -> %6dK\n" "$src" $((before/1024)) $((after/1024))
  (( DRY_RUN )) && return
  mv "$tmp/out.mp4" "$base.mp4"
  mv "$tmp/poster.webp" "$src"
}

while IFS= read -r -d "" -u 3 f; do
  case "${f,,}" in
    *.webp)
      # Capture first: `webpmux | grep -q` trips pipefail via SIGPIPE on long frame lists
      info=$(webpmux -info "$f")
      if [[ $info == *"Number of frames"* ]]; then
        animated_to_mp4 "$f"
      elif (( $(width "$f") > MAX_WIDTH )); then
        printf "resize %s\n" "$f"
        (( DRY_RUN )) || { cwebp -quiet -q 82 -resize $MAX_WIDTH 0 "$f" -o "$tmp/r.webp" && mv "$tmp/r.webp" "$f"; }
      fi ;;
    *.gif)
      printf "gif    %s -> %s.webp (then re-run to convert to video)\n" "$f" "${f%.*}"
      (( DRY_RUN )) || { gif2webp -quiet -mixed "$f" -o "${f%.*}.webp" && rm "$f"; } ;;
    *.png|*.jpg|*.jpeg)
      printf "webp   %s -> %s.webp (update references: %s)\n" "$f" "${f%.*}" "$(basename "$f")"
      (( DRY_RUN )) || { cwebp -quiet -q 82 -resize "$(( $(ffprobe -v error -show_entries stream=width -of csv=p=0 "$f") > MAX_WIDTH ? MAX_WIDTH : 0 ))" 0 "$f" -o "${f%.*}.webp" && rm "$f"; } ;;
  esac
done 3< <(find "${paths[@]}" -type f \( -iname '*.webp' -o -iname '*.gif' -o -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) -print0)

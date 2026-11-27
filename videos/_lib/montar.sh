#!/usr/bin/env bash
# Junta narração + trilha + vídeo mudo -> build/<name>.mp4 (rodar dentro da pasta do curta)
set -euo pipefail
name=$(python3 -c "import json;print(json.load(open('timeline.json'))['name'])")
dur=$(python3 -c "import json;print(json.load(open('timeline.json'))['duration'])")
inputs=(); filters=""; labels=""; i=0
while IFS=$'\t' read -r audio start; do
  inputs+=(-i "$audio"); ms=$(python3 -c "print(int(float('$start')*1000))")
  filters+="[$i:a]aresample=48000,adelay=${ms}|${ms},volume=1.6[n$i];"; labels+="[n$i]"; i=$((i+1))
done < <(python3 -c "import json;[print(l['audio'],l['start'],sep='\t') for l in json.load(open('timeline.json'))['lines']]")
filters+="${labels}amix=inputs=$i:normalize=0,apad[voz];[voz]asplit[voz1][voz2];[$i:a]volume=0.55[bg];"
filters+="[bg][voz2]sidechaincompress=threshold=0.03:ratio=4:attack=20:release=400[bgd];"
vin=$((i+1)); sfx=()
if [ -f build/sfx.wav ]; then  # efeitos de luta: entram depois do ducking (não abaixam com a voz)
  sfx=(-i build/sfx.wav); vin=$((i+2))
  filters+="[$((i+1)):a]volume=${SFX_VOL:-0.8}[fx];[voz1][bgd][fx]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[out]"
else
  filters+="[voz1][bgd]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[out]"
fi
ffmpeg -y -loglevel error "${inputs[@]}" -i build/trilha.wav "${sfx[@]}" -i build/video-mudo.mp4 -filter_complex "$filters" \
  -map "$vin:v" -map "[out]" -c:v copy -c:a aac -b:a 192k -ar 48000 -t "$dur" "build/$name.mp4"
# Arquivo grande demais para baixar pelo app: recomprime para ~90 MB (mesma resolução)
sz=$(stat -c %s "build/$name.mp4")
if [ "$sz" -gt $((95*1024*1024)) ]; then
  vk=$(python3 -c "print(max(800, int(90*8*1024/float('$dur')) - 170))")
  ffmpeg -y -loglevel error -i "build/$name.mp4" -c:v libx264 -preset medium -b:v ${vk}k -maxrate $((vk*14/10))k -bufsize $((vk*28/10))k \
    -pix_fmt yuv420p -c:a copy -movflags +faststart "build/$name-tmp.mp4" && mv "build/$name-tmp.mp4" "build/$name.mp4"
fi
echo "ok build/$name.mp4 ($(( $(stat -c %s "build/$name.mp4")/1024/1024 )) MB)"

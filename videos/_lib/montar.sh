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
filters+="[voz1][bgd]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[out]"
ffmpeg -y -loglevel error "${inputs[@]}" -i build/trilha.wav -i build/video-mudo.mp4 -filter_complex "$filters" \
  -map "$((i+1)):v" -map "[out]" -c:v copy -c:a aac -b:a 192k -ar 48000 -t "$dur" "build/$name.mp4"
echo "ok build/$name.mp4"

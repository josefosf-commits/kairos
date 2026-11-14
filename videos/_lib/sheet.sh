#!/usr/bin/env bash
# sheet.sh out.png t1 t2 ... (rodar dentro de build/) -> grade 3 colunas de still-<t>.png
out=$1; shift; args=(); f=""; n=0
for t in "$@"; do args+=(-i still-$t.png); f+="[$n]scale=640:360[v$n];"; n=$((n+1)); done
lay=""; for ((i=0;i<n;i++)); do lay+="$(( (i%3)*640 ))_$(( (i/3)*360 ))|"; done
ins=""; for ((i=0;i<n;i++)); do ins+="[v$i]"; done
ffmpeg -loglevel error -y "${args[@]}" -filter_complex "${f}${ins}xstack=inputs=$n:layout=${lay%|}:fill=black" $out

#!/usr/bin/env bash
# vsheet.sh out.png t1 t2 ... (inside build/) -> grid of vertical stills, 5 columns
out=$1; shift; args=(); f=""; n=0
for t in "$@"; do args+=(-i still-$t.png); f+="[$n]scale=270:480[v$n];"; n=$((n+1)); done
lay=""; for ((i=0;i<n;i++)); do lay+="$(( (i%5)*270 ))_$(( (i/5)*480 ))|"; done
ins=""; for ((i=0;i<n;i++)); do ins+="[v$i]"; done
ffmpeg -loglevel error -y "${args[@]}" -filter_complex "${f}${ins}xstack=inputs=$n:layout=${lay%|}:fill=black" $out

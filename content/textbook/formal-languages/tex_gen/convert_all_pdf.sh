for i in *.pdf ; do convert -density 300 "$i" -quality 100 "${i%.*}.png"; done 

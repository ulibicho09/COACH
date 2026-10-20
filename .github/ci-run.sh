#!/usr/bin/env bash
# Ejecuta un comando y, si falla, publica las ultimas lineas de su salida
# como anotacion del job para poder leer el error sin abrir el registro.
# Uso: bash .github/ci-run.sh "Nombre del paso" comando args...
name="$1"
shift
log="$(mktemp)"

set +e
"$@" 2>&1 | tee "$log"
status="${PIPESTATUS[0]}"
set -e

if [ "$status" -ne 0 ]; then
  msg="$(tail -n 40 "$log" | sed 's/\r//g' | sed ':a;N;$!ba;s/%/%25/g;s/\n/%0A/g')"
  echo "::error title=${name} fallo::${msg}"
fi

exit "$status"

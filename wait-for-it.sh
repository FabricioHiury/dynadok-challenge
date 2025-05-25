set -e

host="$1"
shift
cmd="$@"

until nc -z -v -w30 "${host%:*}" "${host##*:}"; do
  echo "Esperando por $host..."
  sleep 1
done

echo "$host está disponível, executando comando: $cmd"
exec $cmd
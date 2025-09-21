if [ $# -eq 0 ]; then
	echo "No arguments supplied";
	exit;
fi

args=("$@")

for arg in "${args[@]}"; do
  mkdir "ex${arg}"
done

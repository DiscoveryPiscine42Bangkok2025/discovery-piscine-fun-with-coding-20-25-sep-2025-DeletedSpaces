args=("$@")

for i in {1..3}
do
  echo "${args[$((i-1))]}"
done

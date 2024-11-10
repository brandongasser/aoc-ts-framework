for i in $(seq 1 25);
do
    if [ $i -lt 10 ];
    then
        DAY="0${i}"
    else
        DAY="${i}"
    fi
    if [ -f "inputs/day-$DAY.txt" ];
    then
        tsx day-$DAY/main.ts
    fi
done
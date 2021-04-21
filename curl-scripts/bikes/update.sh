API="http://localhost:4741"
URL_PATH="/bikes"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
  "bike": {
    "brand": "'"${BRAND}"'",
    "model": "'"${MODEL}"'",
    "type": "'"${TYPE}"'",
    "color": "'"${COLOR}"'"
  }
}'

echo

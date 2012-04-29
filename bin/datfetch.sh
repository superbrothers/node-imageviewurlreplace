#!/bin/sh

DAT_URL="http://blizzardkite.sakura.ne.jp/streamingplayer/files/imageviewurlreplace"
DAT_PATH="`dirname $0`/../ImageViewURLReplace.dat"
FETCH_DIR="`dirname $0`"
FETCH_PATH="$FETCH_DIR/ImageViewURLReplace.dat"

# fetch
TARGET_REVISION=`curl --max-redirs 3 --location --url "$DAT_URL" | grep -o -E "ImageViewURLReplace[0-9]+\.zip" | tail -n 1`
DAT_URL="$DAT_URL/$TARGET_REVISION"
RESPONSE=`curl --max-redirs 3 --location --url "$DAT_URL" --output "$FETCH_DIR/dat.zip" --write-out "\n%{response_code}"`

# check status
STATE=`echo "$RESPONSE" | tail -n 1 | grep -o -E "[0-9]+"`
if [ ! "X$STATE" = "X200" ]; then
  echo "$STATE Error : Failed to fetch the ImageViewURLReplace.dat"
  test -f "$FETCH_DIR/dat.zip" rm "$FETCH_DIR/dat.zip"
  exit 1
fi

# decompress
unzip -o "$FETCH_DIR/dat.zip" -d "$FETCH_DIR"
if [ $? -ne 0 -o ! -f "$FETCH_PATH" ]; then
  echo "Decompress Error : Not Found ImageViewURLReplace.dat"
  test -f "$FETCH_DIR/dat.zip" rm "$FETCH_DIR/dat.zip"
  exit 1
fi
rm "$FETCH_DIR/dat.zip"

# convert
cat "$FETCH_PATH" | iconv -f CP943 -t UTF8 | tr -d "\r" > "$FETCH_PATH.convert"
if [ $? -ne 0 ]; then
  rm "$FETCH_PATH"
  test -f "$FETCH_PATH.convert" rm "$FETCH_PATH.convert"
  exit 1
fi
rm "$FETCH_PATH"

# atomic overide
mv "$FETCH_PATH.convert" "$DAT_PATH"
if [ $? -ne 0 ]; then
  rm "$FETCH_PATH.convert"
  exit 1
fi

echo "\033[32mSuccessfully\033[39m"
exit 0

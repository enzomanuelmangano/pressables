#!/usr/bin/env bash
# Run the ennio e2e flows against the installed example app on the emulator.
# Lives in a file (not inline) because android-emulator-runner executes its
# `script:` under /bin/sh (dash), which mangles multi-line loops.
set -uo pipefail

adb install -r -g "$APK_PATH"

PASS=0
FAIL=0
for f in example/.maestro/*.yaml; do
  if npx --yes @reactiive/ennio test "$f" --android --disable-reuse-app --verbose; then
    PASS=$((PASS + 1))
  else
    echo "RETRY $f"
    if npx --yes @reactiive/ennio test "$f" --android --disable-reuse-app --verbose; then
      PASS=$((PASS + 1))
    else
      echo "FAIL $f"
      FAIL=$((FAIL + 1))
    fi
  fi
done

echo "Android e2e: pass=$PASS fail=$FAIL"
[ "$FAIL" -eq 0 ]

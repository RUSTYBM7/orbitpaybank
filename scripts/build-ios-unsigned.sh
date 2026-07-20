#!/usr/bin/env bash
# Build unsigned iOS artifacts locally.
# Requires: macOS, Xcode, Node 20+, pnpm, CocoaPods.
#
# Produces:
#   build/orbitpaybank.xcarchive
#   build/orbitpaybank.app
#   build/orbitpaybank-unsigned.ipa
#   build/*.dSYM
#   build/*.log
#   build/build-manifest.json
#   build/release-metadata.json

set -euo pipefail

PROJECT_NAME="orbitpaybank"
BUNDLE_ID="${BUNDLE_ID:-com.rustybm.orbitpaybank}"
SCHEME="${SCHEME:-$PROJECT_NAME}"
CONFIGURATION="${CONFIGURATION:-Release}"
BUILD_DIR="build"
ARCHIVE_PATH="$BUILD_DIR/$PROJECT_NAME.xcarchive"
ARTIFACTS_DIR="$BUILD_DIR/artifacts"
WORKSPACE="ios/$PROJECT_NAME.xcworkspace"

echo "=========================================="
echo " iOS unsigned build"
echo " Bundle ID:      $BUNDLE_ID"
echo " Scheme:         $SCHEME"
echo " Configuration:  $CONFIGURATION"
echo " Workspace:      $WORKSPACE"
echo "=========================================="

# 1. Install JS deps
echo "[1/8] Installing JS dependencies"
pnpm install --frozen-lockfile

# 2. Run expo prebuild (idempotent)
echo "[2/8] Running expo prebuild"
npx expo prebuild --platform ios --no-install --clean

# 3. Pod install
echo "[3/8] Running pod install"
(cd ios && pod install --repo-update)

# 4. Bundle JS
echo "[4/8] Bundling JS"
mkdir -p "$BUILD_DIR/jsbundle"
npx expo export:embed \
  --platform ios \
  --dev false \
  --bundle-output "$BUILD_DIR/jsbundle/main.jsbundle" \
  --assets-dest "$BUILD_DIR/jsbundle/assets" \
  --sourcemap-output "$BUILD_DIR/jsbundle/main.jsbundle.map"

# 5. Build (no signing, all arches)
echo "[5/8] xcodebuild build"
xcodebuild \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -sdk iphoneos \
  -destination 'generic/platform=iOS' \
  -derivedDataPath "$BUILD_DIR/DerivedData" \
  CODE_SIGNING_ALLOWED=NO \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGN_IDENTITY="" \
  DEVELOPMENT_TEAM="" \
  PROVISIONING_PROFILE_SPECIFIER="" \
  ENABLE_BITCODE=NO \
  DEBUG_INFORMATION_FORMAT=dwarf-with-dsym \
  ONLY_ACTIVE_ARCH=NO \
  build | tee "$BUILD_DIR/xcodebuild-build.log"

# 6. Archive
echo "[6/8] xcodebuild archive"
xcodebuild \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -sdk iphoneos \
  -destination 'generic/platform=iOS' \
  -derivedDataPath "$BUILD_DIR/DerivedData" \
  -archivePath "$ARCHIVE_PATH" \
  CODE_SIGNING_ALLOWED=NO \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGN_IDENTITY="" \
  DEBUG_INFORMATION_FORMAT=dwarf-with-dsym \
  archive | tee "$BUILD_DIR/xcodebuild-archive.log"

# 7. Locate .app + package as .ipa
echo "[7/8] Packaging .ipa"
APP_PATH=$(find "$BUILD_DIR/DerivedData" -name "*.app" -path "*${CONFIGURATION}-iphoneos*" -print -quit)
if [ -z "$APP_PATH" ]; then
  echo "ERROR: no .app found"
  find "$BUILD_DIR/DerivedData" -name "*.app" -type d
  exit 1
fi
mkdir -p "$BUILD_DIR/Payload"
cp -R "$APP_PATH" "$BUILD_DIR/Payload/"
(cd "$BUILD_DIR" && zip -r "$PROJECT_NAME-unsigned.ipa" Payload >/dev/null)

# 8. Collect artifacts
echo "[8/8] Collecting artifacts"
mkdir -p "$ARTIFACTS_DIR"
cp -R "$APP_PATH" "$ARTIFACTS_DIR/$PROJECT_NAME.app"
[ -d "$ARCHIVE_PATH" ] && cp -R "$ARCHIVE_PATH" "$ARTIFACTS_DIR/$PROJECT_NAME.xcarchive"
[ -f "$BUILD_DIR/$PROJECT_NAME-unsigned.ipa" ] && cp "$BUILD_DIR/$PROJECT_NAME-unsigned.ipa" "$ARTIFACTS_DIR/"
find "$BUILD_DIR/DerivedData" -name "*.dSYM" -type d -exec cp -R {} "$ARTIFACTS_DIR/" \; || true
mkdir -p "$ARTIFACTS_DIR/jsbundle"
cp -R "$BUILD_DIR/jsbundle/." "$ARTIFACTS_DIR/jsbundle/" 2>/dev/null || true
mkdir -p "$ARTIFACTS_DIR/logs"
cp "$BUILD_DIR"/*.log "$ARTIFACTS_DIR/logs/" 2>/dev/null || true

cat > "$ARTIFACTS_DIR/build-manifest.json" <<JSON
{
  "platform": "ios",
  "configuration": "$CONFIGURATION",
  "scheme": "$SCHEME",
  "bundle_id": "$BUNDLE_ID",
  "code_signing": "disabled",
  "build_url": "local"
}
JSON

cat > "$ARTIFACTS_DIR/release-metadata.json" <<JSON
{
  "app_name": "$PROJECT_NAME",
  "app_version": "$(node -p "require('./package.json').version")",
  "build_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "git_sha": "$(git rev-parse HEAD 2>/dev/null || echo unknown)",
  "runner": "local"
}
JSON

echo ""
echo "=========================================="
echo " BUILD COMPLETE"
echo " Artifacts: $ARTIFACTS_DIR"
echo "=========================================="
ls -lh "$ARTIFACTS_DIR"/

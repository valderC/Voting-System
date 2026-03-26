#!/bin/sh
# ----------------------------------------------------------------------------
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
# ----------------------------------------------------------------------------

# ----------------------------------------------------------------------------
# Apache Maven Wrapper startup batch script, version 3.3.2
#
# Optional ENV vars
#   JAVA_HOME - location of a JDK home dir
#   MAVEN_OPTS - parameters passed to the Java VM when running Maven
# ----------------------------------------------------------------------------

set -euf
[ "${MVNW_VERBOSE-}" != true ] || set -x

# OS specific support.
native_path() { printf %s\\n "$1"; }
case "$(uname)" in
CYGWIN* | MINGW*)
  [ -z "${JAVA_HOME-}" ] || JAVA_HOME="$(cygpath --unix "$JAVA_HOME")"
  native_path() { cygpath --path --windows "$1"; }
  ;;
esac

# set JAVA_HOME to default if not set
if [ -z "${JAVA_HOME-}" ]; then
  if [ -x /usr/libexec/java_home ]; then
    JAVA_HOME="$(/usr/libexec/java_home)" || true
  fi
fi

# Determine the Java command to use to start the JVM.
if [ -n "${JAVA_HOME-}" ]; then
  if [ -x "$JAVA_HOME/jre/sh/java" ]; then
    # IBM's JDK on AIX uses strange locations for the executables
    JAVACMD="$JAVA_HOME/jre/sh/java"
  else
    JAVACMD="$JAVA_HOME/bin/java"
  fi
  if [ ! -x "$JAVACMD" ]; then
    die "ERROR: JAVA_HOME is set to an invalid directory: $JAVA_HOME

Please set the JAVA_HOME variable in your environment to match the
location of your Java installation."
  fi
else
  JAVACMD="$(
    'set' +e
    'unset' -f command 2>/dev/null
    'command' -v java
  )" || :
  if [ ! -x "${JAVACMD-}" ]; then
    die "ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.

Please set the JAVA_HOME variable in your environment to match the
location of your Java installation."
  fi
fi

# hash://
MVNW_REPO_DEFAULT='https://repo.maven.apache.org/maven2'
MVNW_REPO="${MVNW_REPOURL:-$MVNW_REPO_DEFAULT}"

warn() { echo "$*"; } >&2
die() {
  warn "$*"
  exit 1
}

# parse distributionUrl and optional wrapperUrl from maven-wrapper.properties
while IFS="=" read -r key value; do
  case "${key-}" in
  distributionUrl) distributionUrl="${value-}" ;;
  wrapperUrl) wrapperUrl="${value-}" ;;
  wrapperSha256Sum) wrapperSha256Sum="${value-}" ;;
  distributionSha256Sum) distributionSha256Sum="${value-}" ;;
  esac
done <"${0%/*}/.mvn/wrapper/maven-wrapper.properties"
[ -n "${distributionUrl-}" ] || die "Could not find 'distributionUrl' in ${0%/*}/.mvn/wrapper/maven-wrapper.properties"

# prepare tmp dir
if TMP_DOWNLOAD_DIR="$(mktemp -d)" && [ -d "$TMP_DOWNLOAD_DIR" ]; then
  clean() { rm -rf -- "$TMP_DOWNLOAD_DIR"; }
  trap clean HUP INT TERM EXIT
else
  die "cannot create temp dir"
fi

mvnw_verbose() { :; }
[ "${MVNW_VERBOSE-}" != true ] || mvnw_verbose() { printf %s\\n "${1-}"; }

# Download via curl or wget
mvnw_download() {
  local url="$1" target="$2"
  mvnw_verbose "Downloading $url"
  if command -v curl > /dev/null; then
    curl -fsSL --retry 3 -o "$target" "$url" || return
  elif command -v wget > /dev/null; then
    wget -q --tries=3 -O "$target" "$url" || return
  else
    die "curl or wget required to download"
  fi
}

# checksum verification
verify_checksum() {
  local file="$1" expected="$2"
  if [ -z "$expected" ]; then return 0; fi
  local actual
  if command -v sha256sum > /dev/null; then
    actual="$(sha256sum "$file" | cut -d' ' -f1)"
  elif command -v shasum > /dev/null; then
    actual="$(shasum -a 256 "$file" | cut -d' ' -f1)"
  else
    warn "checksum verification skipped (no sha256sum/shasum)"
    return 0
  fi
  if [ "$actual" != "$expected" ]; then
    die "checksum mismatch for $file (expected=$expected, actual=$actual)"
  fi
}

# maven home
case "${distributionUrl-}" in
*-bin.zip | *-bin.tar.gz) ;;
*) die "distributionUrl is not valid, must end with *-bin.zip or *-bin.tar.gz, but found: ${distributionUrl-}" ;;
esac

# compute maven home from the distribution URL
distributionUrlNameMain="${distributionUrl##*/}"
distributionUrlName="${distributionUrlNameMain%%\?*}"
distributionUrlNameDir="${distributionUrlName%-bin.*}"

MAVEN_USER_HOME="${MAVEN_USER_HOME:-${HOME}/.m2}"
MAVEN_HOME="${MAVEN_USER_HOME}/wrapper/dists/${distributionUrlNameDir}"

if [ -d "$MAVEN_HOME" ]; then
  mvnw_verbose "found existing MAVEN_HOME=$MAVEN_HOME"
else
  mvnw_verbose "MAVEN_HOME=$MAVEN_HOME not found, downloading..."
  mkdir -p -- "$MAVEN_HOME" || die "unable to create $MAVEN_HOME"

  mvnw_download "$distributionUrl" "$TMP_DOWNLOAD_DIR/$distributionUrlName" || die "failed to download $distributionUrl"
  verify_checksum "$TMP_DOWNLOAD_DIR/$distributionUrlName" "${distributionSha256Sum-}"

  mvnw_verbose "extracting $TMP_DOWNLOAD_DIR/$distributionUrlName to $MAVEN_HOME"
  case "$distributionUrlName" in
  *.zip)
    unzip -q -o "$TMP_DOWNLOAD_DIR/$distributionUrlName" -d "$MAVEN_HOME" || die "failed to unzip"
    ;;
  *.tar.gz)
    tar xzf "$TMP_DOWNLOAD_DIR/$distributionUrlName" -C "$MAVEN_HOME" || die "failed to extract tar"
    ;;
  esac

  # flatten directory structure if needed
  dir="$MAVEN_HOME/$distributionUrlNameDir"
  if [ ! -d "$dir" ]; then
    # find extracted directory
    dir="$(find "$MAVEN_HOME" -maxdepth 1 -type d -not -name "$(basename "$MAVEN_HOME")" | head -1)"
  fi
  if [ -d "$dir" ] && [ "$dir" != "$MAVEN_HOME" ]; then
    # move contents up
    mv -- "$dir"/* "$dir"/.* "$MAVEN_HOME"/ 2>/dev/null || true
    rmdir -- "$dir" 2>/dev/null || true
  fi
fi

MVN_CMD="$(find "$MAVEN_HOME" -name mvn -type f -path "*/bin/mvn" 2>/dev/null | head -1)"
if [ ! -x "${MVN_CMD-}" ]; then
  # try standard location
  MVN_CMD="$MAVEN_HOME/bin/mvn"
fi

if [ ! -x "$MVN_CMD" ]; then
  chmod +x "$MVN_CMD" 2>/dev/null || true
fi

if [ ! -x "$MVN_CMD" ]; then
  die "unable to find mvn executable in $MAVEN_HOME"
fi

exec "$MVN_CMD" "$@"

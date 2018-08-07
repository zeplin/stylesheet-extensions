#!/bin/bash
set -e

BASEDIR=$(cd "$(dirname $(dirname "$BASH_SOURCE"))" && pwd)
BUILDDIR=$BASEDIR/lib

pushd $BASEDIR

npm run build

pushd $BUILDDIR

cp $BASEDIR/package.json ./
PKG_PATH=$BUILDDIR/$(npm pack)
rm -f ./package.json

popd

npm publish $PKG_PATH --access public

popd
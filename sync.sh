#!/bin/bash

rm -rf ../app-samples/nuxt3-app/node_modules/jtc-utils/src
rm -rf ../app-samples/nuxt3-app/node_modules/jtc-utils/cjs
rm -rf ../app-samples/nuxt3-app/node_modules/jtc-utils/lib
rm -rf ../app-samples/nuxt3-app/node_modules/jtc-utils/types
rm -f ../app-samples/nuxt3-app/node_modules/jtc-utils/package.json

cp -r ./src ../app-samples/nuxt3-app/node_modules/jtc-utils/src
cp -r ./cjs ../app-samples/nuxt3-app/node_modules/jtc-utils/cjs
cp -r ./lib ../app-samples/nuxt3-app/node_modules/jtc-utils/lib
cp -r ./types ../app-samples/nuxt3-app/node_modules/jtc-utils/types
cp ./package.json ../app-samples/nuxt3-app/node_modules/jtc-utils/package.json

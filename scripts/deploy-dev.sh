#!/bin/sh
# GitHub Pages(dev) 배포: 하위 경로로 빌드해서 gh-pages 브랜치에 올린다. 검색엔진 노출은 막아 둔다.
set -e
BASE_PATH=/documentsgiveaway/ PUBLIC_NOINDEX=1 npm run build
touch dist/.nojekyll
printf 'User-agent: *\nDisallow: /\n' > dist/robots.txt
TMP=$(mktemp -d)
cp -R dist/. "$TMP"
cd "$TMP"
git init -q -b gh-pages
git add -A
git commit -qm "dev 배포 $(date '+%Y.%m.%d %H:%M')"
git push -qf "$(git -C "$OLDPWD" remote get-url origin)" gh-pages
rm -rf "$TMP"
echo "https://hubhub5.github.io/documentsgiveaway/"

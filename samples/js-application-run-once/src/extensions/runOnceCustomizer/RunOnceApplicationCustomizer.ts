
# 1) 元のモノレポを履歴やブロブを極力落とさず取得（no-checkout）
git clone --no-checkout --filter=tree:0 https://github.com/pnp/sp-dev-fx-extensions.git
cd sp-dev-fx-extensions

# 2) sparse-checkout を初期化し、取り出したいサンプルパスを指定
git sparse-checkout init --cone
git sparse-checkout set samples/js-application-run-once   # ←ここを目的のサンプルパスに

# 3) 対象ブランチをチェックアウト（例：main）
git checkout main

# 4) 取り出したサンプルを、独立した新規フォルダへコピー（あるいは移動）
#   ※WindowsならエクスプローラーでコピーでもOK
mkdir ../my-auto-reload-ext
cp -r samples/js-application-run-once/* ../my-auto-reload-ext/

# 5) そのフォルダを新規Gitリポジトリとして初期化＆コミット
cd ../my-auto-reload-ext
git init
git add .
git commit -m "Import sample js-application-run-once from pnp/sp-dev-fx-extensions"

# 6) GitHubで事前に作った空のリポジトリを origin に設定してPush
git branch -M main
git remote add origin https://github.com/<your-account>/<your-repo>.git
git push -u origin main

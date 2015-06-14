VisuAlive Web Starter v1.2.1
=============================

VisuAlive Web Starter は、HTML コーディングをなるべく早く始められるようするためのスターターキットです。  
CSS フレームワークに ZURB 社の Foundation を採用しています。

## Use of programming language and build tool
VisuAlive Web Starter は CSS プリプロセッサの Sass、タスクランナーに Gulp を採用しています。  
予め Ruby、Sass、Compass、Node.js、ImageMagic、Gulp、Bower をインストールしておいてください。  

> 参考サイト : [Mac OSX での開発環境構築](http://designinglabo.com/1019/mac-os-x-web-development-environment.html)

## Editing SourceFiles
以下のコマンド実行後、ファイルの編集が可能になります。

```sh
$ cd /Users/YOURNAME/va-web-starter/_source/
$ bower install
$ sudo npm install
$ gulp
```
※ Windows の場合は sudo は不要です。

## Settings
ECT ファイルのセッティングは `_source/settings.ect.json` 、画像サムネイルの自動生成並びに画像の圧縮レベルの設定は `_source/settings.img.json` で設定します。

### settings.ect.json
**ssiteName :** サイト名。default : VisuAlive Web Starter  
**siteURL :** モックアップ上のサイトURL。default : "http://localhost:3000/"  
※ 初期設定では BrowserSync のポート番号に合わせています。  
**slider :** この項目は不要。サンプルスライダーを組み込むために使用。

### settings.img.json
**settings.pngQuality :** PNG 画像の圧縮レベルを 0 〜 100 の間で設定。値が高くなるほど品質重視。default : "60-80"  
**settings.pngSpeed :** PNG 画像の圧縮処理の実行速度を 1 〜 10 の間で設定。値が高くなるほど速度重視。default : 5  
**settings.jpgQuality :** JPEG 画像の圧縮レベルを 0 〜 100 の間で設定。値が高くなるほど品質重視。default : 70  
**settings.jpgProgressive :** プログレッシブ JPEG にするかの設定。default : true  
**settings.gifInterlaced :** プログレッシブレンタリングの為のインターレース GIF の設定。default : false
**adds :** サムネイル画像を生成したい画像のファイルパスを配列で指定。

## Directory Structure

HTML モックアップの初期ディレクトリ構造です。  
※ _source/ ディレクトリは、クライアントへ納品する時やウェブ公開時には不要です。

```
.
├── _source
│   ├── ect
│   ├── font
│   ├── img
│   ├── js
│   ├── scss
│   │   ├── _settings.scss
│   │   └── style.scss
│   ├── bower.json
│   ├── config.rb
│   ├── csscomb.json
│   ├── ect.json
│   ├── gulpfile.js
│   └── package.json
├── assets
│   ├── css
│   ├── font
│   ├── img
│   └── js
├── .gitignore
├── README.md
└── index.html
```

## Gulp Tasks
* [ect] テンプレートエンジン ECT ファイルのビルド
* [scss] Scss ファイルのビルドと CSS ファイルの圧縮
* [jsLib] 複数の JS ファイルを結合圧縮
* [jsIE] 複数の JS ファイルを結合圧縮
* [js] JS ファイルの圧縮
* [jsCopy] JS ファイルを `_source/js/` ディレクトリから `assets/js/` へコピーする
* [img] 画像ファイルの圧縮 (キャッシュ有)
* [imgBuild] 画像ファイルの圧縮 (キャッシュ無)
* [imgThumb] サムネイル画像の生成 (キャッシュ有)
* [imgThumbBuild] サムネイル画像の生成 (キャッシュ無)
* [font] フォントファイルを `_source/font/` ディレクトリから `assets/font/` へコピーする
* [browserSync] Browser-sync
* [browserSyncReload] Browser-sync
* [clear] キャッシュファイルの削除
* [clean] `*.html` ファイルの削除、`assets/css/`、`assets/js/`、`assets/img/`、`assets/font/` を空にする
* [delete] `*.sass-cache/`、`*.gitkeep` の削除を行う
* [build] clean、scss、ect、jsLib、jsIE、js、imgBuild、imgThumbBuild、font、jsCopy、clear、deleteの順で行う
* [watch] Scss、JS、フォント、画像、HTML、PHP の監視
* [default] clean、scss、ect、jsLib、jsIE、js、imgBuild、imgThumbBuild、font、jsCopy、browserSync、watch を行う

## Things to be aware of when using
`*.html`、`assets/css/`、`assets/js/`、`assets/img/`、`assets/src/font/` は、Gulp 起動時並びに build タスク実行時に、一旦空になる事に注意。

## LICENSE
Dual licensed under the MIT License or GNU General Public License v2.0 ( or later ).

## ToDo
* もっと効率よく高速に処理できるように Gulpfile の改修を行う。( Pull Request 歓迎 ! ! ）

## Changelog
* 2015/06/14  
v1.2.1 - 画像の圧縮方法の変更、サムネイル画像の自動生成タスクを追加。
* 2015/06/14  
v1.1.0 - Upgrade.
* 2015/02/09  
v1.0.0 - First commit.

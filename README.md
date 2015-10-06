VisuAlive Web Starter v1.3.0
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
$ cd /Users/YOURNAME/va-web-starter/
$ bower install
$ sudo npm install
$ gulp
```

※ Windows の場合は sudo は不要です。

## Settings
ECT ファイルのセッティングは \_source/settings.ect.json、画像サムネイルの自動生成並びに画像の圧縮レベルの設定は gulpfile.js の `settings.img` で設定します。

### settings.ect.json

| 項目      | 説明                                                     | 初期値                |
|:----------|:---------------------------------------------------------|:----------------------|
| ssiteName | サイト名                                                 | VisuAlive Web Starter |
| siteURL   | モックアップ上のサイトURL                                | /                     |
| slider    | この項目は不要。サンプルスライダーを組み込むために使用。 |                       |

### settings.img（gulpfile.js）

| 項目           | 説明                                                                        | 初期値 |
|:---------------|:----------------------------------------------------------------------------|:-------|
| pngQuality     | PNG 画像の圧縮レベルを 0 〜 100 の間で設定。値が高くなるほど品質重視        | 60-80  |
| pngSpeed       | PNG 画像の圧縮処理の実行速度を 1 〜 10 の間で設定。値が高くなるほど速度重視 | 5      |
| jpgQuality     | JPEG 画像の圧縮レベルを 0 〜 100 の間で設定。値が高くなるほど品質重視       | 70     |
| jpgProgressive | プログレッシブ JPEG にするかの設定                                          | true   |
| gifInterlaced  | プログレッシブレンタリングの為のインターレース GIF の設定                   | true   |

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
├── assets
│   ├── css
│   ├── font
│   ├── img
│   └── js
├── .csscomb.json
├── .gitignore
├── bower.json
├── gulpfile.js
├── index.html
├── package.json
├── README.md
└── settings.ect.json
```

## Gulp Tasks

| タスク            | 説明                                                                                                |
|:------------------|:----------------------------------------------------------------------------------------------------|
| ect               | テンプレートエンジン ECT ファイルのビルド                                                           |
| scss              | Scss ファイルのビルドと CSS ファイルの圧縮                                                          |
| js                | 複数の JS ファイルを結合圧縮                                                                        |
| jsIE              | 複数の JS ファイルを結合圧縮                                                                        |
| jsCopy            | JS ファイルを `bower_components/` ディレクトリから `assets/js/` へコピーする                        |
| img               | 画像ファイルの圧縮                                                                                  |
| font              | フォントファイルを `_source/font/` ディレクトリから `assets/font/` へコピーする                     |
| browserSync       | Browser-sync                                                                                        |
| browserSyncReload | Browser-sync                                                                                        |
| clear             | キャッシュファイルの削除                                                                            |
| clean             | `*.html` ファイルの削除、`assets/css/`、`assets/js/`、`assets/img/`、`assets/font/` を空にする      |
| delete            | `*.sass-cache/`、`*.gitkeep` の削除を行う                                                           |
| build             | clean、scss、ect、jsLib、jsIE、js、imgBuild、imgThumbBuild、font、jsCopy、clear、deleteの順で行う   |
| watch             | Scss、JS、フォント、画像、HTML、PHP の監視                                                          |
| default           | clean、scss、ect、jsLib、jsIE、js、imgBuild、imgThumbBuild、font、jsCopy、browserSync、watch を行う |

## Things to be aware of when using

`*.html`、`assets/css/`、`assets/js/`、`assets/img/`、`assets/src/font/` は、Gulp 起動時並びに build タスク実行時に、一旦空になる事に注意。

## License

Dual licensed under the MIT License or GNU General Public License v2.0 ( or later ).

## ToDo

* もっと効率よく高速に処理できるように Gulpfile の改修を行う。( Pull Request 歓迎 ! ! ）

## Changelog

* 2015/10/06  
v1.3.0 - Gulpfile、ディレクトリ構造の変更。
* 2015/07/20  
v1.2.2 - Update bower.json & package.json
* 2015/06/14  
v1.2.1 - 画像の圧縮方法の変更、サムネイル画像の自動生成タスクを追加。
* 2015/06/14  
v1.1.0 - Upgrades.
* 2015/02/09  
v1.0.0 - First commit.

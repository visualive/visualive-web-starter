VisuAlive Web Starter v2.00
=============================

VisuAlive Web Starter は、HTML コーディングをなるべく早く始められるようするためのスターターキットです。CSS フレームワークに ZURB 社の Foundation を採用しています。

## Use of programming language and build tool

VisuAlive Web Starter は CSS プリプロセッサの Sass、タスクランナーに Gulp を採用しています。予め Ruby、Sass、Compass、Node.js、ImageMagic、Gulp、Bower をインストールしておいてください。  

> 参考サイト : [Mac OSX での開発環境構築](http://designinglabo.com/1019/mac-os-x-web-development-environment.html)

## Editing SourceFiles

以下のコマンド実行後、ファイルの編集が可能になります。

```sh
$ cd /Users/YOURNAME/va-web-starter/
$ npm run bower install
$ npm install
$ npm run gulp
```
## Settings
ECT ファイルのセッティングは .ect.json、画像サムネイルの自動生成並びに画像の圧縮レベルの設定は gulpfile.js の img タスクで設定します。

### .ect.json

| 項目      | 説明                                                       | 初期値                |
|:----------|:-----------------------------------------------------------|:----------------------|
| ssiteName | サイト名                                                   | VisuAlive Web Starter |
| siteURL   | モックアップ上のサイトURL                                  | /                     |
| slider    | この項目は不要。<br>サンプルスライダーを組み込むために使用 |                       |

### img タスク（gulpfile.js）

| 項目           | 説明                                                                         | 初期値 |
|:---------------|:-----------------------------------------------------------------------------|:-------|
| PNG Quality     | PNG 画像の圧縮レベルを 0 〜 100 の間で設定。値が高くなるほど品質重視        | 60-80  |
| PNG Speed       | PNG 画像の圧縮処理の実行速度を 1 〜 10 の間で設定。値が高くなるほど速度重視 | 5      |
| JPG Quality     | JPEG 画像の圧縮レベルを 0 〜 100 の間で設定。値が高くなるほど品質重視       | 70     |
| JPG Progressive | プログレッシブ JPEG にするかの設定                                          | true   |

## Directory Structure

HTML モックアップの初期ディレクトリ構造です。  
※ _source/ ディレクトリは、クライアントへ納品する時やウェブ公開時には不要です。

```
.
├── _source
│   ├── ect
│   │   ├── inc
│   │   │   └── _slider.ect
│   │   └── layout
│   │   │   └── _default.ect
│   │   └── index.ect
│   ├── font
│   │   ├── slick.eot
│   │   ├── slick.svg
│   │   ├── slick.ttf
│   │   └── slick.woff
│   ├── img
│   │   ├── ajax-loader.gif
│   │   ├── girl.jpg
│   │   └── girl2.jpg
│   ├── js
│   │   └── apps.js
│   └── scss
│        ├── _normalize.scss
│        ├── _settings.scss
│        ├── _slick.scss
│        ├── _slick-theme.scss
│        └── style.scss
├── assets
│   ├── css
│   ├── font
│   ├── img
│   └── js
├── .csscomb.json
├── .ect.json
├── .gitignore
├── bower.json
├── gulpfile.js
├── index.html
├── package.json
└── README.md
```

## Gulp Tasks

| タスク            | 説明                                                                                                |
|:------------------|:----------------------------------------------------------------------------------------------------|
| ect               | テンプレートエンジン ECT ファイルのビルド                                                           |
| scss              | Scss ファイルのビルド                                                                               |
| js                | 複数の JS ファイルを結合圧縮                                                                        |
| js:ie             | 複数の IE 用 JS ファイルを結合圧縮                                                                  |
| js:copy           | JS ファイルを `bower_components/` ディレクトリから `assets/js/` へコピーする                        |
| img               | 画像ファイルの圧縮                                                                                  |
| font              | フォントファイルを `_source/font/` ディレクトリから `assets/font/` へコピーする                     |
| browserSync       | Browser-sync                                                                                        |
| browserSyncReload | Browser-sync                                                                                        |
| clear             | キャッシュの削除                                                                                    |
| clean             | `*.html` ファイル etc の削除、`assets/css/`、`assets/js/`、`assets/img/`、`assets/font/` を空にする |
| archives          | zip ファイルを作成                                                                                  |
| supply            | clear、clean 後、scss、ect、js、js:ie、js:copy、img、archives を行う                                |
| watch             | Scss、JS、フォント、画像、HTML、PHP の監視                                                          |
| default           | clear、clean 後、scss、ect、js、js:ie、js:copy、img、browserSync、watch を行う                      |

## Things to be aware of when using

`*.html`、`assets/css/`、`assets/js/`、`assets/img/`、`assets/src/font/` は、Gulp 起動時並びに build タスク実行時に、一旦空になる事に注意。

## License

Dual licensed under the MIT License or GNU General Public License v2.0 ( or later ).

## Changelog

* 2015/11/11  
v2.0.0 - Gulpfile を全面的にリニューアル。
* 2015/10/07  
v1.4.2 - ビルド時に archive 関連を削除。
* 2015/10/06  
v1.4.1 - Gif 画像の圧縮処理を削除。
* 2015/10/06  
v1.4.0 - Zip 圧縮タスクの追加。
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

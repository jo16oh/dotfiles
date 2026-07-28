# mise の brew backend が bottle の placeholder を置換しない

- 調査日: 2026-07-28
- mise: `2026.7.15 macos-arm64 (2026-07-27)`
- 環境: macOS arm64 / prefix `/opt/homebrew`

## 要約

mise が Homebrew の bottle を注ぐとき、**テキストファイル中の `@@HOMEBREW_*@@`
placeholder が未置換のまま残る**。Mach-O バイナリのリロケーションは正しく動く
ため、「バイナリは動くがスクリプトは動かない」という壊れ方をする。

この repo では **`stow` が壊れる**。dotfiles の適用そのものが止まるので、
`/opt/homebrew` を作り直す運用は現状取れない。

## 背景: なぜ placeholder があるか

bottle は特定の prefix 向けにビルド済みのバイナリ。そのままでは別の場所に
置けないので、Homebrew は bottle 作成時に埋め込まれた絶対パスをトークンに
置換してから tar に固める。

| トークン | 展開先 |
| --- | --- |
| `@@HOMEBREW_PREFIX@@` | `/opt/homebrew` |
| `@@HOMEBREW_CELLAR@@` | `/opt/homebrew/Cellar` |
| `@@HOMEBREW_PERL@@` | `/usr/bin/perl5.34` |

pour する側がこれを実パスに戻す責任を負う。`@@HOMEBREW_PERL@@` の展開先が
prefix 内ではなく**システム側の perl** である点に注意 — 単純な prefix 置換
では再現できない。

## 症状

置換には 2 系統あり、mise は片方しか実装していない。

| 対象 | 方式 | mise |
| --- | --- | --- |
| Mach-O バイナリ | load command (`install_name` / rpath) の書き換え | 実装済み |
| テキストファイル | 文字列置換 | **未実装** |

Mach-O 側は正常。テスト prefix に注いだ fish の依存 dylib は正しく書き換わる:

```console
$ otool -L brewtest/Cellar/fish/4.8.1/bin/fish
  .../brewtest/opt/pcre2/lib/libpcre2-8.0.dylib
```

テキスト側は生のトークンが残る:

```console
$ head -1 brewtest/Cellar/stow/2.4.1/bin/stow
#!@@HOMEBREW_PERL@@                    # mise

$ head -1 /opt/homebrew/Cellar/stow/2.4.1/bin/stow
#!/usr/bin/perl5.34                    # 本物の Homebrew
```

fish が動いて stow が壊れるのは、fish が Mach-O 実行ファイルで stow が Perl
スクリプトだから。動く / 動かないの境界が Mach-O とテキストの境界に一致する。

## 影響

### 1. shebang 破壊 → 起動しない (実行ファイル 9 個)

```
stow, chkstow
autoconf, autoheader, autoreconf, autom4te, autoscan, autoupdate, ifnames
```

```console
$ brewtest/bin/stow --version
bad interpreter: @@HOMEBREW_PERL@@: no such file or directory
```

### 2. pkg-config メタデータの汚染 → ビルドが失敗する (`.pc` 30 個)

```console
$ grep prefix= brewtest/.../xorgproto/.../xproto.pc
prefix=@@HOMEBREW_CELLAR@@/xorgproto/2025.1     # mise

$ grep prefix= /opt/homebrew/.../xproto.pc
prefix=/opt/homebrew/Cellar/xorgproto/2025.1    # 本物
```

X11 系にリンクするビルドが `-I@@HOMEBREW_CELLAR@@/...` を掴んで死ぬ。
shebang と違いエラーがビルド時にしか出ないので、原因特定が遅れる。

### 3. サービス定義

`colima/0.10.3/homebrew.mxcl.colima.plist` に
`@@HOMEBREW_PREFIX@@/opt/colima/bin/colima` が残る。この repo は
`brew 'colima', restart_service: true` でこの plist を使っているので、
mise が注いだ keg に差し替えると **launchd agent が起動しなくなる**。
lima の `share/lima/templates/homebrew-macos.yaml` も同様。

### 定量

| | placeholder が残るファイル |
| --- | --- |
| 本物の Homebrew (62 keg) | **0** |
| mise (61 keg) | **43** |

本物の Cellar 全体を走査してゼロなので、Homebrew 側の仕様ではなく mise の欠落。

Brewfile が宣言している formula のうち直接影響を受けるのは `stow` / `autoconf`
/ `colima` / `lima`。加えて依存で入る `xorgproto`。

## 再現手順

`MISE_SYSTEM_BREW_PREFIX` (未文書。`strings $(which mise)` で発見) で
prefix を差し替えられるので、実環境を壊さずに再現できる。

```console
$ mkdir -p /tmp/bs && printf '[bootstrap.packages]\n"brew:stow" = "latest"\n' > /tmp/bs/mise.toml
$ mise trust /tmp/bs/mise.toml
$ env PATH=/usr/bin:/bin MISE_SYSTEM_BREW_PREFIX=/tmp/brewtest \
    /opt/homebrew/bin/mise -C /tmp/bs bootstrap packages apply -y
$ head -1 /tmp/brewtest/Cellar/stow/*/bin/stow
#!@@HOMEBREW_PERL@@
```

### 再現時の落とし穴 (実際に踏んだ)

- **`mise -C <dir>` はグローバル設定の読み込みを止めない。**
  `~/.config/mise/config.toml` の `[bootstrap.packages]` がマージされるので、
  ローカルに 1 個だけ書いても宣言済み全部が対象になる。
- **`MISE_SYSTEM_BREW_PREFIX` が効くのは formula だけ。**
  cask は実の `/Applications` にインストールされる。検証のつもりで
  `apply` すると実環境のアプリが更新される。**必ず `--dry-run` を使う。**

## この repo への判断

placeholder 問題は **mise が新規に注いだ keg にしか出ない**。本物の Homebrew
が既に注いだ `/opt/homebrew` の 62 keg は正しく置換済み。したがって:

- **Homebrew 本体だけ削除して keg を残す** → 影響なし。既存 keg をそのまま使える
- **完全アンインストール → mise で再 pour** → `stow` が壊れる。実質不可

### 経緯

2026-07-28 に Brewfile を `[bootstrap.packages]` へ移す検証を一通り行った
(`mise bootstrap packages status` は 47 件すべて `installed` を返し、既存 keg
の検出自体は問題なく動く)。ただし:

- mise が cask として扱えないものが 6 個ある
  (`adobe-creative-cloud` は installer artifact 非対応、
  `microsoft-{word,excel,powerpoint,teams}` は pkg installer choices 非対応、
  `microsoft-auto-update` はインストール検出が効かない)。
  これらは Homebrew に委譲するか手動管理になる
- 上の placeholder 問題で Homebrew 本体は結局消せない

両者を合わせると「パッケージマネージャが 1 つ減る」という移行の主目的が
達成できず、管理の手数だけが増えると判断して **Brewfile 運用を継続**した。
移行の実装は `migrate-brewfile-to-mise-bootstrap` ブランチに残してある。

再挑戦するなら、placeholder の修正と cask artifact 対応 (installer /
pkg choices) の両方が upstream に入ってからでよい。

## upstream

`gh search issues --repo jdx/mise` を `HOMEBREW_PERL` / `placeholder bottle` /
`brew relocation` で検索したが該当 issue は見つからなかった (検索が拾えて
いないだけの可能性はある)。未報告。

# JTC-utils

<!-- npm publish -->

JTC-utils は、日本の伝統的な企業では必要とされることが多いにも関わらず、他国ではさほど必要されないため、ライブラリとして提供されにくい日本環境特有の関数/クラス群を提供します。

このような機能群は Java では見かけることがありますが、JavaScript/Node.js 向けで機能が揃っているものがなかったため新たに作成しました。

なお、このライブラリでは次の方針に基づき開発しています。

- 国際化は目標とせず、日本語/英語環境のみをターゲットにする。
- lodash に存在する機能は実装しない。

## インストール

```sh
npm install jtc-utils
```

## 使い方

このライブラリは４つのサブライブラリから構成されています。

|モジュール名       |概要                                                              |
|==================|==================================================================|
|jtc-utils         |文字列処理や CSV や固定長ファイルの入出力機能などの機能を提供します。   |
|jtc-utils/node    |Node.js 向けに拡張された CSV や固定長ファイルの入出力機能を提供します。|
|jtc-utils/charset |日本語文字コード用のエンコード/デコード機能を提供します                |

### jtc-utils (core)

#### getLocale - 現在のロケールを取得する

```javascript
import { getLocale } from "jtc-utils"

getLocale() // -> "ja"
```

#### getTimeZone - 現在のタイムゾーンを取得する

```javascript
import { getTimeZone } from "jtc-utils"

getTimeZone() // -> "Asia/Tokyo"
```

#### JapaneseEra - 元号を表す定数クラス

```javascript
import { JapaneseEra } from "jtc-utils"

JapaneseEra.REIWA.toLocaleString("ja") // -> "令和"
JapaneseEra.of(new Date(2023, 1, 1)) // -> JapaneseEra.REIWA
JapaneseEra.from("昭和") // -> JapaneseEra.SHOWA
```

※明治以降しか対応していません

#### formatDate - Date を書式を使って文字列に変換する

```javascript
import { formatDate } from "jtc-utils/text"

console.log(formatDate(new Date(2023, 1, 1), "uuuu/MM/dd")) // -> "2023/01/01"
```

#### CsvReader - CSV ファイルを読み込む

```javascript
import { CsvReader } from "jtc-utils/io"
```

### jtc-utils/node

#### CsvReader - CSV ファイルを読み込む

```javascript
import { CsvReader } from "jtc-utils/io/node"
```

### jtc-utils/charset

```javascript
import { utf8, utf16be, utf16le, windows31j, eucjp, cp930, cp939 } from "jtc-utils/charset"

const decoder = windows31j.createDecoder()
decoder.encode(Uint8Array.of(0x88, 0x9F)) // -> "亜"

const encoder = windows31j.createEncoder()
encoder.encode("亜") // -> Uint8Array.of(0x88, 0x9F)
```

サポートする文字コードは次の通りです。

|モジュール  |説明                               |
|===========|===================================|
|utf8       |UTF-8                              |
|utf16be    |UTF-16BE                           |
|utf16le    |UTF-16LE                           |
|windows31j |Windows-31J (Windows 版 SHIFT_JIS) |
|eucjp      |EUC-JP                             |
|cp930      |IBM CP930 (EBCDIC + IBM漢字)       |
|cp939      |IBM CP939 (EBCDIC + IBM漢字)       |


## License

このライブラリは、MIT license にてライセンスされています。

 * MIT license
   ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

# JTC-utils

<!-- npm publish -->

JTC-utils は、日本の伝統的な企業では必要とされることが多いにも関わらず、他国ではさほど必要されないため、ライブラリとして提供されにくい日本環境特有の関数/クラス群を提供します。

このような機能群は Java ではしばしば見かけますが、JavaScript/Node.js 向けとして良いものが見つからなかったので新たに作成しました。

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
|jtc-utils         |JavaScript の標準機能の不足を補う API 群を提供します。               |
|jtc-utils/text    |文字列処理用の API 群を提供します。                                  |
|jtc-utils/charset |日本語文字コード用のエンコード/デコード機能を提供します                |
|jtc-utils/io      |CSV や固定長ファイルの入出力機能を提供します。                        |
|jtc-utils/io/node |Node.js 向けに拡張された CSV や固定長ファイルの入出力機能を提供します。|

### jtc-utils (core)

#### getLocale - 現在のロケールを取得する

```javascript
import { getLocale } from "jtc-utils"

const locale = getLocale()
console.log(locale) // -> ja
```

#### getTimeZone - 現在のタイムゾーンを取得する

```javascript
import { getTimeZone } from "jtc-utils"

const locale = getTimeZone()
console.log(locale) // -> Asia/Tokyo
```

#### DayOfWeek - 曜日を表す定数クラス

```javascript
import { DayOfWeek } from "jtc-utils"

console.log(DayOfWeek.SUNDAY.toLocaleString("ja")) // -> 日曜日
```

#### JapaneseEra - 元号を表す定数クラス

```javascript
import { JapaneseEra } from "jtc-utils"

console.log(JapaneseEra.REIWA.toLocaleString("ja")) // -> 令和
console.log(JapaneseEra.from(new Date(2023, 1, 1))) // -> JapaneseEra.REIWA
```

### jtc-utils/text

```javascript
import { ... } from "jtc-utils/text"
```

### jtc-utils/charset

```javascript
import { ... } from "jtc-utils/charset"
```

### jtc-utils/io

```javascript
import { ... } from "jtc-utils/io"
```

### jtc-utils/io/node

```javascript
import { ... } from "jtc-utils/io/node"
```


## License

このライブラリは、MIT license にてライセンスされています。

 * MIT license
   ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

# JTC-utils (Utilities for Japanese Traditional Companies)

<!-- npm publish -->

JTC-utils は、伝統的な日本企業では必要とされるにも関わらず、他国ではさほど必要されないため、あまり提供されない次のような日本環境特有の関数/クラス群を提供します。

- 和歴をサポートする日付のパース/書式化
- 数値書式に基づく数値のパース/書式化
- ひらがな、カタカナ、半角カナ、全銀カナ、MS漢字の文字チェックや変換処理
- CSV や 固定長ファイルの入出力

このような機能は、エンタープライズで主流となっている Java での実装は良く見かけますが、JavaScript/Node.js 向けで機能が揃っているものがなかったため、新たに作成しました。

なお、このライブラリでは次の方針に基づき開発しています。

- 国際化は目標とせず、日本語/英語環境のみをターゲットにする。
- [lodash](https://lodash.com/) に存在する機能は実装しない。
- Tree shaking 可能にする。

## インストール

```sh
npm install jtc-utils
```

## 使い方

このライブラリは3つのサブモジュールから構成されています。

|モジュール名       |概要                                                              |
|------------------|------------------------------------------------------------------|
|jtc-utils         |文字列処理や CSV や固定長ファイルの入出力機能などの機能を提供します。   |
|jtc-utils/locale  |和歴を含む各種ロケール情報を提供します。                              |
|jtc-utils/charset |日本語文字コード用のエンコード/デコード機能を提供します                |

### jtc-utils (コア機能)

#### parseDate - 文字列を書式に従い Date に変換する

指定した文字列を書式に従い Date に変換します。

日付として解釈できない文字列が指定された場合は null を返します。

```typescript
parseDate(
  // 日付として解釈する文字列です。
  str: string | null | undefined,

  // 書式文字列です。
  // 詳細は [`date-fns` の parse 関数の説明](https://date-fns.org/docs/parse) を参照してください。
  format?: string,

  // オプションです。
  options?: {
    // ロケールです。
    // デフォルトはシステム環境が日本語の場合 ja その他は enUS が指定されたものと扱われます。
    // フランス語などを指定したい場合は明示的に設定が必要です。和歴の場合は jaJPUCaJapanse を指定します。
    locale: Locale,

    // タイムゾーンです。
    // デフォルトはシステム環境の値を使います。
    timeZone: string
  }
): Date?
```

##### 例

```javascript
import { parseDate } from "jtc-utils"

parseDate("2000/01/01", "uuuu/MM/dd") // -> new Date(2000, 0, 1)
```

#### formatDate - 日付を書式に従い文字列に変換する

指定した日付を書式に従い文字列に変換します。

日付として解釈できない値が指定された場合には空文字列を返します。

```typescript
formatDate(
  // 文字列化する日付です。
  // number はエポックミリ秒、string は ISO 日付として解釈されます。
  date: Date | number | string | null | undefined,

  // 書式文字列です。
  // 詳細は [`date-fns` の format 関数の説明](https://date-fns.org/docs/format) を参照してください。
  format: string,

  // オプションです。
  options?: {
    // ロケールです。
    // デフォルトはシステム環境が日本語の場合 ja その他は enUS が指定されたものと扱われます。
    // フランス語などを指定したい場合は明示的に設定が必要です。和歴の場合は jaJPUCaJapanse を指定します。
    locale: Locale,

    // タイムゾーンです。
    // デフォルトはシステム環境の値を使います。
    timeZone: string
  }
): string
```

##### 例

```javascript
import { formatDate } from "jtc-utils"

formatDate(new Date(2023, 1, 1), "uuuu/MM/dd") // -> "2023/01/01"
```

#### parseNumber - 文字列を書式に従い Number に変換する

#### formatNumber - 数値を書式に従い文字列に変換する

#### isHiragana - 文字列がひらがなだけから構成されているか判定する

#### isKatakana - 文字列がカタカナだけから構成されているか判定する
#### isHalfwidthKatakana - 文字列が半角カナだけから構成されているか判定する
#### isZenginkana - 文字列が全銀カナだけから構成されているか判定する

#### isURL - 妥当な HTTP/HTTPS の URLか判定する

#### isSimpleEmail - 妥当なEメールアドレスか判定する

#### isWindows31j - 文字列が Windows-31J （ASCII+MS漢字コード）だけから構成されているか判定する
#### isWebSafeString - 文字列が Windows-31J （ASCII+MS漢字コード）だけから構成されているか判定する



#### CsvReader - CSV ファイルを読み込む

```javascript
import { CsvReader } from "jtc-utils/io"
```

#### CsvWriter - CSV ファイルを出力する

#### FixlenReader - 固定長ファイルを読み込む

#### FixlenWriter - 固定長ファイルを出力する

#### MemoryReadableStream - Uint8Array から読み込む ReadableStream

#### MemoryWritableStream - Uint8Array に出力する WritableStream

### jtc-utils/locale

`date-fns` のロケールに加え、和歴表示のため jaJPUCaJapanese (ja-JP-u-ca-japanese) が利用できます。

```javascript
import { enUS, ja, jaJPUCaJapanese } from "jtc-utils/locale"

formatDate(new Date(2000, 0, 1), "GGGGy/M/d", { locale: enUS }) // -> "Anno Domini2000/1/1"
formatDate(new Date(2000, 0, 1), "GGGGy/M/d", { locale: ja }) // -> "西暦2000/1/1"
formatDate(new Date(2000, 0, 1), "GGGGy/M/d", { locale: jaJPUCaJapanese }) // -> "平成12/1/1"
```

### jtc-utils/charset

日本で使われる各種文字コードのエンコーダ、デコーダが利用できます。次の文字コードがサポートされています。

主に CsvReader/Writer、FixlenReader/Writer の `charset` オプションを指定するために利用します。

|モジュール  |説明                               |
|-----------|-----------------------------------|
|utf8       |UTF-8                              |
|utf16be    |UTF-16BE                           |
|utf16le    |UTF-16LE                           |
|windows31j |Windows-31J (Windows 版 SHIFT_JIS) |
|eucjp      |EUC-JP                             |
|cp930      |IBM CP930 (EBCDIC + IBM漢字)       |
|cp939      |IBM CP939 (EBCDIC + IBM漢字)       |

```javascript
import { utf8, utf16be, utf16le, windows31j, eucjp, cp930, cp939 } from "jtc-utils/charset"

new CsvReader("a,b,c", { charset: windows31j })
```

## License

このライブラリは、MIT license にてライセンスされています。

 * MIT license
   ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

# JTC-utils (Utilities for Japanese Traditional Companies)

<!-- npm publish -->

JTC-utils は、伝統的な日本企業では必要とされるにも関わらず、他国ではさほど必要されないため、あまり提供されない次のような日本環境特有の関数/クラス群を提供します。

- 和歴を含むロケールとタイムゾーンをサポートする、書式ベースの日付のパース/文字列化
- ロケールをサポートする書式ベースの数値のパース/文字列化
- ひらがな、カタカナ、半角カナ、全銀カナ、MS漢字の文字チェックや変換処理
- レガシーな日本語向け文字セットによる CSV、固定長ファイルの入出力

このような機能は、エンタープライズで主流となっている Java での実装は良く見かけますが、JavaScript/Node.js 向けで機能が揃っているものがなかったため、新たに作成しました。

なお、このライブラリは次の方針に基づき開発しています。

- 国際化は必ずしも目標とせず、日/英環境のみをターゲットにする。
- [lodash](https://lodash.com/) に存在する機能は実装しない。
- Tree Shaking に対応する。

## インストール

```sh
npm install jtc-utils
```

## 使い方

このライブラリは3つのサブモジュールから構成されています。

<table>
<thead>
<tr><th>モジュール名</th><th>概要</th></tr>
</thead>
<tbody>
<tr><td>jtc-utils</td><td>文字列処理や CSV や固定長ファイルの入出力機能などの機能を提供します。<ul>
<li>parseDate, formatDate</li>
<li>parseNumber, formatNumber</li>
<li>isHiragana, isFullwidthKatakana, isHalfwidthKatakana, isZenginkana</li>
<li>isHttpURL, isEmail, isTelephoneNo</li>
<li>isWindows31j, isUnicodeBMP, isWebSafeString</li>
<li>toNormalizedString</li>
<li>toFullwidth, toHalfwidth</li>
<li>toHiragana, toFullwidthKatakana, toZenginKana</li>
<li>CsvReader, CsvWriter</li>
<li>FixlenReader, FixlenWriter</li>
<li>MemoryReadableStream, MemoryWritableStream</li>
</ul></td></tr>
<tr><td>jtc-utils/locale</td><td>和歴を含む各種ロケール情報を提供します。</td></tr>
<tr><td>jtc-utils/charset</td><td>日本語文字コード用のエンコード/デコード機能を提供します。</td></tr>
</tbody>
</table>

### jtc-utils (コア機能)

#### parseDate - 文字列を書式に従い Date に変換する

指定した文字列を書式に従い Date に変換します。

日付として解釈できない文字列が指定された場合は null を返します。

```typescript
function parseDate(
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
    timeZone: string,
  }
): Date | undefined
```

##### 例

```typescript
import { parseDate } from "jtc-utils"

parseDate("2000/01/01", "uuuu/MM/dd") // -> new Date(2000, 0, 1)
```

#### formatDate - 日付を書式に従い文字列に変換する

指定した日付を書式に従い文字列に変換します。

日付として解釈できない値が指定された場合には空文字列を返します。

```typescript
function formatDate(
  // 文字列化する日付です。
  // number はエポックミリ秒、string は ISO 日付として解釈されます。
  date: Date | number | string | null | undefined,

  // 書式文字列です。例： uuuu/MM/dd HH:mm:ss.SSS
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
    timeZone: string,
  }
): string
```

##### 例

```typescript
import { formatDate } from "jtc-utils"

formatDate(new Date(2023, 1, 1), "uuuu/MM/dd") // -> "2023/01/01"
```

#### parseNumber - 文字列を書式に従い Number に変換する

指定した文字列を書式に従い Number に変換します。

変換に失敗した場合は undefined を返します。

```typescript
function parseNumber(
  // 数値として解釈する文字列です。
  str: string | null | undefined,

  // 書式文字列です。例： ###,##0.#
  // 0: 数字、#: 0のとき表示されない数字、,: 桁区切り、.: 小数点
  // ;: サブパターン区切り（正値のパターン;負値のパターン;ゼロのパターン）
  // '任意の文字列': 固定文字（' を含めるときは '' と記述します）
  format?: string,

  // オプションです。
  options?: {
    // ロケールです。
    // デフォルトはシステム環境が日本語の場合 ja その他は enUS が指定されたものと扱われます。
    locale?: Locale,
  }
): number | undefined
```

##### 例

```typescript
import { parseNumber } from "jtc-utils"
import { de } from "jtc-utils/locale"

parseNumber("100,000") // -> 100000
parseNumber("(100,000)", "###,##0;(###,##0)") // -> 100000
parseNumber("100.000", "###,##0", { locale: de }) // -> 100000
```

#### formatNumber - 数値を書式に従い文字列に変換する

指定した数値を書式に従い文字列に変換します。

数値として解釈できない値が指定された場合には空文字列を返します。

```typescript
function formatNumber(
  // 数値あるいは数値として解釈できる文字列です。
  num: string | number | null | undefined,

  // 書式文字列です。例： ###,##0.#
  // 0: 数字、#: 0のとき表示されない数字、,: 桁区切り、.: 小数点
  // ;: サブパターン区切り（正値のパターン;負値のパターン;ゼロのパターン）
  // '...': 固定文字（' を含めるときは '' と記述します）
  format?: string,

  // オプションです。
  options?: {
    // ロケールです。
    // デフォルトはシステム環境が日本語の場合 ja その他は enUS が指定されたものと扱われます。
    locale?: Locale,
  }
): string
```

##### 例

```typescript
import { formatNumber } from "jtc-utils"
import { de } from "jtc-utils/locale"

formatNumber(100000) // -> "100000"
formatNumber(-100000, "###,##0;(###,##0)") // -> "(100,000)"
formatNumber(100000, "###,##0", { locale: de }) // -> "100.000"
```

#### isHiragana - 文字列がひらがなだけから構成されているか判定する

文字列がひらがな、全角空白（U+3000）からのみ構成される場合、 true を返します。（中黒、長音記号、繰り返し記号、括弧、句読点は含まれません）

主に読み仮名、振り仮名のチェックに使うことを想定しています。

```typescript
function isHiragana(
  // 検査する文字列です。
  value: string | null | undefined,
): boolean
```

##### 例

```typescript
import { isHiragana } from "jtc-utils"

isHiragana("やまだ　たろう") // -> true
isHiragana("山田　太郎") // -> false
```

#### isFullwidthKatakana - 文字列が全角カタカナだけから構成されているか判定する

文字列が全角カタカナ、全角空白（U+3000）、中黒（U+30FB）、長音記号（U+30FC）からのみ構成される場合、 true を返します。（繰り返し記号、括弧、句読点は含まれません）

主に読み仮名、振り仮名のチェックに使うことを想定しています。

```typescript
function isFullwidthKatakana(
  // 検査する文字列です。
  value: string | null | undefined,
): boolean
```

##### 例

```typescript
import { isFullwidthKatakana } from "jtc-utils"

isFullwidthKatakana("ヤマダ・タロー") // -> true
isFullwidthKatakana("山田　太郎") // -> false
```

#### isHalfwidthKatakana - 文字列が半角カナだけから構成されているか判定する

文字列が半角カタカナ、半角空白（U+0020）、半角中黒（U+FF65）、半角長音記号（U+FF70）からのみ構成される場合、 true を返します。（括弧、句読点は含まれません）

主に読み仮名、振り仮名のチェックに使うことを想定しています。

```typescript
function isHalfwidthKatakana(
  // 検査する文字列です。
  value: string | null | undefined,
): boolean
```

##### 例

```typescript
import { isHalfwidthKatakana } from "jtc-utils"

isHalfwidthKatakana("ﾔﾏﾀﾞ･ﾀﾛｰ") // -> true
isHalfwidthKatakana("山田　太郎") // -> false
```

#### isZenginkana - 文字列が全銀カナだけから構成されているか判定する

文字列が銀行口座名義として使える文字のみから構成されている場合、 true を返します。

銀行口座名義として使える文字の仕様は以下の通りです。

- 半角数字、半角英字（大文字のみ）
- 半角カタカナ（濁点、半濁点は含むが、ｦ、小さい文字（ｧｨｩｪｫｯｬｭｮ）および長音記号は含まない）
- 半角丸括弧（()）、半角カギ括弧（｢｣）、半角スラッシュ（/）、半角円記号/バックスラッシュ（\）、半角ハイフン（-）、半角ピリオド（.）、半角スペース（ ）

```typescript
function isZenginkana(
  // 検査する文字列です。
  value: string | null | undefined,
): boolean
```

##### 例

```typescript
import { isZenginKana } from "jtc-utils"

isZenginKana("ﾔﾏﾀﾞ･ﾀﾛｰ") // -> true
isZenginKana("山田　太郎") // -> false
```

#### isHttpURL - 妥当な HTTP/HTTPS の URLか判定する

文字列が妥当な HTTP/HTTPS の URL であるか判定します。

```typescript
function isHttpURL(
  // 検査する文字列です。
  value: string | null | undefined,
): boolean
```

##### 例

```typescript
import { isHttpURL } from "jtc-utils"

isHttpURL("http://localhost:8080/test?param=value") // -> true
isHttpURL("https://www.google.co.jp/") // -> true
isHttpURL("mailto:test@example.com") // -> false
isHttpURL("ftp://test@example.com/test") // -> false
```

#### isEmail - 妥当なEメールアドレスか判定する

文字列が妥当な [HTML Web Standard で定義される妥当なメールアドレス](https://html.spec.whatwg.org/multipage/input.html#email-state-%28type=email%29)に合致するか判定します。

メールアドレスの定義としては [RFC 5321](https://www.rfc-editor.org/rfc/rfc5321.html)、[RFC 5322](https://www.rfc-editor.org/rfc/rfc5322.html) などがありますが、複雑すぎること、定義が複数あること、最終的に送信してみないと有効か判断できないことから、上記の定義でチェックするのが現状最善であると判断しています。

```typescript
function isEmail(
  // 検査する文字列です。
  value: string | null | undefined,
): boolean
```

##### 例

```typescript
import { isEmail } from "jtc-utils"

isEmail("test@example.com") // -> true
isEmail("あいう@example_com") // -> false
```

#### isTelephoneNo - 妥当な電話番号か判定する

文字列が妥当な電話番号と見なせるか判定します。

ITU-T E.164 に従い、国番号（"+" + 数字1～3桁）とハイフン区切りの数字からなり、合計15桁以内の場合に true を返します。日本で良く使われる市外局番を丸括弧でくくるケースもサポートしています。

世界には、1桁の電話番号も存在しているため、厳密なチェックはで難しいことに注意してください。

```typescript
function isTelephoneNo(
  // 検査する文字列です。
  value: string | null | undefined,
): boolean
```

##### 例

```typescript
import { isTelephoneNo } from "jtc-utils"

isTelephoneNo("0312345678") // -> true
isTelephoneNo("03-1234-5678") // -> true
isTelephoneNo("+81 090-1234-5678") // -> true
isTelephoneNo("+81 (090) 1234-5678") // -> true
isTelephoneNo("-81 (090) 1234-ABCD") // -> false
```

#### isWindows31j - 文字列が Windows-31J として利用可能な文字だけから構成されているか判定する

文字列が Windows-31J（Windows 環境用 SHIFT_JIS に対する IANA 登録名。ASCII、半角カナ、JIS非漢字、JIS第1/2水準漢字、NEC特殊文字、NEC選定IBM拡張文字、IBM拡張文字で構成される）で利用可能な文字だけから構成されていることを判定します。

主に Windows-31J で外部に連携される項目の入力チェックに使うことを想定しています。

```typescript
function isWindows31j(
  // 検査する文字列です。
  value: string | null | undefined,
): boolean
```

##### 例

```typescript
import { isWindows31j } from "jtc-utils"

isWindows31j("Aあｱ亜") // -> true
isWindows31j("€₩𠮟") // -> false
```

#### isUnicodeBMP - 文字列が Unicode の基本多言語面に含まれる文字だけから構成されているか判定する

文字列にサロゲートペアが含まれていない場合、true を返します。

主に追加多言語面をサポートしない文字セットで構成されたデータベースに格納できるかをチェックするために利用します。

```typescript
function isUnicodeBMP(
  // 検査する文字列です。
  value: string | null | undefined,
): boolean
```

##### 例

```typescript
import { isUnicodeBMP } from "jtc-utils"

isUnicodeBMP("Aあｱ亜€₩") // -> true
isUnicodeBMP("𠮟") // -> false
```

#### isWebSafeString - 文字列が Web 上で安全に使用できる文字だけから構成されているか判定する

文字列に次の文字が含まれない場合、true を返します。

- タブ（U+0009）、改行（U+000A、U+000D）を除く制御文字
- ユニコードカテゴリ Zl（区切/段落）、Zp（区切/制御）、Co（プライベート利用）、Cf（その他/書式）、Cn（その他/未定義）
- BOM（U+FEFF）、特殊文字（U+FFF0-U+FFFF）

```typescript
function isWebSafeString(
  // 検査する文字列です。
  value: string | null | undefined,
): boolean
```

##### 例

```typescript
import { isWebSafeString } from "jtc-utils"

isWebSafeString("Aあｱ亜") // -> true
isWebSafeString("\uFEFF\0") // -> false
```

#### toNormalizedString - 文字列を正規化します

文字列を正規化します。null、undefined が入力された場合には空文字列を返します。

正規化の仕様は以下の通りです。

- 字体の異なるCJK互換漢字を除き、NFC にて Unicode 正規化を行います。
- 改行コードを LF（U+000A）に統一します。

```typescript
function toNormalizedString(
  // 正規化対象の文字列です。
  value: string | null | undefined,
): string
```

##### 例

```typescript
import { toNormalizedString } from "jtc-utils"

toNormalizedString("Aあｱ亜欄\u304B\u3099\r\n") // -> "Aあｱ亜欄\u304C\n"
```

#### toFullwidth - 半角文字を全角文字に変換する

半角文字を全角文字に変換します。null、undefined が入力された場合にはそのままの値を返します。

```typescript
function toFullwidth(
  // 変換対象の文字列です。
  value: string | null | undefined,
): string | null | undefined
```

##### 例

```typescript
import { toFullwidth } from "jtc-utils"

toFullwidth("0Aｱｶﾞﾊﾟｰ") // -> "０Ａアガパー"
```

#### toHalfwidth - 全角文字を半角文字に変換する

全角文字を半角文字に変換します。null、undefined が入力された場合にはそのままの値を返します。

```typescript
function toHalfwidth(
  // 変換対象の文字列です。
  value: string | null | undefined,
): string | null | undefined
```

##### 例

```typescript
import { toFullwidth } from "jtc-utils"

toHalfwidth("0Aｱｶﾞﾊﾟｰ") // -> "０Ａアガパー"
```

#### toHiragana - カタカナをひらがなに変換する

全角/半角カタカナをひらがなに変換します。null、undefined が入力された場合にはそのままの値を返します。

半角カタカナの記号（｡｢｣､･ｰ）も例外的に全角文字に変換します。

```typescript
function toHiragana(
  // 変換対象の文字列です。
  value: string | null | undefined,
): string | null | undefined
```

##### 例

```typescript
import { toHiragana } from "jtc-utils"

toHiragana("アガサ・ｸﾘｽﾃｨｰ") // -> "あがさ・くりすてぃー"
```

#### toFullwidthKatakana - ひらがなと半角カタカナを全角カタカナに変換する

ひらがなと半角カタカナを全角カタカナに変換します。null、undefined が入力された場合にはそのままの値を返します。

半角カタカナの記号（｡｢｣､･ｰ）も例外的に全角文字に変換します。

```typescript
function toFullwidthKatakana(
  // 変換対象の文字列です。
  value: string | null | undefined,
): string | null | undefined
```

##### 例

```typescript
import { toFullwidthKatakana } from "jtc-utils"

toFullwidthKatakana("あがさ・ｸﾘｽﾃｨｰ") // -> "アガサ・クリスティー"
```

#### toZenginKana - ひらがな、カタカナ、記号を全銀カナに変換する

ひらがな、カタカナ、記号を可能な限り銀行口座名義で使える文字に変換します。null、undefined が入力された場合にはそのままの値を返します。

```typescript
function toZenginKana(
  // 変換対象の文字列です。
  value: string | null | undefined,
): string | null | undefined
```

##### 例

```typescript
import { toZenginKana } from "jtc-utils"

toZenginKana("アガサ・クリスティー") // -> "ｱｶﾞｻ.ｸﾘｽﾃｲ-"
```

#### CsvReader - CSV ファイルを読み込む

データソースから読み込んだデータを CSV として解析し、行データを取得します。

```typescript
const reader = new CsvReader(
  // 読み込みするデータソースです。
  src: string | Uint8Array | Blob | ReadableStream<Uint8Array> | FileHandle | Readable,

  // オプションです。
  options?: {
    // 文字セットです。
    // jtc-utils/charset から import した文字セットオブジェクトを指定します。
    // デフォルトは utf8 です。
    charset?: Charset,

    // 先頭に BOM にある場合に読み飛ばす場合 true
    // デフォルトは true です。
    bom?: boolean,

    // フィールドの区切り文字です。
    // デフォルトは "," です。
    fieldSeparator?: string,

    // 空行をスキップする場合 true
    // デフォルトは false です。
    skipEmptyLine?: boolean,

    // 変換できないなど無効なデータが見つかった時に Error にしたい場合 true
    // デフォルトは true です。
    fatal?: boolean,
  }
)

// reader はレコードを１行ずつ読み込むジェネレーターを実装しています。
reader: AsyncGenerator<string[]>

// 明示的に1行読み込むことも可能です。
reader.read(): Promise<string[]>

// 現在までに読み込んだレコード件数を取得します。
reader.count: number

// ストリームをクローズします。
reader.close(): Promise<void>
```

##### 例

```typescript
import { CsvReader } from "jtc-utils"
import { windows31j } from "jtc-utils/charset"
import fs from "node:fs"

const reader = new CsvReader(fs.createReadStream("sample.csv"), {
  charset: windows31j,
})
try {
  const result = []
  for await (const line of reader.read(layout)) {
    result.push(line)
  }
} finally {
  await reader.close()
}
```

read メソッドを明示的に呼びだすことでスキップなどの細かい制御も可能です。

```typescript
import { CsvReader } from "jtc-utils"
import { windows31j } from "jtc-utils/charset"
import fs from "node:fs"

const reader = new CsvReader(fs.createReadStream("sample.csv"), {
  charset: windows31j,
})
try {
  const result = []
  let line = reader.read() // 1行スキップ
  while (line = reader.read()) {
    result.push(line)
  }
} finally {
  await reader.close()
}
```

#### CsvWriter - CSV ファイルを出力する

配列を CSV として出力先に書き込みます。

```typescript
const writer = new FixlenReader(
  // 出力先です。
  dest: WritableStream<Uint8Array> | FileHandle | Writable,

  // オプションです。
  options?: {
    // 文字セットです。
    // jtc-utils/charset から import した文字セットオブジェクトを指定します。
    // デフォルトは utf8 です。
    charset?: Charset,

    // 先頭に BOM を出力する場合 true
    // デフォルトは charset に Unicode を指定した場合は true です。
    bom?: boolean,

    // フィールドの区切り文字です。
    // デフォルトは "," です。
    fieldSeparator?: string,

    // 行の区切り文字です。
    // デフォルトは "\r\n" です。
    lineSeparator?: string,

    // 全項目をクォートする場合 true
    // デフォルトは false（＝必要な時のみクォート）です。
    quoteAll?: boolean

    // 変換できないなど無効なデータが見つかった時に Error にしたい場合 true
    // デフォルトは true です。
    fatal?: boolean,
  }
)

// レコードを１行出力します。
writer.write(
  // 出力するデータです。
  record: any[],

  // オプションです。
  options?: {
    // 全項目をクォートする場合 true
    // デフォルトはコンストラクタのオプションに従います。
    quoteAll?: boolean
  }
): Promise<void>

// 現在までに出力したレコード件数を取得します。
writer.count: number

// ストリームをクローズします。
writer.close(): Promise<void>
```

##### 例

```typescript
import { CsvWriter } from "jtc-utils"
import { windows31j } from "jtc-utils/charset"
import fs from "node:fs"

const writer = new CsvWriter(fs.createWriteStream("sample.csv"), {
  charset: windows31j,
})
try {
  await writer.write(["012", "abc", "あいう"])
  await writer.write(["345", "def", "かきく"])
} finally {
  await writer.close()
}
```

#### FixlenReader - 固定長ファイルを読み込む

データソースから読み込んだデータを固定長ファイルとして解析し、行データを取得します。

```typescript
const reader = new FixlenReader(
  // 読み込みするデータソースです。
  src: string | Uint8Array | Blob | ReadableStream<Uint8Array> | FileHandle | Readable,

  // 設定です。
  config: {
    // 1行として切り出すバイト数です。
    lineLength: number,

    // レコードのレイアウト定義です。
    // レコードの値によってレイアウトを動的に変更する関数も指定できます。
    columns: FixlenReaderColumn[] |
      ((line: { decode(column: FixlenReaderColumn) }) => FixlenReaderColumn[]),

    // 文字セットです。
    // jtc-utils/charset から import した文字セットオブジェクトを指定します。
    // デフォルトは utf8 です。
    charset?: Charset,

    // 先頭に BOM を出力する場合 true
    // デフォルトは charset に Unicode を指定した場合は true です。
    bom?: boolean,

    // 文字セットをシフト状態にする場合 true
    // 主に漢字コードがシフト状態に割り当てられている文字セットで利用します。
    // デフォルトは false です。
    shift?: boolean,

    // 変換できないなど無効なデータが見つかった時に Error にしたい場合 true
    // デフォルトは true です。
    fatal?: boolean,
  }
)

// reader はレコードを１行ずつ読み込むジェネレーターを実装しています。
reader: AsyncGenerator<(string | number)[]>

// 明示的に1行読み込むことも可能です。
// オプションを指定することで、動的に切り出すサイズやレイアウトを変更できます。
reader.read(
  // オプションです。
  options?: {
    // 1行として切り出すバイト数です。
    lineLength: number,

    // レコードのレイアウト定義です。
    // レコードの値によってレイアウトを動的に変更する関数も指定できます。
    columns: FixlenReaderColumn[] |
      ((line: FixlenLineDecoder) => FixlenReaderColumn[]),

    // 文字セットをシフト状態にする場合 true
    // 主に漢字コードがシフト状態に割り当てられている文字セットで利用します。
    // デフォルトはコンストラクタのオプションに従います。
    shift?: boolean,
  }
): Promise<(string | number)[]>

// 現在までに読み込んだレコード件数を取得します。
reader.count: number

// ストリームをクローズします。
reader.close(): Promise<void>

// 解析前に行の一部を切り出すためのインターフェイスです。
interface FixlenLineDecoder {
  // 行の一部を切り出します。
  decode(column: FixlenReaderColumn): string | number
}

// 各フィールドの定義です。
declare type FixlenReaderColumn = {
  // フィールドの開始位置（バイト数）です。
  start: number,

  // フィールドの長さ（バイト数）です。
  length?: number,

  // 文字セットをシフト状態にする場合 true
  // 主に漢字コードがシフト状態に割り当てられている文字セットで利用します。
  shift?: boolean,

  // 読み込んだデータをトリムする場合の位置を指定します。
  // デフォルトはトリムなしです。
  trim?: "left" // 左トリム
    | "right" // 右トリム
    | "both", // 両側トリム

  // データの解釈を指定します。
  // 主に数値型として読み込む場合に利用します。
  type?: "decimal" // 数値
    | "int-le" // 符号あり整数（リトルエンディアン）
    | "int-be" // 符号あり整数（ビッグエンディアン）
    | "uint-le" // 符号なし整数（リトルエンディアン）
    | "uint-be" // 符号なし整数（ビッグエンディアン）
    | "zoned" // ゾーン10進数
    | "packed", // パック10進数
}
```

##### 例

```typescript
import { FixlenReader } from "jtc-utils"
import { windows31j } from "jtc-utils/charset"
import fs from "node:fs"

const reader = new FixlenReader(fs.createReadStream("sample.dat"), {
  lineLength: 14,
  columns: [{ start: 0 }, { start: 3 }, { start: 6, length: 6 }],
  charset: windows31j,
})
try {
  const result = []
  for await (const line of reader) {
    result.push(line)
  }
} finally {
  await reader.close()
}
```

read メソッドを明示的に呼びだすことでスキップなどの細かい制御も可能です。

```typescript
import { CsvReader } from "jtc-utils"
import { windows31j } from "jtc-utils/charset"
import fs from "node:fs"

const reader = new FixlenReader(fs.createReadStream("sample.csv"), {
  lineLength: 14,
  columns: [{ start: 0 }, { start: 3 }, { start: 6, length: 6 }],
  charset: windows31j,
})
try {
  const result = []
  let line = reader.read({  // 最初の10バイトをスキップ
    lineLength: 10,
    columns: [],
  })
  while (line = reader.read()) {
    result.push(line)
  }
} finally {
  await reader.close()
}
```

#### FixlenWriter - 固定長ファイルを出力する

配列を固定長ファイルとして出力先に書き込みます。

```typescript
const writer = new FixlenWriter(
  // 出力先です。
  dest: WritableStream<Uint8Array> | FileHandle | Writable,

  // 設定です。
  config: {
    // レコードのレイアウト定義です。
    columns: FixlenWriterColumn[],

    // 文字セットです。
    // jtc-utils/charset から import した文字セットオブジェクトを指定します。
    // デフォルトは utf8 です。
    charset?: Charset,

    // 先頭に BOM を出力する場合 true
    // デフォルトは charset に Unicode を指定した場合は true です。
    bom?: boolean,

    // 文字セットをシフト状態にする場合 true
    // 主に漢字コードがシフト状態に割り当てられている文字セットで利用します。
    // デフォルトは false です。
    shift?: boolean,

    // 余った領域を埋める文字を指定します。
    // デフォルトは " "（半角空白）です。
    filler?: string,

    // 行末に付与する文字を指定します。
    // デフォルトは未設定（＝改行なし）です。
    lineSeparator?: string,

    // 変換できないなど無効なデータが見つかった時に Error にしたい場合 true
    // デフォルトは true です。
    fatal?: boolean,
  },
)

// レコードを１行出力します。
writer.write(
  // 出力するデータです。
  record: any[],

  // オプションです。
  options?: {
    // レコードのレイアウト定義です。
    columns: FixlenWriterColumn[],

    // 文字セットをシフト状態にする場合 true
    // 主に漢字コードがシフト状態に割り当てられている文字セットで利用します。
    // デフォルトはコンストラクタの設定に従います。
    shift?: boolean

    // 余った領域を埋める文字を指定します。
    // デフォルトはコンストラクタの設定に従います。
    filler?: string,

    // 行末に付与する文字を指定します。
    // デフォルトはコンストラクタの設定に従います。
    lineSeparator?: string,
  }
): Promise<void>

// 現在までに出力したレコード件数を取得します。
writer.count: number

// ストリームをクローズします。
writer.close(): Promise<void>
```

##### 例

```typescript
import { FixlenWriter } from "jtc-utils"
import { windows31j } from "jtc-utils/charset"
import fs from "node:fs"

const writer = new FixlenWriter(fs.createWriteStream("sample.dat"), {
  columns: [{ length: 3 }, { length: 3 }, { length: 3 }],
  charset: windows31j,
  bom: true,
  lineSeparator: "\r\n",
})
try {
  await writer.write(["aaa", "bbb", "あいう"])
  await writer.write(["ddd", "eee", "かきく"])
} finally {
  await writer.close()
}
```

#### MemoryReadableStream - Uint8Array から ReadableStream を構築する

Uint8Array から ReadableStream を構築します。

主にユニットテストに利用します。

```typescript
const stream = new MemoryReadableStream(
  // 読み込むデータです。
  input: Uint8Array | Uint8Array[]
)
```

##### 例

```typescript
import { MemoryReadableStream } from "jtc-utils"
import { CsvReader } from "jtc-utils"

const stream = new MemoryReadableStream(Uint8Array.of(0x61, 0x62, 0x63))
const reader = new CsvReader(stream)
```

#### MemoryWritableStream - Uint8Array に出力する WritableStream を構築する

Uint8Array に出力する WritableStream を構築します。

主にユニットテストに利用します。

```typescript
const stream = new MemoryWritableStream()

// 書き込まれたデータを Uint8Array として取得します。
stream.toUint8Array()

// 書き込まれたデータを指定した文字コードを使って文字列に変換します。
stream.toString(encoding: string)
```

##### 例

```typescript
import { MemoryWritableStream } from "jtc-utils"
import { CsvWriter } from "jtc-utils"

const stream = new MemoryWritableStream()
const reader = new CsvWriter(stream)
...
stream.toString("euc-jp")
```

### jtc-utils/locale

`date-fns` のロケールに加え、和歴表示のため jaJPUCaJapanese (ja-JP-u-ca-japanese) が利用できます。

##### 例

```typescript
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

##### 例

```typescript
import { utf8, utf16be, utf16le, windows31j, eucjp, cp930, cp939 } from "jtc-utils/charset"

new CsvReader("a,b,c", { charset: windows31j })
```

## License

このライブラリは、MIT license にてライセンスされています。

 * MIT license
   ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

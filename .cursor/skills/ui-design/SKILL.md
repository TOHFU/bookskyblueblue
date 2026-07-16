---
name: ui-design
description: 本プロジェクトのUIデザイン戦略。UI実装、コンポーネント設計、スタイルガイド、アクセシビリティについて説明。UI設計時に参照。
---

# UI実装・スタイリング

## 画面設計

- デザインはモバイルファーストで作成し、レスポンシブデザインを考慮する
- Figmaで作成したデザインを忠実に再現するように実装する
- Auto LayoutやConstraintsを読み取り、画面サイズに応じて適切にレイアウトが変化するようにする
- ユーザーフィードバックを得るために、インタラクションのある要素には適切なホバーやアクティブ状態を設ける

### 各画面の概要

#### SPLASH SCREEN

PWAの機能を活用して、ホーム画面に追加した際のスプラッシュスクリーンを実装する

https://www.figma.com/design/iDXrNxsVTqDlnarpHRObY7/BookSkyBlueBlueApp?node-id=1-11&t=OFXASDHltN5XfkgI-4

#### TOP

保存済みの作品の一覧を表示する。作品はカード形式で表示し、カードには作品の作品名、著者名、底本初版発行年、文字遣い種別、底本親本出版社を表示する。カードには削除ボタン、詳細ボタンを設ける。削除ボタンをクリックすると、TOP-DELETE DIALOGが表示され、削除の確認を行う。詳細ボタンをクリックすると、TOP詳細画面（TOP DETAIL）に遷移する。0件の場合は、TOP-EMPTYSTATEを表示する。

https://www.figma.com/design/iDXrNxsVTqDlnarpHRObY7/BookSkyBlueBlueApp?node-id=1-24&t=OFXASDHltN5XfkgI-4

#### TOP-DELETE DIALOG

作品の削除を確認するダイアログ。作品の作品名を表示し、削除の確認を行う。削除を確定すると、IndexedDBから作品データを削除し、TOPに遷移する。キャンセルボタンを設け、クリックするとダイアログが閉じるようにする。

https://www.figma.com/design/iDXrNxsVTqDlnarpHRObY7/BookSkyBlueBlueApp?node-id=41-13857&t=OFXASDHltN5XfkgI-4

#### TOP-EMPTYSTATE

保存済みの作品の一覧が0件の場合に表示する画面。保存された作品がないことをユーザーに伝えるメッセージ表示する。
アイコンと、検索画面への遷移ボタンを設ける。検索画面への遷移ボタンをクリックすると、SEARCHに遷移する。

https://www.figma.com/design/iDXrNxsVTqDlnarpHRObY7/BookSkyBlueBlueApp?node-id=45-443&t=OFXASDHltN5XfkgI-4

#### TOP DETAIL

作品の詳細を表示する画面。作品の詳細情報（作品ID、作品名、サブタイトル、オリジナルタイトル、著者名、底本初版発行年、文字遣い種別、底本親本出版社、底本名）を表示する。作品の詳細情報はJSONで保持し、IndexedDBから取得する。READボタンを設け、クリックすると本文(BOOK-EVENPAGE / BOOK-ODDPAGE)画面に遷移する。Backボタンを設け、クリックするとTOPに遷移する。
また、作品詳細カードの下に、保存したブックマーク一覧をリスト表示する。ブックマークしたページと、そのページの最初の一文を表示する。最初の一文は２行で三点リーダ処理される。

https://www.figma.com/design/D0j5BYrtGVQvgdTyhiIIxA/BlueSkyBlueBlue?node-id=4064-4673&t=sV0ChReMlqPatEeb-4

#### SEARCH

青空文庫の書籍を検索する画面。インプットを1つ設け、インクリメンタルサーチを行う。検索する条件は、作品名、著者名、底本初版発行年、文字遣い種別、底本親本出版社とする。検索結果はサーバーコンポーネントからAPIで取得し、カード形式で表示する。カードには作品名、著者名、底本初版発行年、文字遣い種別、底本親本出版社を表示する。カードには作品詳細ボタンを設ける。作品詳細ボタンをクリックすると、SEARCH DETAILに遷移する。カードは10件ずつ表示し、追加ロードの機能を設ける。APIのコール中は最下部にLoadingを表示する。Closeボタンを設け、クリックするとTOPに遷移する。0件の場合は、SEARCH-EMPTYSTATEを表示する。

https://www.figma.com/design/iDXrNxsVTqDlnarpHRObY7/BookSkyBlueBlueApp?node-id=19-63&t=OFXASDHltN5XfkgI-4

#### SEARCH-EMPTYSTATE

検索結果が0件の場合に表示する画面。検索条件に合致する作品が見つからないことをユーザーに伝えるメッセージ表示する。メッセージの下部には、サンプルの検索条件を表示する。サンプルの検索条件をクリックすると、検索が実行される。Closeボタンを設け、クリックするとTOPに遷移する。

https://www.figma.com/design/iDXrNxsVTqDlnarpHRObY7/BookSkyBlueBlueApp?node-id=46-690&t=OFXASDHltN5XfkgI-4

#### SEARCH DETAIL

作品の詳細を表示する画面。作品の詳細情報（作品ID、作品名、サブタイトル、オリジナルタイトル、著者名、底本初版発行年、文字遣い種別、底本親本出版社、底本名）を表示する。作品の詳細情報はJSONで保持し、サーバーコンポーネントからAPIで取得する。ダウンロードボタンを設け、クリックするとDOWNLOADに遷移し、作品のダウンロードが開始される。Backボタンを設け、クリックするとSEARCHに遷移する。Closeボタンを設け、クリックするとTOPに遷移する。

https://www.figma.com/design/iDXrNxsVTqDlnarpHRObY7/BookSkyBlueBlueApp?node-id=25-9825&t=OFXASDHltN5XfkgI-4

#### DOWNLOAD

作品のダウンロード画面。ダウンロードの進捗を表示する。ダウンロードが完了したら、TOPに遷移する。
作品のダウンロードは青空文庫のXHTMLにアクセスし、IndexedDBに保存する形で行う。

https://www.figma.com/design/iDXrNxsVTqDlnarpHRObY7/BookSkyBlueBlueApp?node-id=41-4819&t=OFXASDHltN5XfkgI-4

#### BOOK-EVENPAGE / BOOK-ODDPAGE

作品の本文を表示する画面。作品の本文をIndexedDBから取得し、表示する。作品の本文はページネーションされており、ページごとに遷移できるようにする。ページの遷移は、スワイプ操作とページ下部のページネーションコントロールの両方で行えるようにする。Closeボタンを設け、クリックするとTOPに遷移する。一定時間操作しないと、ページネーションコントロールとCloseボタンがフェードアウトするようにする。操作すると再度表示されるようにする。
作品の表示はCSSを使用して行う。縦書きで表示し、ルビや傍点などの表現も可能な限り再現する。また、ページ番号を表示する。ページのレイアウトは、CSSのマルチカラムレイアウトを使用して行う。
TOP画面に戻る際、作品の閲覧位置を保存し、再度その作品を開いた際に前回の閲覧位置から表示するようにする。
ページネーションコントロールに、ブックマークボタンを設ける。ブックマークボタンをクリックすると、現在のページの位置を保存し、TOP DETAILのブックマーク一覧に表示されるようにする。
ブックマークボタンはON/OFFの状態を持ち、現在のページがブックマークされている場合はONの状態で表示するようにする。

##### パフォーマンス最適化（仮想スクロール化）

全ページを一度に描画するとDOM負荷が高いため、以下の戦略で最適化する：

- **チャンク分割**: 50ページ単位でコンテンツを分割し、チャンク単位で管理する
- **メモリバッファ**: 現在のページを含む3つのチャンク（前のチャンク・現在・次のチャンク）のみメモリに保持し、それ以外は削除する
- **スムーズな遷移**: 前後のチャンクがメモリに存在するため、ページ遷移時のちらつきなく高速にページを切り替えられる
- **レイアウト計算**: 各チャンク内でのページ位置計算は、チャンク内のローカルページ番号で行い、全体のページ番号にマップする

実装方法：

1. **初期化（useBookScreen）**
   - 全コンテンツでCSSマルチカラムレイアウトを計算し、総ページ数を確定させる
   - レイアウト計算完了後、`splitContentIntoChunks()` で50ページ単位にチャンク化

2. **チャンク管理（bookHtmlUtils）**
   - `CHUNK_SIZE = 50` - 1チャンク = 50ページ
   - `splitContentIntoChunks()` - HTMLを段落単位で分割し、文字数ベースでチャンク境界を決定
   - `getRequiredChunkIds()` - 現在ページから必要な3つのチャンクIDを計算

3. **ページ遷移時の動作**
   - `currentPage` 変更 → 必要なチャンク3つを計算
   - `innerRef.current.innerHTML` で必要なチャンクのみをDOMに設定
   - 不要なチャンクはメモリから削除

4. **テスト戦略**
   - ラージコンテンツ（1000ページ以上）での読み込みパフォーマンス測定
   - ページ遷移時のちらつきやレイアウト崩れの確認
   - ブックマーク・読書位置の保存が各チャンクで正確に機能するか確認

実装ファイル：
- [bookHtmlUtils.ts](src/components/screens/BookScreen/bookHtmlUtils.ts) - `splitContentIntoChunks()`, `getRequiredChunkIds()`
- [useBookScreen.ts](src/hooks/screens/useBookScreen.ts) - チャンク管理ロジック

https://www.figma.com/design/iDXrNxsVTqDlnarpHRObY7/BookSkyBlueBlueApp?node-id=30-376&t=OFXASDHltN5XfkgI-4
https://www.figma.com/design/iDXrNxsVTqDlnarpHRObY7/BookSkyBlueBlueApp?node-id=30-177&t=OFXASDHltN5XfkgI-4

#### ERROR DIALOG

エラーが発生した際に表示するダイアログ。エラーメッセージを表示し、ユーザーにエラーの内容を伝える。Closeボタンを設け、クリックするとダイアログが閉じるようにする。

https://www.figma.com/design/iDXrNxsVTqDlnarpHRObY7/BookSkyBlueBlueApp?node-id=46-955&t=OFXASDHltN5XfkgI-4

## デザイン

- デザインはFigmaで作成し、プロジェクトのデザインシステムを構築する
- 下記のリンクからFigmaのデザインファイルにアクセスできる

デザインシステム
https://www.figma.com/design/D0j5BYrtGVQvgdTyhiIIxA/BlueSkyBlueBlueComponent?node-id=12-184

画面デザイン
https://www.figma.com/design/iDXrNxsVTqDlnarpHRObY7/BookSkyBlueBlueApp?node-id=0-1

## コンポーネント設計

- コンポーネントは可能な限り再利用可能な形で設計し、必要に応じてサブディレクトリで整理する
- コンポーネントは単一の責任を持ち、1つの機能に集中するように設計する
- コンポーネントのスタイルは、Chakra UIのテーマ機能を活用して一貫性を保つようにする
- コンポーネントのアクセシビリティを考慮し、必要に応じてARIA属性を使用する
- コンポーネントを作成したら、Storybookにストーリーを追加して、ドキュメント化とテストを行うようにする
- 画面のレイアウトは、CSSグリッドやフレックスボックスを使用して柔軟に対応できるようにする
- 画面の配色は、コントラスト比を考慮してアクセシビリティを確保する
- 画面のアイコンは、必要に応じてSVGアイコンを使用し、アクセシビリティを考慮して適切な代替テキストを提供する

## Storybook

- Storybookを使用して、コンポーネントのドキュメントとテストを行う
- 各コンポーネントのpropsをControlsで操作できるようにし、コンポーネントの挙動を確認できるようにする
- 各コンポーネントは、正常な状態、エラー状態、ローディング状態など、さまざまな状態をカバーするストーリーを持つようにする
- Storybookのアドオンを活用して、アクセシビリティのテストや、レスポンシブデザインの確認を行う
- Storybookのドキュメントは、コンポーネントの使用方法や、受け取るプロパティの説明を含むようにする
- コンポーネントはStorybook上で、propsの変更に応じてリアルタイムで更新されるようにする
- 利用するChakra UIのコンポーネントは、Storybook上でカスタマイズされた状態を表示するストーリーを作成する

### 新規コンポーネント追加時のControls有効化パターン

1. meta.component = YourComponent + tags: ["autodocs"]
2. meta.args にデフォルト値
3. meta.argTypes で control の種類（select/radio/boolean/text）を指定
4. Playgroundストーリーに render: (args) => <YourComponent {...args} />

## アクセシビリティ (a11y)

- WCAG 2.1 AAを目指し、キーボード操作やスクリーンリーダーでの利用を考慮する
- フォーカス管理を適切に行い、ユーザーが現在どこにいるかを明確にする
- 色覚多様性を考慮し、色だけに頼らない情報伝達を行う
- フォーム要素には適切なラベルを提供し、エラーメッセージは明確でわかりやすいものにする
- 動的なコンテンツの更新は、スクリーンリーダーに通知されるようにする


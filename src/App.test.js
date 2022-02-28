// テストユーティリティ：https://ja.reactjs.org/docs/test-utils.html#simulate
// レシピ集：https://ja.reactjs.org/docs/testing-recipes.html
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import App from './App';

// 仮想コンテナ
let container = null;

// 前処理
beforeEach(() => {
  // index.jsの代わりにトップエレメントを作成
  container = document.createElement("div");
  document.body.appendChild(container);
});

// 後処理
afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

// 単純な描画の確認
it("renders main", async () => {
  await act(async () => {
    render(<App />, container);
  });

  // 固定で描画する要素の確認
  expect(container.textContent).toContain('フィルター');
});

// モックの確認
it("mock test", async () => {
  // 応答内容の定義
  const fakeResult = {
    '2022-01-01': 'ダミー'
  };
  // https://jestjs.io/ja/docs/jest-object#jestspyonobject-methodname
  // Mockの設定
  jest.spyOn(global, "fetch").mockImplementation(() =>
   // fetchは非同期処理のためPromiseを作成する
    Promise.resolve({
      // json()の置き換え。
      // json()も非同期処理のためPromiseを作成する
      json: () => Promise.resolve(fakeResult)
    })
  );

  // レンダリング完了を待つ。
  await act(async () => {
    render(<App />, container);
  });

  // 固定で描画する要素の確認
  expect(container.querySelector("li").textContent).toContain('ダミー');

  // モックの削除
  global.fetch.mockRestore();
});

// イベント発行のテスト
it("use event", async () => {

  // レンダリング完了を待つ。
  await act(async () => {
    render(<App />, container);
  });

  // 対象の取得
  let select = document.querySelector("[data-testid=select]");

  // イベント発行
  act(() => {
    select.dispatchEvent(new MouseEvent("change", { bubbles: true, composed: true }));
  });

  // 選択されている番号のチェック
  expect(select.selectedIndex).toBe(1);
});

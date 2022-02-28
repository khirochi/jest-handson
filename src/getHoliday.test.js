import getHoliday from './getHoliday';

it("fetch test", async () => {
  // 応答内容の定義
  const fakeResult = {
    '2022-01-01': '元日'
  };
  // https://jestjs.io/ja/docs/jest-object#jestspyonobject-methodname
  // Mockの設定
  const mock = jest.spyOn(global, "fetch").mockImplementation(() =>
   // fetchは非同期処理のためPromiseを作成する
    Promise.resolve({
      // json()の置き換え。
      // json()も非同期処理のためPromiseを作成する
      json: () => Promise.resolve(fakeResult)
    })
  );

  // テストコードの実行
  const result = await getHoliday();

  // 1回実行されていることを確認
  expect(mock).toHaveBeenCalledTimes(1);
  // fetchが呼び出された際のパラメータを確認
  expect(mock).toHaveBeenCalledWith('https://holidays-jp.github.io/api/v1/date.json');
  // 取得した値を確認
  expect(result[0].name).toContain('元日');

  // モックの削除
  global.fetch.mockRestore();
});

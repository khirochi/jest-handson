// 祝日リストの取得
export default async function getHoliday() {
  return await fetch('https://holidays-jp.github.io/api/v1/date.json')  // Web API の実行
    .then(response => response.json())  // 結果をJSON形式で受け取る。
    .then(json =>
      // プロパティの名前の配列を取得する。
      Object.keys(json)
        // プロパティの名前=日付,value=祝日名のため形式を変換する。
        .map(key => {
          return {
            date: key,      // 日付
            name: json[key] // 祝日名
          };
        }));
}

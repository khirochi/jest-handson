import { useEffect, useState } from 'react';

// フィルターの選択肢
const filterArray = ['2021','2022','2023'];

// 祝日リストの取得
// return:
//   [{date, name}]
//        date: 日付
//        name: 祝日名
async function getHoliday() {
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

// フィルター部分の表示
function Filter(props) {
  const { filter, setFilter } = props;

  // フィルター変更時のハンドラ
  const onChange = (event) => {
    // フィルター設定の更新
    setFilter(event.target.value);
  }

  return (
    <div>
      <span>フィルター</span>
      <select size={1} defaultValue={filter} onChange={onChange} data-testid="select">
        {filterArray
          // 配列をタグに変換
          .map((element, index) => <option key={element} value={index}>{element}年</option>)}
      </select>
    </div>
  );
}

// リスト部分の表示
function HolidayList(props) {
  const { holidays, filter } = props;

  return (
    <ul>
      {holidays
        // 年部分でフィルターする
        .filter(holiday => holiday.date.indexOf(filterArray[filter]) === 0)
        // 配列をタグに変換
        .map(holiday => <li key={holiday.date}>{holiday.date} : {holiday.name}</li>)}
    </ul>
  );
}

export default function App() {
  // 祝日のリストを保持するステートフック
  const [holidays, setHolidays] = useState([]);
  // 表示を制限するフィルター設定を保持するステートフック
  const [filter, setFilter] = useState(1);

  // 初回時にのみ実行する処理（副作用フック）
  useEffect(async () => {
    // 祝日のリストを取得する。
    setHolidays(await getHoliday());
  },[]);

  return (
    <div className="App">
      <Filter filter={filter} setFilter={setFilter} />
      <hr/>
      <HolidayList holidays={holidays} filter={filter} />
    </div>
  );
}

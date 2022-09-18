/**
 * Todo操作処理
 **/

import { PropertyName } from "typescript";

export function todo(): void {

	//datetime-localの初期value値に現在時間追加
	const timeInput =  document.querySelector('.control__formInput02') as HTMLInputElement;
	const now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  timeInput.value = now.toISOString().slice(0, -8);

	// todo入力情報を入れる配列
	let listItems = Array();

	// tableへ挿入関数
	const insertingTable = (todo: string, time: string, status: string) => {
		// trにclass付与
		let trClass = '';
		if (status === '1') {
			trClass = 'is-uncomplete';
		} else if (status === '2') {
			trClass = 'is-process';
		} else if (status === '3') {
			trClass = 'is-complete';
		}
		// selectにselected属性付与
		let statusToSelected1 = status === '1' ? 'selected="selected"' : '';
		let statusToSelected2 = status === '2' ? 'selected="selected"' : '';
		let statusToSelected3 = status === '3' ? 'selected="selected"' : '';

		const insertHtml = `
		<tr class="table__row ${trClass}" data-todoname="${todo}">
		<td>${todo}</td>
		<td>${time}</td>
		<td>
		<select name="" id="" class="table__select">
		<option value="1" class="table__selectItem" ${statusToSelected1}>未完</option>
		<option value="2" class="table__selectItem" ${statusToSelected2}>処理中</option>
		<option value="3" class="table__selectItem" ${statusToSelected3}>完了</option>
		</select>
		</td>
		<td>
		<button type="button" class="table__delButton">削除</button>
		</td>
		</tr>
		`;
		const targetTbody = document.querySelector('.table__tbody') as HTMLElement;
		if (targetTbody) {
			targetTbody.insertAdjacentHTML('afterbegin', insertHtml);
		}
	}


	// -- 新規追加 --
	const addBtn = document.querySelector('.control__addButton') as HTMLButtonElement;
	addBtn.addEventListener('click', () => {

		//入れる要素
		const todoInput =  document.querySelector('.control__formInput01');
		const todoInputVal =  (todoInput as HTMLInputElement).value;
		const timeInputVal = (timeInput as HTMLInputElement).value;

		// 2026-08-28T23:00 を2026/08/28 23:00の形式に変更
		const replacedTimeInputVal01 = timeInputVal.replace(/-/g, '/');
		const replacedTimeInputVal02 = replacedTimeInputVal01.replace(/T/g, ' ');

		// 空なら終了
		if(todoInputVal === '') {
			window.alert('todo名を入力してください。');
			return false;
		}

		// localStorageの準備
		//   入力情報をオブジェクトの配列に入れる
		const item = {
			todoVal: todoInputVal,
			todoTime: replacedTimeInputVal02,
			status: 1, //状態は1=未完が初期値
			isDeleted: false
		};
		listItems.push(item);

		//オブジェクトを復元できるように文字列(JSON)形式にする
		const listItemsString = JSON.stringify(listItems);

		// localStorageに保存、構文→localStorage.setItem(キー, データ)
		localStorage.setItem('mykey', listItemsString);

		insertingTable(todoInputVal, replacedTimeInputVal02, "1");
	});

	//ページ読込時に、localStorageからリスト呼び出し
	document.addEventListener('DOMContentLoaded', () => {
		const storageJson = localStorage.mykey;
		if(storageJson === undefined) {
			return false;
		}
		//呼び出し時は逆にオブジェクト形式に戻す
		listItems = JSON.parse(storageJson);
		listItems.forEach((item: { todoVal: string; todoTime: string; status: string; }) => {
			insertingTable(item.todoVal, item.todoTime, item.status);
		})
	});


	// 状態の変更 (追加要素への処理時のため、親要素にイベント設定)
	const tbody = document.querySelector('.table__tbody') as HTMLElement;
	tbody.addEventListener('change', (e) => {
		if ((e.target as HTMLElement).classList.contains('table__select')) {

			const selectValue = (e.target as HTMLSelectElement).value;
			const parent = (e.target as HTMLElement).closest('.table__row') as HTMLElement;
			//まず既存classは削除
			if (
				parent.classList.contains('is-uncomplete') ||
				parent.classList.contains('is-process') ||
				parent.classList.contains('is-complete')
			) {
				(parent as HTMLElement).classList.remove('is-uncomplete', 'is-process', 'is-complete');
			}

			if ((selectValue as string) === '1') {
				(parent as HTMLElement).classList.add('is-uncomplete');
			}
			if ((selectValue as string) === '2') {
				(parent as HTMLElement).classList.add('is-process');
			}
			if ((selectValue as string) === '3') {
				(parent as HTMLElement).classList.add('is-complete');
			}

			// localStorageへも変更を保存
			// btn data値
			const trDataVal = (parent as HTMLElement).dataset['todoname'] as string;
			// todoごと（特定のkeyのみ）更新するにはデータ取り出してから更新
			let storageJson = localStorage.mykey;
			//呼び出し時はオブジェクト形式に戻す
			let storageJsonObj = JSON.parse(storageJson);
			if (storageJsonObj) {
				//変更対象の要素のtodoVal値と一致させる
				//メモ：find()は、提供されたテスト関数を満たす配列内の要素を返す
				const changeValue = storageJsonObj.find(
					(item: { todoVal: string; }) => item.todoVal === trDataVal
				);
				//一致した削除対象のオブジェクトのstatusプロパティにvalue値(整数)を入れる
				changeValue.status = selectValue;


			}
			// JSONに変換し直してローカルストレージに再設定
			localStorage.setItem('mykey', JSON.stringify(storageJsonObj));
		}
	})

	// 削除する (追加要素への処理時のため、親要素にイベント設定)
	tbody.addEventListener('click', (e) => {
		if ((e.target as HTMLElement).classList.contains('table__delButton')) {
			const parent = (e.target as HTMLElement).closest('tr') as HTMLElement;
			const todoName = parent.querySelector('td:first-of-type') as HTMLElement;
			const todoNameValue = todoName.textContent;
			const confirmDel = window.confirm(`「${todoNameValue}」を削除しますか？`);
			//btn data値
			const trDataVal = (parent as HTMLElement).dataset['todoname'] as string;
			if (confirmDel) {
				(parent as HTMLElement).remove();
				// todoごと（特定のkeyのみ）削除するにはデータ取り出してから削除
				let storageJson = localStorage.mykey;
				//呼び出し時はオブジェクト形式に戻す
				let storageJsonObj = JSON.parse(storageJson);
				if (storageJsonObj) {

					//削除対象の要素のtodoVal値と一致させる
					//メモ：find()は、提供されたテスト関数を満たす配列内の要素を返す
					const delValue = storageJsonObj.find(
						(item: { todoVal: string; }) => item.todoVal === trDataVal
					);
					//一致した削除対象のオブジェクトのisDeletedプロパティにtrueを入れる
					delValue.isDeleted = true;

					//オブジェクトをfilter()で削除
					//メモ：filter()はオブジェクトのうちfalseのものを配列で返す
					const newStorageJsonObj = storageJsonObj.filter(
						(item: { isDeleted: boolean; }) => item.isDeleted === false
					);
					storageJsonObj = newStorageJsonObj;

					// JSONに変換し直してローカルストレージに再設定
					localStorage.setItem('mykey', JSON.stringify(storageJsonObj));

				}
			} else {
				return false;
			}
		}
	});
}

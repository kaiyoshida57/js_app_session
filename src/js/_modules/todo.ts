/**
 * Todo操作処理
 * @param { String } tableId - ラッパーID
 * ex: tab('tab');
 */

export function todo(tableId: string): void {

	//datetime-localのvalueに現在時間追加
	const timeInput =  document.querySelector('.control__formInput02') as HTMLInputElement;
	const date = new Date();
	const dateYear = date.getFullYear();
	const dateMonth = (date.getMonth() + 1).toString().padStart(2, '0');
	const dateDate = date.getDate();
	const hour = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	// console.log(dateYear+'-'+dateMonth+'-'+dateDate+' '+hour+':'+minutes); // => 2022-11-11 10:00

	timeInput.value = dateYear+'-'+dateMonth+'-'+dateDate+' '+hour+':'+minutes;

	// 新規追加
	const addBtn = document.querySelector('.control__addButton') as HTMLButtonElement;
	addBtn.addEventListener('click', () => {
	const todoInput =  document.querySelector('.control__formInput01');
	const timeInput =  document.querySelector('.control__formInput02');
	const todoInputVal =  (todoInput as HTMLInputElement).value;
	const timeInputVal = (timeInput as HTMLInputElement).value;
	const firstTr = document.querySelector('.table__row:first-of-type') as HTMLElement;
	// console.log((todoInput as HTMLInputElement).value, (timeInput as HTMLInputElement).value);

		const insertHtml = `
			<tr class="table__row is-uncomplete">
			<td>${todoInputVal}</td>
			<td>${dateYear}/${dateMonth}/${dateDate} ${hour}:${minutes}</td>
			<td>
			<select name="" id="" class="table__select">
			<option value="1" class="table__selectItem" selected="selected">未完</option>
			<option value="2" class="table__selectItem">処理中</option>
			<option value="3" class="table__selectItem">完了</option>
			</select>
			</td>
			<td>
			<button type="button" class="table__delButton">削除</button>
			</td>
			</tr>
			`;

			if (firstTr) {
				firstTr.insertAdjacentHTML('beforebegin', insertHtml);
			}
	});


	//状態の変更 (追加要素への時のため、親要素にイベント設定)
	const tbody = document.querySelector('.table__tbody') as HTMLElement;
	tbody.addEventListener('change', (e) => {
		if ((e.target as HTMLElement).classList.contains('table__select')) {

			const selectValue = (e.target as HTMLSelectElement).value;
			const parent = (e.target as HTMLElement).closest('.table__row') as HTMLElement;
			//まず既存classは削除
			if(
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

		}
	})

	// 削除する (追加要素への時のため、親要素にイベント設定)
		tbody.addEventListener('click', (e) => {
			if ((e.target as HTMLElement).classList.contains('table__delButton')) {
				const parent = (e.target as HTMLElement).closest('tr');
				const confirmDel = window.confirm('Todoを削除しますか？');
				if (confirmDel) {
					(parent as HTMLElement).remove();
				} else {
					return false;
				}
			}
		});
}

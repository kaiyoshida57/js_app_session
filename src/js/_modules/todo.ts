/**
 * タブ切り替え関数
 * @param { String } tableId - ラッパーID
 * ex: tab('tab');
 */

export function todo(tableId: string): void {

	// 完了にする
	const checkList = document.querySelectorAll('.table__check') as NodeList;
	checkList.forEach(item => {
		item.addEventListener('click', (e) => {
			const parent = (e.currentTarget as HTMLElement).closest('tr');
			const targetList = (parent as HTMLElement).querySelectorAll('td:nth-of-type(-n+3)');
			targetList.forEach(item => {
				item.classList.toggle('is-done');
			});
		});
	});

	// 削除する
	const delBtnList = document.querySelectorAll('.table__delButton') as NodeList;
	delBtnList.forEach(item => {
		item.addEventListener('click', (e) => {
			const parent = (e.currentTarget as HTMLElement).closest('tr');
			const confirmDel = window.confirm('Todoを削除しますか？');
			if (confirmDel) {
				(parent as HTMLElement).remove();
			} else {
				return false;
			}
		});
	});
}

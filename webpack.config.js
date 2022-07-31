module.exports = {
	// モード値を production に設定すると最適化された状態で、
	// development に設定するとソースマップ有効でJSファイルが出力される
	mode: "development",
	resolve: {
		extensions:['.ts','.js']
	},
	// メインのJS
	entry: {
		"common": "./src/js/common.js",
		"top": "./src/js/top.ts",
		// "top": "./src/js/slick.min.js",
		// "top": "./src/js/top.js",
	},
		output: {
		path: __dirname,
		filename: "[name].bundle.js",
	},
	// モジュールに適用するルールの設定
	module: {
		rules: [
			{
				// 拡張子が.tsで終わるファイルに対して、TypeScriptコンパイラを適用する
				test:/\.ts$/,loader:'ts-loader'
			}
		]
	}
}

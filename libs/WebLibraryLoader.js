/** ルートディレクトリからWebLibraryLoaderまでのパス */
const LIBPATH = '/libs/WebLibraryLoader.js';



(() => {
	/** @type {HTMLScriptElement} */
	const libScript = Array.prototype.find.call(document.scripts, elem => elem.src.match(LIBPATH));

	const rootDir = (() => {
		const urlComponent = new URL(libScript.src);

		return `${urlComponent.origin}${urlComponent.pathname.replace(LIBPATH, "")}`;
	})();
})();
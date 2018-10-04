/**
 * ルートディレクトリからWebLibraryLoaderまでのパス (ex: 'libs/WebLibraryLoader.js')
 * @type {string}
 */
const LIB_PATH = 'libs/WebLibraryLoader.js';

/**
 * WebLibraryLoaderを読み込んでいるScriptタグ
 * @type {HTMLScriptElement}
 */
const LIB_SCRIPT = Array.prototype.find.call(document.scripts, elem => elem.src.match(LIB_PATH));

/**
 * ルートディレクトリのURL
 */
const ROOTDIR = (() => {
	const urlComponent = new URL(LIB_SCRIPT.src);

	return `${urlComponent.origin}${urlComponent.pathname.replace(`/${LIB_PATH}`, "")}`;
})();



const WLL = {
	JsLib: class JsLib {
		/**
		 * @param {string} url
		 * @param {LibrariesManifest.Library.JsProperties} properties
		 * 
		 * @return {HTMLScriptElement}
		 */
		constructor (url, properties) {
			const self = document.createElement("script");
			self.src = url;

			for (const propName in properties) if (!["async", "defer"].includes(propName)) self.setAttribute(propName, properties[propName]);
			if (properties.async !== undefined) self.async = properties.async;
			if (properties.defer !== undefined) self.defer = properties.defer;

			return self;
		}
	},

	CssLib: class CssLib {
		/**
		 * @param {string} url
		 * @param {LibrariesManifest.Library.CssProperties} properties
		 * 
		 * @return {HTMLLinkElement}
		 */
		constructor (url, properties) {
			const self = document.createElement("link");
			self.rel = "StyleSheet";
			self.href = url;

			for (const propName in properties) self.setAttribute(propName, properties[propName]);

			return self;
		}
	}
};



(() => {
	fetch(`${ROOTDIR}/${LIB_SCRIPT.dataset.wlbLibraries || "libraries.json"}`)
		.catch(error => { throw error })
	.then(resp => resp.json())
		.catch(error => { throw error })
	.then(/** @param {LibrariesManifest} libraries */ libraries => {
		for (const lib of libraries) {
			switch (lib.type) {
				default:
					throw new TypeError(`${lib.type} is not acceptable`);
				case "JS":
					document.head.appendChild(new WLL.JsLib(lib.url, lib.properties));
					break;
				case "CSS":
					document.head.appendChild(new WLL.CssLib(lib.url, lib.properties));
					break;
			}
		}
	});
})();



/** @typedef {Array<LibrariesManifest.Library>} LibrariesManifest */

/**
 * @typedef {Object} LibrariesManifest.Library
 * @prop {"JS" | "CSS"} type
 * @prop {string} url
 * @prop {LibrariesManifest.Library.JsProperties} properties
 */

/**
 * @typedef {Object<string, any>} LibrariesManifest.Library.JsProperties
 * @prop {Boolean} [async]
 * @prop {Boolean} [defer]
 */

/** @typedef {Object<string, any>} LibrariesManifest.Library.CssProperties */
export namespace types {
	
	export class JSResp {
	    success: boolean;
	    msg: string;
	    data?: any;
	
	    static createFrom(source: any = {}) {
	        return new JSResp(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.msg = source["msg"];
	        this.data = source["data"];
	    }
	}
	export class PreferencesDecoder {
	    name: string;
	    enable: boolean;
	    auto: boolean;
	    decodePath: string;
	    decodeArgs: string[];
	    encodePath: string;
	    encodeArgs: string[];
	
	    static createFrom(source: any = {}) {
	        return new PreferencesDecoder(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.enable = source["enable"];
	        this.auto = source["auto"];
	        this.decodePath = source["decodePath"];
	        this.decodeArgs = source["decodeArgs"];
	        this.encodePath = source["encodePath"];
	        this.encodeArgs = source["encodeArgs"];
	    }
	}
	export class PreferencesCli {
	    fontFamily: string[];
	    fontSize: number;
	    cursorStyle: string;
	
	    static createFrom(source: any = {}) {
	        return new PreferencesCli(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.fontFamily = source["fontFamily"];
	        this.fontSize = source["fontSize"];
	        this.cursorStyle = source["cursorStyle"];
	    }
	}
	export class PreferencesEditor {
	    font: string;
	    fontFamily: string[];
	    fontSize: number;
	    showLineNum: boolean;
	    showFolding: boolean;
	    dropText: boolean;
	    links: boolean;
	    entryTextAlign: number;
	
	    static createFrom(source: any = {}) {
	        return new PreferencesEditor(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.font = source["font"];
	        this.fontFamily = source["fontFamily"];
	        this.fontSize = source["fontSize"];
	        this.showLineNum = source["showLineNum"];
	        this.showFolding = source["showFolding"];
	        this.dropText = source["dropText"];
	        this.links = source["links"];
	        this.entryTextAlign = source["entryTextAlign"];
	    }
	}
	export class PreferencesGeneral {
	    theme: string;
	    language: string;
	    font: string;
	    fontFamily: string[];
	    fontSize: number;
	    scanSize: number;
	    keyIconStyle: number;
	    useSysProxy: boolean;
	    useSysProxyHttp: boolean;
	    checkUpdate: boolean;
	    skipVersion: string;
	    allowTrack: boolean;
	
	    static createFrom(source: any = {}) {
	        return new PreferencesGeneral(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.theme = source["theme"];
	        this.language = source["language"];
	        this.font = source["font"];
	        this.fontFamily = source["fontFamily"];
	        this.fontSize = source["fontSize"];
	        this.scanSize = source["scanSize"];
	        this.keyIconStyle = source["keyIconStyle"];
	        this.useSysProxy = source["useSysProxy"];
	        this.useSysProxyHttp = source["useSysProxyHttp"];
	        this.checkUpdate = source["checkUpdate"];
	        this.skipVersion = source["skipVersion"];
	        this.allowTrack = source["allowTrack"];
	    }
	}
	export class PreferencesBehavior {
	    welcomed: boolean;
	    asideWidth: number;
	    windowWidth: number;
	    windowHeight: number;
	    windowMaximised: boolean;
	    windowPosX: number;
	    windowPosY: number;
	
	    static createFrom(source: any = {}) {
	        return new PreferencesBehavior(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.welcomed = source["welcomed"];
	        this.asideWidth = source["asideWidth"];
	        this.windowWidth = source["windowWidth"];
	        this.windowHeight = source["windowHeight"];
	        this.windowMaximised = source["windowMaximised"];
	        this.windowPosX = source["windowPosX"];
	        this.windowPosY = source["windowPosY"];
	    }
	}
	export class Preferences {
	    behavior: PreferencesBehavior;
	    general: PreferencesGeneral;
	    editor: PreferencesEditor;
	    cli: PreferencesCli;
	    decoder: PreferencesDecoder[];
	
	    static createFrom(source: any = {}) {
	        return new Preferences(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.behavior = this.convertValues(source["behavior"], PreferencesBehavior);
	        this.general = this.convertValues(source["general"], PreferencesGeneral);
	        this.editor = this.convertValues(source["editor"], PreferencesEditor);
	        this.cli = this.convertValues(source["cli"], PreferencesCli);
	        this.decoder = this.convertValues(source["decoder"], PreferencesDecoder);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	
	

}


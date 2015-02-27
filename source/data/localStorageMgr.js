enyo.kind({
	name: "localStorageMgr",
	kind: "Component",
    statics: {
        useCookies:true,
    	cookie:{
            create:function (name,value,days) {
                if (days) {
                    var date = new Date();
                    date.setTime(date.getTime()+(days*24*60*60*1000));
                    var expires = "; expires="+date.toGMTString();
                }
                else var expires = "";
                document.cookie = name+"="+value+expires+"; path=/";
            },

            read:function(name){
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for(var i=0;i < ca.length;i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') c = c.substring(1,c.length);
                    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
                }
                return null;
            },

            erase: function(name){
                this.prototype.cookie.create(name,"",-1);
            }
        },

        initUseCookie:function(){
            if (this.prototype.useCookies == -1) {  // first init storage
                if(!!localStorage && ((2*1024*1024 - unescape(encodeURIComponent(JSON.stringify(localStorage))).length) > 1024)){
                    this.prototype.useCookies = false;
                } else {
                    this.prototype.useCookies = true;
                }
            }
        },

		set: function(name, obj){
            this.initUseCookie();
			if(typeof name === "string") {
				if(typeof obj !== "string") {
                    if (this.prototype.useCookies) {
                        this.prototype.cookie.create(name, JSON.stringify(obj),365);
                    } else {
                        localStorage.setItem(name, JSON.stringify(obj));
                    }
				}
				else {
                    if (this.prototype.useCookies){
                        this.prototype.cookie.create(name, obj, 365);
                    } else {
                        localStorage.setItem(name, obj);
                    }
				}
			}
		},
		
		/* Get the item with the key 'name'. */
		get: function(name, defValue){
            this.initUseCookie();
			var result;
			if(typeof name === "string") {
                if (this.prototype.useCookies) {
                    result = this.prototype.cookie.read(name);
                } else {
                    result = localStorage.getItem(name);
                }
			}
			
			if(typeof result === "string"){
				try {
					return JSON.parse(result);
				} catch(e) {
					return result;
				}
			} else if(typeof result === "object" && result !== null) {
				enyo.log("OBJECT: " + result);
				throw "ERROR [Storage.get]: getItem returned an object. Should be a string.";
			} else if(typeof result === "undefined" || result === null){
				return defValue;
			}
			
		},
		
		/* Remove the item with the key 'name'. */
		remove: function(name){
            this.initUseCookie();
			if(typeof name === "string") {
                if (this.prototype.useCookies){
                    this.prototype.cookie.erase(name);
                } else {
                    localStorage.remove(name);
                }
			} else {
				throw "ERROR [Storage.remove]: 'name' was not a String.";
			}
		},
		
		/* Returns length of all localStorage objects. */
		__getLocalStorageSize: function(){
			var i, count = 0;
			for(i = 0; i < localStorage.length; i++){
				count += localStorage.getItem(localStorage.key()).length;
			}
			return count;
		}
    }
});


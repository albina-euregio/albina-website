/**
 * The configuration store. All configuration data is immutable.
 */
export default class ConfigStore {
	data: {};
	
	/**
	 * Create a new configuration with given data.
	 * 
	 * @param configData An object holding configuration data.
	 */
	constructor(configData) {
		this.data = configData;
	}

	/**
	 * Get a configuration value. The '.' notation can be used to get
	 * elements on nested levels.
	 * 
	 * @param key The string of either a key or a path of keys separated by '.'
	 */
	get(key) {
		const elems = key.split('.');
		if(elems.length > 0) {
			const start = elems[0];
			
			if(typeof(this.data[start]) !== 'undefined') {
				var val = this.data[start];
				
				elems.splice(1).forEach(key => {
					if(val && typeof(val) == 'object' && typeof(val[key] !== 'undefined')) {
						val = val[key];
					} else {
						val = '';
					}
				});
				
				return val;
			}
		}
		return '';
	}
}
/**
 * Node error handler
 */
module.exports = class NodeErrorHandler {
    ignoreErrors = [];
    
    /**
     * Create node error handler
     * 
     * @param {function} cb Function callback
     */
    constructor(cb) {
        this.cb = cb;
    }
    
    // --- Get/Set ---
    setCb(cb) {
        this.cb = cb;
        
        return this;
    }
    
    // --- Execution ---
    execute() {
        try {
            this.cb();
        } catch(err) {
            // Check if the error is to be ignored
            let ignoreError = false;
            
            for(const errorName of this.ignoreErrors) {
                if(errorName === err.code) {
                    ignoreError = true;
                }
            }
            
            // If the error is not to be ignored print it
            if(!ignoreError) {
                console.error(err);
            } else {
                // console.log(`Insignificant error`);
            }
        }
        
        return this;
    }
    
    // --- Add to the ignore list ---
    ignoreFileOrFolderAlreadyExists() {
        this.ignoreErrors.push("EEXIST");
        
        return this;
    }
}

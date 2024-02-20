# Email private key problem

There is a folder that doesn't exists, and the private key tiny app is throwing errors

The real problem, is that I don't know where this folder is fucking created

How do I generalize folder creation in such a way that you can never miss out where they're created?

# Problem solution

It's the file [src/test/testSetup.js] that creates these folders, but for some reason it's throwing the error before the folders get a chance to be created.

Tested it, the code is indeed executed first, however the .cache folder is not even created.

The problem was this

```cjs
const { fs } = require("node:fs");
```

The solution

```cjs
const fs = require("node:fs");
```

Another thing is that the errors weren't being printed, this is because the folder may be created multiple times and if it already exists then it throws an error.

I have to distinguish between error types.

I fixed the problem and added a warning when there's another kind of error that is not 'EEXIST'

```cjs
// Folder exists
if(err.code === "EEXIST") {
    console.log(`It's the useless error`);
} else {
    // This error is something else
    console.error(err);
}
```

- [x] Problem fixed
- [x] Console warning added

# Problem general solution

- [ ] General solution

This is a general solution, that would be applied to any project that store files locally.

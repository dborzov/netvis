Install & Build
----------------
To build the library install `grunt-cli` and run:
```
    $ grunt 
```
This will concatinate all the js files into a single library file and put the result into `./dist` directory along with `index.html` for entry point. It will also watch all the source files for changes and update everything when needed.

We use `bower` to manage dependencies (install `d3.js`, `moment.js` and many others).

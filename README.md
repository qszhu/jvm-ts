## Java Interpreter in TypeScript

### Setup

```bash
$ npm i
$ npm link
```

### Verify

```bash
$ ./test.sh
```

### Class Viewer

```bash
$ classviewer <path/to/.class>
```

### Debugger

* enable with `--debug` flag
* commands
  * print string
    * `string stack <n>`: print string at stack #n
    * `string statics <n>`: print string at static vars #n in current class
    * `string <n>`: print string at local vars #n
  * print class
    * `class stack <n>`: print class at stack #n
    * `class var <n>`: print class at ocal vars #n
  * print fields
    * `fields stack <n>`: print field at stack #n
    * `fields var <n>`: print field at local vars #n
  * print const
    * `const <n>`: print const {n} in current class' constant pool
  * print statics
    * `statics`: print static vars of current class
  * step
    * `<Return>`: next instruction
    * `step over`: next instruction in current method
  * breakpoint
    * `bp <n>`: set breakpoint at pc #n in current frame
  * continue
    * `run`: resume running

### References
* https://github.com/zxh0/jvmgo-book

## JVM in TypeScript

### Setup

```bash
$ npm i
$ npm link
```

### Run

```bash
$ tsjava java.lang.String
version: 52.0
constants count: 548
access flags: 0x31
this class: java/lang/String
super class: java/lang/Object
interfaces: java/io/Serializable,java/lang/Comparable,java/lang/CharSequence
fields count: 5
  value
  hash
  serialVersionUID
  serialPersistentFields
  CASE_INSENSITIVE_ORDER
methods count: 94
  <init>
  <init>
  <init>
  ...
```

```bash
$ tsjava --cp java jvmgo.book.ch05.GaussTest
version: 52.0
constants count: 28
access flags: 0x21
this class: jvmgo/book/ch05/GaussTest
super class: java/lang/Object
interfaces: 
fields count: 0
methods count: 2
  <init>
  main
pc: 0 inst: IConst0
pc: 1 inst: IStore1
pc: 2 inst: IConst1
pc: 3 inst: IStore2
pc: 4 inst: ILoad2
pc: 5 inst: BiPush
pc: 7 inst: IfICmpGT
pc: 10 inst: ILoad1
pc: 11 inst: ILoad2
pc: 12 inst: IAdd
pc: 13 inst: IStore1
pc: 14 inst: IInc
pc: 17 inst: Goto
...
```

```bash
$ tsjava --cp java jvmgo.book.ch07.FibonacciTest
832040n
```

```bash
$ tsjava --cp java jvmgo.book.ch08.BubbleSortTest --verbose
[Loaded java/lang/Object from /Library/Java/JavaVirtualMachines/jdk1.8.0_271.jdk/Contents/Home/jre/lib/rt.jar]
[Loaded jvmgo/book/ch08/BubbleSortTest from /Users/qinsi/dev/jvm-ts/java]
[Loaded java/lang/Cloneable from /Library/Java/JavaVirtualMachines/jdk1.8.0_271.jdk/Contents/Home/jre/lib/rt.jar]
[Loaded java/io/Serializable from /Library/Java/JavaVirtualMachines/jdk1.8.0_271.jdk/Contents/Home/jre/lib/rt.jar]
[Loaded java/lang/System from /Library/Java/JavaVirtualMachines/jdk1.8.0_271.jdk/Contents/Home/jre/lib/rt.jar]
[Loaded java/lang/AutoCloseable from /Library/Java/JavaVirtualMachines/jdk1.8.0_271.jdk/Contents/Home/jre/lib/rt.jar]
[Loaded java/io/Closeable from /Library/Java/JavaVirtualMachines/jdk1.8.0_271.jdk/Contents/Home/jre/lib/rt.jar]
[Loaded java/io/Flushable from /Library/Java/JavaVirtualMachines/jdk1.8.0_271.jdk/Contents/Home/jre/lib/rt.jar]
[Loaded java/io/OutputStream from /Library/Java/JavaVirtualMachines/jdk1.8.0_271.jdk/Contents/Home/jre/lib/rt.jar]
[Loaded java/io/FilterOutputStream from /Library/Java/JavaVirtualMachines/jdk1.8.0_271.jdk/Contents/Home/jre/lib/rt.jar]
[Loaded java/lang/Appendable from /Library/Java/JavaVirtualMachines/jdk1.8.0_271.jdk/Contents/Home/jre/lib/rt.jar]
[Loaded java/io/PrintStream from /Library/Java/JavaVirtualMachines/jdk1.8.0_271.jdk/Contents/Home/jre/lib/rt.jar]
9
10
11
22
24
36
36
56
65
77
78
84
92
95
97
```

```bash
$ tsjava --cp java jvmgo.book.ch08.PrintArgs foo bar 你好，世界！
jvmgo.book.ch08.PrintArgs
foo
bar
你好，世界！
```

### References
* https://github.com/zxh0/jvmgo-book

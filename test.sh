#!/bin/sh
set -ex

tsjava --version | grep -q "0.1.0"
tsjava --cp java jvmgo.book.ch05.GaussTest | grep -q "5050"
tsjava --cp java jvmgo.book.ch06.MyObject | grep -q "32768"
tsjava --cp java jvmgo.book.ch07.FibonacciTest | grep -q "832040"
tsjava --cp java jvmgo.book.ch01.HelloWorld  | grep -q "Hello, world!"
tsjava --cp java jvmgo.book.ch08.PrintArgs foo bar | tr -d '\n' | grep -q "foobar"
tsjava --cp java jvmgo.book.ch09.GetClassTest | grep -q "Ljava.lang.String;"
tsjava --cp java jvmgo.book.ch09.StringTest | tr -d '\n' | grep -q "truefalsetrue"
tsjava --cp java jvmgo.book.ch09.ObjectTest | tr -d '\n' | grep -q "falsetrue"
tsjava --cp java jvmgo.book.ch09.CloneTest | grep -q "3.14"
tsjava --cp java jvmgo.book.ch09.BoxTest | grep -q "1, 2, 3"
tsjava --cp java jvmgo.book.ch10.ParseIntTest 123 | grep -q "123"
tsjava --cp java jvmgo.book.ch10.ParseIntTest abc 2>&1 | grep  'For input string: "abc"'
tsjava --cp java jvmgo.book.ch10.ParseIntTest 2>&1 | grep -q "at jvmgo"
echo OK

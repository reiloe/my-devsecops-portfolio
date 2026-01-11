---
title: 📝 Groovy
---

# 🧩 Groovy

**Groovy** is a dynamic programming language for the **JVM** that is closely compatible with Java but offers **shorter syntax**, **closures**, **meta-programming**, and **DSL support**.  
It is frequently used for **scripting, build automation (e.g., Gradle), Jenkins pipelines**, and test automation.

---

## Table of Contents

1. [Basics](#-1-basics)
2. [Control Structures](#-2-control-structures)
3. [Methods / Functions](#-3-methods--functions)
4. [Object Orientation](#-4-object-orientation)
5. [Closures](#-5-closures)
6. [Exception Handling](#-6-exception-handling)
7. [Filesystem & IO](#-7-filesystem--io)
8. [Integration with Java](#-8-integration-with-java)
9. [Jenkins Pipelines (Groovy DSL)](#-9-jenkins-pipelines-groovy-dsl)
10. [Collections & Operators](#-10-collections--operators)
11. [Best Practices](#-11-best-practices)
12. [Resources](#-12-resources)

---

## 🔹 1) Basics

### Variables

- Dynamic typing possible (`def`)
- Optional type as in Java

```groovy
def name = "Max"
int age = 42
double pi = 3.1415
```

### Data Types

- Numbers: `Integer`, `Double`
- Strings: `"Hello"` or `'Hello'`
- Lists: `[1,2,3]`
- Maps: `[name: "Max", role: "Admin"]`

```groovy
def arr = [1,2,3]
def map = [name: "Max", role: "Admin"]
```

---

## 🔹 2) Control Structures

### If/Else

```groovy
def x = 10
if (x > 5) {
    println "Greater than 5"
} else if (x == 5) {
    println "Exactly 5"
} else {
    println "Less than 5"
}
```

### Switch/Case

```groovy
def grade = 'B'
switch (grade) {
    case 'A':
        println "Excellent"
        break
    case 'B':
        println "Good"
        break
    default:
        println "Needs improvement"
}
```

### Loops

```groovy
// each over list
[1,2,3].each { num -> println num }

// for in range
for (i in 0..2) { println i }

// while
def i = 0
while(i<3) {
    println i
    i++
}
```

---

## 🔹 3) Methods / Functions

```groovy
def greet(name) {
    return "Hello, ${name}!"
}
println greet("Reik")

// Default parameter
def greet(name="Guest") {
    "Hello, ${name}!"
}
println greet()
```

- Variadic parameters with `...`:

```groovy
def sum(int... numbers) {
    numbers.sum()
}
println sum(1,2,3)  // => 6
```

---

## 🔹 4) Object Orientation

### Classes

```groovy
class Person {
    String name
    int age

    String greet() {
        "Hello, I'm ${name} and ${age} years old"
    }
}

def p = new Person(name: "Max", age: 42)
println p.greet()
```

### Inheritance

```groovy
class Employee extends Person {
    String role

    String greet() {
        super.greet() + " and work as ${role}"
    }
}

def e = new Employee(name:"Max", age:42, role:"Admin")
println e.greet()
```

---

## 🔹 5) Closures

- **Closure = anonymous function / block**

```groovy
def square = { x -> x * x }
println square(5)  // => 25

[1,2,3].each { n -> println n * 2 }
```

---

## 🔹 6) Exception Handling

```groovy
try {
    def result = 10 / 0
} catch (ArithmeticException e) {
    println "Error: ${e.message}"
} finally {
    println "This block is always executed"
}
```

---

## 🔹 7) Filesystem & IO

### Read file

```groovy
new File("test.txt").eachLine { line -> println line }
```

### Write file

```groovy
new File("output.txt").withWriter { writer ->
writer.writeLine("Hello World")
}
```

---

## 🔹 8) Integration with Java

- Groovy runs on the JVM and can use Java classes directly

```groovy
import java.time.LocalDate

def heute = LocalDate.now()
println heute
```

- Java libraries can be imported directly

---

## 🔹 9) Jenkins Pipelines (Groovy DSL)

- Declarative Pipeline Example:

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo "Building project..."
            }
        }
        stage('Test') {
            steps {
                sh './run_tests.sh'
            }
        }
        stage('Deploy') {
            steps {
                echo "Deployment started"
            }
        }
    }
}
```

- Scripted Pipeline Example:

```groovy
node {
    stage('Build') {
        echo "Building project..."
    }
    stage('Test') {
        sh './run_tests.sh'
    }
    stage('Deploy') {
        echo "Deployment started"
    }
}
```

---

## 🔹 10) Collections & Operators

### Lists

```groovy
def list = [1,2,3,4]
println list[0]    // 1
println list.size() // 4
list << 5          // Add element
```

### Maps

```groovy
def map = [name:"Max", role:"Admin"]
println map.name      // Max
map.role = "User"
```

### Operators

- `==`, `!=`, `<`, `>`, `<=`, `>=`
- `+`, `-`, `*`, `/` for numbers
- `<<` for appending to lists

---

## 🔹 11) Best Practices

- Use **def** for dynamic types, otherwise type safety with explicit types
- Use **closures** for reusable blocks
- Keep code modular in classes and methods
- Jenkins pipelines should use **Declarative DSL** for better overview
- Test Driven Development: Spock or JUnit integration
- Use Groovy GDK functions for collections & strings

---

## 🔹 12) Resources

- Official Website: [https://groovy-lang.org](https://groovy-lang.org)
- Documentation: [https://groovy-lang.org/documentation.html](https://groovy-lang.org/documentation.html)
- Spock Framework: [https://spockframework.org](https://spockframework.org)
- Jenkins DSL Reference: [https://www.jenkins.io/doc/book/pipeline/](https://www.jenkins.io/doc/book/pipeline/)

---

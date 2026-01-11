---
title: ☕ Gradle
---

# Gradle

Gradle is an **open-source build tool** specialized in automating build processes for software projects. It supports Java, Kotlin, Groovy, Android, C/C++, and many other languages.

---

## Table of Contents

1. [Basics](#1-basics)
2. [Installation](#2-installation)
    - [2.1 Linux](#21-linux)
    - [2.2 MacOS](#22-macos)
    - [2.3 Windows](#23-windows)
    - [2.4 Docker](#24-docker)
3. [Create Project](#3-create-project)
4. [Build Lifecycle](#4-build-lifecycle)
5. [Manage Dependencies](#5-manage-dependencies)
6. [Task Examples](#6-task-examples)
7. [Multi-Project Builds](#7-multi-project-builds)
8. [Best Practices](#8-best-practices)
9. [Conclusion](#9-conclusion)

---

## 1. Basics

- Gradle uses **DSLs** in Groovy or Kotlin (Kotlin DSL `.gradle.kts`)
- Supports **incremental building** and **task caching**
- Plugins extend functionality (Java, Kotlin, Spring Boot, Android)
- Build file: `build.gradle` (Groovy) or `build.gradle.kts` (Kotlin)

---

## 2. Installation

### 2.1 Linux

```bash
# Use SDKMAN! (recommended)
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk install gradle

# Alternatively manually
wget https://services.gradle.org/distributions/gradle-8.5-bin.zip
unzip gradle-8.5-bin.zip -d /opt/gradle
export PATH=/opt/gradle/gradle-8.5/bin:$PATH
gradle -v
```

### 2.2 MacOS

```brew
brew install gradle
gradle -v
```

### 2.3 Windows

1. Download Gradle ZIP: [https://gradle.org/releases/](https://gradle.org/releases/)
2. Extract, e.g., `C:\Gradle`
3. Set environment variable `GRADLE_HOME`
4. Extend `PATH`: `%GRADLE_HOME%\bin`
5. Check version: `gradle -v`

---

### 2.4 Docker

```bash
docker pull gradle:8.5-jdk17
docker run --rm -v $(pwd):/home/gradle/project -w /home/gradle/project gradle:8.5-jdk17 gradle build
```

---

## 3. Create Project

```bash
# Initialize Gradle Wrapper
gradle wrapper

# New Java project
gradle init --type java-application
```

Structure:

```bash
project/
├─ build.gradle
├─ settings.gradle
├─ gradle/
├─ src/
│  ├─ main/java/
│  └─ test/java/
└─ gradlew
```

---

## 4. Build Lifecycle

- **clean:** Deletes build directories
- **build:** Compiles, tests, packages
- **assemble:** Only compile and package
- **check:** Run tests
- **run:** Execute application (only with Java Application plugin)

```bash
gradle clean build
gradle run
```

---

## 5. Manage Dependencies

### build.gradle (Groovy)

```groovy
plugins {
    id 'java'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter:3.2.0'
    testImplementation 'junit:junit:4.13.2'
}
```

### build.gradle.kts (Kotlin)

```groovy
plugins {
    java
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter:3.2.0")
    testImplementation("junit:junit:4.13.2")
}
```

---

## 6. Task Examples

```bash
# List tasks
gradle tasks

# Run tests
gradle test

# Start application
gradle run

# Create jar
gradle jar

# Clean build
gradle clean build
```

---

## 7. Multi-Project Builds

### settings.gradle

```text
rootProject.name = 'my-multi-project'
include 'core', 'api', 'web'
```

### build.gradle (Root)

```text
subprojects {
apply plugin: 'java'

    repositories {
        mavenCentral()
    }
}
```

---

## 8. Best Practices

1. **Use Wrapper:** Consistent Gradle version for all developers
2. **Centrally manage dependencies** (Version Catalog / `gradle.properties`)
3. **Task optimization:** Enable incremental builds, caching
4. **Multi-module projects:** Clear separation of modules
5. **Test Coverage & Reporting:** Integrate automated tests in CI
6. **Plugin documentation:** Pay attention to version compatibility

---

## 9. Conclusion

- Gradle is **flexible, performant and extensible**
- Ideal for Java/Kotlin, Android and multi-language projects
- Supports modern CI/CD pipelines and container environments

---

---
title: ☕ Maven
---

# Maven

**Apache Maven** is a build and project management tool for Java projects.

## Table of Contents

1. [Features](#features)
2. [What is Maven used for](#what-is-maven-used-for)
3. [Installation](#installation)
4. [Basic Maven Commands](#basic-maven-commands)
5. [Example POM.xml](#example-pomxml)
6. [Parent-POM / Company-POM](#parent-pom--company-pom)
7. [Advantages and Disadvantages of a Parent-POM](#advantages-and-disadvantages-of-a-parent-pom)
8. [Summary](#summary)

---

## Features

- Management of **dependencies** (libraries)
- Unified **project structure**
- Automatic **build, test, package**
- Support for **multi-module projects**
- Integrable in CI/CD pipelines

---

## What is Maven used for

- Automatically download and manage dependencies
- Compile, test and package projects
- Unified project structure across teams
- Centrally manage multi-module projects
- Integration in CI/CD pipelines (Jenkins, GitHub Actions, GitLab CI)

---

## Installation

### Linux / MacOS

```bash
# Check if Maven is installed
mvn -v

# Install via package manager
sudo apt install maven        # Linux (Debian/Ubuntu)
brew install maven            # MacOS
```

---

## Basic Maven Commands

| Command                      | Description                                     |
|------------------------------|-------------------------------------------------|
| mvn clean                    | Deletes target directory                        |
| mvn compile                  | Compiles the code                               |
| mvn test                     | Runs tests                                      |
| mvn package                  | Creates JAR/WAR                                 |
| mvn install                  | Installs artifact locally in Maven repository   |
| mvn deploy                   | Deploy to remote repository                     |
| mvn dependency:tree          | Shows dependency tree                           |

### Example

```bash
mvn clean compile test package
```

---

## Example POM.xml

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
http://maven.apache.org/xsd/maven-4.0.0.xsd">
<modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>demo-app</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>Demo App</name>
    <description>Example Maven Project</description>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>3.2.1</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```

---

## Parent-POM / Company-POM

A **Parent-POM** is a central Maven project that defines:

- Dependencies
- Plugins
- Version numbers
- Build settings

for **all subprojects**. Subprojects inherit these settings.

### Example Parent-POM

```xml
<project>
<modelVersion>4.0.0</modelVersion>
<groupId>com.company</groupId>
<artifactId>company-parent</artifactId>
<version>1.0.0</version>
<packaging>pom</packaging>

    <properties>
        <java.version>17</java.version>
        <spring.boot.version>3.2.1</spring.boot.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-web</artifactId>
                <version>${spring.boot.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### Subproject with Parent-POM

```xml
<project>
<modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.company</groupId>
        <artifactId>company-parent</artifactId>
        <version>1.0.0</version>
    </parent>

    <artifactId>demo-app</artifactId>
    <version>1.0.0</version>
    <name>Demo App</name>

</project>
```

---

## Advantages and Disadvantages of a Parent-POM

### Advantages

- Unified configuration for all projects
- Centralized version management
- Reduces redundancy in subprojects
- Easy upgrade of dependencies / plugins

### Disadvantages

- Dependency on Parent-POM version → can cause breaking changes
- Subprojects less flexible when individual adjustments are needed
- Complexity with large company-POMs

---

## Summary

- Maven = build and project management for Java
- POM.xml defines project, dependencies, plugins
- Parent-POM enables central management of versions and build settings
- Typical commands: `clean`, `compile`, `test`, `package`, `install`, `deploy`
- Parent-POM facilitates consistency but can limit flexibility

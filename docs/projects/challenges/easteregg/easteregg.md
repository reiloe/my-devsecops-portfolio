---
title: "🥚 Easter Egg"
pagination_prev: projects/challenges/visual-geo-stalking/visual-geo-stalking
pagination_next: projects/challenges/nested-easteregg/nested-easeregg
---

# Easter Egg

Find the hidden easter egg.

**Type:** Broken Access Control  
**Difficulty:** 4 Stars

## Procedure

In another challenge I found a folder "ftp" with some files in it. One of the files was named **easter.egg**.  

![ftp](./img/ftp.png)  

When you try to open or download the file, an error occurs.  

![error](./img/download_error.png)  

This error is already known from another challenge, as is the solution: **Poison Null Byte**

## Solution

After clicking the **easter.egg** file, add **%2500.md** at the end of the URL and hit Enter. The file will be downloaded immediately.  

![success](./img/download_success.png)  

Now you can open the downloaded file

![easteregg](./img/easteregg.png)  

and the challenge is solved.

![solved](./img/solved.png)  

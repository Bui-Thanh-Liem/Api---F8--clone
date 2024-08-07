setTimeout(() => {  // Ném vào web api đếm, đếm xong đẩy xuống callback queue đợi call stack rỗng 
    console.log("A");
}, 0);

setTimeout(() => {
    console.log("B");
}, 10);

console.log("C");   // Call Stask thực thi ngay lập tức

Promise.resolve("D").then((result) => console.log(result))  // Là job queue, được ném vào micro task queue (ưu tiên cao hơn callback queue)

for (let index = 0; index < 10; index++) {
    // 
}

console.log("E");
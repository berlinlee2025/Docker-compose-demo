const regexp = /^\w+@[A-Za-z]+(\.edu\.hk|\.com.hk)$/;
const email1 = 'test@test.edu.hk';
const email2 = 'test@edu.hk';
const email3 = 'test@test.com.hk';
const email4 = 'test@com.hk';
const emailRegExp = new RegExp(/^\w+@[A-Za-z]+(\.com|\.gov|\.tw|\.cn|\.hk|\.edu|\.au|\.uk|\.net|\.io|\.gov\.hk|\.com\.hk|\.com\.tw|\.edu\.tw|\.gov\.uk|\.edu\.hk|\.edu\.uk|\.edu\.au)$/, 'gm');

// console.log('email1', regexp.test(email1));
// console.log('email2', regexp.test(email2));
// console.log('email3', regexp.test(email3));
// console.log('email4', regexp.test(email4));
console.log('email1', emailRegExp.test(email1));
console.log('email2', emailRegExp.test(email2));
console.log('email3', emailRegExp.test(email3));
console.log('email4', emailRegExp.test(email4));
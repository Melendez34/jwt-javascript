localStorage.setItem('name', 'Omar');
console.log(localStorage.getItem('name'));
localStorage.removeItem('name');

sessionStorage.setItem('name', 'John');
console.log(sessionStorage.length);

document.cookie = 'name=Antonio; expires=' + new Date(2222, 0, 1).toUTCString();
document.cookie = 'lastName; expires=' + new Date(2222, 0, 1).toUTCString();

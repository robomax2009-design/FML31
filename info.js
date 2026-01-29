function Copy(containerid) {
	let textarea = document.createElement('textarea');
	textarea.id = 'temp';
	textarea.style.height = 0;
	document.body.appendChild(textarea);
	textarea.value = document.getElementById(containerid).innerText;
	let selector = document.querySelector('#temp');
	selector.select();
	document.execCommand('copy');
	document.body.removeChild(textarea);
}
function A0(){
	const formElement = document.getElementById('form0');
	const formData = new FormData(formElement);
	document.getElementsByClassName('o0')[0].textContent = formData.get('i0-0');
}
function A1(){
	const formElement = document.getElementById('form1');
	const formData = new FormData(formElement);
	let x = parseFloat(formData.get('i1-0'));
	let y = parseFloat(formData.get('i1-1'));
	let p = 1;
	for(let i = 0; i < Math.abs(y); i++){
		p *= x;
	}
	if(y < 0){
		p = 1/p;
	}
	document.getElementsByClassName('o1')[0].textContent = p;
}
function A2(){
	const formElement = document.getElementById('form2');
	const formData = new FormData(formElement);
	let x = Math.abs(parseFloat(formData.get('i2-0')));
	let k = Math.abs(parseFloat(formData.get('i2-1')));
	if(k == 1){
		document.getElementsByClassName('o2')[0].textContent = (k == x);
		return;
	}
	let p = 1;
	while(p < x){
		p *= k
	}
	document.getElementsByClassName('o2')[0].textContent = (p == x);
}
function A3(){
	const formElement = document.getElementById('form3');
	const formData = new FormData(formElement);
	let x = Math.abs(parseInt(formData.get('i3-0')));
	let m = x;
	let ne = 0;
	while(x > 0){
		ne = ne * 10 + x % 10;
		x = Math.floor(x / 10);
	}
	document.getElementsByClassName('o3')[0].textContent = (ne == m);
}
function A4(){
	const formElement = document.getElementById('form4');
	const formData = new FormData(formElement);
	let x = Math.abs(parseInt(formData.get('i4-0')));
	let cnt = [];
	for(let i = 0; i < 10; i++){
		cnt.push(0);
	}
	while(x > 0){
		cnt[x % 10] += 1;
		x = Math.floor(x / 10);
	}
	let mx = 0;
	let mi = 0;
	for(let i = 0; i < 10; i++){
		if(cnt[i] > mx){
			mx = cnt[i];
			mi = i;
		}
	}
	document.getElementsByClassName('o4')[0].textContent = mi;
}
function A5(){
	const formElement = document.getElementById('form5');
	const formData = new FormData(formElement);
	let x = Math.abs(parseInt(formData.get('i5-0')));
	let c = 1;
	let cou = 0;
	while(c * c < x){
		if(x % c == 0){
			cou += 2;
		}
		c += 1;
	}
	if(x % c == 0){
		cou += 1
	}
	document.getElementsByClassName('o5')[0].textContent = (cou);
}
function A6(){
	const formElement = document.getElementById('form6');
	const formData = new FormData(formElement);
	let n = Math.abs(parseInt(formData.get('i6-0')));
	let i = 2;
	primfac = [];
	while((i * i) <= n){
		while(n % i == 0){
			primfac.push(i);
			n = Math.floor(n / i);
		}
		i += 1;
	}
	if(n > 1){
		primfac.push(n);
	}
	document.getElementsByClassName('o6')[0].textContent = (primfac);
}
function A7(){
	const formElement = document.getElementById('form7');
	const formData = new FormData(formElement);
	let x = formData.get('i7-0');
	console.log(formData.get('i7-1'));
	let k = formData.get('i7-1').split(" ");
	b = false;
	for(let i = 0; i < k.length; i++){
		if(k[i] == x){
			b = true;
		}
	}
	
	document.getElementsByClassName('o7')[0].textContent = (b);
}
function A8(){
	const formElement = document.getElementById('form8');
	const formData = new FormData(formElement);
	let y = formData.get('i8-1').split(" ");
	let s = 0;
	for(let i = 0; i < y.length; i++){
		s += parseFloat(y[i]);
	}
	document.getElementsByClassName('o8')[0].textContent = (s);
}
function A9(){
	const formElement = document.getElementById('form9');
	const formData = new FormData(formElement);
	let n = parseInt(formData.get('i9-0'));
	
	let s = 0;
	let i = 0;
	while(n >= i * i){
		if(n % i == 0 && i != Math.floor(n / i)){
			s += i;
			s += n / i;
		}else{
			if(n % i == 0 && i == Math.floor(n / i)){
				s += i
			}
		}
		i += 1;
	}
	
	document.getElementsByClassName('o9')[0].textContent = (s);
}
function A10(){
	const formElement = document.getElementById('form10');
	const formData = new FormData(formElement);
	let x = parseInt(formData.get('i10-0'));
	let d = 2;
	let b = true;
	while(x >= d * d){
		if(x % d == 0){
			b = false;
		}d += 1;
	}b = b && x > 1
	
	document.getElementsByClassName('o10')[0].textContent = (b);
}

function fib(n, a, b){
	if(2 > n){
		return(n);
	}else{
		return(a + fib(n - 1, b, a + b));
	}
}

function A11(){
	const formElement = document.getElementById('form11');
	const formData = new FormData(formElement);
	let x = formData.get('i11-0');
	let b = fib(parseInt(x), 0, 1);
	
	document.getElementsByClassName('o11')[0].textContent = (b);
}
function A12(){
	const formElement = document.getElementById('form12');
	const formData = new FormData(formElement);
	let y = formData.get('i12-1').split(" ");
	for(let i = 0; i < y.length; i++){
		y.splice(i, 1, parseFloat(y[i]));
	}
	let mx1 = 0;
	let mx2 = 0;
	let x = 0;
	for(let i = 0; i < y.length; i++){
		x = y[i];
		if(x > mx1){
			mx2 = mx1;
			mx1 = x;
		}else{
			if(x > mx2){
				mx2 = x;
			}
		}
	}
	
	document.getElementsByClassName('o12')[0].textContent = [mx2, mx1];
}
function A13(){
	const formElement = document.getElementById('form13');
	const formData = new FormData(formElement);
	let y = formData.get('i13-1').split(" ");
	for(let i = 0; i < y.length; i++){
		y.splice(i, 1, parseFloat(y[i]));
	}
	
	y.sort();
	
	document.getElementsByClassName('o13')[0].textContent = (y);
}
function A14(){
	const formElement = document.getElementById('form14');
	const formData = new FormData(formElement);
	let y = formData.get('i14-1').split(" ");
	for(let i = 0; i < y.length; i++){
		y.splice(i, 1, parseFloat(y[i]));
	}
	
	y.sort();
	
	document.getElementsByClassName('o14')[0].textContent = (y);
}
function A15(){
	const formElement = document.getElementById('form15');
	const formData = new FormData(formElement);
	let y = formData.get('i15-1').split(" ");
	for(let i = 0; i < y.length; i++){
		y.splice(i, 1, parseFloat(y[i]));
	}
	
	y.sort();
	
	document.getElementsByClassName('o15')[0].textContent = (y);
}
function A16(){
	const formElement = document.getElementById('form16');
	const formData = new FormData(formElement);
	let y = formData.get('i16-1').split(" ");
	for(let i = 0; i < y.length; i++){
		y.splice(i, 1, parseFloat(y[i]));
	}
	
	y.sort();
	
	document.getElementsByClassName('o16')[0].textContent = (y);
}
function A17(){
	const formElement = document.getElementById('form17');
	const formData = new FormData(formElement);
	let y = formData.get('i17-1').split(" ");
	for(let i = 0; i < y.length; i++){
		y.splice(i, 1, parseFloat(y[i]));
	}
	
	y.sort();
	
	document.getElementsByClassName('o17')[0].textContent = (y);
}
function A18(){
	const formElement = document.getElementById('form18');
	const formData = new FormData(formElement);
	let y = formData.get('i18-1').split(" ");
	for(let i = 0; i < y.length; i++){
		y.splice(i, 1, parseFloat(y[i]));
	}
	
	y.sort();
	
	document.getElementsByClassName('o18')[0].textContent = (y);
}
function A19(){
	const formElement = document.getElementById('form19');
	const formData = new FormData(formElement);
	let y = formData.get('i19-1').split(" ");
	for(let i = 0; i < y.length; i++){
		y.splice(i, 1, parseFloat(y[i]));
	}
	
	y.sort();
	
	document.getElementsByClassName('o19')[0].textContent = (y);
}
function A20(){
	const formElement = document.getElementById('form19');
	const formData = new FormData(formElement);
	let a = parseInt(formData.get('i20-1'));
	let b = parseInt(formData.get('i20-2'));
	while(a != 0 && b != 0){
		if(a > b){
			a = a % b;
		}else{
			b = b % a;
		}
	}
	let c = a + b;
	
	document.getElementsByClassName('o19')[0].textContent = [c, a * b / c];
}
function A22(){
	const formElement = document.getElementById('form22');
	const formData = new FormData(formElement);
	let y = formData.get('i22-1') + " ";

	let out = [];
	let sep = " ,.;:!?\n";
	let w = "";
	for(let i = 0; i < y.length; i++){
		if(!sep.includes(y[i])){
			w += y[i];
		}else{
			if(w != ""){
				out.push(w);
				w = "";
			}
		}
	}

	document.getElementsByClassName('o22')[0].textContent = out;
}
class Product{constructor(n,p,c){this.name=n;this.price=p;this.category=c}}
const products=[
new Product("Brown Luxe Handbag",45000,"Handbags"),
new Product("Black Shoulder Bag",38000,"Shoulder Bags"),
new Product("Gold Evening Clutch",25000,"Clutches"),
new Product("Travel Luggage",75000,"Luggage")
];
function showCategory(cat){
const shop=document.getElementById("shop");
shop.innerHTML="";
products.forEach(bag=>{
if(cat==="All"||bag.category===cat){
shop.innerHTML+=`<div class="bag"><h3>${bag.name}</h3><p>₦${bag.price}</p><small>${bag.category}</small><br><button onclick="pay(${bag.price},'${bag.name}')">Buy</button></div>`;
}
});
}
function pay(price,name){
var handler=PaystackPop.setup({key:'pk_test_xxx',email:'customer@gmail.com',amount:price*100,currency:"NGN",callback:function(r){alert("Thanks for buying "+name)}});
handler.openIframe();
}
showCategory('All');
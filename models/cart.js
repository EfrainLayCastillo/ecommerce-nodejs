module.exports = function Cart(oldcart){
    this.items = oldcart.items || {};
    this.totalQty = oldcart.totalQty || 0;
    this.totalPrice = oldcart.totalPrice || 0;

    this.add = function(item, id){
        var storeItem = this.items[id];
        if(!storeItem){
            storeItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storeItem.qty++;
        storeItem.price = storeItem.item.price * storeItem.qty;
        this.totalQty++;
        this.totalPrice += storeItem.item.price;
    };
    this.reduce = function(id){
        this.items[id].qty--;
        this.totalQty--;
        this.items[id].price -= this.items[id].price;
        this.totalPrice -= this.items[id].price;
        if(this.items[id].qty<= 0){
            delete this.items[id];
        }
    }
    this.removeAll = function(id){
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    }
    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
}
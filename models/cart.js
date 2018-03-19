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

    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
}
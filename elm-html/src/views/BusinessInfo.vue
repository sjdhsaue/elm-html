<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>商家信息</p>
    </header>
    <!-- 商家logo部分 -->
    <div class="business-logo">
      <img :src="data.businessImg">
    </div>
    <!-- 商家信息部分 -->
    <div class="business-info">
      <h1>{{data.name}}</h1>
      <p>电话：{{data.phone}} </p>
      <p>{{data.address}}</p>
    </div>

    <!-- 食品列表部分 -->
    <ul class="food">
      <li v-for="(item,index) in data1" v-bind:key="index" >
        <div class="food-left" >
          <img :src="item.foodImg">
          <div class="food-left-info">
            <h3>{{item.name}}</h3>
            <p>{{item.description}}</p>
            <p>&#165;{{item.price}}</p>
          </div>
        </div>
        <div class="food-right">
          <div>
            <el-button v-if="item.selectedNum>0" @click="item.selectedNum--">-</el-button>
          </div>
          <p><span v-show="item.number!==0">{{item.selectedNum }}</span></p>
          <div>
            <el-button v-if="item.selectedNum<item.number" @click="item.selectedNum++">+</el-button>
          </div>
        </div>
      </li>
    </ul>
    <!-- 购物车部分 -->
    <div class="cart">
      <div class="cart-left">
        <div class="cart-left-icon" :style="totalQuantity==0?'backgroundcolor:#505051;':'background-color:#3190E8;'">
          <i class="fa fa-shopping-cart"></i>
          <div class="cart-left-icon-quantity" v-show="totalQuantity!=0">
            {{totalQuantity}}</div>
        </div>
        <div class="cart-left-info">
          <p>&#165;{{totalPrice}}</p>
          <p>另需配送费{{business.deliveryPrice}}元</p>
        </div>
      </div>
      <div class="cart-right">

        <div class="cart-right-item" @click="toOrder">
          去结算
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import axios from "axios";
import {ElMessage, ElButton} from "element-plus";

export default {
  name: 'BusinessInfo',
  data() {
    return {
      businessId: this.$route.query.businessId,
      business: {},
      foodArr: [],
      user: {},
      id:JSON.parse(localStorage.getItem('business')),
      userid:JSON.parse(localStorage.getItem('name')),
      data:[],
      data1:[],
      num:[],
      price:[],
      name:[],
      ElButton,
      visiable:true,
      number:0,
      address:'翻斗花园'
    }
  },

  mounted() {
    this.fetchData()
    this.fetchData1()
  },
  methods: {
    fetchData() {
      axios.get('http://localhost:8082/business-center/business/find?id='+this.id)
          .then(response => {
            this.data = response.data
          })
          // eslint-disable-next-line no-unused-vars
          .catch(function (error) {
            ElMessage.error('获取数据错误，请重新尝试')
          })
    },

    fetchData1() {
      axios.get('http://localhost:8082/business-center/food/list?relativeBusiness='+this.id)
          .then(response => {
            this.data1 = response.data
            this.data1.forEach(item => {
              // 给每个对象添加一个selectedNum属性，并设置为0
              item.selectedNum = 0;
            });
          })
          // eslint-disable-next-line no-unused-vars
          .catch(function (error) {
            ElMessage.error('获取数据错误，请重新尝试')
          })
    },
    toOrder() {
      let filteredData = this.data1.filter(item => item.selectedNum !== 0);
      // 提取出name，price，selectedNum的值，并分别存入对应的数组中
      this.num = filteredData.map(item => item.selectedNum);
      this.price = filteredData.map(item => item.price);
      this.name = filteredData.map(item => item.name);
      axios.get('http://localhost:8082/order-center/order/create?relativeUser='+this.userid+'&relativeBusiness='+this.id+'&address='+this.address+'&num='+this.num+'&foodName='+this.name+'&foodPrice='+this.price)
          // eslint-disable-next-line no-unused-vars
          .then(response => {
            ElMessage.success('创建订单成功，等待商家确认后可以支付定订单')
          })
          // eslint-disable-next-line no-unused-vars
          .catch(function (error) {
            ElMessage.error('获取数据错误，请重新尝试')
          })
    },
    listCart() {
      this.$axios.post('CartController/listCart', this.$qs.stringify({
        businessId: this.businessId,
        userId: this.user.userId
      })).then(response => {
        let cartArr = response.data;
        //遍历所有食品列表
        for (let foodItem of this.foodArr) {
          foodItem.quantity = 0;
          for (let cartItem of cartArr) {
            if (cartItem.foodId == foodItem.foodId) {
              foodItem.quantity = cartItem.quantity;
            }
          }
        }
        this.foodArr.sort();
      }).catch(error => {
        console.error(error);
      });
    },
    add(index) {
      //首先做登录验证
      if (this.user == null) {
        this.$router.push({
          path: '/login'
        });
        return;
      }
      if (this.foodArr[index].quantity == 0) {
        //做insert
        this.savaCart(index);
      } else {
        //做update
        this.updateCart(index, 1);
      }
    },
    minus(index) {
      //首先做登录验证
      if (this.user == null) {
        this.$router.push({
          path: '/login'
        });
        return;
      }
      if (this.foodArr[index].quantity > 1) {
        //做update
        this.updateCart(index, -1);
      } else {
        //做delete
        this.removeCart(index);
      }
    },
    savaCart(index) {
      this.$axios.post('CartController/saveCart', this.$qs.stringify({
        businessId: this.businessId,
        userId: this.user.userId,
        foodId: this.foodArr[index].foodId
      })).then(response => {
        if (response.data == 1) {
          //此食品数量要更新为1；
          this.foodArr[index].quantity = 1;
          this.foodArr.sort();
        } else {
          alert('向购物车中添加食品失败！');
        }
      }).catch(error => {
        console.error(error);
      });
    },
    updateCart(index, num) {
      this.$axios.post('CartController/updateCart', this.$qs.stringify({
        businessId: this.businessId,
        userId: this.user.userId,
        foodId: this.foodArr[index].foodId,
        quantity: this.foodArr[index].quantity + num
      })).then(response => {
        if (response.data == 1) {
          //此食品数量要更新为1或-1；
          this.foodArr[index].quantity += num;
          this.foodArr.sort();
        } else {
          alert('向购物车中更新食品失败！');
        }
      }).catch(error => {
        console.error(error);
      });
    },
    removeCart(index) {
      this.$axios.post('CartController/removeCart', this.$qs.stringify({
        businessId: this.businessId,
        userId: this.user.userId,
        foodId: this.foodArr[index].foodId
      })).then(response => {
        if (response.data == 1) {
          //此食品数量要更新为0；视图的减号和数量要消失
          this.foodArr[index].quantity = 0;
          this.foodArr.sort();
        } else {
          alert('从购物车中删除食品失败！');
        }
      }).catch(error => {
        console.error(error);
      });
    },

  },
  computed: {
    count(){
      return this.$store.state.id
    },
    //食品总价格
    totalPrice() {
      let total = 0;
      for (let item of this.foodArr) {
        total += item.foodPrice * item.quantity;
      }
      return total;
    },
    //食品总数量
    totalQuantity() {
      let quantity = 0;
      for (let item of this.foodArr) {
        quantity += item.quantity;
      }
      return quantity;
    },
    //结算总价格
    totalSettle() {
      return this.totalPrice + this.business.deliveryPrice;
    }
  }
}
</script>
<style scoped>
/****************** 总容器 ******************/
.wrapper {
  width: 100%;
  height: 100%;
}
/****************** header部分 ******************/
.wrapper header {
  width: 100%;
  height: 12vw;
  background-color: #0097FF;
  color: #fff;
  font-size: 4.8vw;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}
/****************** 商家logo部分 ******************/
.wrapper .business-logo {
  width: 100%;
  height: 35vw;
  /*使用上外边距避开header部分*/
  margin-top: 12vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper .business-logo img {
  width: 40vw;
  height: 30vw;
  border-radius: 5px;
}
/****************** 商家信息部分 ******************/
.wrapper .business-info {
  width: 100%;
  height: 20vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.wrapper .business-info h1 {
  font-size: 5vw;
}
.wrapper .business-info p {
  font-size: 3vw;
  color: #666;
  margin-top: 1vw;
}
/****************** 食品列表部分 ******************/
.wrapper .food {
  width: 100%;
  /*使用下外边距避开footer部分*/
  margin-bottom: 14vw;
}
.wrapper .food li {
  width: 100%;
  box-sizing: border-box;
  padding: 2.5vw;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wrapper .food li .food-left {
  display: flex;
  align-items: center;
}
.wrapper .food li .food-left img {
  width: 20vw;
  height: 20vw;
}
.wrapper .food li .food-left .food-left-info {
  margin-left: 3vw;
}
.wrapper .food li .food-left .food-left-info h3 {
  font-size: 3.8vw;
  color: #555;
}
.wrapper .food li .food-left .food-left-info p {
  font-size: 3vw;
  color: #888;
  margin-top: 2vw;
}
.wrapper .food li .food-right {
  width: 16vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wrapper .food li .food-right .fa-minus-circle {
  font-size: 5.5vw;
  color: #999;
  cursor: pointer;
}
.wrapper .food li .food-right p {
  font-size: 3.6vw;
  color: #333;
}
.wrapper .food li .food-right .fa-plus-circle {
  font-size: 5.5vw;
  color: #0097EF;
  cursor: pointer;
}
/****************** 购物车部分 ******************/
.wrapper .cart {
  width: 100%;
  height: 14vw;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
}
.wrapper .cart .cart-left {
  flex: 2;
  background-color: #505051;
  display: flex;
}
.wrapper .cart .cart-left .cart-left-icon {
  width: 16vw;
  height: 16vw;
  box-sizing: border-box;
  border: solid 1.6vw #444;
  border-radius: 8vw;
  background-color: #3190E8;
  font-size: 7vw;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -4vw;
  margin-left: 3vw;
  position: relative;
}
.wrapper .cart .cart-left .cart-left-icon-quantity {
  width: 5vw;
  height: 5vw;
  border-radius: 2.5vw;
  background-color: red;
  color: #fff;
  font-size: 3.6vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: -1.5vw;
  top: -1.5vw;
}
.wrapper .cart .cart-left .cart-left-info p:first-child {
  font-size: 4.5vw;
  color: #fff;
  margin-top: 1vw;
}
.wrapper .cart .cart-left .cart-left-info p:last-child {
  font-size: 2.8vw;
  color: #AAA;
}
.wrapper .cart .cart-right {
  flex: 1;
}
/*达到起送费时的样式*/
.wrapper .cart .cart-right .cart-right-item {
  width: 100%;

  height: 100%;
  background-color: #38CA73;
  color: #fff;
  font-size: 4.5vw;
  font-weight: 700;
  user-select: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
/*不够起送费时的样式（只有背景色和鼠标样式的区别）*/
/*
.wrapper .cart .cart-right .cart-right-item{
width: 100%;
height: 100%;
background-color: #535356;
color: #fff;
font-size: 4.5vw;
font-weight: 700;
user-select: none;

display: flex;
justify-content: center;
align-items: center;
}
*/
</style>

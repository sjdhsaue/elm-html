<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>用户登陆</p>
    </header>
    <!-- 表单部分 -->
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
    <ul class="form-box">
      <li>
        <div class="title">
          手机号码：
        </div>
        <div class="content">
          <el-form-item prop="username">
            <el-input type="text" v-model="loginForm.username" placeholder="手机号码"></el-input>
          </el-form-item>
        </div>
      </li>
      <li>
        <div class="title">
          密码：
        </div>
        <div class="content">
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
          </el-form-item>
        </div>
      </li>
    </ul>

    <div class="button-login">
      <el-form-item>
      <button @click="login">登陆</button>
      </el-form-item>
    </div>
    <div class="button-register">
      <button @click="register">去注册</button>
    </div>
    </el-form>
    <!-- 底部菜单部分 -->
  </div>
</template>
<script>

import { ElForm, ElMessage, ElFormItem, ElInput, ElButton} from "element-plus";
import {defineComponent} from "vue";
import axios from "axios";

export default defineComponent({

  name:'UserLogin',
  components:{
    ElForm,
    ElFormItem,
    ElInput,
    // eslint-disable-next-line vue/no-unused-components
    ElButton
  },
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login () {
      axios.get('http://localhost:8082/user-center/user/login?name=' + this.loginForm.username + '&password=' + this.loginForm.password)
          .then(response => {
            localStorage.setItem('figure', JSON.stringify(response.data.figure))
            localStorage.setItem('name', JSON.stringify(response.data.name))
            if (response.data.id !== null && response.data.figure === 1) {
              this.$router.push('/index')
            }
            if (response.data.id !== null && response.data.figure === 2) {
              this.$router.push('/dhome')
            }
          })
          // eslint-disable-next-line no-unused-vars
          .catch(function (error) {
            ElMessage.error('用户名或账号错误')
          })
    }
  },

})
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
/****************** 表单部分 ******************/
.wrapper .form-box {
  width: 100%;
  margin-top: 12vw;
}
.wrapper .form-box li {
  box-sizing: border-box;
  padding: 4vw 3vw 0 3vw;
  display: flex;
  align-items: center;
}
.wrapper .form-box li .title {
  flex: 0 0 18vw;
  font-size: 3vw;
  font-weight: 700;
  color: #666;
}
.wrapper .form-box li .content {
  flex: 1;
}
.wrapper .form-box li .content input {
  border: none;
  outline: none;
  width: 100%;
  height: 4vw;
  font-size: 3vw;
}
.wrapper .button-login {
  width: 100%;
  box-sizing: border-box;
  padding: 4vw 3vw 0 3vw;
}
.wrapper .button-login button {
  width: 100%;
  height: 10vw;
  font-size: 3.8vw;
  font-weight: 700;
  color: #fff;
  background-color: #38CA73;
  border-radius: 4px;
  border: none;
  outline: none;
}
.wrapper .button-register {
  width: 100%;
  box-sizing: border-box;
  padding: 4vw 3vw 0 3vw;
}
.wrapper .button-register button {
  width: 100%;
  height: 10vw;
  font-size: 3.8vw;
  font-weight: 700;
  /*与上面登陆按钮不同的只有颜色、背景色、边框不同*/
  color: #666;
  background-color: #EEE;
  border: solid 1px #DDD;
  border-radius: 4px;
  border: none;
  outline: none;
}
/****************** 底部菜单部分 ******************/
.wrapper .footer {
  width: 100%;

  height: 14vw;
  border-top: solid 1px #DDD;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.wrapper .footer li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
  user-select: none;
  cursor: pointer;
}
.wrapper .footer li p {
  font-size: 2.8vw;
}
.wrapper .footer li i {
  font-size: 5vw;
}
</style>

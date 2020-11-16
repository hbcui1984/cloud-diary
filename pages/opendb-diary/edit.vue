
<template>
  <view class="uni-container">
    <uni-forms ref="form" v-model="formData" validate-trigger="submit" err-show-type="toast" @submit="submit">
      <uni-forms-item name="content" label="">
  <textarea @input="binddata('content', $event.detail.value)" class="uni-textarea-border" :value="formData.content"></textarea>
</uni-forms-item>

      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submitForm">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import validator from '@/js_sdk/validator/opendb-diary.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'opendb-diary';

  function getValidator(fields) {
    let reuslt = {}
    for (let key in validator) {
      if (fields.indexOf(key) > -1) {
        reuslt[key] = validator[key]
      }
    }
    return reuslt
  }

  export default {
    data() {
      return {
        formOptions: {},
        formData: {
  "diary_date": null,
  "content": ""
},
        rules: {
          ...getValidator(["diary_date","content"])
        }
      }
    },
    onLoad(e) {
      const id = e.id
      this.formDataId = id
      this.getDetail(id)
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      /**
       * 触发表单提交
       */
      submitForm(form) {
        this.$refs.form.submit();
      },

      /**
       * 表单提交
       * @param {Object} event 回调参数 Function(callback:{value,errors})
       */
      submit(event) {
        const {
          value,
          errors
        } = event.detail

        // 表单校验失败页面会提示报错 ，要停止表单提交逻辑
        if (errors) {
          return
        }

        uni.showLoading({
          title: "修改中...",
          mask: true
        })

        // 使用 uni-clientDB 提交数据
        db.collection(dbCollectionName).where({
          _id: this.formDataId
        }).update(value).then((res) => {
          uni.showToast({
            icon: 'none',
            title: '修改成功'
          })
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        }).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 获取表单数据
       * @param {Object} id
       */
      getDetail(id) {
        uni.showLoading({
          mask: true
        })
        db.collection(dbCollectionName).where({
          _id: id
        }).get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
          }
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        }).finally(() => {
          uni.hideLoading()
        })
      }
    }
  }
</script>

<style>
  .uni-container {
    padding: 15px;
  }

  .uni-input-border,
  .uni-textarea-border {
    width: 100%;
    font-size: 14px;
    color: #666;
    border: 1px #e5e5e5 solid;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .uni-input-border {
    padding: 0 10px;
    height: 35px;

  }

  .uni-textarea-border {
    padding: 10px;
    height: 80px;
  }

  .uni-button-group {
    margin-top: 50px;
    display: flex;
    justify-content: center;
  }

  .uni-button {
    width: 184px;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    line-height: 1;
    margin: 0;
  }
</style>

// 校验规则由 schema 生成，请不要直接修改当前文件，如果需要请在uniCloud控制台修改schema
// uniCloud: https://unicloud.dcloud.net.cn/



export default {
  "diary_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ]
  },
  "content": {
    "rules": [
      {
        "format": "string"
      }
    ]
  }
}

import CryptoJS from 'crypto-js'
import { w3cwebsocket as W3CWebSocket } from 'websocket'

const SPARK_URL = 'wss://spark-api.xf-yun.com/v3.5/chat'
const SPARK_API_KEY = '60cae27277c84f7b0068e553df3ff601'
const SPARK_API_SECRET = 'ZTgyMDRiYmJjYTZiZTg4MmEyZDczOWQw'
const SPARK_APPID = '87911696'

// 生成握手参数
function getHandshakeParams() {
  const date = new Date().toGMTString()
  const signatureOrigin = `host: spark-api.xf-yun.com\ndate: ${date}\nGET /v3.5/chat HTTP/1.1`
  const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, SPARK_API_SECRET)
  const signature = CryptoJS.enc.Base64.stringify(signatureSha)
  const authorizationOrigin = `api_key="${SPARK_API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
  const authorization = btoa(authorizationOrigin)
  
  return {
    authorization,
    date,
  }
}

// 创建WebSocket连接
export function createSparkConnection(onMessage) {
  const params = getHandshakeParams()
  const url = `${SPARK_URL}?authorization=${params.authorization}&date=${encodeURI(params.date)}&host=spark-api.xf-yun.com`
  
  const ws = new W3CWebSocket(url)
  
  ws.onmessage = (evt) => {
    const data = JSON.parse(evt.data)
    onMessage(data)
  }
  
  return ws
}

// 构造请求数据
export function buildRequestData(messages) {
  return {
    header: {
      app_id: SPARK_APPID
    },
    parameter: {
      chat: {
        domain: "generalv3.5",
        temperature: 0.5,
        max_tokens: 2048
      }
    },
    payload: {
      message: {
        text: messages
      }
    }
  }
}
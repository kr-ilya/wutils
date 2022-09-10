import axios from 'axios'
if(process.env.NODE_ENV === 'production'){
var domen = 'wutils.ru/api';
}else{
var domen = '127.0.0.1:3000';
}
export default() => {
  return axios.create({
    baseURL: '//' + domen
  })
}

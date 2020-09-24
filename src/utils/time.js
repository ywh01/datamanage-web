import moment from 'moment'

export default {
    //获取当前格式化时间
    getNowTime(){
        return moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }
}
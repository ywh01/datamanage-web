import uuidv1 from 'uuid/v1' 

export default {
    //获取vue-cli自带的uuid方法
    getUUID(){
        let reg=new RegExp('-','g')//g代表全部
        return uuidv1().replace(reg,"");
    }
}
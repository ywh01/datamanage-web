import request from '../../utils/request';
import uuid from '../../utils/uuid' 
import time from '../../utils/time'
import localItem from '../../utils/localstorage'

export default {
    //分页查询单位信息
    fetchData(query){
        return request({
            url: './getUnitByPage',
            method: 'post',
            params: query
        });
    },
    //查询所有的单位信息,新建单位使用        
    fetchAllData(){
        return request({
            url: './getAllUnit',
            method: 'post'
        });
    },
    //新增单位
    insertData(form){
        form.id = uuid.getUUID();
        form.creator = localItem.getLoginUser();
        form.modifier = localItem.getLoginUser();
        // form.createTime=time.getNowTime();
        // form.updateTime=time.getNowTime();
        form.createTime=new Date().getTime();
        form.updateTime=new Date().getTime();
        const reqData = {
            reqData : JSON.stringify(form)
        };
        
        return request({
            url: './insertUnit',
            method: 'post',
            params: reqData
        });
    },
    //修改数据
    updateUnit(form){
        form.modifier = localItem.getLoginUser();
        form.updateTime=new Date().getTime();
        const reqData = {
            reqData : JSON.stringify(form)
        };
        return request({
            url: './updateUnit',
            method: 'post',
            params: reqData
        });
    },
    //删除单个数据
    delUnitData(rowID){
        const arr = [];
        arr.push(rowID);
        const reqData = {
            reqData : JSON.stringify(arr)
        };
        return request({
            url: './delUnitData',
            method: 'post',
            data: arr
        });
    },
    //删除批量数据
    delBeachUnitData(delBeachUnitData){
        const arr = [];
        for(var i=0; i<delBeachUnitData.length; i++){
            arr.push(delBeachUnitData[i].id);
        }
        return request({
            url: './delUnitData',
            method: 'post',
            data: arr
        });
    }
}

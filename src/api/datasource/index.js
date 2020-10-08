import request from '../../utils/request';

export default {
    //分页查询数据源信息
    fetchData(query){
        return request({
            url: './dataSource/getAllDataSource',
            method: 'post',
            params: query
        });
    },
    insertData(insert){
        return request({
            url: './dataSource/getAllDataSource',
            method: 'post',
            params: insert
        });
    },
    delDataSourceData(id){
        const arr = [];
        arr.push(id);
        return request({
            url: './dataSource/delDataSourceData',
            method: 'post',
            data: arr
        });
    },
    delBeachDataSourceData(ids){
        const arr = [];
        for(var i=0; i<ids.length; i++){
            arr.push(ids[i].id);
        }
        return request({
            url: './dataSource/delDataSourceData',
            method: 'post',
            data: arr
        });
    }
}
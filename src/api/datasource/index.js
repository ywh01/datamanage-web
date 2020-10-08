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
            url: './getAllDataSource',
            method: 'post',
            params: insert
        });
    }
}
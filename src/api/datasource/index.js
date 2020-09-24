import request from '../../utils/request';

export const fetchData = query => {
    return request({
        url: './getAllDataSource',
        method: 'post',
        params: query
    });
};

export const insertData = insert => {
    return request({
        url: './getAllDataSource',
        method: 'post',
        params: insert
    });
};

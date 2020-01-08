import React from 'react';
import { Modal } from 'antd';
import axios from "axios";


const { confirm } = Modal;

function showDeleteConfirm(props) {

    const { entity, dataKey, url, token, redirectUrl } = props;

    confirm({
        title: `Delete ${entity}?`,
        content: `Are you sure delete the ${entity} -- ${dataKey}?`,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk() {
            axios.defaults.headers = {
                Authorization: `Token ${token}`
            };
            axios.delete(url).then(res => {
                if (!redirectUrl)
                    window.location.reload();
                else
                    window.location.href = redirectUrl;
            }).catch(err => console.error(err));
        }
    });
};


export default showDeleteConfirm;
import React from 'react';
import { UsergroupAddOutlined, ControlOutlined, InboxOutlined } from '@ant-design/icons';
import routes from '@routes';
import { FormattedMessage } from 'react-intl';
import apiConfig from './apiConfig';
import { IconSettings } from '@tabler/icons-react';

export const navMenuConfig = [
    {
        label: <FormattedMessage defaultMessage="Quản lý hệ thống" />,
        key: 'quan-ly-he-thong',

        // permission: apiConfig.category.getList.baseURL,
        children: [
            {
                label: <FormattedMessage defaultMessage="Cài đặt" />,
                key: 'setting',
                path: routes.settingsPage.path,

            },

        ],
    },
    {

        label: <FormattedMessage defaultMessage="Quản lý khóa học" />,
        key: 'quan-ly-khoa-hoc',
        permission: apiConfig.courses.getList.baseURL,
        children: [
            {
                label: <FormattedMessage defaultMessage="Khóa học" />,
                key: 'course',
                path: routes.CourseListPage.path,
            },
        ],
    },
];

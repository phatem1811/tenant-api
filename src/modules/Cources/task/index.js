import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Button, Modal, Tag } from 'antd';
import React, { Component, useEffect, useState } from 'react';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { FieldTypes } from '@constants/formConfig';

import useTranslate from '@hooks/useTranslate';
import { defineMessages, FormattedMessage } from 'react-intl';
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE } from '@constants/index';
import DatePickerField from '@components/common/form/DatePickerField';
import { useLocation  ,useNavigate } from 'react-router-dom';



const message = defineMessages({
    objectName: 'Task',

});

const TaskListPage = () => {
    const translate = useTranslate();
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const queryString = location.search;
    console.log("check pre url ", queryString);
    const courseName = location.state?.courseName;
    const navigate = useNavigate();
    console.log("check", location);
    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.task,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.getCreateLink = () => {
                return `${pagePath}/lecture${queryString}`;
            };
        },


    });
    console.log("dataaaaaaaaaaaaa", data);


    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            align: 'center',
            width: 100,
            render: (text, record, index) => index + 1,
        },
        { title: <FormattedMessage defaultMessage="Task" />, dataIndex: ['lecture', 'lectureName'] },
        {
            title: <FormattedMessage defaultMessage="Tên sinh viên" />, dataIndex: ['student', 'account', 'fullName'],
        },
        {
            title: <FormattedMessage defaultMessage="Ngày bắt đầu" />,
            dataIndex: 'startDate',

        },
        {
            title: <FormattedMessage defaultMessage="Ngày kết thúc" />, dataIndex: 'dueDate',
        },
        {
            title: <FormattedMessage defaultMessage="Ngày hoàn thành" />, dataIndex: 'dateComplete',
        },


        mixinFuncs.renderStatusColumn({ width: '90px' }),
        mixinFuncs.renderActionColumn(
            {

                edit: true,
                delete: true,
            },
            { width: '130px' },
        ),
    ];

    const searchFields = [
        {
            key: 'studentId',
            type: FieldTypes.AUTOCOMPLETE,
            placeholder: 'Tên sinh viên',
            apiConfig: apiConfig.student.autocomplete,
            mappingOptions: (item) => ({ value: item.id, label: item.account.fullName }),
            searchParams: (text) => ({ name: text }),

        },

        {
            name: 'startDate',
            placeholder: 'Từ ngày',
            component: DatePickerField,
            componentProps: {

                format: DATE_FORMAT_DISPLAY,
            },

        },
        {
            name: 'startDate',
            placeholder: 'Tới ngày',
            component: DatePickerField,
            componentProps: {

                format: DATE_FORMAT_DISPLAY,
            },

        },
    ];


    return (
        <PageWrapper
            routes={[
                // { breadcrumbName: `Khóa học`, path: location.state.path },
                { breadcrumbName: translate.formatMessage(message.objectName) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        pagination={pagination}
                    />
                }
            />
            <Modal
                title={<FormattedMessage defaultMessage="Preview" />}
                width={1000}
                open={showPreviewModal}
                footer={null}
                centered
                onCancel={() => setShowPreviewModal(false)}
            >

            </Modal>
        </PageWrapper>
    );
};

export default TaskListPage;

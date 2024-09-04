import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Button, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { EyeOutlined, UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, categoryKind, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { convertUtcToLocalTime } from '@utils';
import { defineMessages, FormattedMessage } from 'react-intl';

const message = defineMessages({
    objectName: 'Khóa học',
    fee: 'Học phí',
    dateEnd: 'Ngày kêt thúc',
    subject: "Tên Môn học",
});

const CourseListPage = () => {
    const translate = useTranslate();
    const notification = useNotification();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const { execute: executeUpdateNewsPin, loading: updateNewsPinLoading } = useFetch(apiConfig.courses.update);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.courses,
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
            funcs.additionalActionColumnButtons = () => {
                if (!mixinFuncs.hasPermission([apiConfig.courses.getById.baseURL])) return {};
                return {
                    preview: ({ id }) => {
                        return (
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={() => {
                                    executeGetNews({
                                        pathParams: {
                                            id,
                                        },
                                        onCompleted: () => setShowPreviewModal(true),
                                        onError: () =>
                                            notification({
                                                type: 'error',
                                                title: 'Error',
                                                message: translate.formatMessage(commonMessage.previewFailed),
                                            }),
                                    });
                                }}
                            >
                                <EyeOutlined />
                            </Button>
                        );
                    },
                };
            };
        },
    });

    const {
        execute: executeGetNews,
        loading: getNewsLoading,
        data: newsContent,
    } = useFetch(apiConfig.courses.getById, {
        immediate: false,
        mappingData: ({ data }) => data.content,
    });


    const handleUpdatePinTop = (item) => {
        executeUpdateNewsPin({
            pathParams: {
                id: item.id,
            },
            data: {
                ...item,
                pinTop: Number(!item.pinTop),
            },
        });
    };


    const formatMoney = (amount) => {
        if (isNaN(amount)) {
            return 'Invalid amount';
        }
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };
    const columns = [
        {
            title: '#',
            dataIndex: 'avatar',
            align: 'center',
            width: 100,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        { title: <FormattedMessage defaultMessage="Tên khóa học" />, dataIndex: 'name' },
        {
            title: <FormattedMessage defaultMessage="Tên Môn Học" />, dataIndex: ['subject', 'subjectName'],

        },
        {
            title: <FormattedMessage defaultMessage="Học phí" />,

            dataIndex: 'fee',
            render: (fee) => formatMoney(fee),


        },
        {
            title: <FormattedMessage defaultMessage="Ngày Kết Thúc" />,
            width: 180,
            dataIndex: 'dateEnd',
            render: (dateEnd) => {
                const createdDateLocal = convertUtcToLocalTime(dateEnd, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
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
            key: 'Tên khóa học',
            placeholder: translate.formatMessage(commonMessage.Name),
        },

        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];


    return (
        <PageWrapper
            loading={getNewsLoading}
            routes={[{ breadcrumbName: translate.formatMessage(message.objectName) }]}
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

export default CourseListPage;

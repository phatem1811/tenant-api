import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
// import { defineMessages, FormattedMessage } from 'react-intl';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants/index';
import { useLocation } from 'react-router-dom';
import { statusOptions } from '@constants/masterData';
import { commonMessage } from '@locales/intl';
import { BaseForm } from '@components/common/form/BaseForm';
import useFetch from '@hooks/useFetch';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Radio, Button, Modal } from 'antd';
import { useState } from 'react';
import useDisclosure from '@hooks/useDisclosure';
import DatePickerField from '@components/common/form/DatePickerField';
import { Card, Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextField from '@components/common/form/TextField';
import { formatDateString } from '@utils/index';
import { useNavigate } from "react-router-dom";
// const message = defineMessages({
    
//     objectName: 'Bài giảng',
// });

const CreateTask = () => {
    const location = useLocation();
    const queryString = location.search;
    const navigate = useNavigate();
    const [isOpen, { open, close }] = useDisclosure(false);
    const params = new URLSearchParams(queryString);
    const subjectId = params.get('subjectId');
    const courseId = params.get('courseId');
    const [selectedLecture, setselectedLecture] = useState(null);

    const handleRadioChange = (e) => {
        setselectedLecture(e.target.value);
    };

    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const [form] = useForm();

    const { data: dataTaskCourse } = useFetch(apiConfig.task.coursetask, {
        pathParams: { id: courseId },
        immediate: true,
        mappingData: (response) => response.data.content,
    });
    const { execute } = useFetch(apiConfig.task.asignAll, {
        immediate: false,
    });

    const { data: dataListTask } = useFetch(apiConfig.lecture.getbysubject, {
        pathParams: { id: subjectId },
        immediate: true,
        mappingData: (response) => response.data.content,
    });

    const lectureId = dataTaskCourse?.map(task => task.lecture?.id) || [];
    console.log("check data task cource", lectureId);
    const handleCreateTaskClick = () => {
        open();
    };



    const columns = [
        {
            title: <FormattedMessage defaultMessage="Tên bài giảng" />,
            dataIndex: 'lectureName',
            width: '50%',
            render: (lectureName, record) => {
                const { id, lectureKind } = record;
                const isChecked = lectureId.includes(id);
                const isSelected = selectedLecture === id;
                const showRadio = lectureKind !== 1;

                return (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                    }}>
                        <span style={{
                            fontWeight: lectureKind === 1 ? 'bold' : 'normal',
                            textTransform: lectureKind === 1 ? 'uppercase' : 'none',
                            marginLeft: lectureKind === 2 ? '30px' : '0',
                            flex: 1,
                        }}>
                            {lectureName}
                        </span>
                        {isChecked ? (
                            <CheckCircleOutlined style={{ color: 'green' }} />
                        ) : (
                            showRadio && (
                                <Radio
                                    checked={isSelected}
                                    value={id}
                                    onChange={handleRadioChange}
                                />
                            )
                        )}
                    </div>
                );
            },
        },
    ];

    const handleSubmit = async (values) => {
        values.startDate = formatDateString(values.startDate, DEFAULT_FORMAT);
        values.dueDate = formatDateString(values.dueDate, DEFAULT_FORMAT);
        const formData = {
            ...values,
            courseId,
            lectureId: selectedLecture,
        };
        console.log("Form Values:", formData);
        try {
            await execute({
                method: 'POST',
                data: formData,
                onCompleted: (response) => {
                    console.log('Task created successfully:', response);
                    navigate( `/course/task${queryString}`);
                },
                onError: (error) => {
                    console.error('Error creating task:', error);
                },
            });
        } catch (error) {
            console.error('Error saving task:', error); 
        }

    };
    return (
        <PageWrapper routes={[  { breadcrumbName: 'bài giảng' },
        ]}>
            <BaseForm>
                <ListPage >
                    <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                        <Button
                            type="primary"
                            style={{ marginTop: '16px' }}
                            disabled={selectedLecture === null}
                            onClick={handleCreateTaskClick}
                        >
                            Tạo Task
                        </Button>
                    </div>
                    <BaseTable

                        columns={columns}
                        dataSource={dataListTask}

                    />

                </ListPage>
            </BaseForm>
            <Modal
                title="Tạo Task"
                open={isOpen}
                onCancel={close}
                width={850}
                footer={null}
            >
                <BaseForm
                    id="create-task-form"
                    onFinish={handleSubmit}
                    form={form}
                >
                    <Card className="card-form" bordered={false}>
                        <Row gutter={10}>
                            <Col span={12}>
                                <DatePickerField
                                    name="startDate"
                                    label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                                    placeholder="Ngày bắt đầu"
                                    format={DEFAULT_FORMAT}
                                    style={{ width: '100%' }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ngày bắt đầu',
                                        },
                                    ]}
                                    showTime={{ format: 'HH:mm:ss' }}
                                />
                            </Col>
                            <Col span={12}>
                                <DatePickerField
                                    name="dueDate"
                                    label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                                    placeholder="Ngày kết thúc"
                                    format={DEFAULT_FORMAT}
                                    style={{ width: '100%' }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ngày kết thúc',
                                        },
                                    ]}
                                    showTime={{ format: 'HH:mm:ss' }}
                                />
                            </Col>
                        </Row>
                        <div style={{ marginTop: '16px' }}>
                            <label>Chú thích:</label>
                            <TextField

                                name="notes"
                                placeholder="Nhập chú thích tại đây..."
                                type="textarea"
                            />
                        </div>
                        <div className="footer-card-form" style={{ marginTop: '16px' }}>
                            <Button type="primary" htmlType="submit">
                                Tạo
                            </Button>
                        </div>
                    </Card>
                </BaseForm>
            </Modal>
        </PageWrapper>
    );
};

export default CreateTask;

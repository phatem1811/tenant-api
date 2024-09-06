import { Card, Col, Form, Row, Space, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import TextField from '@components/common/form/TextField';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants } from '@constants';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import SelectField from '@components/common/form/SelectField';
import useTranslate from '@hooks/useTranslate';
import { statusOptions } from '@constants/masterData';

import { FormattedMessage } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { useIntl } from 'react-intl';
import DatePickerField from '@components/common/form/DatePickerField';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants/index';
import { formatDateString } from '@utils/index';
import { taskStateMessage, STATE_TASK_ASIGN, STATE_TASK_DONE } from '@constants/masterData';

dayjs.extend(customParseFormat);

const TaskForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing }) => {
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);

    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { formatMessage } = useIntl();

    console.log("check", statusValues);
    const defaultStatus = 1;
    const stateValues = [
        { value: STATE_TASK_ASIGN, label: formatMessage(taskStateMessage.asign) },
        { value: STATE_TASK_DONE, label: formatMessage(taskStateMessage.done) },
    ];



    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });



    const handleSubmit = (values) => {

        values.startDate = formatDateString(values.startDate, DEFAULT_FORMAT);
        values.dueDate = formatDateString(values.dueDate, DEFAULT_FORMAT);
        console.log("check value", values);
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);

    useEffect(() => {

        dataDetail.startDate = dataDetail.startDate && dayjs(dataDetail.startDate, DEFAULT_FORMAT);
        dataDetail.dueDate = dataDetail.dueDate && dayjs(dataDetail.dueDate, DEFAULT_FORMAT);
        form.setFieldsValue({
            ...dataDetail,
            studentId: dataDetail?.student?.account?.id,
            state: dataDetail?.state,
            courseId: dataDetail?.course?.id,
            lectureId: dataDetail?.lecture?.lectureName,

        });

    }, [dataDetail]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange} initialValues={{ status: defaultStatus }}  >
            <Card className="card-form" bordered={false}>

                <Row gutter={10}>

                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Khóa học" />}
                            name={['courseId']}
                            apiConfig={apiConfig.courses.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            searchParams={(text) => ({ subjectName: text })}
                            required
                        />

                    </Col>
                </Row>

                <Row gutter={10}>

                    <Col span={12}>

                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Sinh Viên" />}
                            name={['studentId']}
                            apiConfig={apiConfig.student.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.account.fullName })}
                            searchParams={(text) => ({ name: text })}
                            required={isEditing ? false : true}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="state"
                            options={stateValues}
                        />
                    </Col>


                </Row>
                <Row gutter={10}>
                    <Col span={12}>
                        <DatePickerField
                            name="startDate"

                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            placeholder="Ngày bắt đầu"
                            format={DATE_FORMAT_DISPLAY}
                            style={{ width: '100%' }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày bắt đầu',
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                            name="dueDate"
                            placeholder="Ngày kết thúc"
                            format={DATE_FORMAT_DISPLAY}
                            style={{ width: '100%' }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày kết thúc',
                                },
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={10}>
                    <Col span={24}>
                        <TextField
                            required
                            label={<FormattedMessage defaultMessage="Lưu ý" />}
                            name="note"
                            type="textarea"
                        />
                    </Col>
                </Row>
                <Form.Item
                    
                    name="status"
                    rules={[{ required: true }]}>
                  
                </Form.Item>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default TaskForm;
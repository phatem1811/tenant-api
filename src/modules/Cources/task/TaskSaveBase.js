import PageWrapper from '@components/common/layout/PageWrapper';
import { categoryKind } from '@constants';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useSaveBase from '@hooks/useSaveBase';
import React, { useEffect } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import routes from '../route';
import useTranslate from '@hooks/useTranslate';
import TaskForm from './TaskForm';

const message = defineMessages({
    objectName: 'task',
});

const TaskSaveBase = () => {
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.task.getById,
            create: apiConfig.task.create,
            update: apiConfig.task.update,
        },
        options: {
            getListUrl: routes.TaskListPage.path,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                };
            };

        },
    });



    console.log("check data detail", detail);
    return (
        <PageWrapper

            routes={[
                // { breadcrumbName: <FormattedMessage defaultMessage="Task" />, path: routes.TaskListPageListPage.path },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <TaskForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
};

export default TaskSaveBase;

import PageWrapper from '@components/common/layout/PageWrapper';
import { categoryKind } from '@constants';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useSaveBase from '@hooks/useSaveBase';
import React, { useEffect } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import CoursesForm from './CoursesForm';
import routes from './route';
import useTranslate from '@hooks/useTranslate';

const message = defineMessages({
    objectName: 'courses',
});

const CoursesSaveBase = () => {
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.courses.getById,
            create: apiConfig.courses.create,
            update: apiConfig.courses.update,
        },
        options: {
            getListUrl: routes.CourseListPage.path,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    kind: categoryKind.news,
                };
            };
        },
    });

    const {
        data: categories,
        loading: getCategoriesLoading,
        execute: executeGetCategories,
    } = useFetch(apiConfig.category.autocomplete, {
        immediate: false,
        mappingData: ({ data }) => data.data.map((item) => ({ value: item.id, label: item.categoryName })),
    });

    useEffect(() => {
        executeGetCategories({
            params: {
                kind: categoryKind.news,
            },
        });
    }, []);

    return (
        <PageWrapper
            loading={loading || getCategoriesLoading}
            routes={[
                { breadcrumbName: <FormattedMessage defaultMessage="Courses" />, path: routes.CourseListPage.path },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CoursesForm
                categories={categories}
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

export default CoursesSaveBase;

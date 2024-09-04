import apiConfig from '@constants/apiConfig';
import CourseListPage from './index';
import CoursesSaveBase from './CoursesSaveBase';

export default {
    CourseListPage: {
        path: '/course',
        title: 'courses',
        auth: true,
        component: CourseListPage,
        permission: [apiConfig.courses.getList.baseURL],
    },
    CoursesSaveBase: {
        path: '/course/:id',
        title: 'courses Save Page',
        auth: true,
        component: CoursesSaveBase,
        separateCheck: true,
        permission: [apiConfig.courses.create.baseURL, apiConfig.courses.update.baseURL],
    },

};

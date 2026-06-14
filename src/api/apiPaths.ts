export const apiPaths = {
    institute: {
        get: "/institute/list",
        add: "/institute/add",
        search: "/institute/search",
        update: "/institute/update" // unused
    },
    users: {
        login: "/user/login",
        logout: "/user/logout",
        me: "/user/me",
        setInactive: "/user/activity/off"
    },
    counters: {
        get: "/metadata/counters/all",
    },
    contribute: {
        batch: "/contribute/send/batch",
        get: {
            institute: "/contribute/get/institute", // usage: institute/${instituteId}
            user: "/contribute/get/user", // usage: user/${username}
            both: "/contribute/get/both" // usage: both/${instituteId}/${username}
        },
        stop: "/contribute/stop" // usage /contribute/stop/${instituteId}
    },
    students: {
        getFrozenList: (instituteId: string) => `/student/institute/${instituteId}/list/frozen`,
        getRegularList: (instituteId: string) => `/student/institute/${instituteId}/list/regular`,
        getSortedList: (instituteId: string) => `/student/institute/${instituteId}/list/sorted`,
        search: "/student/search"
    }
};

export const gfgApiPaths = {
    institute: (instituteId: string, page_no: number, page_size: number) => `institute/${instituteId}/students/stats?page_size=${page_size}&page=${page_no}`
}

export const API_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL;
import { ChatIcon, DocumentTextIcon, HeartIcon, RefreshIcon } from "@heroicons/react/outline";

import Table from "components/Tables";
import { useLazyQuery } from "@apollo/client";
import { get } from 'lodash'

import { SEARCH_USER, SEARCH_POST, SEARCH_POST_EXPORT } from 'graphql/mutation'
import { useEffect, useRef } from "react";

import UserDetailCard from "components/UserDetailCard";
import { useUserStatus } from "hooks/useUsersStatus";
import jsPDF from "jspdf";
import { handleHeader } from "hooks/handleHeader";
import autoTable from 'jspdf-autotable'
import moment from 'moment';

const SingleUserPage = (props) => {
    const _processPdf = useRef(false);
    const username = props.match.params.username
    const [changeUserStatus, { loading: loadingUserStatus }] = useUserStatus(true);

    const [getUserDetail, { data: dataUser, loading, called, refetch }] = useLazyQuery(SEARCH_USER, { notifyOnNetworkStatusChange: true });
    const [
        getPosts,
        { data: dataPosts, loading: loadingPost, called: calledPost, refetch: refetchPosts }
    ] = useLazyQuery(SEARCH_POST, { notifyOnNetworkStatusChange: true });

    useEffect(() => {
        const fetchUserDetail = () => {
            if (called) refetch()
            getUserDetail({ variables: { search: username, perPage: 20, page: 0 } })
        }

        const fetchPostDetail = () => {
            if (calledPost) refetchPosts()
            getPosts({ variables: { search: "", location: "", filters: { owner: username } } })
        }

        fetchUserDetail();
        fetchPostDetail();
    }, [username, called, refetch, calledPost, getPosts, getUserDetail, refetchPosts])

    const [
        searchPostExportData,
        { called: calledExport }
    ] = useLazyQuery(SEARCH_POST_EXPORT, {
        onCompleted: (data) => {
            if (data?.searchPosts?.hits.length) {

                const doc = new jsPDF({
                    orientation: 'landscape'
                })
                //Header
                handleHeader(doc, "Post", "-", data?.searchPosts?.hits.length)

                //Footer
                doc.setFontSize(9)
                //table
                autoTable(doc, { html: '#posts' })

                const newExport = data?.searchPosts?.hits.map(({
                    owner, text, createdAt, location, id, status = '', ...props
                }) => {
                    const { markdownContent } = JSON.parse(text)
                    const datetime = moment(createdAt).utc().format('DD MMM YYYY hh:mm')
                    return [
                        owner,
                        markdownContent,
                        datetime,
                        `${location?.detail?.formattedAddress.toString()}`,
                        id,
                        (status.flags ? (status.flags || []).join(',') : status.active ? 'Active' : 'TakeDown')
                    ]
                })

                const head = ['Owner', 'Caption', 'CreateAt', 'Location', 'ID', 'Status']
                autoTable(doc, {
                    startY: 36,
                    head: [head],
                    body: newExport,
                    didDrawPage: (data) => {
                        var str = 'Page ' + doc.internal.getNumberOfPages()
                        // Total page number plugin only available in jspdf v1.0+
                        // if (typeof doc.putTotalPages === 'function') {
                        //   str = str + ' of ' + data.table.pageCount
                        // }
                        doc.setFontSize(10)

                        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                        var pageSize = doc.internal.pageSize
                        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
                        doc.text(str, data.settings.margin.left, pageHeight - 10)
                    }

                })
                if (!_processPdf.current) {
                    doc.save(`data-exported-posts-${new Date().getTime()}`)

                    _processPdf.current = true
                }
            }
        }, fetchPolicy: 'network-only'
    })
    const onFilters = (filter = [], exportData = false) => {
        if (exportData) {
            onExportData()
            return;
        }
    }
    const onExportData = () => {
        _processPdf.current = false; // pretend to double save pdf
        if (calledExport) refetch({ useExport: true, })
        searchPostExportData({ variables: { useExport: true, search: username } })
    }


    const singleUser = get(dataUser, 'searchUser.hits.[0]', [])
    const posts = get(dataPosts, 'searchPosts.hits', [])
    // const totalPostPages = get(dataPosts, 'searchPosts.nbPages', [])
    return (
        <>
            <div>
                <UserDetailCard data={singleUser} loading={loading} action={changeUserStatus} statusLoading={loadingUserStatus} title="Personal Info" />

                <div className="flex w-full mt-7 mb-5 gap-6">
                    <div className="card flex items-center">
                        <div className="bg-primary-100 rounded-full w-20 h-20 flex justify-center items-center mr-9">
                            <DocumentTextIcon className="w-10 h-10" />
                        </div>
                        <div>
                            <h1>{posts?.length}</h1>
                            <span>Total Post</span>
                        </div>
                    </div>
                    <div className="card flex items-center">
                        <div className="bg-red-100 rounded-full w-20 h-20 flex justify-center items-center mr-9">
                            <HeartIcon className="w-10 h-10" />
                        </div>
                        <div >
                            <h1>1</h1>
                            <span>Total Like</span>
                        </div>
                    </div>
                    <div className="card flex items-center">
                        <div className="bg-blue-100 rounded-full w-20 h-20 flex justify-center items-center mr-9">
                            <ChatIcon className="w-10 h-10" />
                        </div>
                        <div >
                            <h1>2</h1>
                            <span>Total Comment</span>
                        </div>
                    </div>
                    <div className="card flex items-center">
                        <div className="bg-yellow-100 rounded-full w-20 h-20 flex justify-center items-center mr-9">
                            <RefreshIcon className="w-10 h-10" />
                        </div>
                        <div>
                            <h1>2</h1>
                            <span>Total Repost</span>
                        </div>
                    </div>
                </div>
                <Table
                    noAddNew
                    noSearch
                    noSort
                    noFilter
                    onFilters={onFilters}
                    isLoading={loadingPost}
                    type="User Post"
                    totalHits={dataPosts?.searchPosts.nbHits}
                    data={posts} />
            </div>


        </>
    );
}

export default SingleUserPage;
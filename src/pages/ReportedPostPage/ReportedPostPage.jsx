
import { useEffect, useState, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import Table from 'components/Tables';
import Areas from 'components/Visual/Areas';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import './ReportedPostPage.css'

import SwitchButton from 'components/SwitchButton';

import { SEARCH_REPORTED_POST, GET_COMMENTS_REPORTED, GET_GRAPH } from "graphql/query";

const ReportedPostPage = () => {
  const [state, setstate] = useState('Post')
  const _processPdf = useRef(false);

  const [option, setOption] = useState('daily')

  const [getInitGraph, { data: dataGraph, loading: loadingGraph }] = useLazyQuery(GET_GRAPH)


  useEffect(() => {
    getInitGraph({
      variables: { graphType: option, state: 'user.total' }
    })
  }, [getInitGraph, option])

  const graph = dataGraph?.getGraphSummary?.graph.map(({ date, total }) => ({ date: new Date(date).toISOString(), totalRegistration: total })) || []


  const [
    searchReportedPost,
    { data, refetch: onSearchRefetch, loading: isLoading, called }
  ] = useLazyQuery(SEARCH_REPORTED_POST)

  const [
    searchReportedExportPost,
    { refetch: refetchExport, called: calledExport }
  ] = useLazyQuery(SEARCH_REPORTED_POST, {
    onCompleted: (data) => {
      const exportedData = data?.searchPosts?.hits;

      if (exportedData.length) {
        const doc = new jsPDF()

        autoTable(doc, { html: '#reported-posts' })

        const newExport = data?.searchPosts?.hits.map(({
          owner, text, createdAt, location, rank, likeCount, commentCount, repostCount, status = '',
        }) => {
          const { markdownContent } = JSON.parse(text)

          return [
            owner,
            markdownContent,
            createdAt,
            `${location?.detail?.formattedAddress.toString()}`,
            rank,
            likeCount,
            commentCount,
            repostCount,
            status.likeCount,
            status.commentCount,
            status.reportCount,
            (status?.flags || []).join(',')
          ]
        })

        const head = ['Owner', 'Caption', 'CreateAt', 'Location', 'Rank', 'Like Count', 'Comment Count', 'Repost Count', 'Status']
        autoTable(doc, {
          head: [head],
          body: newExport,
        })

        if (!_processPdf.current) {
          doc.save(`data-exported-reported-posts-${new Date().getTime()}`)

          _processPdf.current = true
        }
      }
    }
  })

  const [
    searchReportedComments,
    { data: dataComments, refetch: onSearchReportedRefetch, loading: isLoadingComments, called: calledComment }
  ] = useLazyQuery(GET_COMMENTS_REPORTED)

  const [
    searchReportedExportComment,
    { refetch: refetchExportComment }
  ] = useLazyQuery(GET_COMMENTS_REPORTED, {
    onCompleted: (data) => {
      const exportedData = data?.searchCommentReported?.hits;

      if (exportedData.length) {
        const doc = new jsPDF()

        autoTable(doc, { html: '#reported-comments' })

        const newExport = data?.searchCommentReported?.hits.map(({
          owner, text, status, reportedCount
        }) => {
          const { markdownContent } = JSON.parse(text)

          return [
            owner,
            markdownContent,
            reportedCount,
            status.likeCount,
            status.commentCount,
            status.reportCount,
            (status?.flags || []).join(',')
          ]
        })

        const head = ['Owner', 'Caption', 'Reported Count', 'Like Count', 'Comment Count', 'Repost Count', 'Status']
        autoTable(doc, {
          head: [head],
          body: newExport,
        })

        if (!_processPdf.current) {
          doc.save(`data-exported-reported-comments-${new Date().getTime()}`)

          _processPdf.current = true
        }
      }
    }
  })

  useEffect(() => {
    if (state === 'Comment') {
      if (calledComment) {
        onSearchReportedRefetch();

        return
      }

      searchReportedComments({ variables: { search: '', perPage: 5, page: 0 } })
    } else {
      if (called) {
        onSearchRefetch()

        return;
      }

      searchReportedPost({ variables: { search: '', perPage: 20, page: 0 } });
    }
  }, [state])

  const handleCallbackSwitch = state => {
    setstate(state)
  }

  const onFilters = (filter = [], exportData = false) => {
    let newFilter = {
      media: '',
      timestamp: {
        from: null,
        to: null
      }
    }

    if (filter.some(data => data?.from && data?.to)) {
      newFilter.timestamp = filter.find(data => data.from)
    }

    if (state !== 'Comment') {
      if (filter.includes('video')) {
        newFilter.media = 'video'
      }

      if (filter.includes('image')) {
        newFilter.media = 'image'
      }

      if (filter.includes('voice')) {
        newFilter.media = 'voice'
      }

      if (filter.includes('gif')) {
        newFilter.media = 'gif'
      }
    }

    if (exportData) return onExportData()

    if (called) onSearchRefetch({ filters: newFilter })
    else searchReportedPost({ filters: newFilter })
  }

  const onExportData = (isComments) => {
    _processPdf.current = false; // pretend to double save pdf
    const refetchFunc = isComments ? refetchExportComment : refetchExport
    const searchExportFunc = isComments ? searchReportedExportComment : searchReportedExportPost

    if (calledExport) refetchFunc({ useExport: true })
    searchExportFunc({ variables: { useExport: true } })
  }
  const handleStateOfGraph = state => {
    setOption(state)
  }

  const dataTable = state === 'Post' ? data?.searchPosts.hits : dataComments?.searchCommentReported?.hits
  const dataPage = state === 'Post' ? data?.searchPosts.nbPages : dataComments?.searchCommentReported?.nbPages
  const onRefetchTable = state === 'Post' ? onSearchRefetch : onSearchReportedRefetch

  return (
    <div>
      <div className='w-full flex justify-center'>
        <div className='w-1/3 '>
          <SwitchButton onSwitch={handleCallbackSwitch} />
        </div>
      </div>
      <div className="card mb-5 h-80 w-full">
        <h1>Reported {state}</h1>
        <div className="h-64">
          <Areas loading={loadingGraph} height={250} data={graph} />
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <div
            onClick={() => handleStateOfGraph('daily')}
            className={`${option === 'daily' ? 'bg-primary-100' : ''} cursor-pointer w-20 h-8 text-center justify-center text-gray-100 hover:bg-dark-600 hover:bg-opacity-50 dark:text-gray-100 group flex items-center px-2 py-2 font-semibold rounded-md antialiased`}>
            Daily
          </div>
          <div
            onClick={() => handleStateOfGraph('monthly')}
            className={`${option === 'monthly' ? 'bg-primary-100' : ''} cursor-pointer w-20 h-8 text-center justify-center text-gray-100 hover:bg-dark-600 hover:bg-opacity-50 dark:text-gray-100 group flex items-center px-2 py-2 font-semibold rounded-md antialiased`}>
            Monthly
          </div>
          <div
            onClick={() => handleStateOfGraph('yearly')}
            className={`${option === 'yearly' ? 'bg-primary-100' : ''} cursor-pointer w-20 h-8 text-center justify-center text-gray-100 hover:bg-dark-600 hover:bg-opacity-50 dark:text-gray-100 group flex items-center px-2 py-2 font-semibold rounded-md antialiased`}>
            Yearly
          </div>
        </div>

      </div>

      <Table
        noAddNew
        type={state === 'Post' ? "Reported Post" : "Reported Comment"}
        isLoading={(isLoading || isLoadingComments)}
        onRefetch={onRefetchTable}
        onFilters={onFilters}
        data={dataTable}
        pages={dataPage - 1}
        useReportedComment={state !== 'Post'}
      />
    </div>
  );
}

export default ReportedPostPage;
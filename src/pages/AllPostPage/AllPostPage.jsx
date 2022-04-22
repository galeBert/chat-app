import { parse } from 'querystring'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useHistory } from "react-router";
import SmallGraph from 'components/SmallGraph/SmallGraph';
import './AllPostPage.css'
import Table from 'components/Tables';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_POST, SEARCH_POST_EXPORT } from 'graphql/mutation';
import { useEffect, useRef, useState } from 'react';
import { GET_GRAPH } from 'graphql/query';
import moment from 'moment';
import { handleHeader } from 'hooks/handleHeader';

const AllPostPage = () => {
  const _processPdf = useRef(false);
  const [stateGraph, setStateGraph] = useState('post.total')
  const [option, setOption] = useState('daily')
  const [filters, setFilters] = useState([])
  const [headerSearch, setHeaderSearch] = useState('')
  const _isMounted = useRef(false);
  const _prevSearch = useRef('');
  const queryString = useHistory().location.search;
  const parseQs = parse(queryString.replace('?', ''));

  const [getInitGraph, { data: dataAllPost, loading: loadingGrapgh, refetch: refetchGraph, called: calledGraph }] = useLazyQuery(GET_GRAPH)
  useEffect(() => {
    getInitGraph({
      variables: { graphType: option, state: stateGraph }
    })
  }, [])

  const summary = dataAllPost?.getGraphSummary?.summary;

  const summaryData = [
    { label: 'post.total', name: 'Total Post', total: summary?.post?.total },
    { label: 'post.active', name: 'Active Post', total: summary?.post?.active, percent: Math.floor((summary?.post?.active / summary?.post?.total) * 100) },
    { label: 'post.nonactive', name: 'Nonactive Post', total: summary?.post?.nonActive },
    { label: 'post.totalReported', name: 'Reported Post', total: summary?.post?.totalReported }
  ]

  const [
    searchPost,
    { data, refetch: onSearchRefetch, loading: isLoading, called }
  ] = useLazyQuery(SEARCH_POST)

  const [
    searchPostExportData,
    { refetch, called: calledExport }
  ] = useLazyQuery(SEARCH_POST_EXPORT, {
    onCompleted: (data) => {
      if (data?.searchPosts?.hits.length) {

        const doc = new jsPDF({
          orientation: 'landscape'
        })
        //Header
        handleHeader(doc, "Post", filters, data?.searchPosts?.hits.length)

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

  useEffect(() => {
    if (!_isMounted.current) {
      searchPost({ variables: { search: parseQs?.search || '', perPage: 20, page: 0, sortBy: "desc", filters: { owner: '' } } });

      _isMounted.current = true;
      _prevSearch.current = parseQs?.search || ''
    }

    const hasSearchQuery = parseQs?.search !== undefined || parseQs?.search !== ''
    if (_isMounted.current && _prevSearch.current !== (parseQs?.search || '') && hasSearchQuery) {
      if (called) {
        onSearchRefetch({ search: parseQs?.search })
        _prevSearch.current = parseQs?.search || ""
      }
    }

  }, [_isMounted, parseQs])

  const onFilters = (filter = [], exportData = false) => {

    let newFilter = {
      media: [],
      status: '',
      timestamp: {
        from: null,
        to: null
      }
    }

    if (filter.some(data => data.from && data.to)) {
      newFilter.timestamp = filter.find(data => data.from)
    }
    if (filter.includes('active')) {
      newFilter.status = 'active'
    }

    if (filter.includes('takedown')) {
      newFilter.status = 'takedown'
    }
    if (filter.includes('video')) {
      newFilter.media.push('video')
    }

    if (filter.includes('photo')) {
      newFilter.media.push('image')
    }

    if (filter.includes('voice')) {
      newFilter.media = 'voice'
    }

    if (filter.includes('gif')) {
      newFilter.media.push('gif')
    }
    if (exportData) {
      onExportData({ filters: newFilter })
      return;
    }

    setFilters(newFilter)
    if (called) onSearchRefetch({ filters: newFilter, page: 0, perPage: 20 })
    else searchPost({ filters: newFilter })


  }

  const onExportData = ({ filters }) => {
    _processPdf.current = false; // pretend to double save pdf
    if (calledExport) refetch({ useExport: true, filters })
    searchPostExportData({ variables: { useExport: true, filters, search: headerSearch } })
  }

  return (
    <div>
      <div className="allpost-insight">
        {summaryData && summaryData.map((dataGraph, key) => {
          return <div ke={key} style={{ width: "100%", height: '100%' }}>
            <SmallGraph
              loading={loadingGrapgh}
              data={dataGraph}
              simple={dataGraph.name !== "Active Post" && dataGraph.name !== "Nonactive Post"}
            />
          </div>
        })}
      </div>
      <Table
        noAddNew
        type="All Post"
        initialSearch={parseQs?.search}
        isLoading={isLoading}
        onRefetch={onSearchRefetch}
        totalHits={data?.searchPosts.nbHits}
        onFilters={onFilters}
        data={data?.searchPosts.hits}
        currentPages={data?.searchPosts.page}
        pages={data?.searchPosts.nbPages}
        headerSearch={setHeaderSearch}
      />
    </div>
  );
}

export default AllPostPage;
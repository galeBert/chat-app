import './AllPostPage.css';

import { useCallback, useEffect, useRef, useState } from 'react';

import SmallGraph from '../../components/SmallGraph/SmallGraph';
import Table from '../../components/Tables';
import { SEARCH_POST, SEARCH_POST_EXPORT } from '../../graphql/mutation';
import { GET_GRAPH } from '../../graphql/query';
import { handleHeader } from '../../hooks/handleHeader';

import { useLazyQuery } from '@apollo/client';
import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DateTime } from 'luxon';
import { parse } from 'querystring';
import { useHistory } from 'react-router-dom';

const AllPostPage = () => {
  const _processPdf = useRef(false);
  const stateGraph = 'post.total';
  // const [stateGraph, setStateGraph] = useState('post.total');
  const option = 'daily';
  // const [option, setOption] = useState('daily');
  const [filters, setFilters] = useState([]);
  const [headerSearch, setHeaderSearch] = useState('');
  const _isMounted = useRef(false);
  const _prevSearch = useRef('');
  const queryString = useHistory().location.search;
  const parseQs = parse(queryString.replace('?', ''));

  const [
    getInitGraph,
    {
      data: dataAllPost,
      loading: loadingGrapgh,
      // refetch: refetchGraph,
      // called: calledGraph,
    },
  ] = useLazyQuery(GET_GRAPH);
  useEffect(() => {
    getInitGraph({
      variables: { graphType: option, state: stateGraph },
    });
  }, [getInitGraph, option, stateGraph]);

  const summary = dataAllPost?.getGraphSummary?.summary;

  const summaryData = [
    { label: 'post.total', name: 'Total Post', total: summary?.post?.total },
    {
      label: 'post.active',
      name: 'Active Post',
      total: summary?.post?.active,
      percent: Math.floor((summary?.post?.active / summary?.post?.total) * 100),
    },
    {
      label: 'post.nonactive',
      name: 'Nonactive Post',
      total: summary?.post?.nonActive,
    },
    {
      label: 'post.totalReported',
      name: 'Reported Post',
      total: summary?.post?.totalReported,
    },
  ];

  const [
    searchPost,
    { data, refetch: onSearchRefetch, loading: isLoading, called },
  ] = useLazyQuery(SEARCH_POST);

  const [searchPostExportData, { refetch, called: calledExport }] =
    useLazyQuery(SEARCH_POST_EXPORT, {
      onCompleted: (datas) => {
        if (datas?.searchPosts?.hits.length) {
          const doc = new JsPDF({
            orientation: 'landscape',
          });
          //Header
          handleHeader(doc, 'Post', filters, datas?.searchPosts?.hits.length);

          //Footer
          doc.setFontSize(9);
          //table
          autoTable(doc, { html: '#posts' });

          const newExport = datas?.searchPosts?.hits.map(
            ({ owner, text, createdAt, location, id, status = '' }) => {
              const { markdownContent } = JSON.parse(text);
              const datetime =
                DateTime.now(createdAt).toFormat('dd MMM yyyy hh:mm');
              return [
                owner,
                markdownContent,
                datetime,
                `${location?.detail?.formattedAddress.toString()}`,
                id,
                status.flags
                  ? (status.flags || []).join(',')
                  : status.active
                  ? 'Active'
                  : 'TakeDown',
              ];
            }
          );

          const head = [
            'Owner',
            'Caption',
            'CreateAt',
            'Location',
            'ID',
            'Status',
          ];
          autoTable(doc, {
            startY: 36,
            head: [head],
            body: newExport,
            didDrawPage: (docs) => {
              const str = `Page ${doc.internal.getNumberOfPages()}`;
              // Total page number plugin only available in jspdf v1.0+
              // if (typeof doc.putTotalPages === 'function') {
              //   str = str + ' of ' + data.table.pageCount
              // }
              doc.setFontSize(10);

              // jsPDF 1.4+ uses getWidth, <1.4 uses .width
              const pageSize = doc.internal.pageSize;
              const pageHeight = pageSize.height
                ? pageSize.height
                : pageSize.getHeight();
              doc.text(str, docs.settings.margin.left, pageHeight - 10);
            },
          });
          if (!_processPdf.current) {
            doc.save(`data-exported-posts-${new Date().getTime()}`);

            _processPdf.current = true;
          }
        }
      },
      fetchPolicy: 'network-only',
    });

  useEffect(() => {
    if (!_isMounted.current) {
      searchPost({
        variables: {
          search: parseQs?.search || '',
          perPage: 20,
          page: 0,
          sortBy: 'desc',
          filters: { owner: '' },
        },
      });

      _isMounted.current = true;
      _prevSearch.current = parseQs?.search || '';
    }

    const hasSearchQuery =
      parseQs?.search !== undefined || parseQs?.search !== '';
    if (
      _isMounted.current &&
      _prevSearch.current !== (parseQs?.search || '') &&
      hasSearchQuery
    ) {
      if (called) {
        onSearchRefetch({ search: parseQs?.search });
        _prevSearch.current = parseQs?.search || '';
      }
    }
  }, [_isMounted, parseQs, called, onSearchRefetch, searchPost]);

  const onExportData = useCallback(
    ({ filter }) => {
      _processPdf.current = false; // pretend to double save pdf
      if (calledExport) refetch({ useExport: true, filter });
      searchPostExportData({
        variables: { useExport: true, filter, search: headerSearch },
      });
    },
    [calledExport, headerSearch, refetch, searchPostExportData]
  );
  const onFilters = useCallback(
    (filter = [], exportData = false) => {
      const newFilter = {
        media: [],
        status: '',
        timestamp: {
          from: null,
          to: null,
        },
      };

      if (filter.some((date) => date.from && date.to)) {
        newFilter.timestamp = filter.find((doc) => doc.from);
      }
      if (filter.includes('active')) {
        newFilter.status = 'active';
      }

      if (filter.includes('takedown')) {
        newFilter.status = 'takedown';
      }
      if (filter.includes('video')) {
        newFilter.media.push('video');
      }

      if (filter.includes('photo')) {
        newFilter.media.push('image');
      }

      if (filter.includes('voice')) {
        newFilter.media = 'voice';
      }

      if (filter.includes('gif')) {
        newFilter.media.push('gif');
      }
      if (exportData) {
        onExportData({ filters: newFilter });
        return;
      }

      setFilters(newFilter);
      if (called) onSearchRefetch({ filters: newFilter, page: 0, perPage: 20 });
      else searchPost({ filters: newFilter });
    },
    [called, onExportData, onSearchRefetch, searchPost]
  );

  return (
    <div>
      <div className='allpost-insight'>
        {summaryData &&
          summaryData.map((dataGraph, key) => {
            return (
              <div key={key} style={{ width: '100%', height: '100%' }}>
                <SmallGraph
                  data={dataGraph}
                  loading={loadingGrapgh}
                  simple={
                    dataGraph.name !== 'Active Post' &&
                    dataGraph.name !== 'Nonactive Post'
                  }
                />
              </div>
            );
          })}
      </div>
      <Table
        currentPages={data?.searchPosts.page}
        data={data?.searchPosts.hits}
        headerSearch={setHeaderSearch}
        initialSearch={parseQs?.search}
        isLoading={isLoading}
        noAddNew
        onFilters={onFilters}
        onRefetch={onSearchRefetch}
        pages={data?.searchPosts.nbPages}
        totalHits={data?.searchPosts.nbHits}
        type='All Post'
      />
    </div>
  );
};

export default AllPostPage;

import { useCallback, useEffect, useRef, useState } from 'react';

import SwitchButton from '../../components/SwitchButton';
import Table from '../../components/Tables';
import Areas from '../../components/Visual/Areas';
import {
  GET_COMMENTS_REPORTED,
  GET_GRAPH,
  SEARCH_REPORTED_POST,
} from '../../graphql/query';
import clsxm from '../../utils/clsxm';

import { useLazyQuery } from '@apollo/client';
import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportedPostPage = () => {
  const [state, setstate] = useState('Post');
  const _processPdf = useRef(false);

  const [option, setOption] = useState('daily');

  const graphButton = (key) => {
    return clsxm(
      'cursor-pointer w-20 h-8 text-center justify-center text-dark-9 hover:bg-dark-6/50 dark:text-dark-9 group flex items-center px-2 py-2 font-semibold rounded-md antialiased',
      { 'bg-brand-1': option === key }
    );
  };

  const [getInitGraph, { data: dataGraph, loading: loadingGraph }] =
    useLazyQuery(GET_GRAPH);

  useEffect(() => {
    getInitGraph({
      variables: { graphType: option, state: 'user.total' },
    });
  }, [getInitGraph, option]);

  const graph =
    dataGraph?.getGraphSummary?.graph.map(({ date, total }) => ({
      date: new Date(date).toISOString(),
      totalRegistration: total,
    })) || [];

  const [
    searchReportedPost,
    { data, refetch: onSearchRefetch, loading: isLoading, called },
  ] = useLazyQuery(SEARCH_REPORTED_POST);

  const [
    searchReportedExportPost,
    { refetch: refetchExport, called: calledExport },
  ] = useLazyQuery(SEARCH_REPORTED_POST, {
    onCompleted: (datas) => {
      const exportedData = datas?.searchPosts?.hits;

      if (exportedData.length) {
        const doc = new JsPDF();

        autoTable(doc, { html: '#reported-posts' });

        const newExport = datas?.searchPosts?.hits.map(
          ({
            owner,
            text,
            createdAt,
            location,
            rank,
            likeCount,
            commentCount,
            repostCount,
            status = '',
          }) => {
            const { markdownContent } = JSON.parse(text);

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
              (status?.flags || []).join(','),
            ];
          }
        );

        const head = [
          'Owner',
          'Caption',
          'CreateAt',
          'Location',
          'Rank',
          'Like Count',
          'Comment Count',
          'Repost Count',
          'Status',
        ];
        autoTable(doc, {
          head: [head],
          body: newExport,
        });

        if (!_processPdf.current) {
          doc.save(`data-exported-reported-posts-${new Date().getTime()}`);

          _processPdf.current = true;
        }
      }
    },
  });

  const [
    searchReportedComments,
    {
      data: dataComments,
      refetch: onSearchReportedRefetch,
      loading: isLoadingComments,
      called: calledComment,
    },
  ] = useLazyQuery(GET_COMMENTS_REPORTED);

  const [searchReportedExportComment, { refetch: refetchExportComment }] =
    useLazyQuery(GET_COMMENTS_REPORTED, {
      onCompleted: (datas) => {
        const exportedData = datas?.searchCommentReported?.hits;

        if (exportedData.length) {
          const doc = new JsPDF();

          autoTable(doc, { html: '#reported-comments' });

          const newExport = datas?.searchCommentReported?.hits.map(
            ({ owner, text, status, reportedCount }) => {
              const { markdownContent } = JSON.parse(text);

              return [
                owner,
                markdownContent,
                reportedCount,
                status.likeCount,
                status.commentCount,
                status.reportCount,
                (status?.flags || []).join(','),
              ];
            }
          );

          const head = [
            'Owner',
            'Caption',
            'Reported Count',
            'Like Count',
            'Comment Count',
            'Repost Count',
            'Status',
          ];
          autoTable(doc, {
            head: [head],
            body: newExport,
          });

          if (!_processPdf.current) {
            doc.save(`data-exported-reported-comments-${new Date().getTime()}`);

            _processPdf.current = true;
          }
        }
      },
    });

  useEffect(() => {
    if (state === 'Comment') {
      if (calledComment) {
        onSearchReportedRefetch();

        return;
      }

      searchReportedComments({
        variables: { search: '', perPage: 5, page: 0 },
      });
    } else {
      if (called) {
        onSearchRefetch();

        return;
      }

      searchReportedPost({ variables: { search: '', perPage: 20, page: 0 } });
    }
  }, [
    called,
    calledComment,
    onSearchRefetch,
    onSearchReportedRefetch,
    searchReportedComments,
    searchReportedPost,
    state,
  ]);

  const handleCallbackSwitch = (value) => {
    setstate(value);
  };

  const onExportData = useCallback(
    (isComments) => {
      _processPdf.current = false; // pretend to double save pdf
      const refetchFunc = isComments ? refetchExportComment : refetchExport;
      const searchExportFunc = isComments
        ? searchReportedExportComment
        : searchReportedExportPost;

      if (calledExport) refetchFunc({ useExport: true });
      searchExportFunc({ variables: { useExport: true } });
    },
    [
      calledExport,
      refetchExport,
      refetchExportComment,
      searchReportedExportComment,
      searchReportedExportPost,
    ]
  );
  const onFilters = useCallback(
    (filter = [], exportData = false) => {
      const newFilter = {
        media: '',
        timestamp: {
          from: null,
          to: null,
        },
      };

      if (filter.some((date) => date?.from && date?.to)) {
        newFilter.timestamp = filter.find((docs) => docs.from);
      }

      if (state !== 'Comment') {
        if (filter.includes('video')) {
          newFilter.media = 'video';
        }

        if (filter.includes('image')) {
          newFilter.media = 'image';
        }

        if (filter.includes('voice')) {
          newFilter.media = 'voice';
        }

        if (filter.includes('gif')) {
          newFilter.media = 'gif';
        }
      }

      if (exportData) return onExportData();

      if (called) onSearchRefetch({ filters: newFilter });
      else searchReportedPost({ filters: newFilter });
      return newFilter;
    },
    [called, onExportData, onSearchRefetch, searchReportedPost, state]
  );

  const handleStateOfGraph = (values) => {
    setOption(values);
  };

  const dataTable =
    state === 'Post'
      ? data?.searchPosts.hits
      : dataComments?.searchCommentReported?.hits;
  const dataPage =
    state === 'Post'
      ? data?.searchPosts.nbPages
      : dataComments?.searchCommentReported?.nbPages;
  const onRefetchTable =
    state === 'Post' ? onSearchRefetch : onSearchReportedRefetch;

  return (
    <div>
      <div className='w-full flex justify-center'>
        <div className='w-1/3 '>
          <SwitchButton onSwitch={handleCallbackSwitch} />
        </div>
      </div>
      <div className='card mb-5 h-80 w-full'>
        <h1>Reported {state}</h1>
        <div className='h-64'>
          <Areas data={graph} height={250} loading={loadingGraph} />
        </div>
        <div className='mt-4 flex justify-end gap-3'>
          <div
            className={graphButton('daily')}
            onClickCapture={() => handleStateOfGraph('daily')}
          >
            Daily
          </div>
          <div
            className={graphButton('monthly')}
            onClickCapture={() => handleStateOfGraph('monthly')}
          >
            Monthly
          </div>
          <div
            className={graphButton('yearly')}
            onClickCapture={() => handleStateOfGraph('yearly')}
          >
            Yearly
          </div>
        </div>
      </div>

      <Table
        data={dataTable}
        isLoading={isLoading || isLoadingComments}
        noAddNew
        onFilters={onFilters}
        onRefetch={onRefetchTable}
        pages={dataPage - 1}
        type={state === 'Post' ? 'Reported Post' : 'Reported Comment'}
        useReportedComment={state !== 'Post'}
      />
    </div>
  );
};

export default ReportedPostPage;

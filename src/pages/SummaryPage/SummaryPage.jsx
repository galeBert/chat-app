import React, { useEffect, useRef, useState } from 'react';

import curiousLogo from '../../assets/curious_icon_png.png';
import insvireLogo from '../../assets/horizontal logo.png';
import SmallGraph from '../../components/SmallGraph/SmallGraph';
import Table from '../../components/Tables';
// Components
import Areas from '../../components/Visual/Areas';
import {
  GET_ADMIN_LOGS,
  GET_ADMIN_LOGS_EXPORTS,
  GET_GRAPH,
  SEARCH_ROOMS,
} from '../../graphql/query';
import clsxm from '../../utils/clsxm';

import { useLazyQuery, useQuery } from '@apollo/client';
import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';

function SummaryPage() {
  const _processPdf = useRef(false);

  const [stateGraph, setStateGraph] = useState('user.total');
  const [option, setOption] = useState('daily');
  const [graphDisplay, setGraphDisplay] = useState('Daily New User');

  const graphButton = (key) => {
    return clsxm(
      'cursor-pointer w-20 h-8 text-center justify-center text-dark-9 hover:bg-dark-6/50 dark:text-dark-9 group flex items-center px-2 py-2 font-semibold rounded-md antialiased',
      { 'bg-brand-1': option === key }
    );
  };
  const [getInitGraph, { data, loading, refetch, called }] =
    useLazyQuery(GET_GRAPH);
  const { data: dataLogs, refetch: onSearchLog } = useQuery(GET_ADMIN_LOGS);
  const [getExportAdminLogs, { refetch: refetchExport, called: calledExport }] =
    useLazyQuery(GET_ADMIN_LOGS_EXPORTS, {
      onCompleted: (datas) => {
        if (datas?.getAdminLogs?.hits.length) {
          const doc = new JsPDF({
            orientation: 'landscape',
          });
          //Header
          doc.addImage(curiousLogo, 'PNG', 15, 7, 40, 8);
          doc.addImage(insvireLogo, 'PNG', 245, 3, 40, 15);

          //Summary
          doc.setFontSize(9);
          doc.text('Data Type: Admin Log', 15, 20);
          doc.text(`Total Data: ${datas?.getAdminLogs?.hits.length}`, 15, 24);

          //Footer
          doc.setFontSize(9);
          //table
          autoTable(doc, { html: '#posts' });

          const newExport = datas?.getAdminLogs?.hits.map(
            ({ name, message, createdAt, role }) => {
              const datetime = DateTime.now(+createdAt).toFormat(
                'dd MMM yyyy hh:mm'
              );
              return [name, message, datetime, role];
            }
          );

          const head = ['Name', 'Message', 'CreateAt', 'Role'];
          autoTable(doc, {
            startY: 36,
            head: [head],
            styles: {
              cellWidth: 'wrap',
            },
            body: newExport,
            didDrawPage: (docs) => {
              let str = `Page ${doc.internal.getNumberOfPages()}`;
              // Total page number plugin only available in jspdf v1.0+
              if (typeof doc.putTotalPages === 'function') {
                str = `${str} of ${docs.pageCount}`;
              }
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
            doc.save(`data-exported-admin-logs-${new Date().getTime()}`);

            _processPdf.current = true;
          }
        }
      },
      fetchPolicy: 'network-only',
    });
  const { data: dataRoom, loading: loadingRoom } = useQuery(SEARCH_ROOMS, {
    variables: { page: 0, perPage: 5 },
  });

  useEffect(() => {
    if (option && stateGraph) {
      if (called) refetch({ graphType: option, state: stateGraph });
    }
  }, [option, stateGraph, called, refetch]);

  useEffect(() => {
    getInitGraph({
      variables: { graphType: option, state: stateGraph },
    });
  }, [getInitGraph, option, stateGraph]);

  const handleChangeGraph = (state) => {
    setStateGraph(state?.label);
    setGraphDisplay(state?.name);
  };

  const handleStateOfGraph = (state) => {
    setOption(state);
  };

  const onExportData = () => {
    _processPdf.current = false; // pretend to double save pdf
    if (calledExport) refetchExport({ useExport: true });
    getExportAdminLogs({ variables: { useExport: true } });
  };
  const onFilters = (_, exportData = false) => {
    if (exportData) {
      onExportData();
    }
  };

  const summary = data?.getGraphSummary?.summary;
  const graph =
    data?.getGraphSummary?.graph.map(({ date, total }) => ({
      date: new Date(date).toISOString(),
      totalRegistration: total,
    })) || [];
  const rooms = dataRoom?.searchRoom?.hits || [];
  const logs = dataLogs?.getAdminLogs?.hits || [];

  const roomsData = rooms.map((room) => ({
    name: room.roomName,
    imageUrl: room.displayPicture,
    ...room,
  }));
  const summaryData = [
    { label: 'user.total', name: 'Total User', total: summary?.user?.total },
    {
      label: 'user.newUser',
      name: 'New User',
      total: summary?.user?.newUser,
      percent: 70,
    },
    {
      label: 'user.deleted',
      name: 'Deleted User',
      total: summary?.user?.deleted,
    },
    { label: 'post.total', name: 'Total Post', total: summary?.post?.total },
    {
      label: 'post.totalReported',
      name: 'Reported Post',
      total: summary?.post?.totalReported,
    },
  ];

  return (
    <div>
      <div className='grid grid-cols-5 gap-4 pt-4 pb-4 w-full'>
        {summaryData.map((datas, idx) => {
          return (
            <div key={idx} className='h-full'>
              <SmallGraph
                data={datas}
                loading={loading}
                onClick={handleChangeGraph}
                simple={data?.name !== 'New User'}
              />
            </div>
          );
        })}
      </div>

      <div className='flex gap-4 h-full'>
        <div className='w-2/3 card'>
          <div className='bottom-left relative'>
            <h1 className=''>{graphDisplay}</h1>
            <div style={{ height: 230 }}>
              <Areas data={graph} loading={loading} />
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
        </div>
        <div className='w-1/3'>
          <div className='card h-12'>
            <div className='grid grid-cols-2 pb-1'>
              <h1>Available Room</h1>
              <Link className='text-right' to='/available-room'>
                <span>see all</span>
              </Link>
            </div>
            <div>
              {loadingRoom && (
                <div>
                  <div className='skeleton w-full h-12 mt-3 ' />
                  <div className='skeleton w-full h-12 mt-3' />
                  <div className='skeleton w-full h-12 mt-3' />
                  <div className='skeleton w-full h-12 mt-3' />
                </div>
              )}
              {!loadingRoom &&
                roomsData.map(({ name, imageUrl, totalPosts }, idx) => {
                  return (
                    <div
                      key={idx}
                      className='flex justify-between p-3 border-b-2 border-solid border-dark-9'
                    >
                      <div className='flex justify-center gap-3'>
                        <img
                          alt='room_img'
                          className=' w-7 h-7 rounded-full'
                          src={imageUrl}
                        />
                        <span className='font-bold'>{name}</span>
                      </div>
                      <span>{totalPosts || 0}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <div className=' pt-4'>
        <Table
          data={logs}
          noAddNew
          noFilter
          noSearch
          noSort
          onFilters={onFilters}
          onRefetch={onSearchLog}
          pages={dataLogs?.getAdminLogs?.nbPages - 1}
          type='Admin Log'
        />
      </div>
    </div>
  );
}

export default SummaryPage;

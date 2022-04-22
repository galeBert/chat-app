import React, { useState, useEffect, useRef } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import moment from 'moment';
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf'

import curiousLogo from '../../assets/curious_icon_png.png'
import insvireLogo from '../../assets/horizontal logo.png'

import "./SummaryPage.css";

// Components
import Areas from "components/Visual/Areas";

import SmallGraph from "components/SmallGraph/SmallGraph";
import Table from "components/Tables";

import { GET_GRAPH, GET_ADMIN_LOGS, SEARCH_ROOMS, GET_ADMIN_LOGS_EXPORTS } from 'graphql/query';
import { Link } from "react-router-dom";


function SummaryPage() {
  const _processPdf = useRef(false);

  const [stateGraph, setStateGraph] = useState('user.total')
  const [option, setOption] = useState('daily')
  const [graphDisplay, setGraphDisplay] = useState('Daily New User')
  const [getInitGraph, { data, loading, refetch, called }] = useLazyQuery(GET_GRAPH)
  const { data: dataLogs, refetch: onSearchLog } = useQuery(GET_ADMIN_LOGS)
  const [getExportAdminLogs, { refetch: refetchExport, called: calledExport }] = useLazyQuery(GET_ADMIN_LOGS_EXPORTS, {
    onCompleted: (data) => {
      if (data?.getAdminLogs?.hits.length) {
        const doc = new jsPDF({
          orientation: 'landscape'
        })
        //Header
        doc.addImage(curiousLogo, "PNG", 15, 7, 40, 8);
        doc.addImage(insvireLogo, "PNG", 245, 3, 40, 15);

        //Summary
        doc.setFontSize(9);
        doc.text("Data Type: Admin Log", 15, 20);
        doc.text(`Total Data: ${data?.getAdminLogs?.hits.length}`, 15, 24);

        //Footer
        doc.setFontSize(9)
        //table
        autoTable(doc, { html: '#posts' })

        const newExport = data?.getAdminLogs?.hits.map(({
          name, message, createdAt, role
        }) => {
          console.log('createdAt: ', createdAt)
          const datetime = moment(+createdAt).utc().format('DD MMM YYYY hh:mm')
          return [
            name,
            message,
            datetime,
            role
          ]
        })

        const head = ['Name', 'Message', 'CreateAt', 'Role']
        autoTable(doc, {
          startY: 36,
          head: [head],
          styles: {
            cellWidth: 'wrap'
          },
          body: newExport,
          didDrawPage: (data) => {

            var str = 'Page ' + doc.internal.getNumberOfPages()
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
              str = str + ' of ' + data.pageCount
            }
            doc.setFontSize(10)

            // jsPDF 1.4+ uses getWidth, <1.4 uses .width
            var pageSize = doc.internal.pageSize
            var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
            doc.text(str, data.settings.margin.left, pageHeight - 10)
          }

        })


        if (!_processPdf.current) {
          doc.save(`data-exported-admin-logs-${new Date().getTime()}`)

          _processPdf.current = true
        }
      }
    }, fetchPolicy: 'network-only'
  })
  const { data: dataRoom, loading: loadingRoom } = useQuery(SEARCH_ROOMS, { variables: { page: 0, perPage: 5 } })

  useEffect(() => {
    if (option && stateGraph) {
      if (called) refetch({ graphType: option, state: stateGraph })
    }
  }, [option, stateGraph, called, refetch])

  useEffect(() => {
    getInitGraph({
      variables: { graphType: option, state: stateGraph }
    })
  }, [getInitGraph, option, stateGraph])

  const handleChangeGraph = state => {
    setStateGraph(state?.label)
    setGraphDisplay(state?.name)
  }

  const handleStateOfGraph = state => {
    setOption(state)
  }
  const onFilters = (filter = [], exportData = false) => {
    if (exportData) {
      onExportData()
      return;
    }
  }

  const onExportData = () => {
    _processPdf.current = false; // pretend to double save pdf
    if (calledExport) refetchExport({ useExport: true })
    getExportAdminLogs({ variables: { useExport: true } })
  }

  const summary = data?.getGraphSummary?.summary;
  const graph = data?.getGraphSummary?.graph.map(({ date, total }) => ({ date: new Date(date).toISOString(), totalRegistration: total })) || []
  const rooms = dataRoom?.searchRoom?.hits || [];
  const logs = dataLogs?.getAdminLogs?.hits || [];

  const roomsData = rooms.map(room => ({ name: room.roomName, imageUrl: room.displayPicture, ...room }))
  const summaryData = [
    { label: 'user.total', name: 'Total User', total: summary?.user?.total },
    { label: 'user.newUser', name: 'New User', total: summary?.user?.newUser, percent: 70 },
    { label: 'user.deleted', name: 'Deleted User', total: summary?.user?.deleted },
    { label: 'post.total', name: 'Total Post', total: summary?.post?.total },
    { label: 'post.totalReported', name: 'Reported Post', total: summary?.post?.totalReported }
  ]

  return (
    <div>
      <div className="summary-insight">
        {summaryData.map((data, idx) => {
          return <div className="h-full" key={idx}>
            <SmallGraph
              data={data}
              onClick={handleChangeGraph}
              simple={data.name !== "New User"}
              loading={loading}
            />
          </div>
        })}

      </div>

      <div className="flex gap-4 h-full">
        <div className="w-2/3">
          <div className="card bottom-left relative">
            <h1 className="">{graphDisplay}</h1>
            <div style={{ height: 230 }}><Areas data={graph} loading={loading} /></div>
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
        </div>
        <div className="w-1/3">
          <div className="card h-12">
            <div className="grid grid-cols-2 pb-1">
              <h1>Available Room</h1>
              <Link to="/available-room" className="text-right">
                <span >see all</span></Link>
            </div>
            <div>
              {loadingRoom && (<div>
                <div className="skeleton w-full h-12 mt-3 " />
                <div className="skeleton w-full h-12 mt-3" />
                <div className="skeleton w-full h-12 mt-3" />
                <div className="skeleton w-full h-12 mt-3" />
              </div>)}
              {!loadingRoom && roomsData.map(({ name, imageUrl, totalPosts }, idx) => {
                return (
                  <div key={idx} className="flex justify-between p-3 border-b-2 border-solid border-gray-600">
                    <div className="flex justify-center gap-3">
                      <img alt="room_img" src={imageUrl} className=" w-7 h-7 rounded-full" />
                      <span className="font-bold">{name}</span>
                    </div>
                    <span>{totalPosts || 0}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div className=" pt-4">
        <Table
          type="Admin Log"
          data={logs}
          pages={dataLogs?.getAdminLogs?.nbPages - 1}
          onRefetch={onSearchLog}
          onFilters={onFilters}
          noSort
          noFilter
          noSearch
          noAddNew
        />
      </div>

    </div>
  );
}

export default SummaryPage;
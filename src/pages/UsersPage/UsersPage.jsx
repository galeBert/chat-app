import { useLazyQuery, useQuery } from "@apollo/client";
import { useHistory } from "react-router";
import DoughnutChart from "components/Charts/DoughnutChart";
import SmallGraph from "components/SmallGraph/SmallGraph";
import Table from "components/Tables";
import { SEARCH_USER } from "graphql/mutation";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import './UsersPage.css'
import { useEffect, useRef, useState } from "react";
import { GET_GRAPH, GET_STATS_USERS_AGE } from "graphql/query";
import Areas from "components/Visual/Areas";
import { parse } from 'querystring'
import { handleHeader } from "hooks/handleHeader";

const ListOfColors = [
  '#307BF4',
  '#7F57FF',
  '#FF0073',
  '#F6C059',
  'rgba(255,255,255,0.3)',
  'rgba(255,255,255,0.2)',
  'rgba(255,255,255,0.1)',
]

const UserPage = () => {
  const [headerSearch, setHeaderSearch] = useState('')

  const [stateGraph, setStateGraph] = useState('user.total')
  const _processPdf = useRef(false);
  const [option, setOption] = useState("daily")
  const _isMounted = useRef(false);
  const _prevSearch = useRef('');
  const [filters, setFilters] = useState('')

  const queryString = useHistory().location.search;
  const parseQs = parse(queryString.replace('?', '')) || ''

  const [getInitGraph, { data: graphData, loading, refetch }] = useLazyQuery(GET_GRAPH, { notifyOnNetworkStatusChange: true })
  const { data: dataUsersAge, loading: loadingStats } = useQuery(GET_STATS_USERS_AGE);

  useEffect(() => {
    getInitGraph({
      variables: { graphType: "daily", state: "user.total" }
    })
  }, [getInitGraph])

  const [
    searchUserExportData,
    { refetch: refetchExport, called: calledExport }
  ] = useLazyQuery(SEARCH_USER, {
    onCompleted: (data) => {
      const exportedData = data?.searchUser?.hits;

      const body = exportedData.map(({ email, username, status, mobileNumber }) => {
        return [username, email, mobileNumber, status]
      })
      const doc = new jsPDF({
        orientation: 'landscape'
      })

      //Header
      handleHeader(doc, "Users", filters, exportedData.length)

      //Footer
      doc.setFontSize(9)
      autoTable(doc, { html: '#posts-table' })


      autoTable(doc, {
        startY: 36,
        head: [['Username', 'Email', 'Phone Number', 'Status']],
        body,
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
        doc.save(`data-exported-users-${new Date().getTime()}`)

        _processPdf.current = true
      }
    }
  });

  const [
    searchUser,
    { data, refetch: onSearchRefetch, loading: isLoading, called }
  ] = useLazyQuery(SEARCH_USER)


  useEffect(() => {
    if (option && stateGraph) {
      if (called) refetch({ graphType: option, state: stateGraph })
    }
  }, [option, stateGraph])

  useEffect(() => {
    if (!_isMounted.current) {
      searchUser({ variables: { search: parseQs.search || '', perPage: 20, page: 0 } });

      _isMounted.current = true
      _prevSearch.current = parseQs?.search || ''
    }

    const hasSearchQuery = parseQs?.search !== undefined || parseQs?.search !== ''
    if (_isMounted.current && _prevSearch.current !== (parseQs?.search || '') && hasSearchQuery) {
      if (called) {
        onSearchRefetch({ search: parseQs?.search })
        _prevSearch.current = parseQs?.search || ""
      }
    }
  }, [parseQs, _isMounted, called, onSearchRefetch, searchUser])

  const onFilters = (filter = [], exportData = false) => {

    const newFilter = {}
    let newStatus = ''

    if (filter.some(data => data.from && data.to)) {
      newFilter.timestamp = filter.find(data => data.from)
    }
    if (filter.includes('hasEmail')) {
      newFilter.hasEmail = true;
    }

    if (filter.includes('hasPhoneNumber')) {
      newFilter.hasPhoneNumber = true;
    }

    if (filter.includes(['takedown'])) {
      newStatus = 'takedown'
    }

    if (filter.includes(['active'])) {
      newStatus = 'active'
    }

    if (filter.includes(['banned'])) {
      newStatus = 'banned'
    }

    if (filter.includes('active')) {
      newStatus = 'active'
    }

    if (filter.includes('banned')) {
      newStatus = 'banned'
    }
    setFilters(newFilter)

    if (exportData) return onExportData({ filters: newFilter, status: newStatus })

    if (called) onSearchRefetch({ filters: newFilter, status: newStatus })
    else searchUser({ filters: newFilter, status: newStatus })
  }


  const onExportData = (payload = {}) => {
    _processPdf.current = false; // pretend to double save pdf
    if (calledExport) refetchExport({ useExport: true, ...payload })
    searchUserExportData({ variables: { useExport: true, search: headerSearch, ...payload } })
  }

  const handleChangeGraph = state => {
    setStateGraph(state?.label)
  }

  const handleStateOfGraph = state => {
    setOption(state)
  }

  const summaryData = [
    { label: 'user.total', name: 'Total User', total: graphData?.getGraphSummary?.summary?.user?.total },
    { label: 'user.newUser', name: 'New User', total: graphData?.getGraphSummary?.summary?.user?.newUser },
    { label: 'user.active', name: 'Active User', total: graphData?.getGraphSummary?.summary?.user?.active },
    { label: 'user.deleted', name: 'Deleted User', total: graphData?.getGraphSummary?.summary?.user?.deleted },
  ]
  const graph = graphData?.getGraphSummary?.graph.map(({ date, total }) => ({ date: new Date(date).toISOString(), totalRegistration: total })) || []
  const stats = (dataUsersAge?.getStaticUserByAge || []).map((stat) => ({ ...stat, usage: stat.total }));
  console.log("filters", filters);
  return (
    <div>
      <div className="grid-container">
        {summaryData.map((data, idx) => {
          return (
            <div className="h-full" key={idx}>
              <SmallGraph
                loading={loading}
                data={data}
                onClick={handleChangeGraph}
                simple={data.name !== "New User"}
              />
            </div>
          )
        })}
        <div className="card top-right relative">
          <h1>Average Age User</h1>
          {loadingStats ? (
            <div>Loading ...</div>
          ) : <DoughnutChart data={stats} />}

          <div className="absolute bottom-0 left-0 px-4 py-5 right-0">
            <div>Details</div>
            <div className="w-100 mt-4">
              {stats && stats.map(({ label, usage, percentage }, idx) => (
                <div key={idx} className="flex my-2" style={{ columnGap: 10 }}>
                  <div className="bg-primary-100 w-5 h-5 pr-2" style={{ borderRadius: '50%', backgroundColor: ListOfColors[idx] }} />
                  <span>{label} ({percentage}%)</span>
                  <span>{usage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card bottom-left relative">
          <h1 className="absolute z-20 top-10 left-12">Daily New User</h1>
          <div style={{ height: 250 }}>
            <Areas data={graph} loading={loading} />
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
      </div>
      <div className="mt-5">
        <Table
          noAddNew
          noRating
          initialSearch={parseQs?.search}
          type="All User"
          isLoading={isLoading}
          onRefetch={onSearchRefetch}
          onFilters={onFilters}
          data={data?.searchUser?.hits}
          pages={data?.searchUser?.nbPages}
          currentPage={data?.searchUser?.page}
          totalHits={data?.searchUser.nbHits}
          headerSearch={setHeaderSearch}
          height="h-80"
        />
      </div>
    </div>
  );
}

export default UserPage;
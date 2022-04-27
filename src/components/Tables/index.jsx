import { useState } from 'react';

import AdminRoleTable from './AdminRoleTable';
import AdminTable from './AdminTable';
import AllPostTable from './AllPostTable';
import AllUserTable from './AllUserTable';
import AvailableTable from './AvailableRoomTable';
import Footer from './Footer';
import Header from './Header';
import NotificationTable from './NotificationTable';
import RandomizationTable from './RandomizationTable';
import ReportedListTable from './ReportedListTable';
import ReportedPostTable from './ReportedPostTable';
import SummaryTable from './TableSummary';
import UserPostTable from './UserPostTable';

const Table = ({
  type,
  data,
  pages,
  setAllUser,
  height = 'h-full',
  onRefetch,
  onFilters,
  isLoading,
  totalHits,
  useReportedComment,
  ...props
}) => {
  const [timestamp, setTimestamp] = useState(null);

  const defaultPostFilter = [
    {
      label: 'timestamp',
      child: [
        {
          key: timestamp,
          hasTimeStampInput: true,
          setTimestamp,
          timestamp,
        },
      ],
    },
    { label: 'video', key: 'video', active: false },
    { label: 'photo', key: 'photo', active: false },
    { label: 'voice note', key: 'voice', active: false },
    { label: 'GIF', key: 'gif', active: false },
    {
      label: 'Status',
      child: [
        { label: 'Active', key: 'active' },
        { label: 'Take Down', key: 'takedown' },
      ],
    },
  ];

  let table;
  let filter = [];
  switch (type) {
    case 'All Post':
      table = <AllPostTable data={data} isLoading={isLoading} props={props} />;
      filter = defaultPostFilter;
      break;
    case 'All User':
      table = <AllUserTable data={data} isLoading={isLoading} props={props} />;
      filter = [
        {
          label: 'timestamp',
          child: [
            {
              key: timestamp,
              hasTimeStampInput: true,
              setTimestamp,
              timestamp,
            },
          ],
        },
        {
          label: 'Status',
          child: [{ label: 'active' }, { label: 'banned' }],
        },
        { label: 'email', key: 'hasEmail' },
        { label: 'mobile number', key: 'hasPhoneNumber' },
      ];
      break;
    case 'Reported Post':
      table = (
        <ReportedPostTable
          data={data}
          isLoading={isLoading}
          props={props}
          type={type}
          useReportedComment={useReportedComment}
        />
      );
      filter = [
        {
          label: 'timestamp',
          child: [
            {
              key: timestamp,
              hasTimeStampInput: true,
              setTimestamp,
            },
          ],
        },
        { label: 'video', key: 'video' },
        { label: 'photo', key: 'image' },
        { label: 'voice note', key: 'voice' },
        { label: 'GIF', key: 'gif' },
        {
          label: 'Status',
          child: [
            { label: 'active' },
            { label: 'banned' },
            { label: 'take down 2' },
          ],
        },
      ];
      break;
    case 'Reported Comment':
      table = (
        <ReportedPostTable
          data={data}
          isLoading={isLoading}
          props={props}
          type={type}
          useReportedComment={useReportedComment}
        />
      );
      filter = [
        {
          label: 'timestamp',
          child: [
            {
              key: timestamp,
              hasTimeStampInput: true,
              setTimestamp,
            },
          ],
        },
        {
          label: 'Status',
          child: [
            { label: 'active' },
            { label: 'banned' },
            { label: 'take down' },
          ],
        },
      ];
      break;
    case 'User Post':
      table = <UserPostTable data={data} isLoading={isLoading} props={props} />;
      filter = defaultPostFilter;
      break;
    case 'Admin':
      table = <AdminTable data={data} props={props} />;
      break;
    case 'Admin Log':
      table = <AdminRoleTable data={data} />;
      break;
    case 'Randomization':
      table = (
        <RandomizationTable
          data={data}
          id={props.id}
          isLoading={isLoading}
          onRefetch={onRefetch}
          title={props.headerName || type}
        />
      );
      break;
    case 'Available Room':
      table = <AvailableTable data={data} isLoading={isLoading} />;
      break;
    case 'Reported List':
      table = <ReportedListTable data={data} />;
      break;
    case 'Summary':
      table = <SummaryTable data={data} />;
      break;
    case 'Notification':
      table = <NotificationTable data={data} />;
      break;
    default:
      table = <AllPostTable data={data} />;
  }

  return (
    <div className={`table-container ${height} flex justify-between flex-col`}>
      <div>
        <Header
          filter={filter}
          initialSearch={props.initialSearch}
          isLoading={isLoading}
          onFilters={onFilters}
          onRefetch={onRefetch}
          props={props}
          setAllUser={setAllUser}
          setTimestamp={setTimestamp}
          title={props.headerName || type}
          useMultipleFilter={
            type === 'All Post' ||
            type === 'Reported Comment' ||
            type === 'Reported Post'
          }
        />
        {table}
      </div>

      <Footer
        currentLengthData={data?.length}
        isLoading={isLoading}
        onRefetch={onRefetch}
        pages={pages}
        props={props}
        totalHits={totalHits}
      />
    </div>
  );
};

export default Table;

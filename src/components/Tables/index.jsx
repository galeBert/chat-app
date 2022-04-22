import Footer from "./Footer";
import Header from "./Header";
import AllPostTable from "./AllPostTable";
import AllUserTable from "./AllUserTable";
import ReportedPostTable from "./ReportedPostTable";
import UserPostTable from "./UserPostTable";
import AdminTable from "./AdminTable";
import RandomizationTable from "./RandomizationTable";
import SummaryTable from "./TableSummary";
import AvailableTable from "./AvailableRoomTable";
import ReportedListTable from "./ReportedListTable";
import AdminRoleTable from "./AdminRoleTable";
import NotificationTable from "./NotificationTable";
import { useState } from "react";


const Table = ({ type, data, pages, setAllUser, height = 'h-full', onRefetch, onFilters, isLoading, totalHits, useReportedComment, ...props }) => {
    const [timestamp, setTimestamp] = useState(null)

    const defaultPostFilter = [
        {
            label: 'timestamp', child: [
                { key: timestamp, hasTimeStampInput: true, setTimestamp: setTimestamp, timestamp: timestamp }
            ]
        },
        { label: 'video', key: 'video', active: false },
        { label: 'photo', key: 'photo', active: false },
        { label: 'voice note', key: 'voice', active: false },
        { label: 'GIF', key: 'gif', active: false },
        {
            label: 'Status', child: [
                { label: 'Active', key: 'active' },
                { label: 'Take Down', key: 'takedown' }]
        }]

    let table;
    let filter = []
    switch (type) {
        case "All Post":
            table = <AllPostTable data={data} isLoading={isLoading} props={props} />;
            filter = defaultPostFilter
            break;
        case "All User":
            table = <AllUserTable data={data} isLoading={isLoading} props={props} />;
            filter = [
                {
                    label: 'timestamp', child: [
                        { key: timestamp, hasTimeStampInput: true, setTimestamp: setTimestamp, timestamp: timestamp }
                    ]
                },
                {
                    label: 'Status', child: [
                        { label: 'active' },
                        { label: 'banned' },
                    ]
                },
                { label: 'email', key: 'hasEmail' },
                { label: 'mobile number', key: 'hasPhoneNumber' },
            ]
            break;
        case "Reported Post":
            table = <ReportedPostTable data={data} isLoading={isLoading} useReportedComment={useReportedComment} props={props} type={type} />;
            filter = [
                {
                    label: 'timestamp', child: [
                        { key: timestamp, hasTimeStampInput: true, setTimestamp: setTimestamp }
                    ]
                },
                { label: 'video', key: 'video' },
                { label: 'photo', key: 'image' },
                { label: 'voice note', key: 'voice' },
                { label: 'GIF', key: 'gif' },
                {
                    label: 'Status', child: [
                        { label: 'active' },
                        { label: 'banned' },
                        { label: 'take down 2' }]
                }]
            break;
        case "Reported Comment":
            table = <ReportedPostTable data={data} isLoading={isLoading} useReportedComment={useReportedComment} props={props} type={type} />;
            filter = [
                {
                    label: 'timestamp', child: [
                        { key: timestamp, hasTimeStampInput: true, setTimestamp: setTimestamp }
                    ]
                },
                {
                    label: 'Status', child: [
                        { label: 'active' },
                        { label: 'banned' },
                        { label: 'take down' }]
                }]
            break;
        case "User Post":
            table = <UserPostTable data={data} isLoading={isLoading} props={props} />;
            filter = defaultPostFilter
            break;
        case "Admin":
            table = <AdminTable data={data} props={props} />;
            break;
        case "Admin Log":
            table = <AdminRoleTable data={data} />;
            break;
        case "Randomization":
            table = <RandomizationTable data={data} title={props.headerName || type} id={props.id} onRefetch={onRefetch} isLoading={isLoading} />;
            break;
        case "Available Room":
            table = <AvailableTable data={data} isLoading={isLoading} />;
            break;
        case "Reported List":
            table = <ReportedListTable data={data} />;
            break;
        case "Summary":
            table = <SummaryTable data={data} />;
            break;
        case "Notification":
            table = <NotificationTable data={data} />;
            break;
        default:
            table = <AllPostTable data={data} />;
    }

    return (
        <div className={`table-container ${height} flex justify-between flex-col`}>
            <div>
                <Header
                    title={props.headerName || type}
                    useMultipleFilter={type === 'All Post' || type === 'Reported Comment' || type === 'Reported Post'}
                    setAllUser={setAllUser}
                    onRefetch={onRefetch}
                    onFilters={onFilters}
                    isLoading={isLoading}
                    setTimestamp={setTimestamp}
                    props={props}
                    filter={filter}
                    initialSearch={props.initialSearch}
                />
                {table}
            </div>

            <Footer
                pages={pages}
                onRefetch={onRefetch}
                currentLengthData={data?.length}
                totalHits={totalHits}
                isLoading={isLoading}
                props={props}
            />
        </div>
    );
}

export default Table;